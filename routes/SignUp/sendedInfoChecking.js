const mongoose = require("mongoose");
const userDataModel = require("./userDataModel.js"); // Importing Collection Model
// It Is One Type Of Middleware And Its Code Will First Execute And Password Checking Is Done Using This, Visit "https://devdocs.io/express/guide/using-middleware" or "https://www.youtube.com/watch?v=lY6icfhap2o" For Knowing More About Middleware
const isUserNameExists = async (userNameOp, emailOp) => {
    let message;
    try {
        let userData = await userDataModel.findOne({
            userName: userNameOp
        });
        let userData2 = await userDataModel.findOne({
            email: emailOp
        });
        if (userData !== null && userData2 !== null) {
            message = "UserName And Email Exists";
        } else if (userData !== null) {
            message = "UserName Already Exists";
        } else if (userData2 !== null) {
            message = "Email Already Exists";
        }
    } catch (error) {
        console.log(error)
    }
    return (message);
}

const checkingUserNameAndPassword = async (req, res, next) => {
    try {
        let password = req.body.password;
        let userName = req.body.userName;
        let email = req.body.email;
        if (password === "" || userName === "" || email === "") {
            req.sendedInfoChecking = {
                isValid: false,
                message: "Details Are Empty"
            }
            next();
            return;
        } else if (userName.length >= 35) {
            req.sendedInfoChecking = {
                isValid: false,
                message: "Username Is Too Large"
            }
            next();
            return;
        } else if (userName.indexOf("@") !== -1) {
            req.sendedInfoChecking = {
                isValid: false,
                message: "Username Should Not Have @"
            }
            next();
            return;
        } else if ((password.length < 8)) {
            req.sendedInfoChecking = {
                isValid: false,
                message: "Password Length Should Greater Than 8"
            }
            next();
            return;
        } else if ((((userName.length !== userName.replace(/ /g, '')).length) || ((password.replace(/ /g, '')).length < 8))) { // Visit "https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text" For More Info About How To Remove All Whitespace From String.
            if (((password.replace(/ /g, '')).length < 8)) {
                req.sendedInfoChecking = {
                    isValid: false,
                    message: "Password Should Not Contain White Space"
                }
                next();
                return;
            } else {
                req.sendedInfoChecking = {
                    isValid: false,
                    message: "Username Should Not Contain White Space"
                }
                next();
                return;
            }
        } else {
            let message = await isUserNameExists(userName, email);
            if (message) {
                req.sendedInfoChecking = {
                    isValid: false,
                    message: message
                }
                next();
                return;
            } else {
                req.sendedInfoChecking = {
                    isValid: true,
                    message: "Done"
                }
                next();
                return;
            }
        }
    } catch (error) {
        console.log(error)
        req.sendedInfoChecking = {
            isValid: false,
            message: "Bad Request, Something Went Wrong"
        }
        next();
        return;
    }
}

module.exports = checkingUserNameAndPassword;