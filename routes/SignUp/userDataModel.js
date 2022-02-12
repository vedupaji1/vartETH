const mongoose = require("mongoose");

let userDataModel = mongoose.model("userAccountData", { // Created Model
    userName: String,
    email: String,
    address: String,
    walletData: String,
    transactions: []
})

module.exports = userDataModel;