import React from 'react';
import { useTranslation } from 'react-i18next';

function References() {
    const { t } = useTranslation();

    return (
        <div className="app-page">
            <div className="app-page-header mb-3">
                <h2>{t('REFERENCES.TITLE')}</h2>
            </div>
            <h3>{t("REFERENCES.SECTION_1_TITLE")}</h3>
            <ul>
                <li><a href="https://www.energyweb.org" target="_blank" rel="noreferrer">{t("REFERENCES.SECTION_1_ITEM_1")}</a></li>
                <li><a href="https://energyweb.atlassian.net/wiki/home" target="_blank" rel="noreferrer">{t("REFERENCES.SECTION_1_ITEM_2")}</a></li>
                <li><a href="https://energyweb.org/reports/the-energy-web-chain" target="_blank" rel="noreferrer">{t("REFERENCES.SECTION_1_ITEM_3")}</a></li>
                <li><a href="https://medium.com/energy-web-insights" target="_blank" rel="noreferrer">{t("REFERENCES.SECTION_1_ITEM_4")}</a></li>
                <li><a href="https://www.w3.org/TR/did-core" target="_blank" rel="noreferrer">{t("REFERENCES.SECTION_1_ITEM_5")}</a></li>
            </ul>
            <h3>{t('REFERENCES.SECTION_2_TITLE')}</h3>
            <ul>
                <li><a href="https://energyweb.org/wp-content/uploads/2019/12/EnergyWeb-EWDOS-PART1-VisionPurpose-202006-vFinal.pdf" target="_blank" rel="noreferrer">[1] {t("REFERENCES.SECTION_2_ITEM_1")}</a></li>
                <li><a href="https://www.w3.org/TR/did-core/#a-simple-example" target="_blank" rel="noreferrer">[2] {t("REFERENCES.SECTION_2_ITEM_2")}</a></li>
                <li><a href="https://www.w3.org/TR/did-core/#architecture-overview" target="_blank" rel="noreferrer">[3] {t("REFERENCES.SECTION_2_ITEM_3")}</a></li>
                <li><a href="https://www.w3.org/TR/did-use-cases/#use" target="_blank" rel="noreferrer">[4] {t("REFERENCES.SECTION_2_ITEM_4")}</a></li>
                <li><a href="https://medium.com/energy-web-insights/digging-deeper-into-self-sovereign-identity-and-access-management-e6eefbac631e" target="_blank" rel="noreferrer">[5] {t("REFERENCES.SECTION_2_ITEM_5")}</a></li>
            </ul>
            <h3>{t('REFERENCES.SECTION_3_TITLE')}</h3>
            <ul>
                <li><a href="https://switchboard.energyweb.org" target="_blank" rel="noreferrer">{t("REFERENCES.SECTION_3_ITEM_1")}</a></li>
                <li><a href="https://ens.energyweb.org/" target="_blank" rel="noreferrer">{t("REFERENCES.SECTION_3_ITEM_2")}</a></li>
            </ul>
            <h3>{t('REFERENCES.SECTION_4_TITLE')}</h3>
            <ul>
                <li><a href="https://github.com/TendTo/EW-showcase/blob/master/docs/Tesi.pdf" target="_blank" rel="noreferrer">{t("REFERENCES.SECTION_4_ITEM_1")}</a></li>
            </ul>
        </div>
    );
}

export default References;
