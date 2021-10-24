import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Marketplace.css';
import MarketplaceAggregator from './MarketplaceAggregator';
import MarketplaceBuyer from './MarketplaceBuyer';
import MarketplaceOwner from './MarketplaceOwner';

enum ROLES { OWNER, BUYER, AGGREGATOR };


function Marketplace() {
    const [role, setRoles] = useState(ROLES.OWNER);
    const { t } = useTranslation();

    const onRoleSelect = (eventKey: string | null) => {
        switch (eventKey) {
            case "owner":
                return setRoles(ROLES.OWNER);
            case "buyer":
                return setRoles(ROLES.BUYER);
            case "aggregator":
                return setRoles(ROLES.AGGREGATOR);
            default:
                return setRoles(ROLES.OWNER);
        }
    }

    return (
        <div className="app-page">
            <div className="app-page-header mb-3">
                <h2>{t('MARKETPLACE.TITLE')}</h2>
            </div>
            <Nav justify variant="tabs" defaultActiveKey="owner" onSelect={onRoleSelect} className="app-nav">
                <Nav.Item>
                    <Nav.Link eventKey="owner"><b>{t("GENERAL.OWNER")}</b></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="buyer"><b>{t("GENERAL.BUYER")}</b></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="aggregator"><b>{t("GENERAL.AGGREGATOR")}</b></Nav.Link>
                </Nav.Item>
            </Nav>
            {
                role === ROLES.OWNER &&
                <MarketplaceOwner />
            }
            {
                role === ROLES.BUYER &&
                <MarketplaceBuyer />
            }
            {
                role === ROLES.AGGREGATOR &&
                <MarketplaceAggregator />
            }
            <div className="d-flex justify-content-end mt-5">
                <div className="d-flex flex-column align-items-end mt-5">
                    <div className="text-muted">{t("GENERAL.CONTRACTS_USED")}</div>
                    <a href="https://volta-explorer.energyweb.org/address/0x37dfeF9b9c56A81927Dfa73994E2fb23c3dd4b37/transactions" target="_blank" rel="noreferrer">Marketplace</a>
                    <a href="https://volta-explorer.energyweb.org/address/0x84d0c7284A869213CB047595d34d6044d9a7E14A/transactions" target="_blank" rel="noreferrer">Energy web's Identity Manager</a>
                </div>
            </div>
        </div>
    );
}

export default Marketplace;
