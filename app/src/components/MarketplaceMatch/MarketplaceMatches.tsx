import { Signer } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Badge, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Asset, Demand, Match } from '../../types/MarketplaceEntities';
import { toastMetamaskError } from '../Toast/Toast';
import MarketplaceAcceptMatch from './MarketplaceAcceptMatch';
import MarketplaceDeleteMatch from './MarketplaceDeleteMatch';
import MarketplaceRejectMatch from './MarketplaceRejectMatch';

type Props = {
    signer: Signer
    account: string
    demand?: Demand
    asset?: Asset
}

function MarketplaceMatches({ signer, account, asset, demand }: Props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        const fetchDemand = async () => {
            setLoading(true);
            try {
                const match = demand !== undefined ? Match.fetchMatches(signer, demand) : Match.fetchMatches(signer, asset!);
                setMatches(await match);
            } catch (e: any) {
                toastMetamaskError(e, t);
            }
            setLoading(false);
        }
        fetchDemand();
    }, [signer, account, asset, demand, t]);

    const updateMatches = () => setMatches(matches.filter(match => match.doesMatchExists));

    const matchesComponent = () =>
        matches.map(match =>
            <div key={`matches-${match.matchId}`} className="app-row-set info">
                <div className="app-row">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                            <div className="text-muted">{t('GENERAL.ID')}</div>
                            <Badge bg={match.isAccepted ? "success" : "warning"} className="ml-3">
                                {match.isAccepted ? t("GENERAL.ACCEPTED") : t("GENERAL.PENDING")}
                            </Badge>
                        </div >
                        <div className="marketplace-button-row">
                            {demand !== undefined && !match.isAccepted &&
                                <MarketplaceAcceptMatch signer={signer} account={account} match={match} updateMatches={updateMatches} />
                            }
                            {
                                !match.isAccepted &&
                                <MarketplaceRejectMatch signer={signer} account={account} match={match} updateMatches={updateMatches} />

                            }
                            {match.isAccepted &&
                                <MarketplaceDeleteMatch signer={signer} account={account} match={match} updateMatches={updateMatches} />
                            }
                        </div>
                    </div>
                    <p className="text-truncate">{match.matchId}</p>
                </div>
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.ASSET_DID')}</div>
                    <p className="text-truncate">{match.asset?.asset}</p>
                </div>
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.BUYER')}</div>
                    <p className="text-truncate">{match.demand?.buyer}</p>
                </div>
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.VOLUME')} (KW)</div>
                    <p className="text-truncate">{match.volume}</p>
                </div>
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.PRICE')} (ct/KWh)</div>
                    <p className="text-truncate">{match.price}</p>
                </div>
            </div >
        );

    return (<>
        {loading ?
            <div className="app-row text-center">
                <Spinner animation="border" />
            </div>
            :
            (matches.length > 0 &&
                <>
                    <details>
                        <summary>{t('GENERAL.MATCH')}</summary>
                        {matchesComponent()}
                    </details>
                </>
            )
        }
    </>);
}

export default MarketplaceMatches;
