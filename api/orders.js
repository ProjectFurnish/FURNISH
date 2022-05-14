'use strict';
const express = require("express");
let app = express();
let router = express.Router()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const validation = require("./validation");
const mail = require('./sendMail');

router.use(function resetRouter(req, res, next) {
    next()
})

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient
const connectionString = 'mongodb+srv://ORYAN:HANURIT21A@furnish.ngdza.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
let users;
let orders;
let products;


//get the orders, users and products collection
MongoClient.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected');
    let db = client.db('furnish');
    users = db.collection('users');
    products = db.collection('products');
    orders = db.collection('orders');
})

/**
 * add new order, need the folowing request:
 * url:http://localhost:27017/orders/addOrder
 * Type: POST
 * body:
 *  {
      "idItem": "60bfade835c191242078eef1",
      "idSeller": "211727516",
      "idClient": "324175223",
    }
 */
router.post("/addOrder", async (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.idItem) !== "" ||
        validation.validField(req.body.idSeller) !== "" ||
        validation.validField(req.body.idClient) !== "") {
        return res.status(500).send("קוד מוצר, קוד מוכר וקוד לקוח הינם שדות נדרשים");
    }

    //validation tests to the fields
    let errorMessage;

    errorMessage = validation.validId(req.body.idSeller)
    if (errorMessage != "") return res.status(500).send(errorMessage);
    let seller = await users.findOne({ id: req.body.idSeller });
    if (seller === undefined || seller === null) { return res.status(500).send("מוכר זה לא קיים"); }

    errorMessage = validation.validId(req.body.idClient)
    if (errorMessage != "") { return res.status(500).send(errorMessage); }
    let client = await users.findOne({ id: req.body.idClient });
    if (client === undefined || client === null)
        return res.status(500).send("לקוח זה לא קיים");

    let product = await products.findOne({ _id: new mongo.ObjectID(req.body.idItem) });
    if (product === undefined || product === null)
        return res.status(500).send("מוצר זה לא קיים");
    if (product.idSeller !== req.body.idSeller) {
        return res.status(500).send("מוצר זה לא נמכר על ידי המוכר הזה");
    }

    //check if the user ordered this product
    let isOrderExist = await orders.findOne(
        {
            idClient: req.body.idClient,
            idItem: req.body.idItem,
            status:"cart"
        }
    );

    if (isOrderExist !== undefined && isOrderExist !== null) {
        return res.status(500).send("מוצר זה כבר קיים בעגלת הלקוח");
    }

    let order = {
        idSeller: req.body.idSeller,
        idClient: req.body.idClient,
        idItem: req.body.idItem,
        status: "cart"
    }
    orders.insertOne(order)
        .then(() => {
            return res.status(200).send("OK");
        })
        .catch((err) => {
            return res.status(500).send(err);
        })
})



/**
 * Adds shipping details to all orders of this user , need the folowing request:
 * url:http://localhost:27017/orders/addShippingDetails
 * Type: PUT
 * body:
 * { 
      "idClient": "211727516",
      "city":"אשדוד",
      "address":"הנורית",
      "buildingNumber": "20",
      "homeNumber": "12"
    }
 */
router.put("/addShippingDetails", async (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.idClient) !== "") {
        return res.status(500).send("קוד לקוח הינו שדה נדרש");
    }

    //validation test to the fields
    let errorMessage;

    errorMessage = validation.validId(req.body.idClient)
    if (errorMessage != "") return res.status(500).send(errorMessage);
    let user = await users.findOne({ id: req.body.idClient });
    if (user === undefined || user === null)
        return res.status(500).send("משתמש זה אינו קיים במערכת");

    let objectToUpdate = {};
    if (validation.validField(req.body.city) == "") {
        objectToUpdate.city = req.body.city;
    }

    if (validation.validField(req.body.address) == "") {
        objectToUpdate.address = req.body.address;
    }

    if (validation.validField(req.body.buildingNumber) == "") {
        objectToUpdate.buildingNumber = req.body.buildingNumber;
    }

    if (validation.validField(req.body.homeNumber) == "") {
        objectToUpdate.homeNumber = req.body.homeNumber;
    }

    orders.updateMany(
        { idClient: req.body.idClient },
        { $set: objectToUpdate },
        { multi: true })
        .then(() => {
            return res.status(200).send("OK");
        })
        .catch((err) => {
            return res.status(500).send(err);
        })
})

