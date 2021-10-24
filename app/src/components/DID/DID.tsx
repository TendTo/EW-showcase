import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import did_schema from '../../asset/img/did-schema.svg';
import did_auth from '../../asset/img/did-auth.svg';
import did_architecture from '../../asset/img/did-architecture.svg';
import { AppContext } from "../../context/appContext";
import DIDDetails from "../DIDDetails/DIDDetails";
import DIDLogin from "../DIDLogin/DIDLogin";

function DID() {
    const { iam } = useContext(AppContext).state;
    const [did, setDID] = useState<string>("");
    const { t } = useTranslation();

    useEffect(() => {
        const showIam = async () => {
            iam.on('accountChanged', async () => { await iam.closeConnection(); setDID(""); });
            iam.on('networkChanged', async () => { await iam.closeConnection(); setDID(""); });
        }
        if (iam.isConnected() && did)
            showIam();
        else if (iam.isConnected())
            setDID(iam.getDid() || "");
        else if (!iam.isConnected())
            setDID("");
    }, [iam, did]);

    return (
        <div className="app-page">
            <div className="app-page-header mb-3">
                <h2>{t('DID.TITLE')}</h2>
            </div>
            <h3>{t("DID.SECTION_1_TITLE")}</h3>
            <p>{t('DID.SECTION_1_TEXT')}</p>
            <div className="app-img-container">
                <div>
                    <img src={did_schema} className="figure-img img-fluid rounded" alt="DID schema" />
                </div>
                <figcaption className="figure-caption text-center">[2] {t("DID.SECTION_1_IMG")}</figcaption>
            </div>
            <h3>{t("DID.SECTION_2_TITLE")}</h3>
            <p>{t('DID.SECTION_2_TEXT')}</p>
            <div className="app-img-container">
                <div>
                    <img src={did_architecture} className="figure-img img-fluid rounded" alt="DID architecture" />
                </div>
                <figcaption className="figure-caption text-center">[3] {t("DID.SECTION_2_IMG")}</figcaption>
            </div>
            <h3>{t("DID.SECTION_3_TITLE")}</h3>
            <p>{t('DID.SECTION_3_TEXT')}</p>
            <div className="app-img-container">
                <div>
                    <img src={did_auth} className="figure-img img-fluid rounded" alt="DID auth process" />
                </div>
                <figcaption className="figure-caption text-center">[4] {t("DID.SECTION_3_IMG")}</figcaption>
            </div>
            <h3>{t("DID.SECTION_4_TITLE")}</h3>
            <p>{t('DID.SECTION_4_TEXT')}</p>
            <br />
            <DIDLogin setDID={setDID}></DIDLogin>
            <br />
            {iam.isConnected() && did ?
                <DIDDetails did={did}></DIDDetails>
                :
                <div className="app-space" />
            }
        </div >
    );
}

export default DID;