import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import './UserAccount.css'

export default function UserAccount(props) {
   
    let user = props.userNow;
    let changeUser = props.changeUser;
    let closePopover = props.closePopover;
    let setUrl = props.setUrl;

    const [root, setRoot] = useState(props.root);
    let history = useHistory();
    
    useEffect(() => {
        setRoot(props.root);
    }, [props.root])


    function signOut() {
        if (closePopover !== undefined) closePopover();
        changeUser({
            id: "",
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            city: "",
            password: "",
            bankNumber: "",
            bankAccount: "",
            branchNumber: "",
            address: "",
            buildingNumber: "",
            homeNumber: ""
        });
    }



    function goToPersonalArea() {
        if (closePopover !== undefined) closePopover();
        history.push("/PersonalArea");
        setUrl("/PersonalArea");
    }

    function goToUpdate() {
        history.push('/UpdateUser');
        setUrl("/UpdateUser");
    }

    return (
        <div className={root === "header" ? "userAccount" : "userAccountPers"}>
            {user.id === "" &&
                <div className="container1">
                    <h5>אינך מחובר</h5>
                </div>
            }
            { user.id !== "" &&
                <div>
                    <div className={root === "header" ? "containerU" : "containerUPers"}>
                        {root === "personalArea" && <h3>פרטי משתמש</h3>}
                        <p><b>שם </b>{user.firstName} {user.lastName}</p>
                        <p><b>עיר </b>{user.city}</p>
                        <p><b>פלאפון </b>{user.phone}</p>
                        <p><b> מייל</b> {user.email}</p>
                    </div>
                    <div className="buttons-all">
                        <div className={root === "header" ? "button" : "buttonPers"}>
                            <button onClick={() => { signOut(); }} >יציאה מהחשבון</button>
                        </div>
                        {root === "header" && <div className="button">
                            <button onClick={() => { goToPersonalArea(); }}>לאיזור האישי</button>
                        </div>}

                        {root === "personalArea" && <div className="buttonPers">
                            <button onClick={() => { goToUpdate(); }}>עדכן פרטי משתמש</button>
                        </div>}
                    </div>
                </div>
            }
        </div>
    )

}