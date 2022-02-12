const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ethers = require("ethers");
const userDataModel = require("./SignUp/userDataModel.js"); // Importing Collection Model
const privateKey = require("./SignUp/privateKey.js");

router.get("/", async (req, res) => {
    try {
        let sesData = req.cookies.ses;
        let data = jwt.verify(sesData.token, privateKey);
        console.log(data); // We Will Be Getting Payload Or Data Which We Has Provide At Time Of Token Creation
        let userData = await userDataModel.findOne({
            _id: data.id
        });
        //console.log(userData);
        let userBalance;
        try {
            let provider = ethers.getDefaultProvider("ropsten");
            userBalance = ethers.utils.formatEther(await provider.getBalance(userData.address));
            //console.log(ethers.utils.formatEther(userData.records[0][2]._hex))
            res.json({
                message: true,
                data: {
                    userName: userData.userName,
                    email: userData.email,
                    address: userData.address,
                    balance: userBalance,
                    transactions: userData.transactions
                }
            });
        } catch (error) {
            console.log(error);
            res.clearCookie('ses');
            res.json({
                message: false
            });
        }
    } catch (error) {
        console.log(error)
        res.clearCookie('ses');
        res.json({
            message: false
        });
    }
})
module.exports = router;