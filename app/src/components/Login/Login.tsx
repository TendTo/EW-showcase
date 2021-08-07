import detectEthereumProvider from '@metamask/detect-provider';
import MetaMaskOnboarding from '@metamask/onboarding';
import React, { useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Web3 from 'web3';
import metamaskLogo from "../../asset/icon/metamask-logo.svg";
import ew_logo from '../../asset/img/ew-logo-small.png';
import { WindowProvider } from '../../types/MetaMask';
import toast from '../Toast/Toast';
import './Login.css';

type Props = {
    setAccount: (account: string) => void;
    setWeb3: (web3: Web3) => void;
    setChain: (chain: string) => void;
    web3?: Web3;
    chain: string;
};

const reloadWindow = (_: any) => window.location.reload();

export function Login({ setAccount, setWeb3, setChain, web3, chain }: Props) {
    const { t } = useTranslation();
    const allowedChains = ["volta"];
    const onboarding = React.useRef<MetaMaskOnboarding>(new MetaMaskOnboarding());

    const handleAccounts = (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            onboarding.current.stopOnboarding();
        } else {
            setAccount('');
            toast(t("ERROR.NO_ACCOUNT"), 'danger');
        }
    }

    const onClick = async () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            onboarding.current.stopOnboarding();
            const provider = await detectEthereumProvider() as WindowProvider;
            try {
                await provider.request({ method: 'eth_requestAccounts' });
            } catch (e) {
                switch (e.code) {
                    case 4001:
                        return toast(t("ERROR.REQUEST_REJECTED"), 'danger');
                    case -32002:
                        return toast(t("ERROR.REQUEST_ALREADY_SENT"), 'warning');
                    default:
                        return toast(t("ERROR.GENERIC"), 'danger');
                }
            }
            const currentWeb3 = web3 || new Web3(provider);
            handleAccounts(await currentWeb3.eth.getAccounts());
            setChain(await currentWeb3.eth.net.getNetworkType());
        } else {
            toast(t("ERROR.NO_PROVIDER"), 'danger');
            onboarding.current.startOnboarding();
        }
    };

    useEffect(() => {
        const handleAccounts = (accounts: string[]) => {
            if (accounts && accounts.length > 0) {
                setAccount(accounts[0]);
                onboarding.current.stopOnboarding();
            } else {
                setAccount('');
            }
        }
        const providerEventSetup = (provider: WindowProvider, newWeb3: Web3) => {
            provider.removeListener('accountsChanged', reloadWindow);
            provider.removeListener('chainChanged', reloadWindow);
            provider.on('accountsChanged', reloadWindow);
            provider.on('chainChanged', reloadWindow);
        }

        const setup = async () => {
            const provider = await detectEthereumProvider() as WindowProvider;
            if (provider !== null) {
                const newWeb3 = new Web3(provider);
                const accounts = await newWeb3.eth.getAccounts();
                const chain = await newWeb3.eth.net.getNetworkType();
                handleAccounts(accounts);
                setChain(chain);
                setWeb3(newWeb3);
                providerEventSetup(provider, newWeb3);
            }
        };
        setup();
    }, [setWeb3, setChain, setAccount])

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
                                <Button onClick={onClick}>
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