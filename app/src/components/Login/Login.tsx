import MetaMaskOnboarding from '@metamask/onboarding';
import { ethers } from 'ethers';
import React, { useContext, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import metamaskLogo from "../../asset/icon/metamask-logo.svg";
import ew_logo from '../../asset/img/ew-logo-small.png';
import { AppContext, appContextData } from '../../context/appContext';
import { allowedChains } from '../../types/constants';
import toast, { toastMetamaskError } from '../Toast/Toast';
import './Login.css';

declare var window: {
    location: { reload: () => any; };
    ethereum: ethers.providers.ExternalProvider & {
        request(method: { method: string }): Promise<void>
        once(event: string, cb: (...args: any[]) => void): void;
    }
};

type Props = {
    login: (newContext: appContextData) => void;
};

function Login({ login }: Props) {
    const { state, update } = useContext(AppContext);
    const { t } = useTranslation();
    const onboarding = React.useRef<MetaMaskOnboarding>(new MetaMaskOnboarding());

    const onClick = async () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            onboarding.current.stopOnboarding();
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (err: any) {
                toastMetamaskError(err, t);
                console.log(err);
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const accounts = await provider.listAccounts();
            const newContext = {
                ...state,
                signer: provider.getSigner(),
                address: accounts[0],
                chainName: (await provider.getNetwork()).name,
            };
            update(newContext);
            login(newContext);
        } else {
            toast(t("ERROR.NO_PROVIDER"), 'danger');
            onboarding.current.startOnboarding();
        }
    };

    useEffect(() => {
        const setup = async () => {
            if (window.ethereum === undefined || state.chainName !== "")
                return;
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (err: any) {
                toastMetamaskError(err, t);
                console.log(err);
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            window.ethereum.once('accountsChanged', () => window.location.reload());
            window.ethereum.once('chainChanged', () => window.location.reload());
            const accounts = await provider.listAccounts();
            const newContext = {
                ...state,
                signer: provider.getSigner(),
                address: accounts[0],
                chainName: (await provider.getNetwork()).name,
            };
            update(newContext);
            login(newContext);
        };
        setup();
    }, [t, login, state, update]);

    return (
        <Container className="h-100">
            <div className="d-flex justify-content-center h-100">
                <div className="login-card">
                    <div className="d-flex justify-content-center">
                        <div className="login-logo-container">
                            <img src={ew_logo} className="login-logo" alt="Ew-Logo" />
                        </div>
                    </div>
                    <div className="login-card-body">
                        <Container className="text-center">
                            <h4>{t('LOGIN.TITLE')}</h4>
                        </Container>
                        <Container className="login-button-container">
                            <p>{t('LOGIN.TEXT')}</p>
                            <div className="login-button">
                                <img alt="metamask logo" src={metamaskLogo} />
                                <Button onClick={onClick} disabled={!allowedChains.includes(state.chainName) && state.chainName !== ""}>
                                    <span>{t('LOGIN.BUTTON_METAMASK')}</span>
                                </Button>
                            </div>
                            {(!allowedChains.includes(state.chainName) && state.chainName !== "" &&
                                <p className="label text-danger">{t('LOGIN.ERROR_UNSUPPORTED_CHAIN', { chain: state.chainName })}</p>
                            )}
                        </Container>
                        <div className="mt-4">
                            <div className="d-flex justify-content-center">{t('LOGIN.NO_METAMASK')}
                                <a href="https://metamask.io/download.html" className="ml-2">Download</a>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">{t('LOGIN.CONNECT_TO_VOLTA')}
                            <a href="https://energyweb.atlassian.net/wiki/spaces/EWF/pages/703201459/Volta+Connecting+to+Remote+RPC+and+Metamask" className="ml-2">{t("LOGIN.CONNECT")}</a>
                        </div>
                        <div className="d-flex justify-content-center">{t('LOGIN.WHAT_IS_EW')}
                            <a href="https://www.energyweb.org/" className="ml-2">Energy Web</a>
                        </div>
                    </div>
                </div>
            </div>
        </Container >
    );
}
export default Login;