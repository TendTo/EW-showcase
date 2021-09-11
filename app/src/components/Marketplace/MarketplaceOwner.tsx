import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VOLTA_IDENTITY_MANAGER_ADDRESS } from '../../asset/json/voltaContractAddresses.json'
import { abi } from '../../asset/json/IdentityManager.abi.json'
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import IdentityManager from '../../types/IdentityManager'
import { Button, Spinner } from 'react-bootstrap';
import MarketplaceCreateOffer from '../MarketplaceOffer/MarketplaceCreateOffer';
import { toastMetamaskError } from '../Toast/Toast';
import { Asset } from '../../types/MarketplaceEntities';
import MarketplaceCancelOffer from '../MarketplaceOffer/MarketplaceCancelOffer';

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
            const identityManagerContract = new web3.eth.Contract(abi as AbiItem[], VOLTA_IDENTITY_MANAGER_ADDRESS) as unknown as IdentityManager;
            const assetsCreated = await identityManagerContract.getPastEvents('IdentityCreated', {
                filter: { owner: account },
                fromBlock: 'earliest',
                toBlock: 'latest'
            });
            const assetsTransferred = await identityManagerContract.getPastEvents('IdentityTransferred', {
                filter: { owner: account },
                fromBlock: 'earliest',
                toBlock: 'latest'
            });
            // Consider all assets the user may owns among the ones that he has created or those that were transferred to him
            const possibleAssets = Array.from(new Set([...assetsCreated, ...assetsTransferred])).map(({ returnValues }) => returnValues.identity);
            // Filter out assets that are not currently owned by the user
            const assets = await Promise.all(possibleAssets
                .filter(async (identity) => account === await identityManagerContract.methods.identityOwner(identity).call())
                .map(async (identity) => new Asset(identity, account).fetchMarketplaceOffer(web3)));
            setAssets(assets);
            setLoading(false);
        }
        fetchAssets();
    }, [web3, account]);

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

    const viewAssetComponent = () => {

    }

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
        return assets.map((asset, index) => (
            <>
                <div key={index} className="app-row d-flex align-items-center justify-content-between">
                    <div className="d-flex flex-column pr-3">
                        <div className="text-muted">{t('GENERAL.ASSET_DID')}</div>
                        <p className="text-truncate">{asset.asset}</p>
                    </div>
                    {
                        asset.isMatched ?
                            // TODO: unmatch
                            <></>
                            :
                            asset.doesOfferExists ?
                                <div className="marketplace-button-row">
                                    < MarketplaceCreateOffer web3={web3} account={account} asset={asset} updateAssets={updateAssets} />
                                    <MarketplaceCancelOffer web3={web3} account={account} asset={asset} updateAssets={updateAssets} />
                                </div >
                                :
                                < MarketplaceCreateOffer web3={web3} account={account} asset={asset} updateAssets={updateAssets} />
                    }
                </div>
                {
                    asset.doesOfferExists &&
                    <div className="app-row">
                        <details>
                            <summary>{t('GENERAL.OFFER')}</summary>
                            <div className="app-row-set success">
                                <div className="app-row">
                                    <div className="text-muted">{t('GENERAL.VOLUME')} (KW)</div>
                                    <p className="text-truncate">{asset.volume}</p>
                                </div>
                                <div className="app-row">
                                    <div className="text-muted">{t('GENERAL.PRICE')} (ct/KWh)</div>
                                    <p className="text-truncate">{asset.price}</p>
                                </div>
                            </div>
                        </details>
                    </div>
                }
            </>
        ))
    }

    return (
        <div className="app-table">
            <div className="app-row d-flex align-items-baseline justify-content-between">
                <p className="mr-5"><b>{t('MARKETPLACE.ADD_ASSET')}</b></p>
                <Button variant="outline-success" onClick={onCreateAsset} disabled={creatingAsset}>
                    <i className="fa fa-plus"></i>
                </Button>
            </div>
            {renderAssets()}
        </div>
    );
}

export default MarketplaceOwner;
