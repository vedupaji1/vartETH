const ethers = require("ethers");
const mongoose = require("mongoose");
const userDataModel = require("../SignUp/userDataModel.js"); // Importing Collection Model

const checkInfo = async (req, res, next) => {
    const authData = req.body.authData;

    if (ethers.utils.isAddress(authData) === true) {
        req.infoRes = {
            resData: await userDataModel.findOne({
                address: authData
            }),
            isValid: true
        }
    } else if (authData.indexOf("@") !== -1) {
        req.infoRes = {
            resData: await userDataModel.findOne({
                email: authData
            }),
            isValid: true
        }
    } else if (authData.length < 35) {
        req.infoRes = {
            resData: await userDataModel.findOne({
                userName: authData
            }),
            isValid: true
        }
    } else {
        req.infoRes = {
            isValid: false
        }
    }
    next();
    return;
}

module.exports = checkInfo;