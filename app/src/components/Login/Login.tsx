import detectEthereumProvider from '@metamask/detect-provider';
import MetaMaskOnboarding from '@metamask/onboarding';
import React, { useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import Web3 from 'web3';
import metamaskLogo from "../../asset/metamask-logo.svg";
import { WindowProvider } from '../../types/MetaMask';
import toast from '../Toast/Toast';
import { accountConnectionSentError, noAccountError, noProviderError } from './Login.json';

type Props = {
    setAccounts: (account: string[]) => void;
    setWeb3: (web3: Web3) => void;
    setChain: (chain: string) => void;
    web3?: Web3;
    chain: string;
};

export function Login({ setAccounts, setWeb3, setChain, web3, chain }: Props) {
    const allowedChains = ["volta"];
    const onboarding = React.useRef<MetaMaskOnboarding>(new MetaMaskOnboarding());

    const providerEventSetup = (provider: WindowProvider, newWeb3: Web3) => {
        provider.removeListener('accountsChanged', setAccounts);
        provider.removeListener('chainChanged', setChain);
        provider.on('accountsChanged', setAccounts);
        provider.on('chainChanged', async (_) => setChain(await newWeb3.eth.net.getNetworkType()));
    }

    const handleAccounts = (accounts: string[]) => {
        if (accounts.length > 0) {
            setAccounts(accounts);
            onboarding.current.stopOnboarding();
        } else
            toast(noAccountError, 'danger');
    }

    const onClick = async () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            onboarding.current.stopOnboarding();
            const provider = await detectEthereumProvider() as WindowProvider;
            try {
                await provider.request({ method: 'eth_requestAccounts' });
            } catch (e) {
                toast(accountConnectionSentError, 'danger');
                return;
            }
            const currentWeb3 = web3 || new Web3(provider);
            handleAccounts(await currentWeb3.eth.getAccounts());
            setChain(await currentWeb3.eth.net.getNetworkType());
        } else {
            toast(noProviderError, 'danger');
            onboarding.current.startOnboarding();
        }
    };

    useEffect(() => {
        const setup = async () => {
            const provider = await detectEthereumProvider() as WindowProvider;
            if (provider !== null) {
                console.log(provider);
                const newWeb3 = new Web3(provider);
                const accounts = await newWeb3.eth.getAccounts();
                const chain = await newWeb3.eth.net.getNetworkType();
                console.log(`Web3 setted: ${web3}`);
                if (accounts.length > 0) setAccounts(accounts);
                setChain(chain);
                setWeb3(newWeb3);
                providerEventSetup(provider, newWeb3);
            }
        }
        setup();
    }, [])

    return (
        <Card className="text-center">
            <Card.Body>
                <Card.Title>Login</Card.Title>
                <div className="login-button-container">
                    <Button onClick={onClick}>
                        <img alt="metamask logo" className="metamask" src={metamaskLogo} />
                        <span>Login with Metamask</span>
                    </Button>
                </div>
                {(!allowedChains.includes(chain) && chain !== "" &&
                    <p className="label text-danger">{chain} net is not supported.<br></br>Conntect to the volta testnet</p>)}
            </Card.Body>
        </Card>
    );
}
export default Login;