

function isValidId(data) {
    let counter = 0;
    for (let i = 0; i < data.length; i++) {
        let newNumber = Number(data[i]) * ((i % 2) + 1);
        newNumber = (newNumber < 10) ? newNumber : newNumber - 9;
        counter += newNumber;
    }
    if (counter % 10 !== 0) return false;
    return true;
}

export function validId(data) {

    if (data === "") {
        return "שדה נדרש";
    }
    if (isNaN(data)) {
        return "לא מספר";

    }

    if (data.length !== 9) {
        return "צריך 9 ספרות";

    }

    if (!isValidId(data)) {
        return "תעודת הזהות אינה חוקית";

    }
    return "";
}

export function validMail(data) {

    const regExp = /\S+@\S+\.\S+/;

    if (data === "") {
        return "שדה נדרש";
    }

    if (!regExp.test(data)) {
        return "כתובת המייל אינה חוקית";

    }

    return "";
}


export function validName(data) {
    const regExp = /^([a-zA-Z\u0590-\u05fe ]{1,20})$/;
    if (data === "") {
        return "שדה נדרש";

    }
    if (!regExp.test(data)) {
        return "מותרות רק אותיות באנגלית או עיברית, עד 20 אותיות";
    }

    return "";
}


export function validNum(data, numDigits) {

    if (data === "") {
        return "שדה נדרש";
    }
    if (isNaN(data)) {
        return "לא מספר ";
    }

    if (numDigits[1] === "exactly" && data.length !== numDigits[0]) {
        return "לא חוקי, צריך בדיוק " + numDigits[0] + " ספרות";

    }
    else if (numDigits[1] === "upto" && data.length > numDigits[0]) {
        return "לא חוקי, צריך עד  " + numDigits[0] + " ספרות ";

    }

    return "";

}

export function validPhone(data) {
    return validNum(data, [10, "exactly"]);
}

export function validPassword(data) {
    const regExp = [/[^A-Za-z0-9]+/g, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/];

    if (data === "") {
        return "שדה נדרש";
    }

    if (data.length < 8) {
        return "סיסמה צריכה להכיל לפחות 8 תווים";

    }

    if (regExp[0].test(data)) {
        return "הסיסמה צריכה להכיל רק אותיות באנגלית או ספרות";

    }


    if (!regExp[1].test(data)) {
        return "הסיסמה צריכה להכיל לפחות אות אנגלית אחת ולפחות מספר אחד";
    }
    return "";
}

let tempPassword;
export function validPasswords(data, compName) {

    if (compName === "Password") {
        //Saves the password to compare with it the verify password 
        tempPassword = data;
        return validPassword(data);
    }

    else {
        if (data === "") return "שדה נדרש";
        if (data !== tempPassword) {
            return "הסיסמאות אינם זהות";
        }
        return "";
    }
}


export function validUserPassword(data, f) {
    f(data, "password");
    return validPassword(data);
}

export function validUserId(data, f) {
    f(data, "Id");
    return validId(data);
}

//https://www.w3resource.com/javascript/form/credit-card-validation.php
function isCreditCard(creditCard) {
    let cardno1 = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    let cardno2 = /^(?:3[47][0-9]{13})$/;
    let cardno3 = /^(?:5[1-5][0-9]{14})$/;
    if (creditCard.match(cardno1) || creditCard.match(cardno2) || creditCard.match(cardno3)) {
        return true;
    }
    else {

        return false;
    }
}

export function validCreditCard(creditNumber) {
    if (isCreditCard(creditNumber)) return "";
    else return "מספר אשראי אינו חוקי";
}

export function validYear(year) {
    let regExp = '^[0-9]{2}$';
    if (year.match(regExp) && Number(year) > 20) return "";
    else return "שנה לא חוקית";
}

export function validMonth(month) {
    let regExp = '^[0-9]{2}$';
    if (month.match(regExp) && Number(month) < 13 && Number(month) > 0) return "";
    else return "חודש לא חוקי";
}

export function valid3Digit(digits) {
    let regExp = '^[0-9]{3}$';
    if (digits.match(regExp)) return "";
    else return "3 ספרות לא חוקיות";
}

export function validAccount(data) {
    return validNum(data, [6, "exactly"]);
}

export function validBankBranch(data) {
    return validNum(data, [2, "upto"]);
}
