import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../asset/FURNISH.png";
import "./Header.css";
import { OverlayTrigger, Popover } from 'react-bootstrap';
import UserAccount from '../UserAccount/UserAccount'
import Cart from '../Cart/Cart'
import { useHistory } from "react-router-dom";

export default function Header(props) {
    const myUserNow = props.userNow;
    const changeUser = props.changeUser;
    let setUrl = props.setUrl;
    const [myUrl, setMyUrl] = useState(props.url);
    const [respon, setRespon] = useState(false)
    let ref = useRef(null);
    let history = useHistory();
    
    useEffect(() => {
        setMyUrl(props.url);
    }, [props.url])

    const userPopover = (
        <Popover id="popover-contained" className="popover-user" >
            <Popover.Title as="h3" className="title">פרטי חשבון</Popover.Title>
            <Popover.Content>
                <UserAccount
                    userNow={myUserNow}
                    changeUser={changeUser}
                    closePopover={closePopover}
                    setUrl={(url) => { setUrl(url); }}
                    root="header" />
            </Popover.Content>
        </Popover>
    );


    const cartPopover = (

        <Popover id="popover-contained" className="popover-cart" >
            <Popover.Title as="h3" className="title">עגלת הקניות</Popover.Title>
            <Popover.Content>
                <Cart
                    userNow={myUserNow}
                    closePopover={closePopover}
                    setUrl={(url) => { setUrl(url); }} />
            </Popover.Content>
        </Popover>
    );

    function closePopover() {
        document.body.click();
    }

    function change() {
        setRespon(!respon);
    }


    return (
        <div className="header" >
            <div className="logoAndUser">
                <div className="logo-div">
                    <img src={logo} alt="logo" className="logo" onClick={() => {
                        setUrl("/");
                        history.push("/");
                    }
                    } />
                </div>

                <div ref={ref} className="user">
                    <span className="userIcon">
                        <i className="far fa-user-circle"> </i>
                    </span>

                    {(myUserNow.id === "" || myUserNow === null) && (
                        <Link
                            to={"/LoginSign"}
                            style={{ textDecoration: "none" }}
                            className="login"
                        >
                            <h6 className={"signin-h6"} onClick={() => { setUrl("/LoginSign") }}>התחבר\הרשם </h6>
                        </Link>
                    )}
                    {myUserNow.id !== "" && (
                        <OverlayTrigger
                            ref={r => (ref = r)}
                            container={ref.current}
                            trigger="click"
                            placement="auto"
                            overlay={userPopover}
                            rootClose
                        >
                            <h6 className={"login-h6"}>{myUserNow.firstName} </h6>
                        </OverlayTrigger>
                    )}

                </div>
                <div className="line"></div>
                <div ref={ref} className="bag">
                    <span className="bagIcon">
                        <i className="fas fa-shopping-bag"></i>
                    </span>

                    <OverlayTrigger
                        ref={r => (ref = r)}
                        container={ref.current}
                        trigger="click"
                        placement="auto"
                        overlay={cartPopover}
                        rootClose
                    >
                        <h6 className="my-cart" >עגלת הקניות </h6>
                    </OverlayTrigger>
                </div>

                <div className={(respon === true) ? "responsive" : "nav-bar"}>
                    <ul >
                        <li>
                            <NavLink
                                exact
                                to="/"
                                className="navlink"
                                onClick={() => { setUrl("/"); }}
                                id={myUrl === "/" ? "active" : ""}>
                                דף הבית
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                exact
                                to="/closet"
                                className="navlink"
                                onClick={() => { setUrl("/closet"); }}
                                id={myUrl === "/closet" ? "active" : ""}>
                                ארונות
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                exact
                                to="/bed"
                                className="navlink"
                                onClick={() => { setUrl("/bed"); }}
                                id={myUrl === "/bed" ? "active" : ""}>
                                מיטות
                            </NavLink></li>
                        <li>
                            <NavLink
                                exact
                                to="/table"
                                className="navlink"
                                onClick={() => { setUrl("/table"); }}
                                id={myUrl === "/table" ? "active" : ""}>
                                שולחנות
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                exact
                                to="/sofa"
                                className="navlink"
                                onClick={() => { setUrl("/sofa"); }}
                                id={myUrl === "/sofa" ? "active" : ""}>
                                ספות
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                exact
                                to="/chair"
                                className="navlink"
                                onClick={() => { setUrl("/chair"); }}
                                id={myUrl === "/chair" ? "active" : ""}>
                                כסאות
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                exact
                                to="/about"
                                onClick={() => { setUrl("/about"); }}
                                className="navlink"
                                id={myUrl === "/about" ? "active" : ""}
                            >
                                אודות
                            </NavLink>
                        </li>
                        <a href="javascript:void(0);" className="icon" onClick={() => { change(); }}>
                            <i className="fa fa-bars"></i>
                        </a>
                    </ul>
                </div>
            </div>
        </div>
    );
};
