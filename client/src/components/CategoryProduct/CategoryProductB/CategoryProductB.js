import React, { useEffect, useState } from 'react'
import FilterB from '../Filter/FilterB'
import Furinture from '../Furniture/Furinture'

import './CategoryProductB.css'
export default function CategoryProductB(props) {

    let userNow = props.userNow;
    let categoryShow = props.category;
    const [category, setCategory] = useState(categoryShow);
    const [cities, setCities] = useState([]);
    const [types, setTypes] = useState([]);
    const [colors, setColors] = useState([]);
    const [quality, setQuality] = useState([]);
    const [price, setPrice] = useState([]);

    const [citiesChecked, setCitiesChecked] = useState([]);
    const [typesChecked, setTypesChecked] = useState([]);
    const [colorsChecked, setColorsChecked] = useState([]);
    const [qualityChecked, setQualityChecked] = useState([]);
    const [priceChecked, setPriceChecked] = useState([]);
    const [isLoad, setIsLoad] = useState(false);

    //load the filter parameters according to the category and rellevant products
    useEffect(async () => {
        setIsLoad(false);
        setCategory(props.category);
        let response = await fetch('http://localhost:27017/products/filterProducts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: categoryShow,
                statusArray: ["true"],
                projectionProduct: { category: 1, type: 1, color: 1, price: 1, quality: 1, idSeller: 1 },
                projectionSeller:{_id:0,city:1}
            })
        });
        if(response.status!==200) return;
        let products = await response.json()
        products=products.productsList;
        let citiesTemp = [];
        let typesTemp = [];
        let colorsTemp = [];
        let qualityTemp = [];
        let maxPrice = 0;

        for (let i = 0; i < products.length; i++) {
            let city = products[i].sellerDetails.city;
            if (!citiesTemp.includes(city)) {
                citiesTemp.push(city);
            }
            if (!typesTemp.includes(products[i].product.type)) {
                typesTemp.push(products[i].product.type);
            }
            if (!colorsTemp.includes(products[i].product.color)) {
                colorsTemp.push(products[i].product.color);
            }
            if (!qualityTemp.includes(products[i].product.quality)) {
                qualityTemp.push(products[i].product.quality);
            }
            if (Number(products[i].product.price) > maxPrice) maxPrice = Number(products[i].product.price);
        }
        setCities(citiesTemp);
        setTypes(typesTemp);
        setColors(colorsTemp);
        setPrice([0, maxPrice]);
        setQuality(qualityTemp);     

    }, [props.category])

    function changeArrays(cities, types, colors, price, quality) {
        setCitiesChecked(cities.slice());
        setColorsChecked(colors.slice());
        setTypesChecked(types.slice());
        setPriceChecked(price.slice());
        setQualityChecked(quality.slice());
    }

  

    return (
        <div className="categoryProduct">
         

            <div className="filter">
                <FilterB
                    changeArrays={(cities, types, colors, price, quality) => { changeArrays(cities, types, colors, price, quality); }}
                    category={category}
                    cities={cities}
                    types={types}
                    colors={colors}
                    price={price}
                    quality={quality}
                    citiesChecked={citiesChecked}
                    colorsChecked={colorsChecked}
                    typesChecked={typesChecked}
                    priceChecked={priceChecked}
                    qualityChecked={qualityChecked}
                    setIsLoad={(bool) => { setIsLoad(bool); }} 
                    isLoad={isLoad}               
                />
            </div>
            <div className="furniture">
                <Furinture
                    userNow={userNow}
                    category={category}
                    cities={citiesChecked}
                    price={priceChecked}
                    types={typesChecked}
                    colors={colorsChecked}
                    quality={qualityChecked}
                   
                    />
            </div>
           
        </div>
    )
}
