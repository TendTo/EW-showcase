import { IServiceEndpoint } from "@ew-did-registry/did-resolver-interface";
import { Asset, AssetProfiles, ClaimData } from "iam-client-lib";
import React, { Fragment, ReactElement, useContext, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import IAMContext from "../../context/IAMContext";
import empty_set from "../../asset/icon/empty-set.svg";
import solar_logo from "../../asset/icon/solar-logo.svg";
import "./DIDDetails.css";

type Props = {
    did: string
};


function DIDdetails({ did }: Props) {
    const iam = useContext(IAMContext);
    const [loading, setLoading] = useState(false);
    const [claims, setClaims] = useState<(IServiceEndpoint & ClaimData)[]>([]);
    const [assets, setAssets] = useState<(Asset)[]>([]);
    const { t } = useTranslation();

    const toUTCTimestamp = (timeStamp: number | string | undefined) => {
        if (timeStamp === undefined) {
            return "";
        }
        const d = new Date(Number(timeStamp));
        return d.toUTCString().slice(0, -13);
    };

    useEffect(() => {
        const setup = async () => {
            setLoading(true);
            try {
                const claims = await iam.getUserClaims({ did });
                setClaims(claims);
            } catch (e) {
                console.error(e);
                setClaims([]);
            }
            setLoading(false);
        }
        if (did)
            setup();
    }, [did]);

    const assetsComponent = (assetProfiles: AssetProfiles) => {
        const assets: ReactElement[] = [];
        for (const asset in assetProfiles) {
            assets.push(
                <div key={asset} className="diddetails-table mt-3">
                    <div className="diddetails-row">
                        <div>
                            <img src={assetProfiles[asset].icon || solar_logo} className="diddetails-logo" />
                        </div>
                    </div>
                    <div className="diddetails-row">
                        <div className="text-muted">Name</div>
                        <div>{assetProfiles[asset].name}</div>
                    </div>
                    <div className="diddetails-row">
                        <div className="text-muted">Asset DID</div>
                        <div className="text-truncate">{asset}</div>
                    </div>
                </div>
            );
        }
        return assets;
    }

    const claimsComponent = claims.map((claim) => {
        return (
            <Fragment key={claim.id}>
                {claim.profile &&
                    <>
                        <div className="diddetails-row">
                            <div className="text-muted">Name</div>
                            <div>{claim.profile?.name}</div>
                        </div>
                        <div className="diddetails-row">
                            <div className="text-muted">Address</div>
                            <div>{claim.profile?.address}</div>
                        </div>
                        <div className="diddetails-row">
                            <div className="text-muted">Birthdate</div>
                            <div>{toUTCTimestamp(claim.profile?.birthdate)}</div>
                        </div>
                        {
                            claim.profile?.assetProfiles &&
                            <div className="diddetails-row">
                                <details>
                                    <summary>{Object.keys(claim.profile?.assetProfiles).length + " assets"}</summary>
                                    {assetsComponent(claim.profile?.assetProfiles)}
                                </details>
                            </div>
                        }
                    </>
                }
            </Fragment>
        );
    })

    return (
        <>
            {loading ?
                <div className="text-center mt-2"><Spinner animation="border" /></div>
                :
                <Container fluid>
                    <div className="diddetails-table">
                        <div className="diddetails-row">
                            <div className="text-muted">User DID</div>
                            <div>{did}</div>
                        </div>
                        {claims.length > 0 ?
                            claimsComponent
                            :
                            <div className="d-flex justify-content-center align-items-center mt-2">
                                <img className="diddetails-empty-icon" src={empty_set} /><div>No claims</div>
                            </div>
                        }
                    </div>
                </Container >
            }
        </>
    );
}

export default DIDdetails;