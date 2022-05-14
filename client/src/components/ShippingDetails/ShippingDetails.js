import React, { useState, useEffect } from 'react'
import { validNum, validName } from '../InputForm/Validation.js'
import { useHistory } from "react-router-dom";
import InputForm from '../InputForm/InputForm'
import { saveData } from '../Shared/UsesFunction'
import Message from '../Message/Message.js';
import './ShippingDetails.css'


export default function ShippingDetails(props) {
    let userNow = props.userNow;
    let setUrl = props.setUrl;
    const [checked, setChecked] = useState(false);
    const [sumbit, setSumbit] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");

    let numSuccess = 0;
    const numInputs = 4;
    let history = useHistory();
    const [shippingDetails, setShippingDetails] = useState({ city: "", address: "", buildingNumber: "", homeNumber: "" })
    let shippingDetailsTemp = { city: "", address: "", buildingNumber: "", homeNumber: "" };

    const handelSubmit = (event) => {

        event.preventDefault();
        setSumbit(true);
    }

    function wasSuccessAdd() {
        numSuccess++;
    }

    useEffect(async () => {
        //get the user ShippingDetails
        if (userNow.id != "") {
            let response = await fetch('http://localhost:27017/users/getShippingDetails/' + userNow.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status == 200) {
                let response2 = await response.json();
                setShippingDetails(response2);
            }
        }
    }, [userNow])

    //update the orders with the current Shipping details
    const updateOrders = async () => {
        let response = await fetch('http://localhost:27017/orders/addShippingDetails', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
            , body: JSON.stringify({
                idClient: userNow.id, ...shippingDetailsTemp
            })
        });

        if (response.status == 200) {
            return true;

        }
        else {
            let response2 = await response.json();
            setMessage(response2.err);
            setShowAlert(true);
            return false;
        }
    }


    //update the orders with the current Shipping details
    const updateUser = async () => {
        let shippingDetails2 = {};
        shippingDetails2.cityDel = shippingDetailsTemp.city;
        shippingDetails2.address = shippingDetailsTemp.address;
        shippingDetails2.buildingNumber = shippingDetailsTemp.buildingNumber;
        shippingDetails2.homeNumber = shippingDetailsTemp.homeNumber;

        let response = await fetch('http://localhost:27017/users/updateAddress', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
            , body: JSON.stringify({
                id: userNow.id, ...shippingDetails2
            })
        });

        if (response.status == 200) {
            let response2 = await response.json();
            console.log(response2);
            props.changeUser(response2);
            return true;

        }
        else {
            let response2 = await response.json();
            setMessage(response2.err);
            setShowAlert(true);
            return false;
        }
    }

    useEffect(async () => {
        if (sumbit === true) {
            //returns the sumbit to false for allow pressing the button again
            setSumbit(false);
            //if all the inputs return ok- no errors
            if (numSuccess === numInputs) {
                shippingDetailsTemp.city = shippingDetailsTemp.city || shippingDetails.city;
                shippingDetailsTemp.address = shippingDetailsTemp.address || shippingDetails.address;
                shippingDetailsTemp.buildingNumber = shippingDetailsTemp.buildingNumber || shippingDetails.buildingNumber;
                shippingDetailsTemp.homeNumber = shippingDetailsTemp.homeNumber || shippingDetails.homeNumber;
                let success = await updateOrders();
                let success2;
                //if the user apply to save the data to the other times
                if (checked && success) {
                    success2 = await updateUser();
                }
                if (success && (!checked || success2)) {
                    history.push("/Payment");
                    setUrl("/Payment");
                }
            }
        }

    }, [sumbit])


    return (
        <div className="ShippingDetails">
            {userNow.id !== "" &&
                <form onSubmit={handelSubmit}>
                    <h3 className="header"><b> פרטי משלוח </b></h3>
                    <div className="form">
                        <InputForm
                            nameComp="עיר"
                            type={"text"}
                            value={shippingDetails.city}
                            validationFunction={(data) => {
                                let message = validName(data);
                                if (message === "") saveData(shippingDetailsTemp, "city", data);
                                return message
                            }
                            }
                            sumbited={sumbit}
                            wasSuccess={() => { wasSuccessAdd(); }}
                        />
                        <InputForm
                            nameComp="רחוב"
                            type={"text"}
                            value={shippingDetails.address}
                            validationFunction={(data) => {
                                let message = validName(data);
                                if (message === "") saveData(shippingDetailsTemp, "address", data);
                                return message
                            }
                            }
                            sumbited={sumbit}
                            wasSuccess={() => { wasSuccessAdd(); }}
                        />
                        <InputForm
                            nameComp="מספר בניין"
                            type={"text"}
                            value={shippingDetails.buildingNumber}
                            validationFunction={(data) => {
                                let message = validNum(data, [3, "upto"]);
                                if (message === "") saveData(shippingDetailsTemp, "buildingNumber", data);
                                return message
                            }
                            }
                            sumbited={sumbit}
                            wasSuccess={() => { wasSuccessAdd(); }}
                        />
                        <InputForm
                            nameComp="מספר בית"
                            type={"text"}
                            value={shippingDetails.homeNumber}
                            validationFunction={(data) => {
                                let message = validNum(data, [3, "upto"]);
                                if (message === "") saveData(shippingDetailsTemp, "homeNumber", data);
                                return message
                            }
                            }
                            sumbited={sumbit}
                            wasSuccess={() => { wasSuccessAdd(); }}
                        />

                        <label className="container-check">האם לשמור את פרטי המשלוח לפעמים הבאות?
                            <input
                                type="checkbox"
                                onChange={() => { setChecked(true); }}
                            />
                            <span className="checkmark"></span>
                        </label>
                        <button type="submit" className="btn1"><span>המשך</span></button>

                    </div>
                </form>
            }
            {userNow.id === "" &&

                <h5>עליך להיות מחובר כדי לבצע הזמנה</h5>

            }
            {
                showAlert && <Message
                    showAlert={showAlert}
                    message={message}
                    onClose={() => {
                        setShowAlert(false);
                    }
                    } />
            }

        </div >
    );

}

