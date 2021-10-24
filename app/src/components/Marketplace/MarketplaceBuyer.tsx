import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/appContext';
import { Demand } from '../../types/MarketplaceEntities';
import MarketplaceCancelDemand from '../MarketplaceDemand/MarketplaceCancelDemand';
import MarketplaceCreateDemand from '../MarketplaceDemand/MarketplaceCreateDemand';
import MarketplaceMatches from '../MarketplaceMatch/MarketplaceMatches';
import { toastMetamaskError } from '../Toast/Toast';

function MarketplaceBuyer() {
    const { signer, address } = useContext(AppContext).state;
    const { t } = useTranslation();
    const [demand, setDemand] = useState<Demand>(new Demand(address));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDemand = async () => {
            setLoading(true);
            try {
                const demand = new Demand(address);
                setDemand(await demand.fetchDemand(signer));
            } catch (e: any) {
                console.error(e);
                toastMetamaskError(e, t);
                setDemand(new Demand(address));
            }
            setLoading(false);
        }
        fetchDemand();
    }, [signer, address, t]);

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
                                                < MarketplaceCreateDemand signer={signer} demand={demand} updateDemand={updateDemand} />
                                                <MarketplaceCancelDemand signer={signer} demand={demand} updateDemand={updateDemand} />
                                            </ >
                                            :
                                            < MarketplaceCreateDemand signer={signer} demand={demand} updateDemand={updateDemand} />
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
                                <MarketplaceMatches demand={demand} />
                            }
                        </div>
                    </>
                }
            </div >
        </>
    );
}

export default MarketplaceBuyer;