/**
 * update the order details, need the folowing request:
 * url:http://localhost:27017/orders/updateOrder
 * Type: PUT
 * body:{
    "status": "deliever"||"paid"||"error" ||"received",
    "idClient":"324175223", ||"idSeller":"324175223"
    "idItem":"60bfade835c191242078eef1"
    }
 */
router.put("/updateOrder", (req, res) => {
    //Checks if all the fields that have been sent are passed the valitation tests
    if (validation.validField(req.body.status) !== "" ||
        validation.validField(req.body.idItem) !== "") {
        return res.status(500).send("סטטוס לעדכון, קוד לקוח או קוד מוכר, קוד מוצר הינם שדות נדרשים");
    }

    if (req.body.status !== "deliever" && req.body.status !== "paid" && req.body.status !== "error"&&  req.body.status !== "received") {
        return res.status(500).send("סטטוס אינו חוקי");
    }

    if(validation.validField(req.body.idClient) !== "" && validation.validField(req.body.idSeller) !== ""){
        return res.status(500).send("עליך לשלוח או קוד לקוח או קוד מוכר");
    }

    let paramsToFind={};
    if(validation.validField(req.body.idClient)==""){
        paramsToFind.idClient=req.body.idClient;
    }
    else if(validation.validField(req.body.idSeller)==""){
        paramsToFind.idSeller=req.body.idSeller;
    }

    paramsToFind.idItem=req.body.idItem;
    orders.findOneAndUpdate(
        paramsToFind,
        {
            $set: {
                status: req.body.status
            }
        }
    ).then(async () => {
        if (req.body.status === "deliever") {
            //update the seller client that the product have been sent to him
            let order = await orders.findOne(paramsToFind);
            let seller = await users.findOne({ id: order.idSeller });
            let client = await users.findOne({ id: order.idClient });
            let product = await products.findOne({ _id: new mongo.ObjectID(order.idItem) });
            mail.delieverConfirment(seller, client, product);
            return res.status(200).send("OK");
        }
        else{
            return res.status(200).send("OK"); 
        }
    })
        .catch((err) => { return res.status(500).send(err) })
})


/**
 * Makes payment for all the products in the cart, need the folowing request:
 * url:http://localhost:27017/orders/payment
 * Type: PUT
 * body:{
      "idClient": "211727516"
    }
 */
router.put("/payment", async (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.idClient) !== "") {
        return res.status(500).send("קוד לקוח הינו שדה נדרש");
    }

    let errorMessage;
//validation test to the fields
    errorMessage = validation.validId(req.body.idClient)
    if (errorMessage != "") return res.status(500).send(errorMessage);
    let user = await users.findOne({ id: req.body.idClient });
    if (user === undefined || user === null)
        return res.status(500).send("משתמש זה אינו קיים במערכת");

    //update the order status to be paid
    orders.find({
        idClient: req.body.idClient,
        status: "cart"
    }).toArray()
        .then((ordersArray) => {
            //chenge that the product is paid
            orders.updateMany(
                {
                    idClient: req.body.idClient,
                    status: "cart"
                },
                {
                    $set: {
                        status: "paid"
                    }
                }).then(() => {
                    ordersArray.forEach(async (order) => {
                        //update the product to be with status of false- No longer offered for sale
                        products.updateOne(
                            { _id: new mongo.ObjectID(order.idItem) },
                            {
                                $set: {
                                    status: "false"
                                }
                            }
                        ).catch(err => { return res.status(500).send(err) })

                        let seller = await users.findOne({ id: order.idSeller });
                        let client = await users.findOne({ id: order.idClient });
                        let product = await products.findOne({ _id: new mongo.ObjectID(order.idItem) });
                        //send mail to notify the seller about the order
                        mail.orderNotification(seller, client, product);
                        //check if exist more orders with this item in cart and change their status to be error
                        orders.updateMany(
                            {
                                idItem: order.idItem,
                                status: "cart"
                            },
                            {
                                $set: {
                                    status: "error"
                                }
                            }
                        ).catch(err => { return res.status(500).send(err) })
                    });
                })
            return res.status(200).send("OK");
        })
        .catch((err) => { return res.status(500).send(err) });
})

/**
 *get the total prices of the products in the cart, need the folowing request:
 * url:http://localhost:27017/orders/getSumCart/:idClient
 * need to change "idClient" to the id of the user
 * Type: GET
 */
