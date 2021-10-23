import { Signer } from 'ethers';
import React, { useState } from 'react';
import { Button, Container, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ew_logo from '../../asset/img/ew-logo-small.png';
import { useIsMounted } from '../../hooks/useIsMounted';
import { Demand } from '../../types/MarketplaceEntities';
import { toastMetamaskError } from '../Toast/Toast';

type Props = {
    signer: Signer
    demand: Demand
    updateDemand: () => void
}

type FormInput = {
    volume: number
    price: number
}

function MarketplaceCreateDemand({ signer, demand, updateDemand }: Props) {
    const defaultValues = { volume: demand.volume, price: demand.price };
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const { register, formState: { errors }, handleSubmit, reset } = useForm<FormInput>({ defaultValues });
    const { t } = useTranslation();

    const onSubmit = async ({ volume, price }: FormInput) => {
        setLoading(true);
        try {
            await demand.createDemand(signer, volume, price);
            updateDemand();
        } catch (e: any) {
            console.error(e);
            toastMetamaskError(e, t);
        }
        if (isMounted.current) {
            setShow(false);
            setLoading(false);
            reset({ volume: demand.volume, price: demand.price });
        }
    }

    const valueValidationOptions = {
        valueAsNumber: true,
        pattern: { value: /^\d+$/, message: t("ERROR.ONLY_INT") as string },
        validate: (val: number) => val > 0 ? true : (t("ERROR.NOT_POSITIVE") as string),
        maxLength: { value: 70, message: t("ERROR.MAX_LENGTH", { max: 70 }) }
    }

    return (
        <>
            {demand.doesDemandExists ?
                <Button variant="outline-warning" onClick={() => setShow(true)} disabled={loading || demand.isMatched}>
                    <i className="square-fav fa fa-pencil-square-o" />
                </Button>
                :
                <Button variant="outline-light" onClick={() => setShow(true)} disabled={loading || demand.isMatched}>
                    <i className="square-fav fa fa-location-arrow" />
                </Button>
            }

            <Modal show={show} onHide={() => { setShow(false); reset(defaultValues); }} backdrop={!loading} keyboard={!loading}>
                <div className="didedit-card">
                    <div className="d-flex justify-content-center">
                        <div className="login-logo-container">
                            <img src={ew_logo} className="login-logo" alt="Ew-Logo" />
                        </div>
                    </div>
                    <div className="login-card-body">
                        <Container className="text-center">
                            <h4>{demand.doesDemandExists ? t('MARKETPLACE.EDIT_DEMAND') : t('MARKETPLACE.CREATE_DEMAND')}</h4>
                        </Container>
                        <Form className="didedit-form" onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3" controlId="formVolume">
                                <Form.Label>{t('GENERAL.VOLUME')} (KW)</Form.Label>
                                <Form.Control {...register("volume", valueValidationOptions)} type="number" placeholder={t('GENERAL.VOLUME')} isInvalid={Boolean(errors.volume)} disabled={loading} maxLength={70} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.volume?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPrice">
                                <Form.Label>{t('GENERAL.PRICE')} (ct/KWh)</Form.Label>
                                <Form.Control {...register("price", valueValidationOptions)} type="number" placeholder={t('GENERAL.PRICE')} isInvalid={Boolean(errors.price)} disabled={loading} maxLength={70} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.price?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-end">
                                {loading &&
                                    <Spinner animation="border" className="mr-2"></Spinner>
                                }
                                <Button className="mr-2" variant="dark" onClick={() => { setShow(false); reset(defaultValues); }} disabled={loading}>
                                    {t('GENERAL.CANCEL')} </Button>
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {t('GENERAL.SUBMIT')}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default MarketplaceCreateDemand;