import React from 'react'
import Login from '../Login/Login'
import { useHistory } from "react-router-dom";

import './LoginSign.css'

export default function LoginSign(props) {
    let changeUser = props.changeUser;
    let setUrl = props.setUrl;
    let history = useHistory();

    function goToSignUp() {
        history.push("/SignUpClient");
        setUrl("/SignUpClient");
    }

    return (
        <div className="LoginSign">
            <Login changeUser={changeUser} setUrl={
                (url) => { setUrl(url); }} />
            <h5>?עדיין לא רשום</h5>
            <button onClick={() => { goToSignUp() }} className="btn1">הרשם</button>

        </div>
    )
}
