import { Signer } from 'ethers';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMounted } from '../../hooks/useIsMounted';
import { Asset } from '../../types/MarketplaceEntities';
import ConfirmModal from '../Modals/ConfirmModal';
import { toastMetamaskError } from '../Toast/Toast';

type Props = {
    signer: Signer
    account: string
    asset: Asset
    updateAssets: () => void
}

function MarketplaceCancelOffer({ signer, account, asset, updateAssets }: Props) {
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const onSubmit = async () => {
        setLoading(true);
        try {
            await asset.cancelOffer(signer);
            updateAssets();
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
            title={t('MARKETPLACE.CANCEL_OFFER')}
            message={t('MARKETPLACE.CANCEL_OFFER_CONFIRM')}
            warning={t('GENERAL.NO_UNDO_ACTION')}
            buttonDisabled={asset.isMatched}
        />
    );
}

export default MarketplaceCancelOffer;