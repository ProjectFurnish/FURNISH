import React, { useState, useEffect } from 'react'
import './InputForm.css'
function InputForm(props) {
    const { nameComp, type, validationFunction, sumbited, wasSuccess, value, disabled, saveData, arrayOption } = props;
    const [data, setData] = useState(value);
    const [validData, setvalidData] = useState("");


    useEffect(() => {

        if (sumbited === true) {
            //checks whether the data entered is valid by the function sent to the component 
            let message;
            if (type != "select") {
                if (data === undefined) message = "שדה נדרש";
                else message = validationFunction(data);
            }
            else message = validSelects(data);
            setvalidData(message);
            //returns to the parent component that the data is valid
            if (message === "") wasSuccess();
        }

    }, [sumbited]);

    useEffect(() => {
        setData(value)
    }, [value])


    const changeValue = (event) => {
        setData(event.target.value);
        setvalidData("");
        if (type == "select") saveData(event.target.value);
    }

    function validSelects(value) {
        //check if the select value is valid
        if (value === null || value === undefined) return "עליך לבחור";
        let split = value.split(" ");
        if (split[0] !== "בחר" && value !== "") {
            return "";
        }
        return "עליך לבחור";
    }


    return (

        <div className="inputForm1">
            <label htmlFor={nameComp}>{nameComp}</label>
            {type === "textarea" &&
                <div className="wrapper">
                    <div className="form-group">
                        <textarea className="form-control rounded-0" id={nameComp} type={type} value={data} onChange={changeValue} rows="4" cols="50">
                        </textarea>
                    </div>
                </div>
            }
            {
                type == "select" &&
                <select className="select"
                    onChange={(e) => {
                        changeValue(e);
                    }}
                >
                    {arrayOption.map((item, key) => {
                        if (item == value) return <option selected id={key}>{item}</option>
                        return <option id={key}>{item}</option>
                    })}
                </select>
            }
            {type !== "textarea" && type != "select" &&
                <input id={nameComp} type={type} value={data} onChange={changeValue} disabled={disabled || false} />}
            <small >{validData}</small>
        </div>

    );

}
export default InputForm