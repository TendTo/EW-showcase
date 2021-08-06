import React from 'react';
import { Button, Nav, Navbar } from 'react-bootstrap';
import './AppFooter.css';


function AppNav() {

    return (
        <div className="footer-container">© 2021 Copyright
            <a className="mr-3 ml-3" href="https://github.com/TendTo"> TendTo</a>
            <a href="https://github.com/TendTo/EW-showcase">
                <i className="fa fa-github"></i>
            </a>
        </div>
    );
}

export default AppNav;
