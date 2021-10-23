import { Signer } from 'ethers';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMounted } from '../../hooks/useIsMounted';
import { Match } from '../../types/MarketplaceEntities';
import ConfirmModal from '../Modals/ConfirmModal';
import { toastMetamaskError } from '../Toast/Toast';

type Props = {
    signer: Signer
    account: string
    match: Match
    updateMatches: () => void
}

function MarketplaceAcceptMatch({ signer, account, match, updateMatches }: Props) {
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const onSubmit = async () => {
        setLoading(true);
        try {
            await match.acceptMatch(signer, account);
            updateMatches();
        } catch (e: any) {
            console.error(e);
            toastMetamaskError(e, t);
        }
        if (isMounted.current) {
            setLoading(false);
        }
    }

    return (
        <ConfirmModal
            icon="check"
            variant="success"
            loading={loading}
            onSubmit={onSubmit}
            title={t('MARKETPLACE.ACCEPT_MATCH')}
            message={t('MARKETPLACE.ACCEPT_MATCH_CONFIRM')}
        />
    );
}

export default MarketplaceAcceptMatch;