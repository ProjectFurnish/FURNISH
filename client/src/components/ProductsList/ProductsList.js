import React from 'react'
import Product from '../Product/Product'
import './ProductList.css'

function ProductList(props) {


    const productDetails = props.productDetailsArray;
    const type = props.type;
    const functionButton = props.functionButton;
    const size = props.size;
    const userNow = props.userNow;
    const errorProducts = props.errorProducts



    function makeProduct(product, key) {

        return (
            <div className="product-all">
                <div className="product">
                    <Product
                        key={key}
                        productDetails={product}
                        size={size}
                        userNow={userNow}
                        type={type}
                        errorProducts={errorProducts}
                    />
                </div>
                {
                    type==="seller" && product.product.status==="false" &&
                    <h6>מוצר זה אינו זמין לרכישה, עליך להסירו מרשימת המוצרים שלך</h6>
                }
                {type === "paid" &&
                    <div className="button">
                        <button
                            onClick={async () => { await functionButton(product.product._id); }}>
                            אשר קבלה
                        </button>
                    </div>}
                {type === "sent" &&
                    <div className="button">
                        <button
                            onClick={async () => {
                                await functionButton(product.product._id);
                            }}>
                            אשר שליחה
                        </button>
                    </div>}
                {type === "seller" &&
                    <div className="button">
                        <button
                            onClick={async () => { await functionButton(product.product._id); }}>
                            עדכן מוצר
                        </button>
                    </div>}
                {type === "cart" &&
                    <div className="trash-icon-container">
                        <span className="trash-icon" onClick={async () => { await functionButton(product.product._id); }}>
                            <i className="far fa-trash-alt"></i>
                        </span>
                    </div>
                }

            </div>)
    }


    return (
        <div >{
            productDetails.map((item, index) => {
                return makeProduct(item, index);
            })}

        </div>
    );
}
export default ProductList