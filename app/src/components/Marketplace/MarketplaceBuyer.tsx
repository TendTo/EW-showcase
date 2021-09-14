import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import { Demand } from '../../types/MarketplaceEntities';
import MarketplaceCancelDemand from '../MarketplaceDemand/MarketplaceCancelDemand';
import MarketplaceCreateDemand from '../MarketplaceDemand/MarketplaceCreateDemand';
import MarketplaceMatches from '../MarketplaceMatch/MarketplaceMatches';
import { toastMetamaskError } from '../Toast/Toast';

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
            try {
                const demand = new Demand(account);
                setDemand(await demand.fetchDemand(web3));
            } catch (e: any) {
                console.error(e);
                toastMetamaskError(e, t);
                setDemand(new Demand(account));
            }
            setLoading(false);
        }
        fetchDemand();
    }, [web3, account, t]);

    const updateDemand = () => setDemand(demand.clone());

    return (
        <>
            <div className="app-table">
                <div className="app-row">
                    <p><b>{t('MARKETPLACE.CREATE_DEMAND')}</b></p>
                    <div className="text-muted">{t('MARKETPLACE.CREATE_DEMAND_RULE')}</div>
                </div>
            </div>
            <div className="app-table">
                {loading ?
                    <div className="app-row text-center">
                        <Spinner animation="border" />
                    </div>
                    :
                    <>
                        <div className="app-row">
                            <div className="d-flex justify-content-between">
                                <div className="text-muted">{t('GENERAL.BUYER')}</div>
                                <div className="marketplace-button-row">
                                    {
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
                            <p className="text-truncate">{demand.buyer}</p>
                            {demand.doesDemandExists &&
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
                            }
                            {
                                demand.doesDemandExists && demand.isMatched &&
                                <MarketplaceMatches web3={web3} account={account} demand={demand} />
                            }
                        </div>
                    </>
                }
            </div >
        </>
    );
}

export default MarketplaceBuyer;
