import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { postLogin, postRegister } from "../services/apiServices";
import { toast } from 'react-toastify';
import { Context } from '../Context';
import BackdropLoading from './BackDropLoading';

function AuthPage(props) {
    const [userLogin, setUserLogin, isLoading, setIsLoading] = useContext(Context)
    const [isLogin, setIsLogin] = useState(null)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const navigate = useNavigate()
    useEffect(() => {
        setIsLoading(false)
        if (window.location.href.includes("login")) {
            document.title = "Sign in ── Conduit"
            setIsLogin(true)
        } else {
            document.title = "Sign up ── Conduit"
            setIsLogin(false)
        }
    }, [window.location.href])

    function validateEmail(email) {
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return email.match(regexEmail)
    }

    const handleLogin = async () => {

        try {
            // setIsLoading(true)
            //validate
            if (!email.trim() || !validateEmail(email)) {
                toast.error("Email is invalid!")
                return
            } else if (!password.trim()) {
                toast.error("Password is invalid!")
                return
            }

            const infoUser = {
                "user": {
                    "email": email,
                    "password": password
                }
            }

            let timer
            timer = setTimeout(() => {
                toast.error("Email or password is invalid!")
                setIsLoading(false)
            }, 2000)
            setIsLoading(true)
            const resLogin = await postLogin(infoUser)
            clearTimeout(timer)
            if (resLogin.data?.user?.token) {
                localStorage.setItem("userLogin", JSON.stringify(resLogin.data));
                setUserLogin(resLogin.data)
                navigate("/")
            }

        } catch (error) {
            throw new Error(error)
        }
        setIsLoading(false)
    }


    const handleRegister = async () => {

        let dataRegister = {
            user: {
                username: username.trim(),
                email: email.trim(),
                password: password.trim()
            }
        }

        try {

            //validate
            if (!username.trim()) {
                toast.error("Username is invalid!")
                return
            }

            if (!email.trim() || !validateEmail(email)) {
                toast.error("Email is invalid!")
                return
            }
            if (!password.trim()) {
                toast.error("Password is invalid!")
                return
            }
            setIsLoading(true)
            const resRegister = await postRegister(dataRegister)
            localStorage.setItem("userLogin", JSON.stringify(resRegister.data));
            setUserLogin(resRegister.data)
            setIsLoading(false)
            navigate("/")
        } catch (error) {
            toast.error("Username or email has already been taken!")
            setIsLoading(false)
        }
    }

    const handleKeyUp = (e) => {
        if (e.key === "Enter") {
            isLogin ? handleLogin() : handleRegister()
        }
    }


    return (
        <div className="auth-page">
            <div className="container page">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-xs-12">
                        {
                            isLogin ?
                                <h1 className="text-xs-center">Sign in</h1>
                                :
                                <h1 className="text-xs-center">Sign up</h1>
                        }
                        <p className="text-xs-center">
                            {
                                isLogin ?
                                    <NavLink to="/register">Need an account?</NavLink>
                                    :
                                    <NavLink to="/login">Have an account?</NavLink>
                            }
                        </p>

                        <div>
                            {
                                !isLogin && <fieldset className="form-group">
                                    <input className="form-control form-control-lg" type="text" placeholder="Your Name"
                                        disabled={isLoading}
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        onKeyUp={e => handleKeyUp(e)}
                                    />
                                </fieldset>
                            }
                            <fieldset className="form-group">
                                <input className="form-control form-control-lg" type="email" placeholder="Email" required
                                    disabled={isLoading}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onKeyUp={e => handleKeyUp(e)}
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <input className="form-control form-control-lg" type="password" placeholder="Password"
                                    disabled={isLoading}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyUp={e => handleKeyUp(e)}
                                />
                            </fieldset>
                            {
                                isLogin ?
                                    <button className="btn btn-lg btn-primary pull-xs-right" type='button'
                                        onClick={handleLogin}
                                        disabled={isLoading}
                                    >Sign in</button>
                                    :
                                    <button className="btn btn-lg btn-primary pull-xs-right"
                                        onClick={handleRegister}
                                        disabled={isLoading}
                                    >Sign up</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AuthPage;