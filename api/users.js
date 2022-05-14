'use strict';
const express = require("express");
let app = express();
let router = express.Router()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const validation = require("./validation");
const mail = require('./sendMail');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


router.use(function resetRouter(req, res, next) {

    next()
})

const mongo = require('mongodb');
const e = require("express");
const MongoClient = mongo.MongoClient
const connectionString = 'mongodb+srv://ORYAN:HANURIT21A@furnish.ngdza.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

let users;

//get the users collection
MongoClient.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected');
    let db = client.db('furnish');
    users = db.collection('users');
    // get config vars
    dotenv.config();
})


/**
 * sign up to the site, need the folowing request:
 * url:http://localhost:27017/users/signUp
 * Type: POST
 * body:
 *  {"id": "324175223",
      "firstName": "אוריין",
      "lastName": "טמסוט",
      "phone": "0533175235",
      "email": "tamsut2777@gmail.com",
      "city": "אשדוד",
      "password": "GARURIT21",
    }
 */
router.post("/signUp", (req, res) => {

    //Checks if all required fields have been sent
    if (validation.validField(req.body.id) !== "" ||
        validation.validField(req.body.firstName) !== "" ||
        validation.validField(req.body.lastName) !== "" ||
        validation.validField(req.body.phone) !== "" ||
        validation.validField(req.body.email) !== "" ||
        validation.validField(req.body.city) !== "" ||
        validation.validField(req.body.password) !== "") {
        return res.status(500).send("מספר זהות, שם פרטי, שם משפחה, פלאפון, אימייל, עיר, סיסמה הינם שדות נדרשים");
    }

    //validation test to the fields
    let errorMessage = validation.validName(req.body.firstName)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    errorMessage = validation.validName(req.body.lastName)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    errorMessage = validation.validPhone(req.body.phone)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    errorMessage = validation.validMail(req.body.email)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    errorMessage = validation.validName(req.body.city)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    errorMessage = validation.validPassword(req.body.password)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    errorMessage = validation.validId(req.body.id)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    let user = {
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        city: req.body.city,
        password: req.body.password,
    }
    //check if the user exist, else add the user
    users.findOne({ id: req.body.id })
        .then(result => {
            if (result) return res.status(500).send("משתמש קיים");
            users.insertOne(user)
                .then(() => {
                    mail.signUp(req.body.email);
                    return res.status(200).send("OK");
                })
                .catch((err) => res.status(500).send(err));
        })
        .catch((err) => res.status(500).send(err));
})


/**
 * login to the site, need the folowing request:
 * url:http://localhost:27017/users/login
 * Type: GET
 * header:
 *  {"id": "324175223",
      "password": "GARURIT21",
    }
 */
router.get("/login", (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.headers['id']) !== "" ||
        validation.validField(req.headers['password']) !== "") {
        return res.status(500).json({ err: "מספר זהות, סיסמה הינם שדות נדרשים" })
    }

    //validation test to the fields
    let errorMessage = validation.validPassword(req.headers['password'])
    if (errorMessage != "") return res.status(500).json({ err: errorMessage })

    errorMessage = validation.validId(req.headers['id'])
    if (errorMessage != "") return res.status(500).json({ err: errorMessage })

    //check if the user exist and the password are correct
    users.findOne({ id: req.headers['id'] })
        .then(result => {
            if (result) {
                if (result.password === req.headers['password']) { 
                    result.number=parseCreditCardFromToken(result.number).replace(/\d(?=\d{4})/g, "*");
                    return res.status(200).json(result)
                }
                else return res.status(500).json({ err: "passwordError" })
            }
            else return res.status(500).json({ err: "idError" })
        })
        .catch((err) => { res.status(500).json({ err: err }) })
})


/**
 * get the shipping details of the user, need the folowing request:
 * Type: GET
 * url: http://localhost:27017/users/getShipingDetails/:id
 * need to change id to the id of the user
 */
