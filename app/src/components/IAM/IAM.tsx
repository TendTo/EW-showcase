import {
    IAM,
    setCacheClientOptions,
    setChainConfig,
    WalletProvider
} from "iam-client-lib";
import React, { useRef, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import KMLogo from "../../asset/key-manager-icon.svg";
import metamaskLogo from "../../asset/metamask-logo.svg";
import walletconnectIcon from "../../asset/wallet-connect-icon.svg";
import "./IAM.css";
import { backendUrl, enrolmentUrl } from "./IAM.json";

setCacheClientOptions(73799, {
    url: "https://volta-identitycache.energyweb.org/",
});
setChainConfig(73799, {
    rpcUrl: "https://volta-rpc.energyweb.org",
});

type Role = {
    name: string;
    namespace: string;
};

function Iam() {
    const iam = useRef<IAM>(new IAM());
    const [roles, setRoles] = useState<Role[]>([]);
    const [did, setDID] = useState<string>("");
    const [errored, setErrored] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>(false);
    const [unauthorized, setUnauthorized] = useState<Boolean>(false);

    const login = async function (initOptions?: { walletProvider: WalletProvider; }) {
        setLoading(true);
        setErrored(false);
        setUnauthorized(false);
        try {
            const { identityToken, did } = await iam.current.initializeConnection(initOptions);

            if (did) {
                setDID(did);
            }
            if (identityToken) {
                const options: RequestInit = {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: identityToken,
                }
                await fetch(`${backendUrl}/login`, options)
            }

            const options: RequestInit = {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
            const res = await fetch(`${backendUrl}/roles`, options);
            const { data: roles } = await res.json() as { data: Role[] };
            switch (res.status) {
                case 200:
                    setRoles(roles);
                    break;
                case 401:
                    setUnauthorized(true);
                    break;
                default:
                    setErrored(true);
            }
        } catch (err) {
            console.error(err);
            setErrored(true);
        }
        setLoading(false);
    };

    const logout = async function () {
        setDID("");
        await iam.current.closeConnection();
    };

    const loadingMessage = (
        <div>
            <Spinner animation="border" />
            <span>Loading... (Please sign messages using your connected wallet)</span>
        </div>
    );

    const enrolmentButton = enrolmentUrl && (
        <a
            href={`${enrolmentUrl}&returnUrl=${encodeURIComponent(
                window.location.href
            )}`}
            className="button"
        >
            <span>Enrol to test role</span>
        </a>
    );

    const loginResults = (
        <div>
            <p>Hello user!</p>
            <p>
                Your decentralised identifier: <br />
                <strong>{did}</strong>
            </p>
            {roles && roles.length > 0 ? (
                <div className="rolesContainer">
                    <p>These are your validated roles:</p>
                    {roles.map(({ name, namespace }) => (
                        <p key={namespace}>
                            <strong>{`${name}`}</strong>
                            {` at ${namespace}`}
                        </p>
                    ))}
                </div>
            ) : (
                <div>
                    You do not have any issued role at the moment, please login into
                    switchboard and search for apps, orgs to enrol.
                </div>
            )}
            <div className="logoutContainer">
                {enrolmentButton}
                <Button onClick={logout} className="button">
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );

    const loginOptions = (
        <div className="login-button-container">
            <Button onClick={() => login({ walletProvider: WalletProvider.WalletConnect })}>
                <img
                    alt="walletconnect logo"
                    className="walletconnect"
                    src={walletconnectIcon}
                />
                <span>Login with Wallet Connect</span>
            </Button>
            <Button onClick={() => login({ walletProvider: WalletProvider.MetaMask })}>
                <img alt="metamask logo" className="metamask" src={metamaskLogo} />
                <span>Login with Metamask</span>
            </Button>
            <Button onClick={() => login({ walletProvider: WalletProvider.EwKeyManager })}>
                <img alt="metamask logo" className="metamask" src={KMLogo} />
                <span>Login with EW Key Manager</span>
            </Button>
        </div>
    );

    const errorMessage = (
        <div>
            <p>
                Error occurred with login.
                <br />
                If you rejected the signing requests, please try again and accept.
                <br />
                If this is your first time logging in, your account needs a small amount
                of Volta token to create a DID Document.
                <br />A Volta token can be obtained from the{" "}
                <a href="https://voltafaucet.energyweb.org/">Volta Faucet</a>.
            </p>
            {loginOptions}
        </div>
    );

    const unauthorizedMessage = (
        <div>
            <p>
                Unauthorized login response.
                <br />
                Please ensure that you have the necessary role claim.
            </p>
            <div className="enrolbuttonContainer">
                {enrolmentUrl && (
                    <p>Use enrolment button to request necessary role.</p>
                )}
                {enrolmentButton}
            </div>
            {loginOptions}
        </div>
    );

    const loginJsx = () => {
        if (loading) {
            return loadingMessage;
        }
        if (unauthorized) {
            return unauthorizedMessage;
        }
        if (errored) {
            return errorMessage;
        }
        if (did) {
            return loginResults;
        }
        return loginOptions;
    };

    return (
        <Card>
            <Card.Body>
                <Card.Title>IAM showcase</Card.Title>
                {loginJsx()}
            </Card.Body>
        </Card>
    );
}

export default Iam;