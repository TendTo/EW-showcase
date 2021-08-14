import { useTranslation } from 'react-i18next';
import ew_dos from '../../asset/img/ew-dos.png';

function Home() {
    const { t } = useTranslation();

    return (
        <div className="app-page">
            <div className="app-page-header mb-3">
                <h2>{t('HOME.TITLE')}</h2>
            </div>
            <h3>{t("HOME.SECTION_1_TITLE")}</h3>
            <p>{t('HOME.SECTION_1_TEXT')}</p>
            <h3>{t("HOME.SECTION_2_TITLE")}</h3>
            <p>{t('HOME.SECTION_2_TEXT')}</p>
            <ul>
                <li>{t("HOME.SECTION_2_ITEM_1")}</li>
                <li>{t("HOME.SECTION_2_ITEM_2")}</li>
                <li>{t("HOME.SECTION_2_ITEM_3")}</li>
            </ul>
            <figure className="figure">
                <img src={ew_dos} className="figure-img img-fluid rounded" alt="EW-Dos" />
                <figcaption className="figure-caption text-center">[1] {t("HOME.SECTION_2_IMG")}</figcaption>
            </figure>
            <h3>{t('HOME.SECTION_3_TITLE')}</h3>
            <p>{t('HOME.SECTION_3_TEXT')}</p>
            <h3>{t('HOME.SECTION_4_TITLE')}</h3>
            <p>{t('HOME.SECTION_4_TEXT')}</p>
            <ul>
                <li>{t("HOME.SECTION_4_ITEM_1")}</li>
                <li>{t("HOME.SECTION_4_ITEM_2")}</li>
                <li>{t("HOME.SECTION_4_ITEM_3")}</li>
                <li>{t("HOME.SECTION_4_ITEM_4")}</li>
            </ul>
            <h3>{t('HOME.SECTION_5_TITLE')}</h3>
            <p>{t('HOME.SECTION_5_TEXT')}</p>
        </div>
    );
}

export default Home;
