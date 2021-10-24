import { IServiceEndpoint } from "@ew-did-registry/did-resolver-interface";
import { AssetProfiles, ClaimData } from "iam-client-lib";
import React, { Fragment, ReactElement, useContext, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import empty_set from "../../asset/icon/empty-set.svg";
import solar_logo from "../../asset/icon/solar-logo.svg";
import { AppContext } from "../../context/appContext";
import DIDEdit from "../DIDEdit/DIDEdit";

type Props = {
    did: string
};


function DIDDetails({ did }: Props) {
    const { iam } = useContext(AppContext).state;
    const [loading, setLoading] = useState(false);
    const [profileClaim, setProfileClaims] = useState<(IServiceEndpoint & ClaimData)>();
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
                setProfileClaims(claims.find(c => c.profile));
            } catch (e) {
                console.error(e);
                setProfileClaims(undefined);
            }
            setLoading(false);
        }
        if (did)
            setup();
    }, [iam, did]);

    const assetsComponent = (assetProfiles: AssetProfiles) => {
        const assets: ReactElement[] = [];
        for (const asset in assetProfiles) {
            assets.push(
                <div key={asset} className="app-table mt-3">
                    <div className="app-row">
                        <div>
                            <img alt="asset" src={assetProfiles[asset].icon || solar_logo} className="app-logo" />
                        </div>
                    </div>
                    {assetProfiles[asset].name &&
                        <div className="app-row">
                            <div className="text-muted">{t('DID.DID_NAME')}</div>
                            <div>{assetProfiles[asset].name}</div>
                        </div>
                    }
                    <div className="app-row">
                        <div className="text-muted">{t('DID.ASSET_DID')}</div>
                        <div>{asset}</div>
                    </div>
                </div>
            );
        }
        return assets;
    }

    const claimsComponent = () => {
        if (profileClaim === undefined)
            return null;
        return (<Fragment key={profileClaim.id}>
            {profileClaim.profile &&
                <>
                    {profileClaim.profile?.name &&
                        <div className="app-row">
                            <div className="text-muted">{t("DID.DID_NAME")}</div>
                            <div>{profileClaim.profile?.name}</div>
                        </div>
                    }
                    {profileClaim.profile?.address &&
                        <div className="app-row">
                            <div className="text-muted">{t('DID.DID_ADDRESS')}</div>
                            <div>{profileClaim.profile?.address}</div>
                        </div>
                    }
                    {profileClaim.profile?.birthdate && profileClaim.profile?.birthdate !== "NaN" &&
                        <div className="app-row">
                            <div className="text-muted">{t('DID.DID_BIRTHDATE')}</div>
                            <div>{toUTCTimestamp(profileClaim.profile?.birthdate)}</div>
                        </div>
                    }
                    {profileClaim.profile?.assetProfiles &&
                        <div className="app-row">
                            <details>
                                <summary>{Object.keys(profileClaim.profile?.assetProfiles).length + " assets"}</summary>
                                {assetsComponent(profileClaim.profile?.assetProfiles)}
                            </details>
                        </div>}
                </>}
        </Fragment>
        );
    }

    return (
        <>
            {loading ?
                <div className="text-center mt-2"><Spinner animation="border" /></div>
                :
                <Container fluid>
                    <div className="app-table">
                        <div className="app-row">
                            <div className="d-flex align-items-baseline justify-content-between">
                                <div className="text-muted">{t('DID.USER_DID')}</div>
                                <DIDEdit did={did} profile={profileClaim?.profile} setProfileClaims={setProfileClaims} />
                            </div>
                            <div>{did}</div>
                        </div>
                        {profileClaim !== undefined ?
                            claimsComponent()
                            :
                            <div className="d-flex justify-content-center align-items-center mt-2">
                                <img alt="empty" className="app-empty-icon" src={empty_set} /><div>{t('DID.NO_CLAIMS')}</div>
                            </div>
                        }
                    </div>
                </Container >
            }
        </>
    );
}

export default DIDDetails;