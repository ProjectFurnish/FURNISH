'use strict';
const express = require("express");
let app = express();
let router = express.Router()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const validation = require("./validation");

router.use(function resetRouter(req, res, next) {
    next()
})

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient
const connectionString = 'mongodb+srv://ORYAN:HANURIT21A@furnish.ngdza.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
let users;
let products;
let orders;
let categoryOption = ["בחר קטגוריה", "ארונות", "שולחנות", "מיטות", "ספות", "כיסאות"];
let colorsOption = ["בחר צבע", "לבן", "שחור", "אפור", "אדום", "כחול", "סגול", "ורוד", "עץ", "חום", "ירוק", "צהוב", "כתום", "תכלת", "צבעוני"];
let qualityOption = ["בחר מצב מוצר", "חדש", "דרוש תיקון", "משומש", "מצב טוב", "כמו חדש"];
let statusOption = ["true", "false", "deleted"]

//get the products and users collection
MongoClient.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected');
    let db = client.db('furnish');
    users = db.collection('users');
    products = db.collection('products');
    orders=db.collection('orders');
})


/**
 * add new product to the site , need the folowing request:
 * url:http://localhost:27017/products/addProduct
 * Type: POST
 * body:
 *  {
    "idSeller": "322654666",
    "name": "כיסא משרדי",
    "description": "כיסא משרדי בצבע שחור נוח במיוחד !",
    "category": "כיסאות",
    "mainImgSrc": "https://www.waxman.co.il/image.axd?src=~/uploaded_files/images/MANAGER_U5000.jpg&q=100&w=570",
    "type": "כסא משרדי",
    "color": "שחור",
    "price": "560",
    "quality": "כמו חדש"
  } 
 */

router.post("/addProduct", (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.idSeller) !== "" ||
        validation.validField(req.body.name) !== "" ||
        validation.validField(req.body.description) !== "" ||
        validation.validField(req.body.category) !== "" ||
        validation.validField(req.body.mainImgSrc) !== "" ||
        validation.validField(req.body.type) !== "" ||
        validation.validField(req.body.color) !== "" ||
        validation.validField(req.body.price) !== "" ||
        validation.validField(req.body.quality) !== "") {
        return res.status(500).send("קוד מוכר, שם, תיאור, קטגוריה, תמונה, סוג, צבע, מחיר, איכות הינם שדות נדרשים");
    }

    //validation test to the fields

    let errorMessage = validation.validNum(req.body.price, [5, "upto"])
    if (errorMessage != "") return res.status(500).send(errorMessage);

    if (!categoryOption.includes(req.body.category)) {
        errorMessage = "קטגוריה לא חוקית";
        return res.status(500).send(errorMessage);
    }

    if (!colorsOption.includes(req.body.color)) {
        errorMessage = "צבע לא חוקי";
        return res.status(500).send(errorMessage);
    }

    if (!qualityOption.includes(req.body.quality)) {
        errorMessage = "איכות לא חוקית";
        return res.status(500).send(errorMessage);
    }

    if (!matchTypes(req.body.category).includes(req.body.type)) {
        errorMessage = "סוג לא חוקי";
        return res.status(500).send(errorMessage);
    }

    errorMessage = validation.validId(req.body.idSeller)
    if (errorMessage != "") return res.status(500).send(errorMessage);

    let product = {
        idSeller: req.body.idSeller,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        mainImgSrc: req.body.mainImgSrc,
        type: req.body.type,
        color: req.body.color,
        price: req.body.price,
        quality: req.body.quality,
        status: "true"
    }
    //check if the seller exist and than add the product to the products collection
    users.findOne({ id: req.body.idSeller })
        .then(result => {
            if (result) {
                products.insertOne(product)
                    .then(() => {
                        return res.status(200).send("OK");
                    })
                    .catch((err) => console.log(err))
            }
            else {
                return res.status(500).send("קוד מוכר לא קיים");
            }
        })
        .catch((err) => console.log(err))
})

/**
 * get the product full details, need the folowing request:
 * url:http://localhost:27017/products/getProduct
 * Type: POST
 * body:
 *  {
    "id": "60aeafc014a13e4ff0b954e2",
    "projectionProduct":{_id:0,name:1},
    "projectionSeller":{firstName:1},
  }
 */

router.post("/getProduct", (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.id) !== "") {
        return res.status(500).json({ err: "קוד הינו שדה נדרש" });
    }

    products.findOne({ _id: new mongo.ObjectID(req.body.id) }, { projection: req.body.projectionProduct })
        .then(async (result) => {
            if (req.body.projectionProduct === undefined || req.body.projectionProduct.idSeller === 1) {
                result = await getFullDetails(result, req.body.projectionSeller);
            }
            else {
                result = { product: result }
            }
            return res.status(200).json(result);
        })
        .catch((err) => {
            return res.status(500).json({ err: err });
        })
})


