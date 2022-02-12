const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const ethers = require("ethers");
const userDataModel = require("../SignUp/userDataModel.js"); // Importing Collection Model
const privateKey = require("../SignUp/privateKey.js");



// Large Amount Of Code f This File Is Similar To "Login/login.js" File, Check That File For Better Understanding Of This File Code.
const checkInfo = async (req, res, next) => {
    if (req.cookies.ses !== undefined) {
        let authData;
        try {
            let data = jwt.verify(req.cookies.ses.token, privateKey);
            console.log(data); // We Will Be Getting Payload Or Data Which We Has Provide At Time Of Token Creation
            authData = data.id;
        } catch (error) {
            req.infoRes = {
                isValid: false,
                message: "Cookies Are Modified"
            }
            next();
            return;
        }
        let userData = await userDataModel.findOne({
            _id: authData
        })

        if (userData !== null) {
            try {
                let decryptedWallet = await ethers.Wallet.fromEncryptedJson(JSON.parse(userData.walletData), req.body.password); // Decrypting Wallet
                console.log(decryptedWallet);
                req.infoRes = {
                    isValid: true,
                    isPassword: true,
                    walletData: userData.walletData,
                    id: userData.id,
                    message: "Done"
                }
                next();
                return;
            } catch (error) {
                try {
                    let decryptedWallet = new ethers.Wallet(req.body.password);
                    if (decryptedWallet.address === userData.address) {
                        req.infoRes = {
                            isValid: true,
                            isPassword: false,
                            id: userData.id,
                            message: "Done"
                        }
                        next();
                        return;
                    } else {
                        req.infoRes = {
                            isValid: false,
                            message: "Invalid Private Key"
                        }
                        next();
                        return;
                    }
                } catch (error) {
                    console.log(error)
                    req.infoRes = {
                        isValid: false,
                        message: "Invalid Password"
                    }
                    next();
                    return;
                }
            }
        } else {
            req.infoRes = {
                isValid: false,
                message: "Something Went Wrong, Details Not Exists"
            }
            next();
            return;
        }
    } else {
        req.infoRes = {
            isValid: false,
            message: "Cookies Are Not Available"
        }
        next();
        return;
    }

}

module.exports = checkInfo;