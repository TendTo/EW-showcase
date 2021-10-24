import React, { useContext, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import iam_process from "../../asset/img/iam-process.png";
import { AppContext } from "../../context/appContext";
import DIDLogin from "../DIDLogin/DIDLogin";
import IAMDetails from "../IAMDetails/IAMDetails";
import './IAM.css';

function IAM() {
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
                <h2>{t('IAM.TITLE')}</h2>
            </div>
            <h3>{t("IAM.SECTION_1_TITLE")}</h3>
            <p>{t('IAM.SECTION_1_TEXT')}</p>
            <h3>{t("IAM.SECTION_2_TITLE")}</h3>
            <Trans i18nKey="IAM.SECTION_2_TEXT" components={
                {
                    a: <a href="https://ipfs.io" target="_blank" rel="noreferrer">a</a>,
                    h5: <h5 className="mt-4">h5</h5>,
                    p: <p></p>,
                    fig: (
                        <div className="app-img-container">
                            <img src={iam_process} className="figure-img img-fluid rounded" alt="DID auth process" />
                            <figcaption className="figure-caption text-center">[5] {t("IAM.SECTION_2_IMG")}</figcaption>
                        </div>)
                }
            }></Trans>
            <br />
            <h3>{t("IAM.SECTION_3_TITLE")}</h3>
            <p>{t('IAM.SECTION_3_TEXT')}</p>
            <br />
            <DIDLogin setDID={setDID}></DIDLogin>
            <br />
            {iam.isConnected() && did ?
                <IAMDetails did={did} />
                :
                <div className="app-space" />
            }
        </div >
    );
}

export default IAM;