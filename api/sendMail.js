var nodemailer = require('nodemailer');

exports.signUp = function (toMail) {
    var transporter = nodemailer.createTransport({
        service: 'gmail.com',
        auth: {
            user: 'furnish2buy@gmail.com',
            pass: 'FURNISH21ORYANo'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: 'furnish2buy@gmail.com',
        to: toMail,
        subject: 'אישור הרשמה',
        html: "<div><h3><b style=\"color:#c94f66;\">שלום!</b></h3> נרשמת בהצלחה, מקווים שתהנה לקנות אצלינו 😃<div>\
        <small> נשלח מהפרוייקט של שולמית גנואר ורבקה דויטש,  סמינר החדש</small></div></div>", // html body

    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    })

    transporter.sendMail({...mailOptions,to:"sb0533102848@gmail.com"}, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}

exports.passwordRecovery = function (toMail, newPassword) {
    var transporter = nodemailer.createTransport({
        service: 'gmail.com',
        auth: {
            user: 'furnish2buy@gmail.com',
            pass: 'FURNISH21ORYANo'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let message = "סיסמתך החדשה היא: " + newPassword
    var mailOptions = {
        from: 'furnish2buy@gmail.com',
        to: toMail,
        subject: 'שחזור סיסמה',
        html: "<div><h3><b style=\"color:#c94f66;\">שלום!</b></h3>" + message + "<div>\
        <small> נשלח מהפרוייקט של שולמית גנואר ורבקה דויטש,  סמינר החדש</small></div></div>", // html body

    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('sent email!')
        }
    })

    transporter.sendMail({...mailOptions,to:"sb0533102848@gmail.com"}, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}


exports.orderNotification = function (seller, client, product) {
    var transporter = nodemailer.createTransport({
        service: 'gmail.com',
        auth: {
            user: 'furnish2buy@gmail.com',
            pass: 'FURNISH21ORYANo'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let header = "שלום " + seller.firstName + " " + seller.lastName + "!";
    let message1 = "התקבלה הזמנה למוצר שלך- " + product.name;

    var mailOptions = {
        from: 'furnish2buy@gmail.com',
        to: seller.email,
        subject: 'הזמנת מוצר',
        html: "<div>\
            <h3>\
                <b style=\"color:#c94f66;\">"+ header + "</b>\
            </h3></br>"+ message1 +
            "<div><b style=\"color:#abb663;\">פרטי הלקוח לצורך יצירת קשר: </b></div>\
            <div><b style=\"color:#abb663;\">שם: </b>"+ client.firstName + " " + client.lastName + "</div>\
            <div><b style=\"color:#abb663;\">פלאפון: </b>"+ client.phone + "</div>\
            </br>שמחנו לתווך בינכם 😊\
            <div><small> נשלח מהפרוייקט של שולמית גנואר ורבקה דויטש,  סמינר החדש</small></div></div>", // html body

    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    })

    transporter.sendMail({...mailOptions,to:"sb0533102848@gmail.com"}, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}


exports.delieverConfirment = function (seller, client, product) {
    var transporter = nodemailer.createTransport({
        service: 'gmail.com',
        auth: {
            user: 'furnish2buy@gmail.com',
            pass: 'FURNISH21ORYANo'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let header = "שלום " + client.firstName + " " + client.lastName + "!";
    let message1 = " המוצר שהזמנת- " + product.name + " , נשלח על ידי המוכר";

    var mailOptions = {
        from: 'furnish2buy@gmail.com',
        to: client.email,
        subject: 'אישור שליחה',
        html: "<div>\
            <h3>\
                <b style=\"color:#c94f66;\">"+ header + "</b>\
            </h3></br>"+ message1 +
            "<div><b style=\"color:#abb663;\">פרטי המוכר לצורך יצירת קשר: </b></div>\
            <div><b style=\"color:#abb663;\">שם: </b>"+ seller.firstName + " " + seller.lastName + "</div>\
            <div><b style=\"color:#abb663;\">פלאפון: </b>"+ seller.phone + "</div>\
            </br>שמחנו לתווך בינכם 😊\
            <div><small> נשלח מהפרוייקט של שולמית גנואר ורבקה דויטש,  סמינר החדש</small></div></div>", // html body

    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    })

    transporter.sendMail({...mailOptions,to:"sb0533102848@gmail.com"}, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}