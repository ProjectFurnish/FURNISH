import React, { useEffect, useState } from 'react'
import ProductList from '../ProductsList/ProductsList'
import Cart from '../Cart/Cart'
import './Client.css'
import Message  from '../Message/Message'

export default function Client(props) {
    let userNow = props.userNow;
    let setUrl = props.setUrl;
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");
    //load the data
    useEffect(async () => {
        setIsLoad(false);
        if (userNow.id != "") {
            //get the orders that the client wait for
            let response = await fetch('http://localhost:27017/orders/filterOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
                , body: JSON.stringify({ id: userNow.id, type: "client", status: ["paid","deliever"] })
            });

            let response2 = await response.json();
            if (response.status === 200) {
                setProductsInOrder(response2);
            }

            else {
                setMessage(response2.err);
                setShowAlert(true);
            }
            setIsLoad(true);
        }
    }, [userNow.id])

    //update that the order complate- arrive to the user
    async function updateRecieveProduct(id) {
        let response = await fetch('http://localhost:27017/orders/updateOrder', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
            , body: JSON.stringify({
                status: "received",
                idClient: userNow.id,
                idItem: id
            })
        });

        if (response.status == 200) {
            let index = productsInOrder.findIndex((elem) => elem.order.idItem === id);
            productsInOrder.splice(index, 1);
            let tempProductsInOrder = [...productsInOrder];
            setProductsInOrder(tempProductsInOrder);
            setIsLoad(true);
        }
        else{
            let response2=await response.json();
            setMessage(response2.err);
            setShowAlert(true);
        }
    }

    return (
        <div className="Client">
            <div className="cart-container">
                <h4 className="Client-h4">עגלת הקניות</h4>
                <div className="cart-client">
                    <Cart userNow={userNow} className="cart-client" setUrl={(url) => { setUrl(url); }} />
                </div>
            </div>
            <div className="order-container">
                <h4 className="Client-h4">מוצרים בהזמנה</h4>
                <div className="ordered-client">
                    {!isLoad && <div className="loader"></div>}
                    <ProductList
                        type="paid"
                        functionButton={async (id) => { await updateRecieveProduct(id); }}
                        productDetailsArray={productsInOrder}
                        size="smallest"
                        userNow={userNow}
                    />
                     {productsInOrder.length == 0 && isLoad &&
                        <h5 className="h5-seller">אין לך מוצרים באמצע הזמנה</h5>
                    }

                </div>

            </div>

            {
                showAlert && <Message
                    showAlert={showAlert}
                    message={message}
                    onClose={() => {
                        setShowAlert(false);
                    }
                    }/>
            }

        </div>
    )
}
