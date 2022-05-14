import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useHistory } from "react-router-dom";
import { validUserPassword, validUserId, validId } from '../InputForm/Validation.js'

import InputForm from '../InputForm/InputForm'

import './Login.css'

function Login(props) {

    let changeUser = props.changeUser;
    let setUrl = props.setUrl;

    const [showModal, setShowModal] = useState(false);
    const [sumbit, setSumbit] = useState(false);
    const [sumbitModal, setSumbitModal] = useState(false);
    const [validUser, setValidUser] = useState("");
    let history = useHistory();
    //varieble to store and validate the data of login
    const numInputs = 2;
    let numSuccess = 0;
    let dataIdPassword = ["", ""];

    //variable to store and validate the data of password recover
    let idRecover = "";
    let successModal = false;
    const [existUser, setExistUser] = useState(true);
    const [emailSend, setEmailSend] = useState(false)

    useEffect(async () => {
        if (sumbit === true) {
            //returns the sumbit to false for allow pressing the button again
            setSumbit(false);
            //if all the inputs return ok- no errors
            if (numSuccess === numInputs) {
                let response = await fetch('http://localhost:27017/users/login', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        id: dataIdPassword[0],
                        password: dataIdPassword[1]
                    }
                });

                let responseMessage = await response.json();
                if (response.status === 200) {
                    changeUser(responseMessage);
                    history.push("/");
                    setUrl("/");
                }
                else {
                    if (responseMessage.err === "idError") {
                        setValidUser("משתמש לא קיים, עליך להרשם תחילה");
                    }
                    else if (responseMessage.err === "passwordError") {
                        setValidUser("סיסמה לא נכונה");
                    }
                }
            }
        }

    }, [sumbit])

    useEffect(async () => {
        //make password recovery
        if (sumbitModal === true) {
            setSumbitModal(false);
            if (successModal) {
                let response = await fetch('http://localhost:27017/users/passwordRecovery', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id:idRecover})
                });

                if (response.status === 200) {
                    setEmailSend(true);
                }
                else {
                    setExistUser(false);
                    return;
                }
                
            }
        }

    }, [sumbitModal])


    const handelSubmit = (event) => {
        event.preventDefault();
        setSumbit(true);
    }

    function wasSuccessAdd() {
        numSuccess++;
    }

    function wasSuccessModal() {
        successModal = true;
    }

    function validModalId(data) {
        let validIdData = validId(data);
        if (validIdData !== "") return validIdData;
        idRecover = data;
        return "";
    }

    function saveDetails(data, nameInput) {
        if (nameInput === "Id") dataIdPassword[0] = data;
        else dataIdPassword[1] = data;
    }


    return (
        <div className="bg-img">

            <div >
                <form onSubmit={handelSubmit} className="container1">
                    <h2 className="header"><b> התחברות  </b></h2>
                    <small>{validUser}</small>
                    <InputForm
                        nameComp="תעודת זהות"
                        type={"text"}
                        validationFunction={(data) => { return validUserId(data, saveDetails); }}
                        sumbited={sumbit}
                        wasSuccess={() => { wasSuccessAdd(); }}
                    />

                    <InputForm
                        nameComp="סיסמה"
                        type={"password"}
                        validationFunction={(data) => { return validUserPassword(data, saveDetails); }}
                        sumbited={sumbit}
                        wasSuccess={() => { wasSuccessAdd(); }}
                    />

                    <button type="submit" className="btn1">התחבר</button>

                    <div className="password-recovery" onClick={() => { setShowModal(true); }}>
                        <small>שכחת סיסמה?</small>
                    </div>
                </form>

                <div className="password-recovery-modal">
                    <Modal
                        show={showModal}
                        onHide={() => {
                            setShowModal(false);
                            if(emailSend){
                                setEmailSend(false);
                            }
                        }}
                        size="gr"
                        aria-labelledby="example-modal-sizes-title-gr"
                        className="recov-modal"
                    >
                        <Modal.Body className="recov-body">

                            {!emailSend && <div>
                                <h4 className="recov-title">שיחזור סיסמה</h4>
                                <div className="input-recov">
                                    <InputForm
                                        nameComp="מספר תעודת הזהות באמצעותו נרשמת לאתר"
                                        type={"text"}
                                        validationFunction={(data) => { return validModalId(data); }}
                                        sumbited={sumbitModal}
                                        wasSuccess={() => { wasSuccessModal(); }}
                                    />
                                </div>
                                {!existUser && <h6>משתמש לא קיים במערכת</h6>}

                                <button onClick={() => { setSumbitModal(true); }} >שלח לי סיסמה</button>
                            </div>}

                            {emailSend && <div>
                                <h4>נשלחה אליך סיסמה חדשה במייל</h4>
                            </div>}

                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
export default Login