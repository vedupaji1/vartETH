const express = require("express");
const ethers = require("ethers");
const mongoose = require("mongoose");
const userDataModel = require("../SignUp/userDataModel.js"); // Importing Collection Model
const router = express.Router();
const contractABI = require("../contract/contactABI.json")
const checkInfo = require("./checkInfo.js")
router.use(express.json()); // For Receiving Parsed Data In Post Request.
router.use(express.urlencoded({
    extended: true
}));

const filterRecords = (userRecords) => {
    return new Promise((res, req) => {
        let realRecord = [];
        for (let i = 0; i < userRecords.length; i++) {
            realRecord.push({
                addr: userRecords[i].addr,
                amount: userRecords[i].amount,
                time: userRecords[i].time,
                isReceived: userRecords[i].isReceived
            })
        }
        res(realRecord);
    })
}

router.post("/", (checkInfo), async (req, res) => {
    if (req.infoRes.isValid === true) {
        try { // Here We Has Created Provider, It Is Default Provider.
            // We Have To Replace It To Anther Provider Like "Infura" In Deployment.
            let provider = ethers.getDefaultProvider("ropsten");

            // Simply Wallet Is Created Using Private Key Of Existing Wallet, We Are Actually Creating Instance.
            let wallet;
            if (req.infoRes.isPassword === true) {
                wallet = await ethers.Wallet.fromEncryptedJson(JSON.parse(req.infoRes.walletData), req.body.password); // Decrypting Wallet
            } else {
                wallet = new ethers.Wallet(req.body.password);
            }
            let signer = wallet.connect(provider) // Connected Wallet To Provider.

            // Here We Are Just Interacting To Contract Using Contract Hash, ABI, And Signer.
            let contract = new ethers.Contract('0x5149609a8e02B4A86D52249C58811C202972a546', contractABI.abi, signer)

            // console.log(await contract.myAddress()) // Just Using Methods Of Contract, This Is Become Possible Just Because Of Contract Instance. We Can Also Get Address Of User By Another Ways Like " wallet.address".
            console.log(ethers.utils.formatEther(await contract.showBalance()))

            let transactionData = await contract.sendMoney(req.body.to, {
                value: req.body.amount
            })
            //console.log(transactionData) // When We Do Any Transaction So We Gets Response In Object Form, It Contains Whole Data Of Transaction.
            console.log(await transactionData.wait()); // In Transaction Response We Gets One Method Called "wait()", Basically It Provides Promise And Its Promise Resolves When Block Is Mined And Actually Transaction Completes.

            let tempUserRecords = await contract.myRecords();
            console.log(tempUserRecords)
            let userRecords = await filterRecords(tempUserRecords);
            console.log(userRecords);

            await userDataModel.findOneAndUpdate({
                _id: req.infoRes.id
            }, {
                transactions: userRecords
            }, null);

            await userDataModel.findOneAndUpdate({
                address: req.body.to
            }, {
                $push: {
                    transactions: {
                        addr: wallet.address,
                        amount: userRecords[userRecords.length - 1].amount,
                        time: userRecords[userRecords.length - 1].time,
                        isReceived: true
                    }
                }
            }, null);

            // When Transaction Will Complete, Response Will Send.
            res.status(200).json({
                isDone: true,
                message: "Transaction Completed"
            });
        } catch (error) {
            console.log(error)
            //res.clearCookie('ses');
            res.status(200).json({
                isDone: false,
                message: "Something Went Wrong, Transaction Failed"
            });
        }
    } else {
        res.status(200).json({
            isDone: false,
            message: req.infoRes.message
        });
    }
})


// {
//     "address": "0xeb2fcbfC0e0A00F685Bf5De8Ea1B76FA3B3c614A",
//     "privateKey": "0x05195bf86b8f19f5a88e450aa78fb7c1763934b0d413a06369980a6136e95a4e",
//     "mnemonics": {
//       "phrase": "snake vivid drift destroy list busy assist bridge raccoon target wire rate",
//       "path": "m/44'/60'/0'/0/0",
//       "locale": "en"
//     }
//   }

// {
//     "authData":"www.panchalvedant1@gmail.com",
//     "password":"12345678"
// }

// {
//     "address": "0xF3Ba6F9458aed480C7C3cfcabD83A5C5680E88d7",
//     "privateKey": "0xd9d9cb1e322d89c30956f7683d525f58938045715ffb2e7ebb90690ddd425d11",
//     "mnemonics": {
//       "phrase": "wire over shrug balcony hello wing hip dwarf endorse story tomorrow gaze",
//       "path": "m/44'/60'/0'/0/0",
//       "locale": "en"
//     },
//     "message": "Sign Up Done"
//   }
module.exports = router;