router.get("/getShippingDetails/:id", (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.params['id']) !== "") {
        return res.status(500).json({ err: "מספר זהות הינה שדה נדרש" })
    }

    //validation test to the fields
    let errorMessage = validation.validId(req.params['id'])
    if (errorMessage != "") return res.status(500).json({ err: errorMessage })

    //find the user
    users.findOne({ id: req.params['id'] })
        .then((result) => {
            if (result) {
                let shippingDetails = {};
                //check if the user have shipping details
                if (result.address == undefined ||
                    result.city == undefined ||
                    result.homeNumber == undefined ||
                    result.buildingNumber == undefined) { return res.status(500).json({ err: "לא שמורים פרטי משלוח" }) }
                //return the shipping details to the client
                shippingDetails.address = result.address;
                shippingDetails.city = result.cityDel;
                shippingDetails.homeNumber = result.homeNumber;
                shippingDetails.buildingNumber = result.buildingNumber
                return res.status(200).json(shippingDetails);
            }
            else {
                return res.status(500).json({ err: "משתמש זה לא קיים" })
            }
        })
        .catch((err) => { return res.status(500).json({ err: err }) })
})


/**
 * update the address of the user, need the folowing request:
 * url:http://localhost:27017/users/updateAddress
 * Type: PUT
 * body:
 *  {
 *      "id": "324175223",
        "address": "hanurit",
        "buildingNumber": "21",
        "homeNumber": "2",
        "cityDel": "ashdod"   
    }
 */
router.put("/updateAddress", async (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.id) !== "" ||
        validation.validField(req.body.address) !== "" ||
        validation.validField(req.body.buildingNumber) !== "" ||
        validation.validField(req.body.homeNumber) !== "" ||
        validation.validField(req.body.cityDel) !== "") {
        return res.status(500).json({ err: "מספר זהות, כתובת, מספר בניין, מספר בית, עיר למשלוח הינם שדות נדרשים" });
    }

    //validation test to the fields
    let errorMessage = validation.validName(req.body.address)
    if (errorMessage != "") return res.status(500).json({ err: errorMessage });

    errorMessage = validation.validNum(req.body.buildingNumber, [3, "upto"])
    if (errorMessage != "") return res.status(500).json({ err: errorMessage });

    errorMessage = validation.validNum(req.body.homeNumber, [3, "upto"]);
    if (errorMessage != "") return res.status(500).json({ err: errorMessage });

    errorMessage = validation.validName(req.body.cityDel)
    if (errorMessage != "") return res.status(500).json({ err: errorMessage });

    let user = await users.findOne({ id: req.body.id })
    if (user === undefined || user === null)
        return res.status(500).json({ err: "משתמש זה לא קיים במערכת" });

    users.findOneAndUpdate(
        { id: req.body.id },
        {
            $set: {
                address: req.body.address || user.address,
                buildingNumber: req.body.buildingNumber || user.buildingNumber,
                homeNumber: req.body.homeNumber || user.homeNumber,
                cityDel: req.body.cityDel || user.cityDel,
            }
        }


    ).then((result) => {
        return res.status(200).json(result.value);
    })
        .catch((err) => res.status(500).json({ err: err }));
});

/**
 * update the bank account of the user, need the folowing request:
 * url:http://localhost:27017/users/updateAccount
 * Type: PUT
 * body:
 *  {
 *      "id": "324175223",
        "bankNumber": "20",
        "bankAccount": "200200",
        "branchNumber": "12"   
    }
 */
router.put("/updateAccount", async (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.id) !== "" ||
        validation.validField(req.body.bankNumber) !== "" ||
        validation.validField(req.body.bankAccount) !== "" ||
        validation.validField(req.body.branchNumber) !== "") {
        return res.status(500).send("מספר זהות, מספר בנק, מספר חשבון, מספר סניף הינם שדות נדרשים");
    }

    //validation test to the fields
    let errorMessage = validation.validBankBranch(req.body.bankNumber)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    errorMessage = validation.validBankBranch(req.body.branchNumber)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    errorMessage = validation.validAccount(req.body.bankAccount)
    if (errorMessage != "") return res.status(500).send(errorMessage);


    let user = await users.findOne({ id: req.body.id })
    if (user === undefined || user === null)
        return res.status(500).send("משתמש זה לא קיים במערכת");

    users.findOneAndUpdate(
        { id: req.body.id },
        {
            $set: {
                bankNumber: req.body.bankNumber || user.bankNumber,
                branchNumber: req.body.branchNumber || user.branchNumber,
                bankAccount: req.body.bankAccount || user.bankAccount
            }
        }


    ).then(() => {
        return res.status(200).send("OK");
    })
        .catch((err) => res.status(500).send(err));

})


