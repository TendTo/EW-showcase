import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import MarketplaceOwner from './MarketplaceOwner';
import './Marketplace.css'

enum ROLES { OWNER, BUYER, AGGREGATOR };

type Props = {
    web3: Web3
    account: string
}

function Marketplace({ web3, account }: Props) {
    const [role, setRoles] = useState(ROLES.OWNER);
    const { t } = useTranslation();

    return (
        <div className="app-page">
            <div className="app-page-header mb-3">
                <h2>{t('MARKETPLACE.TITLE')}</h2>
            </div>
            <MarketplaceOwner web3={web3} account={account} />
        </div>
    );
}

export default Marketplace;
