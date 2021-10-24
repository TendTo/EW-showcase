import { IServiceEndpoint } from "@ew-did-registry/did-resolver-interface";
import { ClaimData, Profile } from "iam-client-lib";
import React, { useContext, useState } from "react";
import { Button, Container, Form, Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ew_logo from '../../asset/img/ew-logo-small.png';
import { AppContext } from "../../context/appContext";
import { toastMetamaskError } from "../Toast/Toast";
import './DIDEdit.css';

type Props = {
    did: string
    profile: Profile | undefined
    setProfileClaims: (claim: (IServiceEndpoint & ClaimData) | undefined) => void
}

type FormInput = {
    name: string
    address: string
    birthdate: string
}

function DIDEdit({ did, profile, setProfileClaims }: Props) {
    const defaultValues = {
        name: profile?.name ? profile.name.toString() : "",
        address: profile?.address ? profile.address.toString() : "",
        birthdate: profile?.birthdate ? new Date(Number(profile.birthdate)).toISOString().substr(0, 10) : ""
    };
    const { iam } = useContext(AppContext).state;
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const { register, formState: { errors }, handleSubmit, reset } = useForm<FormInput>({ defaultValues });
    const { t } = useTranslation();

    const onSubmit = async ({ name, address, birthdate }: FormInput) => {
        setLoading(true);
        const date = new Date(birthdate);
        const data = {
            profile: {
                name,
                address,
                birthdate: !isNaN(date.getTime()) ? date.getTime().toString() : "",
            }
        }
        try {
            await iam.createSelfSignedClaim({ data });
            const claims = await iam.getUserClaims({ did });
            setProfileClaims(claims.find(c => c.profile));
        } catch (e: any) {
            console.error(e);
            toastMetamaskError(e, t);
        }
        setLoading(false);
        setShow(false);
        reset(defaultValues);
    }

    return (
        <>
            <Button variant="outline-light" onClick={() => setShow(true)}><i className="fa fa-pencil" /></Button>


            <Modal show={show} onHide={() => { setShow(false); reset(defaultValues); }} backdrop={!loading} keyboard={!loading}>
                <div className="didedit-card">
                    <div className="d-flex justify-content-center">
                        <div className="login-logo-container">
                            <img src={ew_logo} className="login-logo" alt="Ew-Logo" />
                        </div>
                    </div>
                    <div className="login-card-body">
                        <Container className="text-center">
                            <h4>{t('DID.EDIT_TITLE')}</h4>
                        </Container>
                        <Form className="didedit-form" onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>{t('DID.DID_NAME')}</Form.Label>
                                <Form.Control {...register("name", {
                                    maxLength: { value: 256, message: t("ERROR.MAX_LENGTH", { max: 256 }) }
                                })} type="text" placeholder={t('DID.DID_NAME')} isInvalid={Boolean(errors.name)} disabled={loading} maxLength={256} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formAddress">
                                <Form.Label>{t('DID.DID_ADDRESS')}</Form.Label>
                                <Form.Control {...register("address", {
                                    maxLength: { value: 256, message: t("ERROR.MAX_LENGTH", { max: 256 }) }
                                })} type="text" placeholder={t('DID.DID_ADDRESS')} isInvalid={Boolean(errors.address)} disabled={loading} maxLength={256} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.address?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBirthdate">
                                <Form.Label>{t('DID.DID_BIRTHDATE')}</Form.Label>
                                <Form.Control {...register("birthdate")} type="date" isInvalid={Boolean(errors.birthdate)} disabled={loading} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.birthdate?.message}
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

export default DIDEdit;