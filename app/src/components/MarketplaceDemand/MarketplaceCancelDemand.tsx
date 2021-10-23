import { Signer } from 'ethers';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMounted } from '../../hooks/useIsMounted';
import { Demand } from '../../types/MarketplaceEntities';
import ConfirmModal from '../Modals/ConfirmModal';
import { toastMetamaskError } from '../Toast/Toast';

type Props = {
    signer: Signer
    demand: Demand
    updateDemand: () => void
}

function MarketplaceCancelDemand({ signer, demand, updateDemand }: Props) {
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const onSubmit = async () => {
        setLoading(true);
        try {
            await demand.cancelDemand(signer);
            updateDemand();
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
            icon="trash"
            variant="danger"
            loading={loading}
            onSubmit={onSubmit}
            title={t('MARKETPLACE.CANCEL_DEMAND')}
            message={t('MARKETPLACE.CANCEL_DEMAND_CONFIRM')}
            warning={t('GENERAL.NO_UNDO_ACTION')}
            buttonDisabled={demand.isMatched}
        />
    );
}

export default MarketplaceCancelDemand;