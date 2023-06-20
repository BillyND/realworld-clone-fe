import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Context';
import { updateInfoUser } from '../services/apiServices';
import { toast } from 'react-toastify';
import BackdropLoading from './BackDropLoading';

function SettingPage(props) {
    const [userLogin, setUserLogin, isLoading, setIsLoading] = useContext(Context)
    const infoUser = localStorage.getItem("userLogin")
    const [imageLink, setImageLink] = useState(userLogin?.user?.image || JSON.parse(infoUser)?.user?.image)
    const [username, setUsername] = useState(userLogin?.user?.username || userLogin?.user?.email || JSON.parse(infoUser)?.user?.username || JSON.parse(infoUser)?.user?.email || null)
    const [email, setEmail] = useState(userLogin?.user?.email || JSON.parse(infoUser)?.user?.email)
    const [password, setPassword] = useState(userLogin?.user?.password || JSON.parse(infoUser)?.user?.password)
    const [bio, setBio] = useState(userLogin?.user?.bio || JSON.parse(infoUser)?.user?.bio || "")
    const navigate = useNavigate()

    const handelLogout = () => {
        localStorage.removeItem("userLogin")
        setUserLogin({})
        navigate("/")
    }

    const handleUpdateInfo = async () => {
        setIsLoading(true)
        const dataUpdate = {
            "user": {
                "email": email?.trim(),
                "username": username?.trim(),
                "bio": bio?.trim() || null,
                "image": imageLink?.trim(),
                "password": password?.trim()
            }
        }
        const resUpdateInfo = await updateInfoUser(dataUpdate, JSON.parse(infoUser)?.user?.token)
        if (resUpdateInfo.status === 200) {
            localStorage.setItem("userLogin", JSON.stringify(resUpdateInfo.data));
            setUserLogin(resUpdateInfo.data)
            setIsLoading(false)
        }
    }


    return (
        <div className="settings-page">
            <div className="container page">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-xs-12">
                        <h1 className="text-xs-center">Your Settings</h1>

                        <form>
                            <fieldset>
                                <fieldset className="form-group">
                                    <input className="form-control" type="text"
                                        placeholder="URL of profile picture"
                                        value={imageLink}
                                        onChange={e => setImageLink(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <input className="form-control form-control-lg" type="text" placeholder="Your Name"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <textarea
                                        className="form-control form-control-lg"
                                        rows="8"
                                        placeholder="Short bio about you"
                                        value={bio || ""}
                                        onChange={e => setBio(e.target.value)}
                                    ></textarea>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input className="form-control form-control-lg" type="text" placeholder="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <input className="form-control form-control-lg" type="password" placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </fieldset>
                                <button className="btn btn-lg btn-primary pull-xs-right" type='button' onClick={handleUpdateInfo}>Update Settings</button>
                            </fieldset>
                        </form>
                        <hr />
                        <button className="btn btn-outline-danger" onClick={handelLogout}>Or click here to logout.</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingPage;