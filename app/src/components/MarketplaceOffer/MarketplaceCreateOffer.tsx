import React, { useContext, useState } from 'react';
import { Button, Container, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ew_logo from '../../asset/img/ew-logo-small.png';
import { AppContext } from '../../context/appContext';
import { useIsMounted } from '../../hooks/useIsMounted';
import { Asset } from '../../types/MarketplaceEntities';
import { toastMetamaskError } from '../Toast/Toast';

type Props = {
    asset: Asset
    updateAssets: () => void
}

type FormInput = {
    volume: number
    price: number
}

function MarketplaceCreateOffer({ asset, updateAssets }: Props) {
    const { signer } = useContext(AppContext).state;
    const defaultValues = { volume: asset.volume, price: asset.price };
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const { register, formState: { errors }, handleSubmit, reset } = useForm<FormInput>({ defaultValues });
    const { t } = useTranslation();

    const onSubmit = async ({ volume, price }: FormInput) => {
        setLoading(true);
        try {
            await asset.createOffer(signer, volume, price);
            updateAssets();
        } catch (e: any) {
            console.error(e);
            toastMetamaskError(e, t);
        }
        if (isMounted.current) {
            setShow(false);
            setLoading(false);
            reset({ volume: asset.volume, price: asset.price });
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
            {asset.doesOfferExists ?
                <Button variant="outline-warning" onClick={() => setShow(true)} disabled={loading || asset.isMatched}>
                    <i className="square-fav fa fa-pencil-square-o" />
                </Button>
                :
                <Button variant="outline-light" onClick={() => setShow(true)} disabled={loading || asset.isMatched}>
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
                            <h4>{asset.doesOfferExists ? t('MARKETPLACE.EDIT_OFFER') : t('MARKETPLACE.CREATE_OFFER')}</h4>
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

export default MarketplaceCreateOffer;