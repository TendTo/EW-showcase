import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VOLTA_MARKETPLACE_ADDRESS } from '../../asset/json/voltaContractAddresses.json'
import { abi } from '../../asset/json/Marketplace.abi.json'
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Marketplace from '../../types/Marketplace'
import { toastMetamaskError } from '../Toast/Toast';
import { Demand } from '../../types/MarketplaceEntities';
import { Spinner } from 'react-bootstrap';
import MarketplaceCreateDemand from '../MarketplaceDemand/MarketplaceCreateDemand';
import MarketplaceCancelDemand from '../MarketplaceDemand/MarketplaceCancelDemand';

type Props = {
    web3: Web3
    account: string
}

function MarketplaceBuyer({ web3, account }: Props) {
    const { t } = useTranslation();
    const [demand, setDemand] = useState<Demand>(new Demand(account));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDemand = async () => {
            setLoading(true);
            const marketContract = new web3.eth.Contract(abi as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
            try {
                const newDemand = await marketContract.methods.demands(account).call();
                setDemand(new Demand(account, Number.parseInt(newDemand.volume), Number.parseInt(newDemand.price), newDemand.isMatched));
            } catch (e: any) {
                toastMetamaskError(e, t);
                setDemand(new Demand(account));
            }
            setLoading(false);
        }
        fetchDemand();
    }, [web3, account]);

    // const onCreateDemand = async () => {
    //     setLoading(true);
    //     const marketContract = new web3.eth.Contract(abi as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
    //     marketContract.once('DemandCreated', (err, demandEvent) => {
    //         const newDemand = demandEvent.returnValues;
    //         err ? console.error(err) : setDemand(new Demand(account, Number.parseInt(newDemand.volume), Number.parseInt(newDemand.price)))
    //     });
    //     try {
    //         await marketContract.methods.createDemand(account).send({ from: account });
    //     } catch (e: any) {
    //         console.error(e);
    //         toastMetamaskError(e, t);
    //     }
    //     setLoading(false);
    // }

    const updateDemand = () => setDemand(demand.clone());

    return (
        <div className="app-table">
            {loading ?
                <div className="app-row text-center">
                    <Spinner animation="border" />
                </div>
                :
                <>
                    <div className="app-row d-flex align-items-center justify-content-between">
                        <div className="d-flex flex-column pr-3">
                            <div className="text-muted">{t('GENERAL.BUYER')}</div>
                            <p className="text-truncate">{demand.buyer}</p>
                        </div>
                        <div className="marketplace-button-row">
                            {
                                demand.isMatched ?
                                    // TODO: unmatch
                                    <></>
                                    :
                                    demand.doesDemandExists ?
                                        <>
                                            < MarketplaceCreateDemand web3={web3} demand={demand} updateDemand={updateDemand} />
                                            <MarketplaceCancelDemand web3={web3} demand={demand} updateDemand={updateDemand} />
                                        </ >
                                        :
                                        < MarketplaceCreateDemand web3={web3} demand={demand} updateDemand={updateDemand} />
                            }
                        </div>
                    </div>
                    {demand.doesDemandExists &&
                        <div className="app-row">
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
                    }
                </>
            }
        </div >
    );
}

export default MarketplaceBuyer;
