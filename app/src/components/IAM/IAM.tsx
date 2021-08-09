import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import IAMContext from "../../context/IAMContext";
import IamDetails from "../IAMDetails/IAMDetails";
import IamLogin from "../IAMLogin/IAMLogin";
import "./IAM.css";

type Props = {
    account: string
}

function Iam({ account }: Props) {
    const iam = useContext(IAMContext);
    const [did, setDID] = useState<string>("");
    const { t } = useTranslation();

    const logout = async function () {
        await iam.closeConnection();
        setDID("");
    };

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
                <h2>{t('IAM.TITLE')}</h2>
            </div>
            <h3>{t("IAM.SECTION_1_TITLE")}</h3>
            <p>{t('IAM.SECTION_1_TEXT')}</p>
            <h3>{t("IAM.SECTION_2_TITLE")}</h3>
            <p>{t('IAM.SECTION_2_TEXT')}</p>
            <br />
            <IamLogin setDID={setDID}></IamLogin>
            <br />
            {iam.isConnected() && did &&
                <IamDetails did={did}></IamDetails>
            }
        </div >
    );
}

export default Iam;