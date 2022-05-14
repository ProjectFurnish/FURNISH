import React, { useState, useEffect } from 'react'
import ProductList from '../ProductsList/ProductsList.js'
import { useHistory } from "react-router-dom";
import './Cart.css'

export default function Cart(props) {
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [errorProducts, setErrorProduct] = useState([]);
    const [validOrders, setValidOrders] = useState([])
    const userNow = props.userNow;
    const [isLoad, setisLoad] = useState(false)
    let closePopover = props.closePopover;
    let history = useHistory();
    let setUrl = props.setUrl;

    //load data
    useEffect(async () => {

        if (userNow.id !== "") {
            let response = await fetch('http://localhost:27017/orders/filterOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userNow.id, type: "client", status: ["cart", "error"] })
            });

            let response2 = await response.json();
            if (response.status === 200) {
                setProductsFiltered(response2);
            }

            //check wich of the orders are with "error" status
            let tempErr = [];
            let tempValidOrders = [];

            response2.forEach(order => {
                if (order.order.status === "error" && !tempErr.includes(order.order.idItem)) {
                    tempErr.push(order.order.idItem);
                }
                else if (order.order.status === "cart") {
                    tempValidOrders.push(order);
                }
            });

            setErrorProduct(tempErr);
            setValidOrders(tempValidOrders);
            setisLoad(true);

        }


    }, [userNow])







    const deleteOrder = async (id) => {
        //delete order from the db and from the cart in view
        await fetch('http://localhost:27017/orders/deleteOrderByProduct', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idItem: id, idClient: userNow.id })
        });

        let index = validOrders.findIndex((elem) => elem.order.idItem === id);
        validOrders.splice(index, 1);
        let tempValidOrders = [...validOrders]

        index = productsFiltered.findIndex((elem) => elem.order.idItem === id);
        productsFiltered.splice(index, 1);
        let tempProducts = [...productsFiltered]
        setProductsFiltered(tempProducts);
        setValidOrders(tempValidOrders);
        setisLoad(true);
    }

    //go to payment
    function goToPay() {
        if (closePopover !== undefined) closePopover();
        history.push("/ShippingDetails");
        setUrl("/ShippingDetails");
    }


    return (

        <div className="cart">
            {userNow.id != "" &&
                <div>
                    {!isLoad && <div className="loader"></div>}
                    <div className="product-container">
                        <ProductList
                            productDetailsArray={productsFiltered}
                            size="smallest"
                            userNow={userNow}
                            type={"cart"}
                            functionButton={async (id) => { await deleteOrder(id); }}
                            errorProducts={errorProducts}
                        />
                    </div>
                    {validOrders.length !== 0 && productsFiltered.length !== 0 &&
                        <button onClick={() => { goToPay(); }} className="pay-button">לתשלום</button>}
                    {
                        ( productsFiltered.length === 0&& isLoad) &&
                        <h5>העגלה שלך ריקה</h5>
                    }
                </div>
            }
            {userNow.id === "" &&

                <h5>אינך מחובר</h5>
            }

        </div>
    )
}
