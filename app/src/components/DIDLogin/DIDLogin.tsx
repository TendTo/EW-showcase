import { WalletProvider } from "iam-client-lib";
import React, { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import metamaskLogo from "../../asset/icon/metamask-logo.svg";
import { AppContext } from "../../context/appContext";
import './DIDLogin.css';

type Props = {
    setDID: (did: string) => void
};

type RequestResultType = 'Error' | 'Unauthorized' | 'Success' | 'None';

function DIDLogin({ setDID }: Props) {
    const { iam } = useContext(AppContext).state;
    const [requestResult, setRequestResult] = useState<RequestResultType>('None');
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (iam.isConnected() && iam.getDid()) {
            setRequestResult('Success');
        }
    }, [iam]);

    const login = async () => {
        setLoading(true);
        try {
            const { did, connected } = await iam.initializeConnection({ walletProvider: WalletProvider.MetaMask });
            setRequestResult("Success");
            if (connected && did) {
                setDID(did);
            }
        } catch (err) {
            console.error(err);
            setRequestResult("Error");
            setDID("");
        }
        setLoading(false);
    };

    const logout = async function () {
        await iam.closeConnection();
        setDID("");
        setRequestResult("None");
    };

    const loginResult = () => {
        let faClass = "check";
        let span = <span className="font-weight-bold">{t('DID.DID_VERIFIED')}</span>;
        switch (requestResult) {
            case "Error":
                span = <Trans i18nKey="DID.DID_ERROR" className="font-weight-bold" components={{ a: <a href="https://voltafaucet.energyweb.org" target="_blank" rel="noreferrer">a</a> }} />;
                faClass = "times"
                break;
            case "Unauthorized":
                span = <span className="font-weight-bold">{t('ERROR.REQUEST_UNAUTHORIZED')}</span>;
                faClass = "times"
                break;
            case "Success":
                faClass = "check";
                break;
            default:
                return <></>;
        }
        return (
            <div className="didlogin-result">
                <i className={`fa fa-lg fa-${faClass}-circle text-${faClass === "check" ? "success" : "danger"} mr-3`}></i>
                <span>{span}</span>
            </div>
        );
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="d-flex flex-column align-items-flex-start">
                <div className="didlogin-button-container mb-3">
                    <div className="didlogin-button">
                        {requestResult !== "Success" ?
                            <img alt="metamask logo" src={metamaskLogo} className="didlogin-label" />
                            :
                            <i className="fa fa-sign-out didlogin-label"></i>}
                        <Button onClick={requestResult !== "Success" ? login : logout} disabled={loading} variant={requestResult !== "Success" ? "primary" : "secondary"}>
                            <span>{requestResult !== "Success" ? t('DID.LOGIN') : t('DID.LOGOUT')}</span>
                        </Button>
                    </div>
                </div>
                {loading ?
                    (<div className="d-flex align-items-center">
                        <Spinner animation="border" className="mr-3" />
                        <span className="font-weight-bold">{t('DID.DID_LOADING')}</span>
                    </div>
                    )
                    :
                    loginResult()}
            </div>
        </div>
    );
}

export default DIDLogin;