const express = require("express");
const jwt = require("jsonwebtoken");
const privateKey = require("./SignUp/privateKey.js");
const router = express.Router();

router.get("/", async (req, res) => {
    let sesData = req.cookies.ses;
    try {
        let data = jwt.verify(sesData.token, privateKey);
        console.log(data); // We Will Be Getting Payload Or Data Which We Has Provide At Time Of Token Creation
        res.json({
            message: true
        });
    } catch (error) {
        res.json({
            message: false
        });
    }
})
module.exports = router;