import React, { useEffect, useState } from 'react';
import { Badge, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { abi as MarketplaceABI } from '../../asset/json/Marketplace.abi.json';
import { VOLTA_MARKETPLACE_ADDRESS } from '../../asset/json/voltaContractAddresses.json';
import Marketplace from '../../types/Marketplace';
import { Asset, Demand, Match } from '../../types/MarketplaceEntities';
import { toastMetamaskError } from '../Toast/Toast';

type Props = {
    web3: Web3
    account: string
}

function MarketplaceAggregator({ web3, account }: Props) {
    const { t } = useTranslation();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [demands, setDemands] = useState<Demand[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset>();
    const [selectedDemand, setSelectedDemand] = useState<Demand>();
    const isValidMatch = selectedAsset !== undefined && selectedDemand !== undefined;

    const filterSetAssets = (assets: Asset[]) => setAssets(assets.filter(asset => !asset.isMatched && asset.remainingVolume > 0 && asset.doesOfferExists));
    const filterDemangs = (demands: Demand[]) => setDemands(demands.filter(demand => !demand.isMatched && demand.doesDemandExists));

    useEffect(() => {
        const fetchDemand = async () => {
            setLoading(true);
            try {
                const assets = await Asset.fetchAssets(web3, [account]);
                const demand = await Demand.fetchDemands(web3, [account]);
                setAssets(assets.filter(asset => !asset.isMatched && asset.remainingVolume > 0 && asset.doesOfferExists));
                setDemands(demand.filter(demand => !demand.isMatched && demand.doesDemandExists));
            } catch (e: any) {
                toastMetamaskError(e, t);
                setDemands([]);
            }
            setLoading(false);
        }
        fetchDemand();
    }, [web3, account, t]);

    const updateMatches = () => { setDemands([...demands]); setAssets([...assets]); }

    const onProposeMatch = async () => {
        if (selectedAsset === undefined || selectedDemand === undefined)
            return;

        setLoading(true);
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        marketplace.once('MatchProposed', async (err, matchEvent) => {
            if (err)
                return console.error(err)
            const matchData = await marketplace.methods.matches(matchEvent.returnValues.matchId).call();
            if (matchData) {
                filterSetAssets(assets.map(asset => asset.asset === matchData.asset ?
                    asset.update(asset.matches + 1, asset.remainingVolume - Number.parseInt(matchData.volume))
                    :
                    asset));
                filterDemangs(demands.map(demand => demand.buyer === matchData.buyer ?
                    demand.update(true)
                    :
                    demand));
            }
        });
        try {
            const match = new Match();
            await match.proposeMatch(web3, account, selectedAsset, selectedDemand, selectedDemand?.volume, selectedAsset?.price);
        } catch (e: any) {
            console.error(e);
            toastMetamaskError(e, t);
        }
        setLoading(false);
    }

    const assetsComponent = () => {
        const assetsToShow = assets.filter(asset => selectedDemand === undefined || (asset.remainingVolume >= selectedDemand.volume && asset.price >= selectedDemand.price))
        if (assetsToShow.length === 0)
            return (
                <div className="app-row">
                    <div className="text-muted">{t('MARKETPLACE.NO_ASSET')}</div>
                </div>
            );

        return assetsToShow.map(asset => <>
            <div key={`aggregator-${asset.asset}`} className="app-row">
                <div className="d-flex justify-content-between">
                    <div className="text-muted">{t('GENERAL.ASSET_DID')}</div>
                    {
                        selectedAsset !== undefined && asset.asset === selectedAsset.asset ?
                            <Badge variant={"primary"} className="marketplace-selector mb-2" onClick={() => setSelectedAsset(undefined)}>{t("GENERAL.SELECTED")}</Badge>
                            :
                            <Badge variant={"light"} className="marketplace-selector mb-2" onClick={() => setSelectedAsset(asset)}> {t("GENERAL.SELECT")}</Badge>
                    }
                </div>
                <p className="text-truncate">{asset.asset}</p>
                <details>
                    <summary>{t('GENERAL.OFFER')}</summary>
                    <div className="app-row-set success">
                        <div className="app-row">
                            <div className="text-muted">{t('GENERAL.VOLUME')} (KW)</div>
                            <p className="text-truncate">{asset.volume}</p>
                        </div>
                        <div className="app-row">
                            <div className="text-muted">{t('GENERAL.REMAINING_VOLUME')} (KW)</div>
                            <p className="text-truncate">{asset.remainingVolume}</p>
                        </div>
                        <div className="app-row">
                            <div className="text-muted">{t('GENERAL.PRICE')} (ct/KWh)</div>
                            <p className="text-truncate">{asset.price}</p>
                        </div>
                    </div>
                </details>
            </div>
        </>
        );
    }

    const demandsComponent = () => {
        const demandsToShow = demands.filter(demand => selectedAsset === undefined || (demand.price <= selectedAsset.price && demand.volume <= selectedAsset.remainingVolume));

        if (demandsToShow.length === 0)
            return (
                <div className="app-row">
                    <div className="text-muted">{t('MARKETPLACE.NO_DEMANDS')}</div>
                </div>
            );

        return demandsToShow.map(demand => <>
            <div key={`aggregator-${demand.buyer}`} className="app-row">
                <div className="d-flex justify-content-between">
                    <div className="text-muted">{t('GENERAL.BUYER')}</div>
                    {
                        selectedDemand !== undefined && demand.buyer === selectedDemand.buyer ?
                            <Badge variant={"primary"} className="marketplace-selector mb-2" onClick={() => setSelectedDemand(undefined)}>{t("GENERAL.SELECTED")}</Badge>
                            :
                            <Badge variant={"light"} className="marketplace-selector mb-2" onClick={() => setSelectedDemand(demand)}> {t("GENERAL.SELECT")}</Badge>
                    }
                </div>
                <p className="text-truncate">{demand.buyer}</p>
                <details>
                    <summary>{t('GENERAL.DEMAND')}</summary>
                    <div className="app-row-set success">
                        <div className="app-row">
                            <div className="text-muted">{t('GENERAL.VOLUME')} (KW)</div>
                            <p className="text-truncate">{demand.volume}</p>
                        </div>
                        <div className="app-row">
                            <div className="text-muted">{t('GENERAL.PRICE')} (ct/KWh)</div>
                            <p className="text-truncate">{demand.price}</p>
                        </div>
                    </div>
                </details>
            </div>
        </>
        );
    }


    return (
        <>
            {
                loading ?
                    <div className="app-table">
                        < div className="app-row text-center" >
                            <Spinner animation="border" />
                        </div >
                    </div >
                    :
                    <>
                        <div className="app-table">
                            <div className="app-row ">
                                <div className="d-flex align-items-baseline justify-content-between">
                                    <p className="mr-5"><b>{t('MARKETPLACE.PROPOSE_MATCH')}</b></p>
                                    <Button variant={`outline-${isValidMatch ? "success" : "light"}`} disabled={!isValidMatch} onClick={onProposeMatch}>
                                        <i className="fa fa-plus"></i>
                                    </Button>
                                </div>
                                <div className="text-muted">{t('MARKETPLACE.PROPOSE_ASSET_RULE')}</div>
                            </div>
                        </div>
                        <div className="app-table-side-by-side ">
                            <div className="app-table">
                                {assetsComponent()}
                            </div>
                            <div className="app-table">
                                {demandsComponent()}
                            </div>
                        </div>
                    </>
            }
        </>
    );
}

export default MarketplaceAggregator;