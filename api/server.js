let express = require('express');
let app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let server = app.listen(27017, function () {
    console.log("success");
});



const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:4444',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use('/users', require("./users"));
app.use('/products', require("./products"));
app.use('/orders', require("./orders"));
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});