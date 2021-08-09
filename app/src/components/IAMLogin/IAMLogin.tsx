import { WalletProvider } from "iam-client-lib";
import React, { useContext, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import metamaskLogo from "../../asset/icon/metamask-logo.svg";
import IAMContext from "../../context/IAMContext";
import './IAMLogin.css';

type Props = {
    setDID: (did: string) => void
};

type RequestResultType = 'Error' | 'Unauthorized' | 'Success' | 'None';

function IamLogin({ setDID }: Props) {
    const iam = useContext(IAMContext);
    const [requestResult, setRequestResult] = useState<RequestResultType>('None');
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    const login = async () => {
        setLoading(true);
        setRequestResult("Success");
        try {
            const { did, connected } = await iam.initializeConnection({ walletProvider: WalletProvider.MetaMask });
            console.log(`did: ${did}`);

            if (connected && did) {
                setDID(did);
            }
        } catch (err) {
            setRequestResult("Error");
        }
        setLoading(false);
    };

    const loginResult = () => {
        let faClass = "check";
        let span = <span className="font-weight-bold">{t('IAM.DID_VERIFIED')}</span>;
        switch (requestResult) {
            case "Error":
                span = <Trans i18nKey="IAM.DID_ERROR" className="font-weight-bold" components={{ a: <a href="https://voltafaucet.energyweb.org" target="_blank" rel="noreferrer">a</a> }} />;
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
            <div className="iamlogin-result">
                <i className={`fa fa-lg fa-${faClass}-circle text-${faClass === "check" ? "success" : "danger"} mr-3`}></i>
                <span>{span}</span>
            </div>
        );
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="d-flex flex-column align-items-flex-start">
                <div className="iamlogin-button-container mb-3">
                    <div className="iamlogin-button">
                        <img alt="metamask logo" src={metamaskLogo} />
                        <Button onClick={login} disabled={loading}>
                            <span>{t('IAM.BUTTON_METAMASK')}</span>
                        </Button>
                    </div>
                </div>
                {loading ?
                    (<div className="d-flex align-items-center">
                        <Spinner animation="border" className="mr-3" />
                        <span className="font-weight-bold">{t('IAM.DID_LOADING')}</span>
                    </div>
                    )
                    :
                    loginResult()}
            </div>
        </div>
    );
}

export default IamLogin;