import MetaMaskOnboarding from '@metamask/onboarding';
import { ethers, Signer } from 'ethers';
import React, { useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import metamaskLogo from "../../asset/icon/metamask-logo.svg";
import ew_logo from '../../asset/img/ew-logo-small.png';
import toast, { toastMetamaskError } from '../Toast/Toast';
import './Login.css';

declare var window: { location: { reload: () => any; }; ethereum: ethers.providers.ExternalProvider & { enable(): Promise<void> } };


type Props = {
    setAccount: (account: string) => void;
    setSigner: (signer: Signer) => void;
    setChain: (chain: string) => void;
    chain: string;
};

const reloadWindow = (_: any) => window.location.reload();

function Login({ setAccount, setSigner, setChain, chain }: Props) {
    const { t } = useTranslation();
    const allowedChains = ["volta"];
    const onboarding = React.useRef<MetaMaskOnboarding>(new MetaMaskOnboarding());

    const onClick = async () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            onboarding.current.stopOnboarding();
            try {
                await window.ethereum.enable();
            } catch (err: any) {
                toastMetamaskError(err, t);
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            if (accounts.length === 0) {
                toast(t("ERROR.NO_ACCOUNT"), 'danger');
                return;
            }
            setAccount(accounts[0]);
            setChain((await provider.getNetwork()).name);
        } else {
            toast(t("ERROR.NO_PROVIDER"), 'danger');
            onboarding.current.startOnboarding();
        }
    };

    useEffect(() => {
        const setup = async () => {
            if (window.ethereum === undefined)
                return;
            try {
                await window.ethereum.enable();
            } catch (err: any) {
                toastMetamaskError(err, t);
                return;
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            provider.once('accountsChanged', reloadWindow);
            provider.once('chainChanged', reloadWindow);
            const accounts = await provider.listAccounts();
            setSigner(provider.getSigner());
            if (accounts.length === 0) return;
            setAccount(accounts[0]);
            setChain((await provider.getNetwork()).name);
        };
        setup();
    }, [t, setSigner, setChain, setAccount])

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
                                <Button onClick={onClick} disabled={!allowedChains.includes(chain) && chain !== ""}>
                                    <span>{t('LOGIN.BUTTON_METAMASK')}</span>
                                </Button>
                            </div>
                            {(!allowedChains.includes(chain) && chain !== "" &&
                                <p className="label text-danger">{t('LOGIN.ERROR_UNSUPPORTED_CHAIN', { chain: chain })}</p>
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