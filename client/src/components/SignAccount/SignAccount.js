import React, { useState, useEffect } from 'react'
import { validBankBranch, validAccount } from '../InputForm/Validation.js'
import { useHistory } from "react-router-dom";
import InputForm from '../InputForm/InputForm'
import { saveData } from '../Shared/UsesFunction'
import './SignAccount.css'
import Message from '../Message/Message'

function SignAccount(props) {
    let userNow = props.userNow;
    let mode = props.mode || "";
    let setUrl = props.setUrl;

    const [sumbit, setSumbit] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");

    let accountData = { bankNumber: "", branchNumber: "", bankAccount: "" };
    let numSuccess = 0;
    const numInputs = 3;
    let history = useHistory();

    useEffect(async () => {
        if (sumbit === true) {
            //returns the sumbit to false for allow pressing the button again
            setSumbit(false);
            //if all the inputs return ok- no errors
            if (numSuccess === numInputs) {
                await apdudeAccount();
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

    //update the account details in the user details in db
    async function apdudeAccount() {
        accountData = { ...accountData, id: userNow.id };
        let response = await fetch('http://localhost:27017/users/updateAccount', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountData),
        });
        let response2 = await response.text();
        if (response2 === "OK") {
            if (mode === "") {
                setMessage("החשבון נשמר בהצלחה");
            }
            else {
                setMessage("החשבון עודכן בהצלחה");
            }
            setShowAlert(true);
        }
        else {
            setMessage(response2);
            setShowAlert(true);
        }

    }




    return (
        <div className="SignAccount">


            {userNow.id !== "" && <form onSubmit={handelSubmit} className="container1">
                <h2 className="centered"><b> פרטי בנק</b></h2>
                <p className="centered">כדי להוסיף מוצר עליך לשמור פרטי חשבון בנק, לצורך קבלת הכסף ממכירת הפריטים</p>

                <InputForm
                    nameComp="מספר בנק"
                    type={"text"}
                    value={userNow.bankNumber}
                    validationFunction={(data) => {
                        let message = validBankBranch(data);
                        if (message === "") saveData(accountData, "bankNumber", data);
                        return message
                    }
                    }
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />
                <InputForm
                    nameComp="מספר סניף"
                    type={"text"}
                    value={userNow.branchNumber}
                    validationFunction={(data) => {
                        let message = validBankBranch(data);
                        if (message === "") saveData(accountData, "branchNumber", data);
                        return message
                    }
                    }
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />
                <InputForm
                    nameComp="מספר חשבון בנק"
                    type={"text"}
                    value={userNow.bankAccount}
                    validationFunction={(data) => {
                        let message = validAccount(data);
                        if (message === "") saveData(accountData, "bankAccount", data);
                        return message
                    }
                    }
                    sumbited={sumbit}
                    wasSuccess={() => { wasSuccessAdd(); }}
                />

                <button type="submit" className="btn1">{mode === "" ? "שמור" : "עדכן"}</button>
            </form>}
            {userNow.id === "" &&
                <div className="container1">
                    <h5>עליך להיות מחובר כדי להוסיף פרטי חשבון</h5>
                </div>
            }
            {
                showAlert && <Message
                    showAlert={showAlert}
                    message={message}
                    onClose={() => {
                        setShowAlert(false);
                        if (mode === "") {
                            history.push("/ProductDetails");
                            setUrl("/ProductDetails");
                        }
                    }
                    }
                    type="success" />
            }

        </div>
    );

}
export default SignAccount
