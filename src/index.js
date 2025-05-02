// Imports
const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
let http = require("http");
const path = require('path');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const generatePubSub = require("./modules/middleware/pubsub.js")
const generateMiddleware = require("./modules/middleware/middleware.js")
const generateMailerSender = require("./modules/database/mailerSender.js")
const generateFileManager = require("./modules/database/fileManager.js")
const generateDatabase = require("./modules/database/database.js")
const generateEncrypter = require("./modules/businessLogic/encrypter.js")

// Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(process.cwd(), "public")));
app.use("/docs", express.static(path.join(process.cwd(), "docs")));
app.use("/node_modules", express.static(path.join(process.cwd(), "node_modules")));
app.use("/assets", express.static(path.join(process.cwd(), "assets")));

// Declarations & Initializations
const server = http.createServer(app);
const io = new Server(server);
const pubsub = generatePubSub();
const middleware = generateMiddleware(pubsub);
//const mailer = generateMailerSender(pubsub);
const fileManager = generateFileManager(pubsub);
const database = generateDatabase(pubsub);
const encrypter = generateEncrypter(pubsub);
const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "config.json")));
config.database.ssl.ca = fs.readFileSync(path.join(process.cwd(), "ca.pem"));

// Start Server
server.listen(5500, () => {
    console.log("- server running");
});

// Sockets
io.on('connection', (socket) => {
    console.log("Socket Connected: " + socket.id);

    socket.on("register", async (values) => {
        const res = await middleware.register(values.email, values.username, uuidv4())
        socket.emit("register", res);
    } );

    socket.on("disconnect", () => {
        console.log("socket disconnected: " + socket.id);
    });
});

// PubSub 
pubsub.subscribe("databaseRegisterAccount", async (data) => {
    try{
        const psw = encrypter.encrypt(data.password);
        await database.registerUser(data.email, psw.hash, psw.salt, data.username);
        await mailer.sendMail(data.email, "Welcome to MindSharing", `Welcome to MindSharing, your account has been created successfully!\nHere is your password ${data.password}`);
        return "Account created successfully";
    }
    catch(err){
        console.error(err);
        return `Error creating account: ${err}`;
    }
});