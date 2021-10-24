import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/appContext';
import { useIsMounted } from '../../hooks/useIsMounted';
import { Match } from '../../types/MarketplaceEntities';
import ConfirmModal from '../Modals/ConfirmModal';
import { toastMetamaskError } from '../Toast/Toast';

type Props = {
    match: Match
    updateMatch: () => void
}

function MarketplaceCancelMatch({ match, updateMatch }: Props) {
    const { signer, address } = useContext(AppContext).state;
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const onSubmit = async () => {
        setLoading(true);
        try {
            await match.cancelProposedMatch(signer, address);
            updateMatch();
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
            icon="times"
            variant="danger"
            loading={loading}
            onSubmit={onSubmit}
            title={t('MARKETPLACE.DELETE_MATCH')}
            message={t('MARKETPLACE.DELETE_MATCH_CONFIRM')}
            warning={t('GENERAL.NO_UNDO_ACTION')}
        />
    );
}

export default MarketplaceCancelMatch;