/**
 * update the user details, need the folowing request:
 * url:http://localhost:27017/users/updateUser
 * Type: PUT
 * body:
 *  {"id": "324175223",
      "firstName": "אוריין",
      "lastName": "טמסוט",
      "phone": "0533175235",
      "email": "tamsut2777@gmail.com",
      "city": "אשדוד",
      "password": "GARURIT21",
    }
 */
router.put("/updateUser", async (req, res) => {
    let errorMessage = "";
    //Checks if all required fields have been sent
    if (validation.validField(req.body.id) !== "") {
        return res.status(500).send("מספר זהות הינה שדה נדרש");
    }

    //validation test to the fields- if the fields have been sent
    if (validation.validField(req.body.firstName) === "") {
        errorMessage = validation.validName(req.body.firstName)
        if (errorMessage != "") return res.status(500).send(errorMessage);
    }

    if (validation.validField(req.body.lastName) === "") {
        errorMessage = validation.validName(req.body.lastName)
        if (errorMessage != "") return res.status(500).send(errorMessage);
    }

    if (validation.validField(req.body.phone) === "") {
        errorMessage = validation.validPhone(req.body.phone)
        if (errorMessage != "") return res.status(500).send(errorMessage);
    }

    if (validation.validField(req.body.email) === "") {
        errorMessage = validation.validMail(req.body.email)
        if (errorMessage != "") return res.status(500).send(errorMessage);
    }

    if (validation.validField(req.body.city) === "") {
        errorMessage = validation.validName(req.body.city)
        if (errorMessage != "") return res.status(500).send(errorMessage);
    }

    if (validation.validField(req.body.password) === "") {
        errorMessage = validation.validPassword(req.body.password)
        if (errorMessage != "") return res.status(500).send(errorMessage);
    }

    errorMessage = validation.validId(req.body.id)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    //check if the user exist
    let user = await users.findOne({ id: req.body.id })
    if (user === undefined || user === null)
        return res.status(500).send("משתמש זה לא קיים במערכת");

    users.findOneAndUpdate(
        { id: req.body.id },
        {
            $set: {
                firstName: req.body.firstName || user.firstName,
                lastName: req.body.lastName || user.lastName,
                email: req.body.email || user.email,
                phone: req.body.phone || user.phone,
                password: req.body.password || user.password,
                city: req.body.city || user.city
            }
        },
        {
            upsert: true
        }
    )
        .then(() => res.send("OK"))
        .catch((err) => res.status(500).send(err));
})


/**
 * Performs password recovery, need the folowing request:
 * url:http://localhost:27017/users/passwordRecovery
 * Type: PUT
 * body:
 *  {
 *      "id": "324175223"
    }
 */
router.put("/passwordRecovery", async (req, res) => {

    //Checks if all required fields have been sent
    if (validation.validField(req.body.id) !== "") {
        return res.status(500).send("מספר זהות הינה שדה נדרש");
    }
    //find the user 
    let user = await users.findOne({ id: req.body.id })
    if (user === undefined || user === null) { return res.status(500).send("משתמש זה לא קיים במערכת"); }

    //create new password
    let newPassword = createRandomPassword();

    //update the user password and send mail to notify the user about his new password
    users.findOneAndUpdate(
        { id: req.body.id },
        {
            $set: {
                password: newPassword
            }
        },
        {
            upsert: true
        }
    )
        .then(() => {
            mail.passwordRecovery(user.email, newPassword)
            res.send("ok")
        })
        .catch((err) => res.status(500).send(err));
})


/**
 * get the user's credit details, need the folowing request:
 * url:http://localhost:27017/users/getCreditDetails/:id
 * need to replace "id" with the id of the user
 * Type: GET
 */
