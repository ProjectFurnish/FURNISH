import React, { useEffect, useState } from 'react'
import ProductList from '../ProductsList/ProductsList.js'
import Message from '../Message/Message.js';
import { useHistory } from "react-router-dom";
import './Seller.css'


export default function Seller(props) {

    const userNow = props.userNow;
    let setUrl = props.setUrl;
    let history = useHistory();

    const [myProducts, setMyProducts] = useState([]);
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [isLoad1, setIsLoad1] = useState(false);
    const [isLoad2, setIsLoad2] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(async () => {
        setIsLoad1(false);
        setIsLoad2(false);
        if (userNow.id != "") {
            //filter the orders from the seller
            let response = await fetch('http://localhost:27017/orders/filterOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
                , body: JSON.stringify({ id: userNow.id, type: "seller", status: ["paid"] })
            });

            let response2 = await response.json();
            if (response.status === 200) {
                setProductsInOrder(response2);
                setIsLoad1(true);
            }

            else {
                setMessage(response2.err);
                setShowAlert(true);
            }

            //get all the products the seller sells
            response = await fetch('http://localhost:27017/products/getProductsByUser/' + userNow.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            response2 = await response.json();
            if (response.status === 200) {
                setMyProducts(response2);
                setIsLoad2(true);
            }
            else {
                setMessage(response2.err);
                setShowAlert(true);
            }

        }
    }, [userNow])

    async function updateDelieverProduct(id) {
        //update the product deliever to the user
        let response = await fetch('http://localhost:27017/orders/updateOrder', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
            , body: JSON.stringify({
                status: "deliever",
                idSeller: userNow.id,
                idItem: id
            })
        });

        if (response.status == 200) {
            let index = productsInOrder.findIndex((elem) => elem.order.idItem === id);
            productsInOrder.splice(index, 1);
            let tempProductsInOrder = [...productsInOrder];
            setProductsInOrder(tempProductsInOrder);
            setIsLoad1(true);
        }
        else {
            let response2 = await response.json();
            setMessage(response2.err);
            setShowAlert(true);
        }
    }



    function goToUpdateProduct(id) {
        history.push({
            pathname: '/updateProduct',
            id: id
        });
        setUrl("/updateProduct");
    }

    function goToAddProduct() {
        if (userNow.bankNumber === "") {
            history.push("/signAccount");
            setUrl("/signAccount");
        }
        else {
            history.push("/ProductDetails");
            setUrl("/ProductDetails");
        }
    }

    return (
        <div className="Seller">
            <div className="order">
                <h4 className="h4-seller">מוצרים שהוזמנו ממני</h4>
                <div className="ordered">
                    {!isLoad1 &&
                        <div className="loaderContaine">
                            <div className="loader"></div>
                        </div>
                    }
                    <ProductList
                        type="sent"
                        functionButton={async (id) => { await updateDelieverProduct(id); }}
                        productDetailsArray={productsInOrder}
                        size="smallest"
                        userNow={userNow}
                    />
                    {productsInOrder.length == 0 && isLoad1 &&
                        <h5 className="h5-seller">אין מוצרים שהוזמנו ממך</h5>
                    }

                </div>
            </div>

            <div className="all">
                <h4 className="h4-seller">כל המוצרים שאני מוכר</h4>
                {!isLoad2 && <div className="loader"></div>}
                <ProductList
                    productDetailsArray={myProducts}
                    type="seller"
                    functionButton={(id) => { goToUpdateProduct(id); }}
                    size="small1"
                    userNow={userNow}
                />
                {myProducts.length == 0 && isLoad2 &&
                    <h5 className="h5-seller">חבל :( עדיין לא העלית מוצרים לאתר</h5>
                }
                <div className="add">

                    <button className="add-button" onClick={() => { goToAddProduct(); }}>
                        <span className="add-icon">
                            <i className="fas fa-plus"></i>
                        </span>
                        <p>הוסף</p>
                    </button>

                </div>
            </div>

            {
                showAlert && <Message
                    showAlert={showAlert}
                    message={message}
                    onClose={() => {
                        setShowAlert(false);
                    }
                    } />
            }

        </div>
    )
}
