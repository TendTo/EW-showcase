import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ew_dos from '../../asset/img/ew-dos.png';

function Home() {
    const { t } = useTranslation();

    return (
        <div className="app-page">
            <div className="app-page-header">
                <h2>{t('HOME.TITLE')}</h2>
            </div>
            <h3>{t("HOME.SECTION_1_TITLE")}</h3>
            <p>{t('HOME.SECTION_1_TEXT')}</p>
            <figure className="figure">
                <img src={ew_dos} className="figure-img img-fluid rounded" alt="EW-Dos" />
                <figcaption className="figure-caption text-center">Energy Web Dos schema</figcaption>
            </figure>
        </div>
    );
}

export default Home;
