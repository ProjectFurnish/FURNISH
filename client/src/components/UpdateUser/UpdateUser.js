import React from 'react'
import SignUpClient from '../SignUp/SignUpClient'
import SignAccount from '../SignAccount/SignAccount'

export default function UpdateUser(props) {

    let userNow = props.userNow;
    let changeUser = props.changeUser;
    let setUrl = props.setUrl;

    return (
        <div>
            {userNow.id !== "" && <div>
                <div>
                    <SignUpClient changeUser={changeUser} userNow={userNow} setUrl={setUrl} mode="update" />
                </div>
                <div>
                    <SignAccount userNow={userNow} setUrl={setUrl} mode="update" />
                </div>
            </div>}
            {userNow.id === "" &&
                <div className="container1">
                    <h5>אינך מחובר</h5>
                </div>
            }
        </div>
    )
}
