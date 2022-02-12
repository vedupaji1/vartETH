const express = require("express");
const ethers = require("ethers");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const checkingUserNameAndPassword = require("./sendedInfoChecking.js") // It Is Middleware Of Router, It Will Check That Whether Sended Info Is Correct Or Not.
const userDataModel = require("./userDataModel.js"); // Importing Collection Model.
const privateKey = require("./privateKey.js");
const sendMail = require("../sendMail.js"); // Importing Function Which Will Send Mail.
// For Using Routing Feature Of Express Js. We Uses It For Reducing Complexity Of Code.
// Visit "https://www.tutorialspoint.com/expressjs/expressjs_routing.htm" Or "https://www.youtube.com/watch?v=rWE9v9ulu_0&list=PLp50dWW_m40Vruw9uKGNqySCNFLXK5YiO&index=8" For More Information.
const router = express.Router();

// Basically We Are Encrypting Ethereum Address Wallet For Storing Then In Database, So We At Time Of Authentication We Will Decrypt Them Using User Provide Password.
// If User Will Unable To Provide Password So We Will Take Private Key For Authentication
// Visit "https://docs.ethers.io/v4/api-wallet.html" For More Info
const callback = (progress) => {}
const encryptAndStoreWallet = (account, password, userName, email) => {
    return new Promise(async (res, rej) => {
        let Wallet = ethers.Wallet.fromMnemonic(account.mnemonic.phrase);
        let encryptedJson = await Wallet.encrypt(password, callback) // Encrypting Wallet
        console.log(encryptedJson);

        // Storing Address Of Account, Encrypted Wallet Json And Username In Database, Visit "https://mongoosejs.com/docs/models.html" For Understanding This Process.
        let userId;
        try {
            let userData = await userDataModel.create({ // Created Collection
                userName: userName,
                email: email,
                address: Wallet.address,
                walletData: JSON.stringify(encryptedJson),
                transactions: []
            })
            userId = userData._id;
        } catch (error) {
            userId = null;
            console.log(error)
        }

        // let decryptWallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password); // Decrypting Wallet
        // console.log(decryptWallet.address);
        res(userId);
    })
}

router.post("/emailValidation", async (req, res) => {
    let sesUserData = req.session.userTempData;

    console.log(sesUserData);
    if (sesUserData === undefined) {
        res.json({
            message: "Bad Request, Something Went Wong And Reenter Your Details."
        });
    } else {
        if (sesUserData.email === req.body.email) {
            if (sesUserData.otp === req.body.otp) {
                res.header("Access-Control-Allow-Headers", "*");
                res.header('Access-Control-Allow-Credentials', true);
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                let account = ethers.Wallet.createRandom();
                let userId = await encryptAndStoreWallet(account, sesUserData.password, sesUserData.userName, sesUserData.email);
                if (userId === null) {
                    res.json({
                        message: "Bad Request, Something Went Wong"
                    });
                } else {
                    let token = jwt.sign({ // Creating JWT Token 
                        id: userId
                    }, privateKey)

                    res.cookie(`ses`, { // Creating Cookie, Visit "https://www.section.io/engineering-education/what-are-cookies-nodejs/" For More Info.
                        token: token
                    }, {
                        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
                        httpOnly: true
                    })
                    console.log(req.cookies.ses)
                    req.session.destroy();
                    res.json({
                        address: account.address,
                        privateKey: account.privateKey,
                        mnemonics: account.mnemonic,
                        message: "Sign Up Done"
                    });
                }
            } else {
                res.json({
                    message: "Invalid OTP"
                });
            }
        } else {
            res.json({
                message: "Bad Request, Something Went Wong And Reenter Your Details."
            });
        }
    }
})

const createOTP = () => {
    return new Promise((res, rej) => {
        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        console.log(OTP)
        res(OTP);
    })

}

router.post("/", (checkingUserNameAndPassword), async (req, res) => {
    if (req.sendedInfoChecking.isValid === true) {
        let OTP = await createOTP();
        let isMailSend = await sendMail({
            to: req.body.email,
            subject: "OTP From VARt Eth",
            text: `${OTP}`
        });
        if (isMailSend === true) {
            req.session.userTempData = {
                email: req.body.email,
                userName: req.body.userName,
                password: req.body.password,
                otp: OTP
            }
            res.json({
                message: "Done",
                isValid: true
            });
        } else {
            res.json({
                message: "Invalid Mail Id"
            });
        }
    } else {
        res.json({
            message: req.sendedInfoChecking.message
        });
    }
})

/*{
    "email":"www.panchalvedant1@gmail.com",
    "username":"213315454564",
    "password":"gfdjffgjgfjd"
} */


// Exporting This Module Or File. In Nodejs We Can Export Any File Containing Functions Or Variables And Use Them By Importing Them In Any Other File.
// It Is Quite Similar To Components Which We Export And Use Them In Any Other Component By Importing.
// Visit "https://www.tutorialsteacher.com/nodejs/nodejs-module-exports" For More Information
module.exports = router;