const express = require("express");
const ethers = require("ethers");
const mongoose = require("mongoose");
const userDataModel = require("./SignUp/userDataModel.js"); // Importing Collection Model

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let provider = ethers.getDefaultProvider("ropsten");
        console.log(await provider.getBlock(req.body.blockNumber));

        let realUserData = {
            addr: req.body.data.addr,
            amount: {
                _hex: req.body.data.amount.hex,
                _isBigNumber: true
            },
            time: {
                _hex: req.body.data.time.hex,
                _isBigNumber: true
            },
            isReceived: true
        }
        console.log(realUserData);
        console.log(await userDataModel.findOneAndUpdate({
            address: req.body.address
        }, {
            $push: {
                transactions: realUserData
            }
        }, null));

        res.json({
            isDone: true,
            message: "Done"
        });
    } catch (error) {
        res.json({
            isDone: false,
            message: "Something Went Wrong"
        });
    }
})

module.exports = router;