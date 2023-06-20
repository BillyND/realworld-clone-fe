import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../Context';

function Header(props) {
    const [userLogin, setUserLogin, isLoading, setIsLoading] = useContext(Context)

    return (
        <div className='header-container'>
            <nav className="navbar navbar-light">
                <div className="container">
                    <NavLink className="navbar-brand" to="/">conduit</NavLink>
                    <ul className="nav navbar-nav pull-xs-right">

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        {userLogin?.user?.token ?
                            <>

                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/editor"> <i className="ion-compose"></i>&nbsp;New Article </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/settings" > <i className="ion-gear-a"></i>&nbsp;Settings </NavLink>
                                </li>
                                <li className="nav-item header-user-login">
                                    <img src={userLogin?.user?.image} />
                                    <NavLink className="nav-link " to={`/profile/${userLogin?.user?.username || userLogin?.user.email.split("@")[0]}`}>{userLogin?.user?.username || userLogin?.user?.email}</NavLink>
                                </li>
                            </>
                            :
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="./login">Sign in</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">Sign up</NavLink>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Header;