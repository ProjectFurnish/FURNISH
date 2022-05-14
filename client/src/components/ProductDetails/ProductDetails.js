import React, { useState, useEffect } from 'react'
import { validNum } from '../InputForm/Validation.js'
import { useHistory } from "react-router-dom";
import InputForm from '../InputForm/InputForm'
import './ProductDetails.css'
import Message from '../Message/Message'

function ProductDetails(props) {

    let userNow = props.userNow;
    let idProduct = props.location.id || "";

    const [sumbit, setSumbit] = useState(false);
    const numInputs = 8;
    const [productData, setProductData] = useState({
        _id: "",
        idSeller: userNow.id,
        name: "",
        description: "",
        category: "",
        mainImgSrc: "",
        type: "",
        color: "",
        price: 0,
        quality: "",
        status: "true"
    });
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");

    let categoryOption = ["בחר קטגוריה", "ארונות", "שולחנות", "מיטות", "ספות", "כיסאות"];
    const [category, setCategory] = useState(productData.category || "");

    const [typeOption, setTypeOption] = useState(getTypeOption());
    const [type, setType] = useState(productData.type || "");

    let colorsOption = ["בחר צבע", "לבן", "שחור", "אפור", "אדום", "כחול", "סגול", "ורוד", "עץ", "חום", "ירוק", "צהוב", "כתום", "תכלת", "צבעוני"];
    const [color, setColor] = useState(productData.color || "");

    let qualityOption = ["בחר מצב מוצר", "חדש", "דרוש תיקון", "מצב טוב", "משומש", "כמו חדש"];
    const [quality, setQuality] = useState(productData.quality || "");

    let setUrl = props.setUrl;
    let history = useHistory();
    let numSuccess = 0;
    let tempProductData = {
        _id: "",
        idSeller: userNow.id,
        name: "",
        description: "",
        category: "",
        mainImgSrc: "",
        type: "",
        color: "",
        price: 0,
        quality: ""
    }


    useEffect(() => {
        setColor(productData.color);
        setType(productData.type);
        setCategory(productData.category);
        setQuality(productData.quality);
    }, [productData.category, productData.color, productData.type, productData.quality])

    //load data
    useEffect(async () => {
        if (idProduct !== null && idProduct !== "") {
            let response = await fetch('http://localhost:27017/products/getProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({id:idProduct,projectionProduct:
                    {name:1,price:1,description:1,category:1,mainImgSrc:1,type:1,color:1,quality:1}})
            });

            let response2 = await response.json();
            if (response.status === 200) {
                setProductData(response2.product);
            }

            else {
                setMessage("ארעה שגיאה: " + response2.err);
                setShowAlert(true);
            }
        }
    }, [])

    //load the type option according the category choosed
    useEffect(() => {
        setTypeOption(getTypeOption());
    }, [category])

    //check the validity of the data and store it in the db
    useEffect(async () => {
        if (sumbit === true) {

            //returns the sumbit to false for allow pressing the button again
            setSumbit(false);
            if (numSuccess === numInputs && idProduct == "") {
                addProduct();
            }

            if (numSuccess === numInputs && idProduct !== "") {
                updateProduct();
            }
        }

    }, [sumbit])


    function getTypeOption() {
        let types = [];
        switch (category) {
            case "": case undefined: case "בחר קטגוריה":
                types = ["בחר תחילה קטגוריה"];
                break;
            case "שולחנות":
                types = ["בחר סוג", "שולחן כתיבה", "שולחן אוכל", "שולחן קפה"];
                break;
            case "ארונות":
                types = ["בחר סוג", "סיפרייה", "מזנון", "ארון הזזה", "ארון מטבח", "ארון בגדים"];
                break;
            case "מיטות":
                types = ["בחר סוג", "ספפה", "מיטה נפתחת", "מיטת תינוק", "מיטת קומותיים", "מיטה זוגית", "מיטת ילדים", "מיטת יחיד"];
                break;
            case "ספות":
                types = ["בחר סוג", "ספפה", "כורסה", "ספה פינתית", "ספה 2+3", "ספה 3 מושבים", "ספה לילדים", "ספה דו מושבית"];
                break;
            case "כיסאות":
                types = ["בחר סוג", "כסאות אוכל", "כסאות בר", "כסא משרדי", "כסא ילדים", "כסא חצר", "כסאות ים", "כסא לסלון", "כסא נדנדה"];
                break;
        }
        return types;
    }


    const handelSubmit = (event) => {
        event.preventDefault();
        setSumbit(true);
    }

    function saveData(inputName, data) {
        switch (inputName) {
            case "category":
                setCategory(data);
                break;
            case "type":
                setType(data);
                break;
            case "quality":
                setQuality(data);
                break;
            case "color":
                setColor(data);
                break;
            default:
                tempProductData[inputName] = data;
                break;
        }
    }

    function wasSuccessAdd() {
        numSuccess++;
    }

    const addProduct = async () => {
        //add new product
        tempProductData.category = category;
        tempProductData.color = color;
        tempProductData.type = type;
        tempProductData.quality = quality;

        let response = await fetch('http://localhost:27017/products/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempProductData)
        });

        let response2 = await response.text();
        if (response2 === "OK") {
            setMessage("המוצר נוסף בהצלחה");
            setShowAlert(true);
        }
        else {
            setMessage("ארעה שגיאה: " + response2);
            setShowAlert(true);
        }

    }

    function updateTempData() {
        tempProductData.category = category;
        tempProductData.type = type;
        tempProductData.color = color;
        tempProductData.quality = quality;
        if (tempProductData.name === "") tempProductData.name = productData.name;
        if (tempProductData.description === "") tempProductData.description = productData.description;
        if (tempProductData.price === "") tempProductData.price = Number(productData.price);
        if (tempProductData.mainImgSrc === "") tempProductData.mainImgSrc = productData.mainImgSrc;
        tempProductData._id = productData._id;
    }

    const updateProduct = async () => {
        //update product
        updateTempData();
        let response = await fetch('http://localhost:27017/products/updateProduct', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tempProductData)
        });

        let response2 = await response.text();
        if (response2 === "OK") {
            setMessage("המוצר עודכן בהצלחה");
            setShowAlert(true);
        }
        else {
            setMessage("ארעה שגיאה: " + response2);
            setShowAlert(true);
        }
    }

    const deleteProduct = async () => {
    
        tempProductData = productData;
        let response = await fetch('http://localhost:27017/products/deleteProduct', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: tempProductData._id })
        });

        let response2 = await response.text();
        if (response2 === "OK") {
            setMessage("המוצר נמחק בהצלחה");
            setShowAlert(true);
        }
        else {
            setMessage("ארעה שגיאה: " + response2);
            setShowAlert(true);
        }
    }




    return (
        <div className="ProductDetails">
            <div>


                {
                    userNow.id !== "" && <div >
                        <form onSubmit={handelSubmit} className="container1">
                            <h2 className="PD-h2"><b> פרטי מוצר </b></h2>
                            <InputForm
                                nameComp="שם המוצר"
                                type="text"
                                value={productData.name}
                                validationFunction={(data) => {
                                    let message = "";
                                    if (data == undefined || data == "") message = "שדה נדרש";
                                    saveData("name", data);
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />
                            <InputForm
                                nameComp="תיאור המוצר"
                                type="textarea"
                                value={productData.description}
                                validationFunction={(data) => {
                                    let message = "";
                                    if (data == undefined || data == "") message = "שדה נדרש";
                                    saveData("description", data);
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />

                            <InputForm
                                nameComp="קטגוריה"
                                value={productData.category}
                                type="select"
                                sumbited={sumbit}
                                saveData={(data) => { saveData("category", data); }}
                                wasSuccess={() => { wasSuccessAdd(); }}
                                arrayOption={categoryOption}
                            />


                            <InputForm
                                nameComp=" קישור לכתובת התמונה (התמונה צריכה להיות שמורה ברשת)"
                                type="text"
                                value={productData.mainImgSrc}
                                validationFunction={(data) => {
                                    let message = "";
                                    if (data == undefined || data == "") message = "שדה נדרש";
                                    saveData("mainImgSrc", data);
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />

                            <InputForm
                                nameComp="מחיר"
                                type="text"
                                value={productData.price}
                                validationFunction={(data) => {
                                    let message = validNum(data, [5, "upto"]);
                                    saveData("price", Number(data));
                                    return message
                                }
                                }
                                sumbited={sumbit}
                                wasSuccess={() => { wasSuccessAdd(); }}
                            />


                            <InputForm
                                nameComp="צבע מרכזי"
                                type="select"
                                value={productData.color}
                                sumbited={sumbit}
                                saveData={(data) => { saveData("color", data); }}
                                wasSuccess={() => { wasSuccessAdd(); }}
                                arrayOption={colorsOption}
                            />

                            <InputForm
                                nameComp="מצב המוצר"
                                type="select"
                                value={productData.quality}
                                sumbited={sumbit}
                                saveData={(data) => { saveData("quality", data); }}
                                wasSuccess={() => { wasSuccessAdd(); }}
                                arrayOption={qualityOption}
                            />

                            <InputForm
                                nameComp="סוג"
                                type="select"
                                value={productData.type}
                                sumbited={sumbit}
                                saveData={(data) => { saveData("type", data); }}
                                wasSuccess={() => { wasSuccessAdd(); }}
                                arrayOption={typeOption}
                            />

                            <div className="buttons">
                                {
                                    idProduct === "" &&
                                    <button type="submit" className="btn1">
                                        <span className="plus-icon">
                                            <i className="fas fa-plus"></i>
                                        </span>
                                    </button>
                                }


                                {idProduct !== "" &&
                                    <div className="buttons2">
                                        <button type="submit" className={"btn1", "v-btn"}>
                                            <span className="v-icon">
                                                <i className="fas fa-clipboard-check"></i>
                                            </span>
                                        </button>
                                        <div className="trash-icon-container">
                                            <span className="trash-icon" onClick={() => { deleteProduct(); }}>
                                                <i className="far fa-trash-alt"></i>
                                            </span>
                                        </div>
                                    </div>
                                }
                            </div>
                        </form>
                        {
                            showAlert && <Message
                                showAlert={showAlert}
                                message={message}
                                onClose={() => {
                                    setShowAlert(false);
                                    history.push("/PersonalArea");
                                    setUrl("/PersonalArea");
                                }
                                }
                                type="success" />
                        }
                    </div>

                }
                {userNow.id === "" &&
                    <div className="container1">
                        <h5>עליך להיות מחובר כדי להוסיף או לעדכן מוצר</h5>
                    </div>
                }
            </div>
        </div>
    );

}
export default ProductDetails
