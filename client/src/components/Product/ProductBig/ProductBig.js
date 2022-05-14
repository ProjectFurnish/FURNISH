import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'

import Message from '../../Message/Message'
import '../Product.css'
import './ProductBig.css'

export default function ProductBig(props) {

    const type = props.type;
    const userNow = props.userNow;
    const errorProducts = props.errorProducts;
    const showModal = props.showModal;
    const setShowModal = props.setShowModal;
    const size = props.size;
    const changeSize = props.changeSize;
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [typeMessage, setTypeMessage] = useState("");
    const [sellerDetails, setSellerDetails] = useState({});
    const [myOrder, setMyOrder] = useState({});
    const [productDetails, setProductDetails] = useState(props.productDetails)
    
    const handleClose1 = () => {
        setShowModal(false);       
    }

    const handleClose2 = () => {
        setShowModal(false); 
        changeSize();      
    }

    useEffect(async () => {
        //get the data of the product
        if (type !== "sent" && type !== "paid") {
            let response = await fetch('http://localhost:27017/products/getProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "id": productDetails._id },{})
            });

            let response2 = await response.json();
            console.log(response2);
            if (response.status === 200) {
                setProductDetails(response2.product)
                setSellerDetails(response2.sellerDetails);
            }
        }

        if (type === "sent" || type === "paid") {
            //get the data of the order of the product
            let response = await fetch('http://localhost:27017/orders/getOrderByProduct/' + productDetails._id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            let response2 = await response.json();
            console.log(response2);
            if (response.status === 200) {
                setProductDetails(response2.product);
                setMyOrder(response2);
                setSellerDetails(response2.sellerDetails);
            }
        }
    }, [])


    const makeOrder = async () => {
        //create a new order
        if (userNow.id === "") {
           
            setMessage("אינך מחובר לאתר");
            setShowAlert(true);
            handleClose1();
            return;
        }
        let newOrder = {};
        newOrder.idItem = productDetails._id;
        newOrder.idSeller = sellerDetails.id;
        newOrder.idClient = userNow.id;
        if (newOrder.idClient == newOrder.idSeller) {
           
            setMessage("לא ניתן להזמין מוצר שאתה המוכר שלו");
            setShowAlert(true);
            handleClose1();
            return;
        }
        let response = await fetch('http://localhost:27017/orders/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder)
        });

        let response2 = await response.text();
        if (response.status === 200) {
            
            setMessage("המוצר נוסף בהצלחה");
            setShowAlert(true);
            setTypeMessage("success");
            handleClose1();
        }
        else {
            
            setMessage(response2);
            setShowAlert(true);
            handleClose1();
            return;
        }
    }

    //return the products full details
    return (
        <div>

            <Modal
                show={showModal}
                onHide={handleClose2}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="modal"
            >

                <Modal.Body className="product-modal-body">
                    {(sellerDetails.id != undefined) && <div className="card-modal">
                        <div>
                            <img src={productDetails.mainImgSrc} className="card-modal-img" />
                        </div>
                        <div className="card-modal-text">
                            <h4><b>{productDetails.name}</b></h4>
                            <div className="descContainer">
                            <p className="desc">{productDetails.description}</p>
                            </div>
                            {type === "sent" && myOrder !== null &&
                                <div>
                                    <h6>פרטי הזמנה</h6>
                                    <p>
                                        <b>שם לקוח </b>
                                        <div className="values">{myOrder.clientDetails.firstName} {myOrder.clientDetails.lastName}</div>
                                    </p>
                                    <p>
                                        <b>פלאפון לקוח </b>
                                        <div className="values">{myOrder.clientDetails.phone}</div>
                                    </p>
                                    <p>
                                        <b>כתובת למשלוח </b>
                                        <div className="values">{myOrder.order.city}, {myOrder.order.address} {myOrder.order.buildingNumber} / {myOrder.order.homeNumber}</div>
                                    </p>

                                </div>
                            }

                            {type !== "sent" && < div >
                                <p><b>עיר </b> <div className="values">{sellerDetails.city}</div></p>
                                <p><b>מצב המוצר </b> <div className="values">{productDetails.quality}</div></p>
                                <p><b>צבע </b> <div className="values">{productDetails.color}</div></p>
                                <h6>פרטי התקשרות עם המוכר </h6>
                                <p><b>שם </b> <div className="values">{sellerDetails.firstName} {sellerDetails.lastName}</div></p>
                                <p><b>טלפון </b><div className="values">{sellerDetails.phone}</div></p>

                                {type === "paid" && myOrder !== null &&
                                    <p><b>מצב הזמנה</b><div className="values">
                                        {(myOrder.order.status === "paid") ? "שולם" : (myOrder.order.status === "deliever") ? "נשלח" : "התקבל"}
                                    </div></p>}
                                <p className="price"> {productDetails.price} &#8362;</p>

                            </div>}
                            {
                                type === "cart" && errorProducts.includes(productDetails.id) &&
                                <small>המוצר הוסר ע"י המוכר ואינו זמין יותר לרכישה</small>
                            }
                        </div>
                        {
                            productDetails.id !== "" && sellerDetails.id !== "" && size === "bigWithBtn" &&
                            <div className="button-container">
                                <button onClick={async () => { makeOrder(); }}>הוסף לעגלה</button>
                            </div>
                        }

                    </div>}
                </Modal.Body>
            </Modal>

            {
                showAlert && <Message
                    showAlert={showAlert}
                    message={message}
                    onClose={() => {
                        setShowAlert(false);
                        setTypeMessage("");
                        changeSize();
                    }
                    }
                    type={typeMessage} />
            }

        </div>
    )
}
