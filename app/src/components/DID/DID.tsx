import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import IAMContext from "../../context/IAMContext";
import DIDDetails from "../DIDDetails/DIDDetails";
import DIDLogin from "../DIDLogin/DIDLogin";
import "./DID.css";

type Props = {
    account: string
}

function DID({ account }: Props) {
    const iam = useContext(IAMContext);
    const [did, setDID] = useState<string>("");
    const { t } = useTranslation();

    useEffect(() => {
        const showIam = async () => {
            iam.on('accountChanged', async () => { await iam.closeConnection(); setDID(""); });
            iam.on('networkChanged', async () => { await iam.closeConnection(); setDID(""); });

            const claims = await iam.getUserClaims({ did });
            console.log(claims);
        }
        if (iam.isConnected() && did) {
            showIam();
        }
    }, [iam, did]);

    return (
        <div className="app-page">
            <div className="app-page-header mb-3">
                <h2>{t('DID.TITLE')}</h2>
            </div>
            <h3>{t("DID.SECTION_1_TITLE")}</h3>
            <p>{t('DID.SECTION_1_TEXT')}</p>
            <h3>{t("DID.SECTION_2_TITLE")}</h3>
            <p>{t('DID.SECTION_2_TEXT')}</p>
            <br />
            <DIDLogin setDID={setDID}></DIDLogin>
            <br />
            {iam.isConnected() && did &&
                <DIDDetails did={did}></DIDDetails>
            }
        </div >
    );
}

export default DID;