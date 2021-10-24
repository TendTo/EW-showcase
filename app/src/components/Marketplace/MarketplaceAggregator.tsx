import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { Badge, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { abi as MarketplaceABI } from '../../asset/json/Marketplace.abi.json';
import { VOLTA_MARKETPLACE_ADDRESS } from '../../asset/json/voltaContractAddresses.json';
import { AppContext } from '../../context/appContext';
import { MarketplaceAbi as Marketplace } from '../../types/MarketplaceAbi';
import { Asset, Demand, Match } from '../../types/MarketplaceEntities';
import { toastMetamaskError } from '../Toast/Toast';

function MarketplaceAggregator() {
    const { signer, address } = useContext(AppContext).state;
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
                const assets = await Asset.fetchAssets(signer, [address]);
                const demand = await Demand.fetchDemands(signer, [address]);
                setAssets(assets.filter(asset => !asset.isMatched && asset.remainingVolume > 0 && asset.doesOfferExists));
                setDemands(demand.filter(demand => !demand.isMatched && demand.doesDemandExists));
            } catch (e: any) {
                console.error(e);
                toastMetamaskError(e, t);
                setDemands([]);
            }
            setLoading(false);
        }
        fetchDemand();
    }, [signer, address, t]);

    const onProposeMatch = async () => {
        if (selectedAsset === undefined || selectedDemand === undefined)
            return;

        setLoading(true);
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        marketplace.once('MatchProposed', async (err, matchEvent) => {
            if (err)
                return console.error(err)
            const matchData = await marketplace.matches(matchEvent.returnValues.matchId);
            if (matchData) {
                filterSetAssets(assets.map(asset => asset.asset === matchData.asset ?
                    asset.update(asset.matches + 1, asset.remainingVolume - matchData.volume.toNumber())
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
            await match.proposeMatch(signer, selectedAsset, selectedDemand, selectedDemand?.volume, selectedAsset?.price);
            setSelectedAsset(undefined);
            setSelectedDemand(undefined);
        } catch (e: any) {
            console.error(e);
            toastMetamaskError(e, t);
        }
        setLoading(false);
    }

    const assetsComponent = () => {
        const assetsToShow = assets.filter(asset => selectedDemand === undefined || (asset.remainingVolume >= selectedDemand.volume && asset.price <= selectedDemand.price))
        if (assetsToShow.length === 0)
            return (
                <div className="app-row">
                    <div className="text-muted">{t('MARKETPLACE.NO_ASSET')}</div>
                </div>
            );

        return assetsToShow.map(asset =>
            <div key={`aggregator-${asset.asset}`} className="app-row">
                <div className="d-flex justify-content-between">
                    <div className="text-muted">{t('GENERAL.ASSET_DID')}</div>
                    {
                        selectedAsset !== undefined && asset.asset === selectedAsset.asset ?
                            <Badge bg="primary" className="marketplace-selector mb-2" onClick={() => setSelectedAsset(undefined)}>{t("GENERAL.SELECTED")}</Badge>
                            :
                            <Badge bg="light" className="marketplace-selector mb-2" onClick={() => setSelectedAsset(asset)}> {t("GENERAL.SELECT")}</Badge>
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
        );
    }

    const demandsComponent = () => {
        const demandsToShow = demands.filter(demand => selectedAsset === undefined || (demand.price >= selectedAsset.price && demand.volume <= selectedAsset.remainingVolume));

        if (demandsToShow.length === 0)
            return (
                <div className="app-row">
                    <div className="text-muted">{t('MARKETPLACE.NO_DEMANDS')}</div>
                </div>
            );

        return demandsToShow.map(demand =>
            <div key={`aggregator-${demand.buyer}`} className="app-row">
                <div className="d-flex justify-content-between">
                    <div className="text-muted">{t('GENERAL.BUYER')}</div>
                    {
                        selectedDemand !== undefined && demand.buyer === selectedDemand.buyer ?
                            <Badge bg="primary" className="marketplace-selector mb-2" onClick={() => setSelectedDemand(undefined)}>{t("GENERAL.SELECTED")}</Badge>
                            :
                            <Badge bg="light" className="marketplace-selector mb-2" onClick={() => setSelectedDemand(demand)}> {t("GENERAL.SELECT")}</Badge>
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