/**
 * delete product from the site, need the folowing request:
 * url:http://localhost:27017/products/deleteProduct
 * Type: PUT
 * body:
 *  {
    "id": "60aeafc014a13e4ff0b954e2"
 }
 */

router.put("/deleteProduct", (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.id) !== "") {
        return res.status(500).send("קוד מוצר הינו שדה נדרש");
    }

    //update the product status to be deleted
    products.findOneAndUpdate(
        { _id: new mongo.ObjectID(req.body.id) },
        {
            $set: {
                status: "deleted"
            }
        }
    )
        .then(() => {
            //update the orders with this product to be with "error" status
            orders.updateMany(
                {
                    idItem: req.body.id,
                    status: "cart"
                },
                {
                    $set: {
                        status: "error"
                    }
                })
                .then(()=>{ return res.status(200).send("OK");})
                .catch((err) => {
                    return res.status(500).send(err);
                })
        })
        .catch((err) => {
            return res.status(500).send(err);
        })
})




/**
 * update the product details, need the folowing request:
 * url:http://localhost:27017/products/updateProduct
 * Type: PUT
 * body:
 * { 
 * "_id":"60aeafc014a13e4ff0b954e2",
    "name": "כיסא משרדי",
    "description": "כיסא משרדי בצבע שחור נוח במיוחד !",
    "category": "כיסאות",
    "mainImgSrc": "https://www.waxman.co.il/image.axd?src=~/uploaded_files/images/MANAGER_U5000.jpg&q=100&w=570",
    "type": "כסא משרדי",
    "color": "שחור",
    "price": "560",
    "quality": "כמו חדש",
    "status":"true"
  }
 */

router.put("/updateProduct", async (req, res) => {

    //Checks if all fields that have been sent- are pass the validation tests
    let errorMessage = "";

    if (validation.validField(req.body.price) == "") {
        errorMessage = validation.validNum(req.body.price, [5, "upto"])
        if (errorMessage != "") return res.status(500).send(errorMessage);
    }

    if (validation.validField(req.body.category) == "") {
        if (!categoryOption.includes(req.body.category)) {
            errorMessage = "קטגוריה לא חוקית";
            return res.status(500).send(errorMessage);
        }
    }

    if (validation.validField(req.body.color) == "") {
        if (!colorsOption.includes(req.body.color)) {
            errorMessage = "צבע לא חוקי";
            return res.status(500).send(errorMessage);
        }
    }

    if (validation.validField(req.body.quality) == "") {
        if (!qualityOption.includes(req.body.quality)) {
            errorMessage = "איכות לא חוקית";
            return res.status(500).send(errorMessage);
        }
    }

    if (validation.validField(req.body.type) == "") {
        if (!matchTypes(req.body.category).includes(req.body.type)) {
            errorMessage = "סוג לא חוקי";
            return res.status(500).send(errorMessage);
        }
    }

    if (validation.validField(req.body.status) == "") {
        if (!statusOption.includes(req.body.status)) {
            errorMessage = "סטטוס לא חוקי";
            return res.status(500).send(errorMessage);
        }
    }

    if (validation.validField(req.body._id) !== "") {
        return res.status(500).send("קוד מוצר הינו שדה נדרש");
    }

    //check if the product to update are exist
    let product = await products.findOne({ _id: new mongo.ObjectID(req.body._id) });
    if (product === undefined || product === null)
        return res.status(500).send("מוצר זה אינו קיים");

    products.findOneAndUpdate(
        { _id: new mongo.ObjectID(req.body._id) },
        {
            $set: {
                name: req.body.name || product.name,
                description: req.body.description || product.description,
                category: req.body.category || product.category,
                mainImgSrc: req.body.mainImgSrc || product.mainImgSrc,
                type: req.body.type || product.type,
                color: req.body.color || product.color,
                price: req.body.price || product.price,
                quality: req.body.quality || product.quality,
                status: req.body.status || product.status,
            }
        })
        .then(() => {
            return res.status(200).send("OK");
        })
        .catch((err) => {
            return res.status(500).send(err);
        })
})


/**
 * filter the products, need the folowing request:
 * url:http://localhost:27017/products/filterProducts
 * Type: POST
 * body:
 *  {
    "category": "שולחנות",
    "typesArray":  ["שולחן כתיבה",  "שולחן קפה"],
    "colorsArray": ["כתום", "תכלת", "צבעוני"],
    "priceArray": ["560","1200"],
    "qualityArray": ["כמו חדש"],
    "statusArray":["true"],
    "citiesArray":["ירושלים"],
    "projectionProduct":{_id:0,name:1},
    "projectionSeller":{firstName:1},
    "skip":2
  }
 */
