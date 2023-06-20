import React from 'react';
import { NavLink } from 'react-router-dom';

function Footer(props) {
    return (
        <div className='footer-container'>
            <footer>
                <div className="container">
                    <NavLink to="/" className="logo-font">conduit</NavLink>
                    <span className="attribution">
                        An interactive learning project from <a href="https://thinkster.io" target="_blank">Thinkster</a>. Code &amp;
                        design licensed under MIT.
                    </span>
                </div>
            </footer>
        </div>
    );
}

export default Footer;