router.get("/getSumCart/:idClient", async (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.params["idClient"]) !== "") {
        return res.status(500).send("קוד לקוח הינו שדה נדרש");
    }

    let errorMessage;

    //validation test to the fields
    errorMessage = validation.validId(req.params["idClient"])
    if (errorMessage != "") return res.status(500).json({ err: errorMessage });
    //check if the user exist
    let user = await users.findOne({ id: req.params["idClient"] });
    if (user === undefined || user === null)
        return res.status(500).json({ err: "משתמש זה אינו קיים במערכת" });

    orders.find(
        {
            idClient: req.params["idClient"],
            status: "cart"
        }).toArray()
        .then(async (result) => {
            //Summarize the prices of the products in the cart
            let sum = 0;
            for (let i = 0; i < result.length; i++) {
                let order = result[i];
                await products.findOne({ _id: new mongo.ObjectID(order.idItem) }).then((product) => {
                    sum += product.price;
                })
            }
            res.status(200).json({ res: String(sum) });

        })
        .catch((err) => {
            return res.status(500).json({ err: err })
        })
})

/**
 * get the order details by productId, need the folowing request:
 * url:http://localhost:27017/orders/getOrderByProduct/:idItem
 * need to change "idItem" to the product Id 
 * Type: GET
 */
router.get("/getOrderByProduct/:idItem", (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.params["idItem"]) !== "") {
        return res.status(500).json({ err: "קוד מוצר הינו שדה נדרש" });
    }

    orders.findOne(
        {
            idItem: req.params["idItem"],
            status: { $in: ["paid", "deliever","received"] }
        }).then(async (result) => {
            if(result===null){
                return res.status(500).json({ err: "not found" })
            }
            result = await getFullDetails(result);
            return res.status(200).json(result)
        })
        .catch(err => { return res.status(500).json({ err: err }) })
})


/**
 * filter the orders, need the folowing request:
 * url:http://localhost:27017/orders/filterOrders
 * Type: POST
 * body:
 *{
      "id": "324175223",
      "type":"seller"||"client",
      "status":["deliever","paid","cart","error"]
    }
 */
router.post("/filterOrders", async (req, res) => {
//Checks if all required fields have been sent
    if (validation.validField(req.body.id) !== "" || validation.validField(req.body.type) !== "") {
        return res.status(500).json({ err: "מספר זהות, וסוג הינם שדות נדרשים" });
    }

    let errorMessage;
//validation test to the fields
    errorMessage = validation.validId(req.body.id)
    if (errorMessage != "") return res.status(500).json({ err: errorMessage });
    let user = await users.findOne({ id: req.body.id });
    if (user === undefined || user === null)
        return res.status(500).json({ err: "משתמש זה אינו קיים במערכת" });

    if (req.body.type !== "seller" && req.body.type != "client") {
        return res.status(500).json({ err: "סוג צריך להיות או מוכר או לקוח" });
    }

    let objToFind = {};
    if (req.body.type === "seller") {
        objToFind.idSeller = req.body.id;
    }
    else {
        objToFind.idClient = req.body.id;
    }

    if (validation.validField(req.body.status) == "") {
        objToFind.status = { $in: req.body.status }
    }

    orders.find(objToFind).toArray().then(async (result) => {
        for (let i = 0; i < result.length; i++) {
            result[i] = await getFullDetails(result[i]);
        }
        return res.status(200).json(result);
    })
        .catch(err => { return res.status(500).json({ err: err }) })
})





/**
 * delete order by productId and clientId, need the folowing request:
 * url:http://localhost:27017/orders/deleteOrderByProduct
 * Type: DELETE
 * body:
 * {
      "idItem": "60bfade835c191242078eef0",
      "idClient":"324175223"
    }
 */
router.delete("/deleteOrderByProduct", (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.idItem) !== "") {
        return res.status(500).send("קוד מוצר הינו שדה נדרש");
    }
    //validation test to the fields
    let errorMessage = validation.validId(req.body.idClient)
    if (errorMessage != "") { return res.status(500).send(errorMessage); }

    orders.deleteOne(
        {
            idItem: req.body.idItem,
            idClient: req.body.idClient
        }).then(() => { return res.status(200).send("OK") })
        .catch(err => { return res.status(500).send(err) })
})

//get the order full details
async function getFullDetails(order) {
    let seller = await users.findOne({ id: order.idSeller });

    let client = await users.findOne({ id: order.idClient });

    let product = await products.findOne({ _id: new mongo.ObjectID(order.idItem) });

    let sellerDetails = {
        firstName: seller.firstName,
        lastName: seller.lastName,
        phone: seller.phone,
        email: seller.email,
        city: seller.city,
        id:seller.id
    }
    let clientDetails = {
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        email: client.email,
        id:client.id
    }

    order = {
        order, sellerDetails, clientDetails, product
    }

    return order;
}


module.exports = router


