import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { abi } from '../../asset/json/IdentityManager.abi.json';
import { VOLTA_IDENTITY_MANAGER_ADDRESS } from '../../asset/json/voltaContractAddresses.json';
import { AppContext } from '../../context/appContext';
import { IdentityManagerAbi as IdentityManager } from '../../types/IdentityManagerAbi';
import { Asset } from '../../types/MarketplaceEntities';
import MarketplaceMatches from '../MarketplaceMatch/MarketplaceMatches';
import MarketplaceCancelOffer from '../MarketplaceOffer/MarketplaceCancelOffer';
import MarketplaceCreateOffer from '../MarketplaceOffer/MarketplaceCreateOffer';
import { toastMetamaskError } from '../Toast/Toast';

function MarketplaceOwner() {
    const { signer, address } = useContext(AppContext).state;
    const { t } = useTranslation();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(false);
    const [creatingAsset, setCreatingAsset] = useState(false);

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            try {
                setAssets(await Asset.fetchAssets(signer, [address]));
            }
            catch (e: any) {
                console.error(e);
                toastMetamaskError(e, t);
                setAssets([]);
            }
            setLoading(false);
        }
        fetchAssets();
    }, [signer, address, t]);

    const onCreateAsset = async () => {
        setCreatingAsset(true);
        const identityManagerContract = new ethers.Contract(VOLTA_IDENTITY_MANAGER_ADDRESS, abi, signer) as IdentityManager;
        identityManagerContract.once('IdentityCreated', (err, identity) =>
            err ? console.error(err) : setAssets([...assets, new Asset(identity.returnValues.identity, address)])
        );
        try {
            await identityManagerContract.createIdentity(address);
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
                                    < MarketplaceCreateOffer asset={asset} updateAssets={updateAssets} />
                                    <MarketplaceCancelOffer asset={asset} updateAssets={updateAssets} />
                                </ >
                                :
                                < MarketplaceCreateOffer asset={asset} updateAssets={updateAssets} />
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
                    <MarketplaceMatches asset={asset} />
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
