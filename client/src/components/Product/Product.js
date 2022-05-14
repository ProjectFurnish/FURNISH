import React, { useState } from 'react'

import './Product.css'
import ProductBig from './ProductBig/ProductBig'

function Product(props) {

    const productFullDetails = props.productDetails;
    const productDetails=productFullDetails.product;
    const type = props.type;
    const userNow = props.userNow;
    const errorProducts = props.errorProducts;
    const [size, setSize] = useState(props.size);
    const [showModal, setShowModal] = useState(false)


    const handleShow = () => {
        setShowModal(true);
    }

    //change the product view size
    function changeSize() {

        switch (size) {
            case "smallest":
                handleShow();
                setSize("bigWithOutBtn1");
                break;
            case "small1":
                handleShow();
                setSize("bigWithOutBtn2");
                break;
            case "small2":
                handleShow();
                setSize("bigWithBtn");
                break;
            case "bigWithOutBtn1":
                setSize("smallest");
                break;
            case "bigWithOutBtn2":
                setSize("small1");
                break;
            case "bigWithBtn":
                setSize("small2");
                break;
            default:
                break;
        }
    }


    //Shortens the text if it is longer than the space assigned to it in the small card
    function makeShortText(text, maxLength) {
        if (text === null || text === undefined) return "";
        if (text.length <= maxLength) return text;
        let array = text.split(" ");
        let newText = "";
        let returnText = "";
        for (let i = 0; i < array.length; i++) {
            if ((newText + " " + array[i]).length <= maxLength - 3) {
                newText = newText + " " + array[i];
                returnText = newText;
            }
            else {
                newText = "..." + newText;
                returnText = newText;
                break;
            }
        }

        if (returnText === "...") returnText = "..." + text.slice(0, maxLength - 3);
        return returnText;
    }

    return (
        <div className="product">

            {
                productDetails._id !== "" &&(size === "smallest" || size === "bigWithOutBtn1") &&
                <div onClick={() => changeSize()} className="card">
                    <div className={"card-body", "small-body"}>
                        <h4 className={"card-title", "small2h4"}>{productDetails.name}</h4>

                        <p className={"card-text", "small2p"}>
                            {makeShortText(productDetails.description, 103)}
                        </p>


                        <p className={"price2"}>&#8362; {productDetails.price}</p>
                        {
                            type === "cart" && errorProducts.includes(productDetails._id) &&
                            <small>המוצר הוסר ע"י המוכר ואינו זמין יותר לרכישה</small>
                        }
                    </div>
                </div>
            }
            {
                productDetails._id !== "" &&
                (size === "small1" || size === "small2" || size === "bigWithOutBtn2" || size === "bigWithBtn") &&
                <div onClick={() => changeSize()} className="card">
                    <img src={productDetails.mainImgSrc} className={"card-img-top"} />
                    <div className="card-body">
                        <h4 className="card-title">{makeShortText(productDetails.name, 23)}</h4>
                        <p className="price">&#8362; {productDetails.price}</p>
                    </div>
                </div>
            }
            {
                productDetails._id !== "" && 
                (size === "bigWithOutBtn1" || size === "bigWithOutBtn2" || size === "bigWithBtn") &&

                <ProductBig
                    userNow={userNow}
                    productDetails={productDetails}
                    type={type}
                    errorProducts={errorProducts}
                    showModal={showModal}
                    setShowModal={(show) => { setShowModal(show); }}
                    size={size}
                    changeSize={()=>{changeSize();}} />
            }

            {
                (productDetails._id === "" ) &&
                <div>
                    <h3>מוצר לא נמצא</h3>
                </div>
            }

        </div >
    );
}

export default Product