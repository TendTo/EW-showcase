import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { abi } from '../../asset/json/IdentityManager.abi.json';
import { VOLTA_IDENTITY_MANAGER_ADDRESS } from '../../asset/json/voltaContractAddresses.json';
import IdentityManager from '../../types/IdentityManager';
import { Asset } from '../../types/MarketplaceEntities';
import MarketplaceMatches from '../MarketplaceMatch/MarketplaceMatches';
import MarketplaceCancelOffer from '../MarketplaceOffer/MarketplaceCancelOffer';
import MarketplaceCreateOffer from '../MarketplaceOffer/MarketplaceCreateOffer';
import { toastMetamaskError } from '../Toast/Toast';

type Props = {
    web3: Web3
    account: string
}

function MarketplaceOwner({ web3, account }: Props) {
    const { t } = useTranslation();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(false);
    const [creatingAsset, setCreatingAsset] = useState(false);

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            try {
                setAssets(await Asset.fetchAssets(web3, [account]));
            }
            catch (e: any) {
                toastMetamaskError(e, t);
                setAssets([]);
            }
            setLoading(false);
        }
        fetchAssets();
    }, [web3, account, t]);

    const onCreateAsset = async () => {
        setCreatingAsset(true);
        const identityManagerContract = new web3.eth.Contract(abi as AbiItem[], VOLTA_IDENTITY_MANAGER_ADDRESS) as unknown as IdentityManager;
        identityManagerContract.once('IdentityCreated', (err, identity) =>
            err ? console.error(err) : setAssets([...assets, new Asset(identity.returnValues.identity, account)])
        );
        try {
            await identityManagerContract.methods.createIdentity(account).send({ from: account });
        } catch (e: any) {
            console.error(e);
            toastMetamaskError(e, t);
        }
        setCreatingAsset(false);
    }

    const updateAssets = () => {
        console.log('Updating assets');
        console.log(assets);
        setAssets([...assets])
    };

    const renderAssets = () => {
        if (loading) {
            return <div className="text-center mt-2"><Spinner animation="border" /></div>
        }
        if (assets.length === 0) {
            return (
                <div className="text-center mt-2">
                    <p>{t('MARKETPLACE.NO_ASSET')}</p>
                </div>
            );
        }
        return assets.map(asset => (
            <div key={`owner-${asset.asset}`} className="app-row">
                <div className="d-flex justify-content-between">
                    <div className="text-muted">{t('GENERAL.ASSET_DID')}</div>
                    <div className="marketplace-button-row mt-1">
                        {
                            asset.doesOfferExists ?
                                < >
                                    < MarketplaceCreateOffer web3={web3} account={account} asset={asset} updateAssets={updateAssets} />
                                    <MarketplaceCancelOffer web3={web3} account={account} asset={asset} updateAssets={updateAssets} />
                                </ >
                                :
                                < MarketplaceCreateOffer web3={web3} account={account} asset={asset} updateAssets={updateAssets} />
                        }
                    </div>
                </div>
                <p className="text-truncate">{asset.asset}</p>
                {
                    asset.doesOfferExists &&
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
                }
                {
                    asset.doesOfferExists && asset.isMatched &&
                    <MarketplaceMatches web3={web3} account={account} asset={asset} />
                }
            </div>
        ))
    }

    return (
        <>
            <div className="app-table">
                <div className="app-row">
                    <div className="d-flex align-items-baseline justify-content-between">
                        <p><b>{t('MARKETPLACE.ADD_ASSET')}</b></p>
                        <Button variant="outline-success" onClick={onCreateAsset} disabled={creatingAsset}>
                            <i className="fa fa-plus"></i>
                        </Button>
                    </div>
                    <div className="text-muted">{t('MARKETPLACE.CREATE_OFFER_RULE')}</div>
                </div>
            </div>
            <div className="app-table">
                {renderAssets()}
            </div>
        </>
    );
}

export default MarketplaceOwner;
