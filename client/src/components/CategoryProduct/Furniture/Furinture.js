import React, { useState, useEffect, useRef } from 'react'
import ProductList from '../../ProductsList/ProductsList.js'
import Paging from '../Paging/Paging.js';
import './Furinture.css'
export default function Furinture(props) {

    let category = props.category;
    let types = props.types;
    let cities = props.cities;
    let colors = props.colors;
    let price = props.price;
    let quality = props.quality;
    let userNow = props.userNow;
    const [products, setProducts] = useState([]);
    const [size, setSize] = useState(0);
    const [skip, setSkip] = useState(0);
    const [isLoad, setIsLoad] = useState(false);

    //save the previous category- in order to nullify the skip when the catgory changed
    const prevCategorytRef = useRef();
    useEffect(() => {
        prevCategorytRef.current = category;
    });
    const prevCategory = prevCategorytRef.current;
    //load data

    useEffect(async () => {
        setIsLoad(false);
        let skipTemp = skip;
        if (prevCategory !== category) {
            setSkip(0);
            skipTemp = 0;
        }
        //prepare the filter parameters
        let filterParam = {};
        if (types.length !== 0) {
            filterParam.typesArray = types;
        }
        if (colors.length !== 0) {
            filterParam.colorsArray = colors;
        }
        if (price.length !== 0) {
            filterParam.priceArray = price;
        }
        if (quality.length !== 0) {
            filterParam.qualityArray = quality;
        }
        if (cities.length !== 0) {
            filterParam.citiesArray = cities;
        }

        filterParam = {
            category: category,
            ...filterParam,
            statusArray: ["true"],
            skip: skipTemp
        }

        if (filterParam.citiesArray != undefined) {
            filterParam.projectionSeller = { _id: 0, city: 1 };
            filterParam.projectionProduct = { name: 1, price: 1, mainImgSrc: 1, idSeller: 1 };
        }
        else {
            filterParam.projectionProduct = { name: 1, price: 1, mainImgSrc: 1 };
        }

        //get the products 
        let response = await fetch('http://localhost:27017/products/filterProducts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filterParam)
        });

        let response2 = await response.json();
        if (response.status === 200) {
            setProducts(response2.productsList);
            setSize(response2.size)
        }
        else {
            console.log(response2.err);
        }

        setIsLoad(true);

    }, [category, cities, types, colors, price, quality, skip]);



    return (
        <div>
            {(!isLoad) && <div className="loader"></div>}
            <div className="productArea">
                <ProductList userNow={userNow} productDetailsArray={products} size="small2" />
            </div>
            <div className="pagingArea">
                <Paging size={size} changeSkip={(i) => { setSkip(i) }} skipNow={skip} />
            </div>
        </div>
    )
}
