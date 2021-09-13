import React, { useState } from 'react';
import { Button, Container, Modal, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ew_logo from '../../asset/img/ew-logo-small.png';

type Props = {
    loading: boolean
    icon: "check" | "times" | "trash"
    variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"
    title: string
    message: string
    warning?: string
    buttonDisabled?: boolean
    onSubmit: () => Promise<void>
}

function ConfirmModal({ icon, variant, loading, title, message, warning, buttonDisabled, onSubmit }: Props) {
    const [show, setShow] = useState(false);
    const { t } = useTranslation();

    const wrapOnSubmit = async () => {
        await onSubmit();
        setShow(false);
    }

    return (
        <>
            <Button variant={`outline-${variant}`} onClick={() => setShow(true)} disabled={loading || buttonDisabled}>
                <i className={`fa fa-${icon}`} />
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
                            <h4>{title}</h4>
                        </Container>
                        <p>{message}</p>
                        {
                            warning &&
                            <p className="text-danger"><small>{warning}</small></p>
                        }

                        <div className="d-flex justify-content-end">
                            {loading &&
                                <Spinner animation="border" className="mr-2"></Spinner>
                            }
                            <Button className="mr-2" variant="dark" onClick={() => { setShow(false); }} disabled={loading}>
                                {t('GENERAL.CANCEL')} </Button>
                            <Button variant="primary" onClick={wrapOnSubmit} disabled={loading}>
                                {t('GENERAL.SUBMIT')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

        </>
    );
}

export default ConfirmModal;