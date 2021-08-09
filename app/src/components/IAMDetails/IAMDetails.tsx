import { IServiceEndpoint } from "@ew-did-registry/did-resolver-interface";
import { AssetProfiles, ClaimData } from "iam-client-lib";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import IAMContext from "../../context/IAMContext";
import empty_set from "../../asset/icon/empty-set.svg";
import "./IAMDetails.css";

type Props = {
    did: string
};


function IamDetails({ did }: Props) {
    const iam = useContext(IAMContext);
    const [loading, setLoading] = useState(false);
    const [claims, setClaims] = useState<(IServiceEndpoint & ClaimData)[]>([]);
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
                console.table(claims);
            } catch (e) {
                console.error(e);
                setClaims([]);
            }
            setLoading(false);
        }
        if (did)
            setup();
    }, []);

    const assetsComponent = (assetProfiles: AssetProfiles) => {
        const assets: ReactElement[] = [];
        for (const asset in assetProfiles) {
            assets.push(
                <div key={asset}>
                    <img className="iamdetails-asset-img" src={assetProfiles[asset].icon} />
                    <div>Asset Name: {assetProfiles[asset].name}</div>
                    <div>Asset id: {asset}</div>
                </div>
            );
        }
        return assets;
    }

    const claimsComponent = claims.map((claim) => {
        return (
            <>
                {claim.profile &&
                    <div key={claim.id}>
                        <div>Name: {claim.profile?.name}</div>
                        <div>Address: {claim.profile?.address}</div>
                        <div>Birthdate: {toUTCTimestamp(claim.profile?.birthdate)}</div>
                        {
                            claim.profile?.assetProfiles &&
                            <details>
                                <summary>{Object.keys(claim.profile?.assetProfiles).length + " assets"}</summary>
                                {assetsComponent(claim.profile?.assetProfiles)}
                            </details>
                        }
                    </div>
                }
            </>
        );
    })

    return (
        <Card className="border-primary">
            {loading ?
                <div className="text-center mt-2"><Spinner animation="border" /></div>
                :
                <Card.Body>
                    <Card.Title className="text-center">
                        {did}
                    </Card.Title>
                    <hr />
                    {claims.length > 0 ?
                        claimsComponent
                        :
                        <div className="d-flex justify-content-center align-items-center mt-2">
                            <img className="iamdetails-empty-icon" src={empty_set} /><div>No claims</div>
                        </div>
                    }
                </Card.Body>
            }
        </Card>
    );
}

export default IamDetails;