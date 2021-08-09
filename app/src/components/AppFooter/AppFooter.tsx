import React from 'react';
import { useTranslation } from 'react-i18next';
import ew_logo from '../../asset/img/ew-logo-small.png';
import './AppFooter.css';


function AppFooter() {
    const { t } = useTranslation();

    return (
        <div className="footer-container">
            <a href="https://www.energyweb.org"><img src={ew_logo} alt="EW logo" /></a>
            <div className="text-center">{t("FOOTER.LEGAL")}</div>
            <div>©2021</div>
            <div className="d-flex align-items-center">
                <a className="mr-2" href="https://github.com/TendTo">TendTo</a>
                <a href="https://github.com/TendTo/EW-showcase">
                    <i className="fa fa-2x fa-github"></i>
                </a>
            </div>
        </div>
    );
}

export default AppFooter;
