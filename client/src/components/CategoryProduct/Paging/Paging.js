import React from 'react'
import './Paging.css'

export default function Paging(props) {
    let changeSkip = props.changeSkip;
    let skipNow=props.skipNow;
    //make the buttons that allow the user to paging in the data
    let arr = [];
    for (let i = Math.ceil(props.size/15)-1; i >=0 ; i--) {
        arr[i] = i;
    }

    return (
        <div className="paging">
            {arr.length>1 && arr.map((item) => <div className="skipNav">
                <button key={item} onClick={() => { changeSkip(item); window.scrollTo(0, 0) }} className={item===skipNow?"selected":""}>{item+1}</button>
            </div>
            )}
        </div>
    )
}