router.post("/filterProducts", (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.body.category) == "") {
        if (!categoryOption.includes(req.body.category)) {
            errorMessage = "קטגוריה לא חוקית";
            return res.status(500).json({ err: errorMessage });
        }
    }

    let typesArray = req.body.typesArray || matchTypes(req.body.category);
    let colorsArray = req.body.colorsArray || colorsOption;
    let priceArray = req.body.priceArray || [0, 1000000];
    let qualityArray = req.body.qualityArray || qualityOption;
    let statusArray = req.body.statusArray || statusOption;
    let size = 0;

    products.find({
        category: req.body.category,
        type: { $in: typesArray },
        color: { $in: colorsArray },
        price: { $lte: priceArray[1], $gte: priceArray[0] },
        quality: { $in: qualityArray },
        status: { $in: statusArray }
    }
    ).project(req.body.projectionProduct).toArray()
        .then(async (result) => {
            //get the size of the documents
            let newResult = [];
            for (let i = 0; i < result.length; i++) {
                if (req.body.projectionProduct == undefined || req.body.projectionProduct.idSeller != undefined) {
                    result[i] = await getFullDetails(result[i], req.body.projectionSeller);
                    let citiesArray = req.body.citiesArray;
                    if (citiesArray === undefined) {
                        newResult.push(result[i]);
                        continue;
                    }
                    else if (citiesArray !== undefined && citiesArray.includes(result[i].sellerDetails.city)) {

                        newResult.push(result[i]);
                        continue;
                    }
                }
                else {
                    newResult.push({ product: result[i] });
                }
            }
            size = newResult.length;
            let newResult2;
            let start = 0;
            let end = start + 15;
            if (req.body.skip !== undefined) {
                start = req.body.skip * 15;
                end=start+15;
            }
            newResult2 = newResult.slice(start, end);
            return res.status(200).json({ productsList: newResult2, size: size });
        })
        .catch((err1) => {
            return res.status(500).json({ err: err1 });
        })
})

/**
 *filter the products according to the seller, need the folowing request:
 * url:http://localhost:27017/products/getProductsByUser/:idSeller
 * need to replace "idSeller" with the id of the seller
 * Type: GET
 */
router.get("/getProductsByUser/:idSeller", (req, res) => {
    //Checks if all required fields have been sent
    if (validation.validField(req.params["idSeller"]) !== "") {
        return res.status(500).json({ err: "קוד מוכר הינו שדה נדרש" });
    }

    //validation test to the fields
    let errorMessage = validation.validId(req.params["idSeller"])
    if (errorMessage != "") return res.status(500).json({ err: errorMessage });

    products.find({
        idSeller: req.params["idSeller"],
        status: { $ne: "deleted" }
    }
    ).toArray()
        .then(async (result) => {
            for (let i = 0; i < result.length; i++) {
                result[i] = { product: result[i] }
            }
            return res.status(200).json(result);
        })
        .catch((err) => {
            return res.status(500).json({ err: err });
        })
})


//match types to the category
function matchTypes(category) {
    let types = [];
    switch (category) {
        case "", undefined, "בחר קטגוריה":
            types = [];
            break;
        case "שולחנות":
            types = ["שולחן כתיבה", "שולחן אוכל", "שולחן קפה"];
            break;
        case "ארונות":
            types = ["סיפרייה", "מזנון", "ארון הזזה", "ארון מטבח", "ארון בגדים"];
            break;
        case "מיטות":
            types = ["ספפה", "מיטה נפתחת", "מיטת תינוק", "מיטת קומותיים", "מיטה זוגית", "מיטת ילדים", "מיטת יחיד"];
            break;
        case "ספות":
            types = ["ספפה", "כורסה", "ספה פינתית", "ספה 2+3", "ספה 3 מושבים", "ספה לילדים", "ספה דו מושבית"];
            break;
        case "כיסאות":
            types = ["כסאות אוכל", "כסאות בר", "כסא משרדי", "כסא ילדים", "כסא חצר", "כסאות ים", "כסא לסלון", "כסא נדנדה"];
            break;
    }
    return types;
}

//get the details of the seller
async function getFullDetails(product, projection) {
    let sellerDetails = await users.findOne({ id: product.idSeller }, { projection: projection })
    product = {
        product, sellerDetails
    }
    return product;
}
module.exports = router
