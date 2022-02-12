const express = require("express");
const ethers = require("ethers");
const router = express.Router();
const jwt = require("jsonwebtoken");
const privateKey = require("../SignUp/privateKey.js");
const checkInfo = require("./checkInfo.js");

router.post("/", (checkInfo), async (req, res) => {
    if (req.infoRes.isValid === true) {
        let userData = req.infoRes.resData; // Receiving Details Of User From Middleware, If User Will Exists So "userData" Will Not Null.
        if (userData !== null) {
            try {
                // Here We Will Try To Make Wallet From Encrypted JSON Using Password, This Password Would Set By User At Time Of SignUp.
                // If There Will Be Any Error So It Means Password Is Incorrect And Then We Will Try To Create Wallet By Considering Them As Private Key.
                // If There Will Not Any Error So It Means Wallet Is Created And Then Login Will Be Successful.
                let decryptWallet = await ethers.Wallet.fromEncryptedJson(JSON.parse(userData.walletData), req.body.password); // Decrypting Wallet
                console.log(decryptWallet);
                let token = jwt.sign({ // Creating JWT Token 
                    id: userData.id
                }, privateKey)
                res.cookie(`ses`, { // Creating Cookie, Visit "https://www.section.io/engineering-education/what-are-cookies-nodejs/" For More Info.
                    token: token
                }, {
                    expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
                    httpOnly: true
                })
                res.json({
                    isValid: true,
                    message: "Valid Details"
                });
            } catch (error) {
                try {
                    // If We Face Any Error In Try Statement Because Of Invalid Password So, Here Wallet Will Be Created By Considering Password As Private Key.
                    let decryptWallet = new ethers.Wallet(req.body.password);
                    if (decryptWallet.address === userData.address) { // It Is Checked That Is Created Wallet Is Of User, By Comparing Wallet Address With User Address Which Is Stored In Database.
                        let token = jwt.sign({ // Creating JWT Token 
                            id: userId
                        }, privateKey)
                        res.cookie(`ses`, { // Creating Cookie, Visit "https://www.section.io/engineering-education/what-are-cookies-nodejs/" For More Info.
                            token: token
                        }, {
                            expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
                            httpOnly: true
                        })
                        res.json({
                            isValid: true,
                            message: "Valid Details"
                        });
                    } else {
                        res.json({
                            isValid: false,
                            message: "Invalid Private Key"
                        });
                    }
                } catch (error) {
                    res.json({
                        isValid: false,
                        message: "Invalid Password"
                    });
                }
            }
        } else {
            res.json({
                isValid: false,
                message: "Details Not Exists"
            });
        }
    } else {
        res.json({
            isValid: false,
            message: "Invalid Details"
        });
    }
})

module.exports = router;
/*
{
    "email":"www.panchalvedant1@gmail.com",
    "userName":"vedupaji",
    "password":"12345678"
}

{
    "address": "0xbf4288d8171F8F3CdEb82381B922d6DEBe6d4751",
    "privateKey": "0xb4a63007337d68f0dd2f2940e5a7aba9abdeba7ffadb344237dd8bb0ad382330",
    "mnemonics": {
      "phrase": "crime island surprise modify grow name curious brick pill seminar chuckle giant",
      "path": "m/44'/60'/0'/0/0",
      "locale": "en"
    },
    "message": "Sign Up Done"
  }
  */