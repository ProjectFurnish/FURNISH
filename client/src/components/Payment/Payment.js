import React, { useState, useEffect } from 'react'
import { validId, validCreditCard, validYear, validMonth, valid3Digit } from '../InputForm/Validation.js'
import InputForm from '../InputForm/InputForm'
import { useHistory } from "react-router-dom";
import Paypal from "../Paypal/Paypal";
import { saveData } from '../Shared/UsesFunction'
import './Payment.css'
import Message from '../Message/Message'

function Payment(props) {
    let setUrl = props.setUrl;
    const userNow = props.userNow;
    const [sumbit, setSumbit] = useState(false);
    const [creditDetail, setCreditDetail] = useState({ id: userNow.id, idCredit: "", number: "", year: "", month: "", digit: "" });
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [checked, setChecked] = useState(false);
    const [total, setTotal] = useState(0);

    let history = useHistory();
    let creditDetailTemp = { id: userNow.id, idCredit: "", number: "", year: "", month: "", digit: "" };
    let numSuccess = 0;
    const numInputs = 5;



    useEffect(async() => {
        await checkHaveCreditSaved();
        await sumOrders();
    }, [userNow])

    useEffect(async () => {
        if (sumbit === true) {
            setSumbit(false);
            if (numSuccess === numInputs || (creditDetail.idCredit !== "" && numSuccess === 1)) {
               //save credit details
                if (creditDetail.idCredit==="" || checked) {
                    let response = await fetch('http://localhost:27017/users/changeCreditDetail', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(creditDetailTemp)
                    });

                    if (response.status !== 200) {
                        let response2=await response.text();
                        setMessage("ארעה שגיאה בעת שמירת הנתונים: "+response2);
                        setShowAlert(true);
                        return;
                    }  
                }

                await makePay();
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

    async function sumOrders() {
        //get the total price of the products in the cart
        let response = await fetch('http://localhost:27017/orders/getSumCart/' + userNow.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let response2 = await response.json();

        if (response.status === 200) {
            setTotal(Number(response2.res));
        }
        else{
            console.log(response2.err);
        }
    }



    //Checks whether payment details are stored in the system to upload them to the user
    const checkHaveCreditSaved = async () => {
        let response = await fetch('http://localhost:27017/users/getCreditDetails/' + userNow.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            let response2 = await response.json();
            setCreditDetail(response2);
        }
        else return false;
    }

    const makePay = async () => {
        
        let response = await fetch('http://localhost:27017/orders/payment', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({idClient: userNow.id})
        });

        if (response.status === 200) {
            setMessage("התשלום התקבל בהצלחה");
            setShowAlert(true);
        }
        else {
            let response2 = response.text();
            setMessage("ארעה שגיאה: " + response2);
            setShowAlert(true);
        }

    }

    return (
        <div className="payment">

            {userNow.id !== "" &&
                <div className="container1">
                    <h3 className="header-pay"><b> תשלום </b></h3>
                    <div className="paypal-button">
                        <Paypal history={history} total={total} makePay={() => { makePay(); }} />
                    </div>
                    <h4 className="or">-או-</h4>
                    {
                        creditDetail.idCredit !== "" && !checked &&
                        <form onSubmit={handelSubmit}>

                            <label>מספר אשראי</label>
                            <input type="text" value={creditDetail.number} disabled className="numCredit"></input>
                            <InputForm
                                nameComp="תעודת זהות בעל הכרטיס"
                                type={"text"}
                                validationFunction={(data) => {
                                    let message = validId(data);
                                    if (message === "" && data !== creditDetail.idCredit) message = "תעודת הזהות אינה מתאימה לכרטיס";
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />
                            <h5 className="pay">לתשלום: &#8362;{total} </h5>
                            <small onClick={() => { setChecked(true); }} className="change-pay">לשינוי אמצעי תשלום</small>
                            <button type="submit" className="btn1">אישור</button>
                        </form>
                    }


                    {(creditDetail.idCredit === "" || checked) &&

                        <form onSubmit={handelSubmit}>


                            <InputForm
                                nameComp="תעודת זהות בעל הכרטיס"
                                type={"text"}
                                validationFunction={(data) => {
                                    let message = validId(data);
                                    if (message === "") saveData(creditDetailTemp, "idCredit", data);
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />
                            <InputForm
                                nameComp="מספר אשראי"
                                type={"text"}
                                validationFunction={(data) => {
                                    let message = validCreditCard(data);
                                    if (message === "") saveData(creditDetailTemp, "number", data);
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />
                            <InputForm
                                nameComp="שנה"
                                type={"text"}
                                validationFunction={(data) => {
                                    let message = validYear(data);
                                    if (message === "") saveData(creditDetailTemp, "year", data);
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />

                            <InputForm
                                nameComp="חודש"
                                type={"text"}
                                validationFunction={(data) => {
                                    let message = validMonth(data);
                                    if (message === "") saveData(creditDetailTemp, "month", data);
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />

                            <InputForm
                                nameComp="3 ספרות בגב הכרטיס"
                                type={"text"}
                                validationFunction={(data) => {
                                    let message = valid3Digit(data);
                                    if (message === "") saveData(creditDetailTemp, "digit", data);
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />
                            <h5 className="pay">לתשלום: &#8362;{total} </h5>
                            <button type="submit" className="btn1">בצע תשלום</button>
                        </form>
                    }

                </div>
            }
            {
                showAlert && <Message
                    showAlert={showAlert}
                    message={message}
                    onClose={() => {
                        setShowAlert(false);
                        history.push("/personalArea");
                        setUrl("/personalArea");
                    }
                    }
                    type="success" />
            }
            {userNow.id === "" &&
                <div className="container1">
                    <h5>עליך להיות מחובר כדי לשלם</h5>
                </div>
            }
        </div>
    );

}
export default Payment