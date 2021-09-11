import React, { useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ew_logo from '../../asset/img/ew-logo-small.png';
import { Demand } from '../../types/MarketplaceEntities';

type Props = {
    demand: Demand
}

function MarketplaceViewDemand({ demand }: Props) {
    const [show, setShow] = useState(false);
    const { t } = useTranslation();

    return (
        <>
            <Button variant="outline-info" onClick={() => setShow(true)} ><i className="square-fav fa fa-eye" /> </Button>

            <Modal show={show} onHide={() => { setShow(false); }}>
                <div className="didedit-card">
                    <div className="d-flex justify-content-center">
                        <div className="login-logo-container">
                            <img src={ew_logo} className="login-logo" alt="Ew-Logo" />
                        </div>
                    </div>
                    <div className="login-card-body">
                        <Container className="text-center">
                            <h4>{t('MARKETPLACE.VIEW_OFFER')}</h4>
                        </Container>
                        <Form.Group className="mb-3" controlId="formVolume">
                            <Form.Label>{t('GENERAL.VOLUME')} (KW)</Form.Label>
                            <Form.Control value={demand.volume} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPrice">
                            <Form.Label>{t('GENERAL.PRICE')} (ct/KWh)</Form.Label>
                            <Form.Control value={demand.price} disabled />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="dark" onClick={() => setShow(false)}>
                                {t('GENERAL.CANCEL')} </Button>
                        </div>
                    </div>
                </div>
            </Modal>

        </>
    );
}

export default MarketplaceViewDemand;