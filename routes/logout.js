const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Clearing Cookie, Visit "https://www.geeksforgeeks.org/express-js-res-clearcookie-function/" For More Info.
        // You Can Also Clear Cookie In Another Method, Visit "https://stackoverflow.com/questions/27978868/destroy-cookie-nodejs" For Knowing Them.
        res.clearCookie('ses');
        res.json({
            message: true
        });
    } catch (error) {
        res.json({
            message: true
        });
    }
})
module.exports = router;