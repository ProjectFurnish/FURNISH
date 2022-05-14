import React, { useState } from 'react'
import Seller from '../Seller/Seller'
import Client from '../Client/Client'
import UserAccount from "../UserAccount/UserAccount";
import './PersonalArea.css'

export default function PersonalArea(props) {

    let userNow = props.userNow;
    let setUrl = props.setUrl;
    const [key, setKey] = useState("seller");


    return (
        <div>
            <div className="clearfix">
                {userNow.id !== "" &&
                    <div className="content">
                        <div className="tabs">
                            <button onClick={() => { setKey("account") }} className={key === "account" ? "active" : ""}>פרטי חשבון</button>
                            <button onClick={() => { setKey("seller") }} className={key === "seller" ? "active" : ""}>מוכר</button>
                            <button onClick={() => { setKey("client") }} className={key === "client" ? "active" : ""}>לקוח</button>
                        </div>

                        <div className="tabcontent">
                            {key === "seller" && <Seller userNow={userNow} setUrl={(url) => { setUrl(url); }} />}
                            {key === "client" && <Client userNow={userNow} setUrl={(url) => { setUrl(url); }} />}
                            {key === "account" &&
                                <UserAccount
                                    userNow={userNow}
                                    setUrl={(url) => { setUrl(url); }}
                                    changeUser={props.changeUser}
                                    root="personalArea"
                                />}
                        </div>
                    </div>}
                {userNow.id === "" &&
                    <div className="container1">
                        <h5>אינך מחובר</h5>
                    </div>
                }

            </div>

        </div>
    )
}