router.get("/getCreditDetails/:id", async (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.params["id"]) !== "") {
        return res.status(500).json({ err: "מספר זהות הינה שדה נדרש" });
    }



    users.findOne(
        { id: req.params["id"] },
        {
            projection:
            {
                idCredit: 1,
                number: 1,
                year: 1,
                month: 1,
                digit: 1,
                id: 1,
                _id: 0
            }
        }).then((result) => {
            //check if the user exist

            if (!result) {
                return res.status(500).json({ err: "משתמש זה לא קיים במערכת" });
            }
            //return the user credit details
            if (result.idCredit !== undefined) {
                result.number=parseCreditCardFromToken(result.number).replace(/\d(?=\d{4})/g, "*");
                return res.status(200).json(result);
            }
            else return res.status(500).json({ err: "לא שמורים פרטי אשראי עבור משתמש זה" });
        })
        .catch(err => { return res.status(500).json({ err: err }) })
})


/**
 * get the user details, need the folowing request:
 * url:http://localhost:27017/users/getUser/:id
 * need to replace "id" with the id of the user
 * Type: GET
 */
router.get("/getUser/:id", async (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.params["id"]) !== "") {
        return res.status(500).json({ err: "מספר זהות הינו שדה נדרש" });
    }

    users.findOne(
        { id: req.params["id"] }).then((result) => {
            //check if the user exist
            if (!result) {
                return res.status(500).json({ err: "משתמש זה לא קיים במערכת" });
            }
            //return the user credit details
            result.number=parseCreditCardFromToken(result.number).replace(/\d(?=\d{4})/g, "*");
            return res.status(200).json(result);
        })
        .catch(err => { return res.status(500).json({ err: err }) })
})


/**
 * update the user's credit details, need the folowing request:
 * url:http://localhost:27017/users/changeCreditDetail
 * Type: PUT
 * body:
 * { 
 *    "id": "324175223",
      "idCredit": "324175223",
      "number": "4580090108913495",
      "year": "28",
      "month": "11",
      "digit": "099"
    }
 */
router.put("/changeCreditDetail", async (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.id) !== "" ||
        validation.validField(req.body.idCredit) !== "" ||
        validation.validField(req.body.number) !== "" ||
        validation.validField(req.body.year) !== "" ||
        validation.validField(req.body.month) !== "" ||
        validation.validField(req.body.digit) !== "") {
        return res.status(500).send("מספר זהות משתמש, מספר זהות בעל הכרטיס, מספר אשראי, שנה, חודש, 3 ספרות הינם שדות נדרשים");
    }

    //validation test to the fields
    let errorMessage;
    errorMessage = validation.validId(req.body.idCredit);
    if (errorMessage !== "") {
        return res.status(500).send(errorMessage);
    }

    errorMessage = validation.validCreditCard(req.body.number);
    if (errorMessage !== "") {
        return res.status(500).send(errorMessage);
    }

    errorMessage = validation.validYear(req.body.year);
    if (errorMessage !== "") {
        return res.status(500).send(errorMessage);
    }


    errorMessage = validation.validMonth(req.body.month);
    if (errorMessage !== "") {
        return res.status(500).send(errorMessage);
    }

    errorMessage = validation.valid3Digit(req.body.digit);
    if (errorMessage !== "") {
        return res.status(500).send(errorMessage);
    }

    let user = await users.findOne({ id: req.body.id });
    if (user === undefined || user === null) {
        return res.status(500).send("משתמש זה לא קיים במערכת");
    }
    let encryptCreditCard = generateTokenEncryptCreditCard(req.body.number);
    users.updateOne(
        { id: req.body.id },
        {
            $set: {
                idCredit: req.body.idCredit,
                number: encryptCreditCard,
                year: req.body.year,
                month: req.body.month,
                digit: req.body.digit
            }
        }
    )
        .then(() => { return res.status(200).send("OK") })
        .catch((err) => { return res.status(500).send(err) })
})


//create a rendom password to the password recovery
function createRandomPassword() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomstring = Math.random().toString(36).slice(-8);
    let randomChar = chars[Math.floor(Math.random() * 51)];
    let randomNumber = Math.floor(Math.random() * 10);
    randomstring = randomstring + randomChar + randomNumber;
    return randomstring;
}

function generateTokenEncryptCreditCard(creditCardNumber) {
    return jwt.sign(creditCardNumber, process.env.TOKEN_SECRET,{});
}

function parseCreditCardFromToken(token) {
    try {
        return atob(token.split('.')[1]);
    } catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = router


