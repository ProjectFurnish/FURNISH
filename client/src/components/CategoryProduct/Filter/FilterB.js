import React, { useEffect, useState } from 'react'
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import './FilterB.css'
export default function FilterB(props) {

    const [colors, setColors] = useState(props.colors);
    const [types, setTypes] = useState(props.types);
    const [cities, setCities] = useState(props.cities);
    const [quality, setQuality] = useState(props.quality);
    const changeArrays = props.changeArrays;
    const [priceAdd, setPriceAdd] = useState(props.price);

    let maxPrice = props.price[1];
    const [typesAdd, setTypesAdd] = useState(props.typesChecked);
    const [citiesAdd, setCitiesAdd] = useState(props.citiesChecked);
    const [colorsAdd, setColorsAdd] = useState(props.colorsChecked);
    const [qualityAdd, setQualityAdd] = useState(props.qualityChecked);
    const isLoad=props.isLoad;
    
    useEffect(() => {
        setColors(props.colors);
        setTypes(props.types);
        setCities(props.cities);
        setPriceAdd(props.price);
        setQuality(props.quality);
        props.setIsLoad(true);
    }, [props.colors, props.types, props.cities, props.price, props.quality])


    //style the range
    const useStyles = makeStyles({
        root: {
            color: '#abb663'
        }
    });
    const classes = useStyles();

    //Indicates that the check box checked
    function chooseInput(item, input) {
        let array;
        let setArray;
        switch (input) {
            case "types":
                array = typesAdd.slice();
                setArray = setTypesAdd;
                break;
            case "cities":
                array = citiesAdd.slice();
                setArray = setCitiesAdd;
                break;
            case "colors":
                array = colorsAdd.slice();
                setArray = setColorsAdd;
                break;
            case "quality":
                array = qualityAdd.slice();
                setArray = setQualityAdd;
                break;
            default:
                break;
        }
        if (array.includes(item)) array.splice(array.indexOf(item), 1);
        else array.push(item);
        setArray(array);

        switch (input) {
            case "types":
                changeArrays(citiesAdd, array, colorsAdd, priceAdd, qualityAdd);
                break;
            case "cities":
                changeArrays(array, typesAdd, colorsAdd, priceAdd, qualityAdd);
                break;
            case "colors":
                changeArrays(citiesAdd, typesAdd, array, priceAdd, qualityAdd);
                break;
            case "quality":
                changeArrays(citiesAdd, typesAdd, colorsAdd, priceAdd, array);
                break;
            default:
                break;
        }
    }


    function createElementCheck(item, input, index) {
        let array;
        switch (input) {
            case "types":
                array = typesAdd;
                break;
            case "cities":
                array = citiesAdd;
                break;
            case "colors":
                array = colorsAdd;
                break;
            case "quality":
                array = qualityAdd;
                break;
            default:
                break;
        }

        return (
            <div key={index} className="filter-check-box">
                {
                    <label className="container-check">{item}
                        <input
                            type="checkbox"
                            onChange={() => {
                                chooseInput(item, input)
                            }}
                            checked={array.includes(item)} />
                        <span className="checkmark"></span>
                    </label>
                }
            </div>
        )
    }



    return (
        <div className="filterB">
            <form className="form">
            {(!isLoad) && <div className="loader"></div>}
               
                <div className="key-filter">
                    <label className="title">צבעים</label>
                    <div className="filter-value">
                        {colors.map((color, index) => {
                            return createElementCheck(color, "colors", index);
                        })}
                    </div>
                </div>
                <div className="key-filter">
                    <label className="title">סוגים</label>
                    <div className="filter-value">
                        {types.map((type, index) => {
                            return createElementCheck(type, "types", index);
                        })}
                    </div>
                </div>

                <div className="key-filter">
                    <label className="title">ערים</label>
                    <div className="filter-value">
                        {cities.map((city, index) => {
                            return createElementCheck(city, "cities", index);
                        })}
                    </div>
                </div>
                <div className="key-filter">
                    <label className="title">מצב מוצר</label>
                    <div className="filter-value">
                        {quality.map((quality, index) => {
                            return createElementCheck(quality, "quality", index);
                        })}
                    </div>
                </div>


                <div className="key-filter">
                    <label className="title">מחיר</label>
                    <div className="slide">
                        <Slider
                            classes={{
                                root: classes.root
                            }}
                            max={maxPrice}
                            value={priceAdd}
                            onChange={(event, newValue) => {
                                setPriceAdd(newValue);
                            }}
                            onChangeCommitted={(event, newValue) => {
                                changeArrays(citiesAdd, typesAdd, colorsAdd, newValue, qualityAdd);
                            }}
                            valueLabelDisplay="auto"
                        />
                    </div>
                </div>


            </form>
        </div>
    )
}
