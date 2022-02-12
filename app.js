const express = require("express");
const app = express();
const http = require("http").createServer(app);
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const io = require("socket.io")(http, {
    cors: { // Because Of This Cors Problem In Socket.io Solves, Visit "https://www.educative.io/edpresso/how-to-fix-socketio-cors-error-in-react-with-node" For More Information.
        origin: "*"
    }
});

// This Is Used From Removing Cors Problem.
/*const cors = require('cors');
app.use(cors({
    // Remove It In Deployment, Actually It Removes Cookie Cors Problem.
    // Visit "https://blog.webdevsimplified.com/2021-05/cors/" For Info.
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}))*/

app.use(express.json()); // For Receiving Parsed Data In Post Request.
app.use(express.urlencoded({
    extended: true
}));

// For Creating Cookie, Visit "https://www.section.io/engineering-education/what-are-cookies-nodejs/" For More Info
const cookieParser = require('cookie-parser'); // Actually It Is Used For Parsing Cookie Data
app.use(cookieParser());

// For Session Management, Visit "https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/" For More Info
const sessions = require('express-session')
const thirtyMin = 1000 * 60 * 30;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: {
        maxAge: thirtyMin
    },
    resave: false
}));

// Visit "https://mongoosejs.com/docs/index.html" For Understanding Of Mongoose.
const databaseURL = "mongodb+srv://vartETH:8490856735@cluster0.lihpa.mongodb.net/userData?retryWrites=true&w=majority";
mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log("Done");
}).catch((err) => {
    console.log(err)
    console.log("Sorry");
})

const signup = require("./routes/SignUp/signup.js"); // Importing Exported File For Routing.
app.use("/signup", signup); // Using File For Routing With Middleware, Once Check Imported File For More Info.

const sendETH = require("./routes/SendETH/sendETH.js"); // It Will Send Eth.
app.use("/sendETH", sendETH);

const isLogin = require("./routes/isLogin.js");
app.use("/isLogin", isLogin); // It Will Tell That Whether User Already Login Or Not By Checking Cookies. 

const logout = require("./routes/logout.js");
app.use("/logout", logout); // It Is Used For Logout, Actually This Will Just Clear Cookie. 

const login = require("./routes/Login/login.js");
app.use("/login", login);

const getInfo = require("./routes/getInfo.js");
app.use("/getInfo", getInfo);

const storeReceiverData = require("./routes/storeReceiverData.js");
app.use("/storeReceiverData", storeReceiverData);

const port = process.env.PORT || 8000;

// Basically This Is One Type Of Global Middleware Who Will Execute Before Every Route, Middleware Is A Function Which Is Used For Executing Code Before Any Route.
// Visit "https://devdocs.io/express/guide/using-middleware" or "https://www.youtube.com/watch?v=lY6icfhap2o" For Knowing More About Middleware
// It Will Parse Data Into JSON.
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, "client/dist")));

app.get("/*", function (_, res) {
    res.sendFile(
        path.join(__dirname, "./client/dist/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

http.listen(port, () => {
    console.log("Ok")
})

io.on('connection', (socket) => {
    console.log("Connected Done Using Sockets");
    socket.emit("temp", "Hello Guys")
    socket.on("tempMessage", data => {
        console.log(data)
    })
})
