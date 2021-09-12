import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
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
            try {
                const demand = new Demand(account);
                setDemand(await demand.fetchMarketplaceDemand(web3));
            } catch (e: any) {
                toastMetamaskError(e, t);
                setDemand(new Demand(account));
            }
            setLoading(false);
        }
        fetchDemand();
    }, [web3, account, t]);

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
