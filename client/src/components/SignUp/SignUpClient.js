import React, { useState, useEffect } from 'react'

import { validId, validMail, validName, validPasswords, validPhone } from '../InputForm/Validation.js'
import { useHistory } from "react-router-dom";
import { saveData } from '../Shared/UsesFunction'
import InputForm from '../InputForm/InputForm'
import Message from '../Message/Message'
import './SignUpClient.css'

function SignUpClient(props) {
    let changeUser = props.changeUser;
    let mode = props.mode || "";
    let userNow = props.userNow || "";
    let setUrl = props.setUrl;

    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [sumbit, setSumbit] = useState(false);

    const numInputs = 8;
    let numSuccess = 0;
    let history = useHistory();
    let clientData = {
        id: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        city: "",
        password: ""
    };

    useEffect(async () => {
        if (sumbit === true) {
            //returns the sumbit to false for allow pressing the button again
            setSumbit(false);
            //if all the inputs return ok- no errors
            if (numSuccess === numInputs && mode === "") {
                addUser();
            }
            else if (numSuccess === numInputs && mode === "update") {
                updateUser();
            }
        }

    }, [sumbit])


    const handelSubmit = (event) => {

        event.preventDefault();
        setSumbit(true);
    }


    function wasSuccessAdd() {
        numSuccess++;
    }


    //add user to the db
    async function addUser() {
        let response = await fetch('http://localhost:27017/users/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientData),
        });
        
        let response2 = await response.text();
        if (response2 === "OK") {
            changeUser(clientData);
            history.push("/");
            setUrl("/");
        }
        else if (response2 == "?????????? ????????") {
            setMessage("?????????? ???????? ????????????, ???????? ????????????");
            setShowAlert(true);
        }
        else{
            setMessage(response2);
            setShowAlert(true);
        }
    }

    //update the user details in the db
    async function updateUser() {
        clientData.id = userNow.id;
        clientData.bankNumber = userNow.bankNumber;
        clientData.bankAccount = userNow.bankAccount;
        clientData.branchNumber = userNow.branchNumber;
        if (clientData.firstName === "") clientData.firstName = userNow.firstName;
        if (clientData.lastName === "") clientData.lastName = userNow.lastName;
        if (clientData.phone === "") clientData.phone = userNow.phone;
        if (clientData.city === "") clientData.city = userNow.city;
        if (clientData.password === "") clientData.password = userNow.password;
        
        let response = await fetch('http://localhost:27017/users/updateUser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientData)
        });
       
        let response2 = await response.text();
        if (response2 === "OK") {
            changeUser(clientData);
            setMessage("?????????? ????????????");
            setShowAlert(true);
        }
        else{
            setMessage("???????? ??????????: "+response2);
            setShowAlert(true);
        }
    }



    return (
        <div className="SignUpClient">

            <form onSubmit={handelSubmit} className="container1">
                <h2 className="header"><b> ???????? ?????????? </b></h2>
                <InputForm
                    nameComp="???? ????????"
                    value={userNow.firstName}
                    type={"text"}
                    validationFunction={(data) => {
                        let message = validName(data);
                        if (message === "") saveData(clientData, "firstName", data);
                        return message
                    }
                    }
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />
                <InputForm
                    nameComp="???? ??????????"
                    type={"text"}
                    value={userNow.lastName}
                    validationFunction={(data) => {
                        let message = validName(data);
                        if (message === "") saveData(clientData, "lastName", data);
                        return message
                    }
                    }
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />
                <InputForm
                    nameComp="?????????? ????????"
                    type={"text"}
                    value={userNow.id}
                    validationFunction={(data) => {
                        let message = validId(data);
                        if (message === "") saveData(clientData, "id", data);
                        return message
                    }
                    }
                    disabled={mode === "update" ? true : false}
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />
                <InputForm
                    nameComp="????????????"
                    type={"text"}
                    value={userNow.phone}
                    validationFunction={(data) => {
                        let message = validPhone(data);
                        if (message === "") saveData(clientData, "phone", data);
                        return message
                    }
                    }
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />
                <InputForm
                    nameComp="?????????? ????????????"
                    type={"text"}
                    value={userNow.email}
                    validationFunction={(data) => {
                        let message = validMail(data);
                        if (message === "") saveData(clientData, "email", data);
                        return message
                    }
                    }
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />
                <InputForm
                    nameComp="??????"
                    type={"text"}
                    value={userNow.city}
                    validationFunction={(data) => {
                        let message = validName(data);
                        if (message === "") saveData(clientData, "city", data);
                        return message
                    }
                    }
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />
                <InputForm
                    nameComp="??????????"
                    type={"password"}
                    value={userNow.password}
                    validationFunction={(data) => { return validPasswords(data, "Password"); }}
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />
                <InputForm
                    nameComp="?????? ??????????"
                    type={"password"}
                    validationFunction={(data) => {
                        let message = validPasswords(data, "Verify Password");
                        if (message === "") saveData(clientData, "password", data);
                        return message
                    }
                    }
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />

                <button type="submit" className="btn1">{mode === "" ? "????????" : "????????"}</button>
            </form>

            {
                showAlert && <Message
                    showAlert={showAlert}
                    message={message}
                    onClose={() => {
                        setShowAlert(false);
                        if (mode === "") {
                            history.push("/LoginSign");
                            setUrl("/LoginSign");
                        }
                    }
                    }
                    type={mode === "" ? "" : "success"}
                />
            }
        </div>

    );

}
export default SignUpClient
