
import './App.css';
import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginSign from './components/LoginSign/LoginSign'
import SignUpClient from './components/SignUp/SignUpClient'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import { validId } from './components/InputForm/Validation'
import CategoryProductB from './components/CategoryProduct/CategoryProductB/CategoryProductB'
import Payment from './components/Payment/Payment'
import ShippingDetails from './components/ShippingDetails/ShippingDetails'
import SignAccount from './components/SignAccount/SignAccount'
import ProductDetails from './components/ProductDetails/ProductDetails'
import PersonalArea from './components/PersonalArea/PersonalArea'
import About from './components/About/About'
import UpdateUser from './components/UpdateUser/UpdateUser'
import NotFound from './components/NotFound/NotFound'

function App() {

  const [userNow, setUserNow] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    password: "",
    bankNumber: "",
    bankAccount: "",
    branchNumber: "",
    address: "",
    buildingNumber: "",
    homeNumber: "",
    cityDel: ""
  });
  const [url, setUrl] = useState(window.location.pathname);
  const [isShabbos, setIsShabbos] = useState(false);

  useEffect(async () => {
    if (localStorage.getItem("idUserNow") !== null && validId(localStorage.getItem("idUserNow")) === "") {
      let response = await fetch('http://localhost:27017/users/getUser/' + localStorage.getItem("idUserNow"), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status == 200) {
        let userNow = await response.json();
        setUserNow(userNow);
      }

    }
    chaeckIsShabbos();
  }, [])

  function changeUser(newUser) {
    setUserNow(newUser);
    localStorage.setItem("idUserNow", newUser.id);
  }

  function chaeckIsShabbos() {
    let date = new Date();
    let day = date.getDay();
    let hour = date.getHours();
    if ((day === 5 && hour > 19) || (day === 6 && hour < 20)) setIsShabbos(true);
    else setIsShabbos(false);
    return;
  }

  return (

    <div className="App">
      {!isShabbos &&
        <div>
          <Header userNow={userNow} url={url} setUrl={
            (url) => {
              setUrl(url);
            }
          } changeUser={
            (newUser) => { changeUser(newUser); }}
          />
          <Switch>
            <Route
              exact path='/'
              render={(props) => (<Home {...props}
                setUrl={(url) => { setUrl(url); }}
              />)}
            />
            <Route
              path='/closet'
              render={(props) => (<CategoryProductB {...props}
                category="ארונות"
                userNow={userNow}
              />)} />
            <Route
              path='/table'
              render={(props) => (<CategoryProductB {...props}
                category="שולחנות"
                userNow={userNow}
              />)} />
            <Route
              path='/bed'
              render={(props) => (<CategoryProductB {...props}
                category="מיטות"
                userNow={userNow}

              />)} />

            <Route
              path='/sofa'
              render={(props) => (<CategoryProductB {...props}
                category="ספות"
                userNow={userNow}

              />)} />
            <Route
              path='/chair'
              render={(props) => (<CategoryProductB {...props}
                category="כיסאות"
                userNow={userNow}

              />)} />
            <Route
              path='/SignUpClient'
              render={(props) => (<SignUpClient {...props}
                changeUser={(newUser) => { changeUser(newUser); }}
                setUrl={(url) => { setUrl(url); }}
              />)}

            />
            <Route
              path='/UpdateUser'
              render={(props) => (<UpdateUser {...props}
                changeUser={(newUser) => { changeUser(newUser); }}
                setUrl={(url) => { setUrl(url); }}
                userNow={userNow} />)}

            />
            <Route
              path='/LoginSign'
              render={(props) => (<LoginSign {...props}
                changeUser={(newUser) => { changeUser(newUser); }}
                setUrl={(url) => { setUrl(url); }} />)}
            />
            <Route
              path='/Payment'
              render={(props) => (<Payment {...props}
                userNow={userNow}
                setUrl={(url) => { setUrl(url); }}
              />)} />

            <Route
              path='/ShippingDetails'
              render={(props) => (<ShippingDetails {...props}
                userNow={userNow}
                changeUser={(newUser) => { changeUser(newUser); }}
                setUrl={(url) => { setUrl(url); }}
              />)} />



            <Route
              path='/ProductDetails'
              render={(props) => (<ProductDetails {...props}
                userNow={userNow}
                setUrl={(url) => { setUrl(url); }}
              />)} />

            <Route
              path='/PersonalArea'
              render={(props) => (<PersonalArea {...props}
                userNow={userNow}
                setUrl={(url) => { setUrl(url); }}
                changeUser={(newUser) => { changeUser(newUser); }}
              />)} />


            <Route
              path='/updateProduct'
              render={(props) => (<ProductDetails {...props}
                userNow={userNow}
                setUrl={(url) => { setUrl(url); }}
              />)} />

            <Route
              path='/signAccount'
              render={(props) => (<SignAccount {...props}
                userNow={userNow}
                setUrl={(url) => { setUrl(url); }}
              />)} />

            <Route
              path='/about'
              render={(props) => (<About {...props}
              />)} />

            <Route
              render={(props) => (<NotFound {...props}
              />)} />

          </Switch>
        </div>
      }
      {
        isShabbos &&
        <div className="container1">
          <h4>אתר זה סגור בשבת</h4>
          <p>
            משתמש יקר, שמירת שבת הינה ערך עליון, ועל כן האתר חסום כעת.
          </p>
          <p>
            נשמח לשרת אתכם לאחר השבת.
          </p>
          <p>
            <a href="https://www.hidabroot.org/%D7%A9%D7%91%D7%AA" target="_blank">לפרטים נוספים</a>
          </p>


        </div>
      }
    </div >
  );
}


export default App;
