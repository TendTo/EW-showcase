import React, { useState } from 'react';
import { Button, Container, Modal, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import ew_logo from '../../asset/img/ew-logo-small.png';
import { useIsMounted } from '../../hooks/useIsMounted';
import { Asset } from '../../types/MarketplaceEntities';
import { toastMetamaskError } from '../Toast/Toast';

type Props = {
    web3: Web3
    account: string
    asset: Asset
    updateAssets: () => void
}

function MarketplaceCancelOffer({ web3, account, asset, updateAssets }: Props) {
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const { t } = useTranslation();

    const onSubmit = async () => {
        setLoading(true);
        try {
            await asset.cancelOffer(web3, account);
            updateAssets();
        } catch (e: any) {
            console.error(e);
            toastMetamaskError(e, t);
        }
        if (isMounted.current) {
            setShow(false);
            setLoading(false);
        }
    }

    return (
        <>
            <Button variant="outline-danger" onClick={() => setShow(true)} disabled={loading || asset.isMatched}>
                <i className="fa fa-trash" />
            </Button>


            <Modal show={show} onHide={() => { setShow(false); }} backdrop={!loading} keyboard={!loading}>
                <div className="didedit-card">
                    <div className="d-flex justify-content-center">
                        <div className="login-logo-container">
                            <img src={ew_logo} className="login-logo" alt="Ew-Logo" />
                        </div>
                    </div>
                    <div className="login-card-body">
                        <Container className="text-center">
                            <h4>{t('MARKETPLACE.CANCEL_OFFER')}</h4>
                        </Container>
                        <p>{t('MARKETPLACE.CANCEL_OFFER_CONFIRM')}</p>

                        <div className="d-flex justify-content-end">
                            {loading &&
                                <Spinner animation="border" className="mr-2"></Spinner>
                            }
                            <Button className="mr-2" variant="dark" onClick={() => { setShow(false); }} disabled={loading}>
                                {t('GENERAL.CANCEL')} </Button>
                            <Button variant="primary" onClick={onSubmit} disabled={loading}>
                                {t('GENERAL.SUBMIT')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

        </>
    );
}

export default MarketplaceCancelOffer;