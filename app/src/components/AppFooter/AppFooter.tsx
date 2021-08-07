import React from 'react';
import ew_logo from '../../asset/img/ew-logo-small.png';
import './AppFooter.css';


function AppFooter() {

    return (
        <div className="footer-container">
            <a href="https://www.energyweb.org"><img src={ew_logo} alt="EW logo" /></a>
            <div>All names, logos, images, and brands are property of their respective owners.</div>
            <div >© 2021</div>
            <div>
                <a href="https://github.com/TendTo">TendTo</a>
                <a href="https://github.com/TendTo/EW-showcase">
                    <i className="fa fa-lg fa-github"></i>
                </a>
            </div>
        </div>
    );
}

export default AppFooter;
