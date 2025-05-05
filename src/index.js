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
const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "config.json")));
config.database.ssl.ca = fs.readFileSync(path.join(process.cwd(), "ca.pem"));
const server = http.createServer(app);
const io = new Server(server);
const pubsub = generatePubSub();
const middleware = generateMiddleware(pubsub);
const mailer = generateMailerSender(config.mail);
const fileManager = generateFileManager(pubsub);
const database = generateDatabase(pubsub);
const encrypter = generateEncrypter(pubsub);

// Start Server
server.listen(5500, () => {
    console.log("- server running");
});

// Sockets
io.on('connection', (socket) => {
    console.log("Socket Connected: " + socket.id);

    // Account
    socket.on("register", async (values) => {
        const res = await middleware.register(values.email, values.username, uuidv4())
        socket.emit("register", res);
    });

    socket.on("login", async (values) => {
        const res = await middleware.login(values.email, values.password);
        socket.emit("login", res);
    });

    socket.on("changeUsername", async (values) => {
        const res = await middleware.changeUsername(values.email, values.username);
        socket.emit("changeUsername", res);
    });

    socket.on("changePassword", async (values) => {
        const res = await middleware.changePassword(values.email, values.password);
        socket.emit("changePassword", res);
    });

    socket.on("changeThumbnail", async (values) => {
        const res = await middleware.changeThumbnail(values.img, values.email);
        socket.emit("changeThumbnail", res);
    });

    socket.on("changeBio", async (values) => {
        const res = await middleware.changeBio(values.bio, values.email);
        socket.emit("changeBio", res);
    });

    socket.on("deleteAccount", async (values) => {
        const res = await middleware.deleteAccount(values.email);
        socket.emit("deleteAccount", res);
    });

    socket.on("getProfile", async (values) => {
        const res = await middleware.getProfile(values.username);
        socket.emit("getProfile", res);
    });

    socket.on("followAccount", async (values) => {
        const res = await middleware.followAccount(values.email, values.username);
        socket.emit("followAccount", res);
    });

    socket.on("unfollowAccount", async (values) => {
        const res = await middleware.unfollowAccount(values.email, values.username);
        socket.emit("unfollowAccount", res);
    });

    socket.on("disconnect", () => console.log("socket disconnected: " + socket.id));
});

/* PubSub */
// Account
pubsub.subscribe("databaseRegisterAccount", async (data) => {
    try {
        const psw = encrypter.encrypt(data.password);
        await database.registerUser(data.email, psw.hash, psw.salt, data.username);
        await mailer.send(data.email, "Welcome! Here Are Your Login Credentials", `Hi ${data.username},

Welcome to MindSharing!
Your account has been created and you're ready to get started.

Here are your login credentials:

Email: ${data.email}
Password: ${data.password}

For your security, please change your password upon first login.

You can access your account here:
👉 https://www.mind-sharing.com/login

If you did not request this account, please disregard this email.

Thanks and welcome aboard!
The MindSharing Team`);
        return "Account created successfully";
    }
    catch (err) {
        console.error(err);
        return `Error creating account: ${err}`;
    }
});
pubsub.subscribe("databaseLoginAccount", async (data) => {
    try {
        const res = await database.loginUser(data.email);
        return encrypter.check(data.password, res.password, res.salt) ? res : "Credentials are incorrect!";
    }
    catch (err) {
        console.error(err);
        return `Error logging in: ${err}`;
    }
});
pubsub.subscribe("databaseChangeUsername", async (data) => {
    try {
        await database.updateUserUsername(data.email, data.username);
        return "Username changed successfully";
    }
    catch (err) {
        console.error(err);
        return `Error changing username: ${err}`;
    }
});
pubsub.subscribe("databaseChangePassword", async (data) => {
    try {
        const psw = encrypter.encrypt(data.password);
        await database.updateUserPassword(data.email, psw.hash, psw.salt);
        return "Password changed successfully";
    }
    catch (err) {
        console.error(err);
        return `Error changing password: ${err}`;
    }
});
pubsub.subscribe("databaseChangeThumbnail", async (data) => {
    try {
        const thumbnail = fileManager.saveImage(data.thumbnail, `${uuidv4()}.png`); //estensione ? 
        await database.updateUserThumbnail(data.email, thumbnail);
        return "Thumbnail changed successfully";
    }
    catch (err) {
        console.error(err);
        return `Error changing thumbnail: ${err}`;
    }
});
pubsub.subscribe("databaseChangeBio", async (data) => {
    try {
        await database.updateUserBio(data.email, data.bio);
        return "Bio changed successfully";
    }
    catch (err) {
        console.error(err);
        return `Error changing bio: ${err}`;
    }
});
pubsub.subscribe("databaseDeleteAccount", async (data) => {
    try {
        await database.deleteUser(data.email);
        return "Account deleted successfully";
    }
    catch (err) {
        console.error(err);
        return `Error deleting account: ${err}`;
    }
});
pubsub.subscribe("databaseFindUser", async (data) => {
    try {
        const res = await database.getUser(data.username);
        return res;
    }
    catch (err) {
        console.error(err);
        return `Error finding user: ${err}`;
    }
});
pubsub.subscribe("databaseFollowUser", async (data) => {
    try {
        await database.followUser(data.email, data.username);
        return "Followed user successfully";
    }
    catch (err) {
        console.error(err);
        return `Error following user: ${err}`;
    }
});
pubsub.subscribe("databaseUnfollowUser", async (data) => {
    try {
        await database.unfollowUser(data.email, data.username);
        return "Unfollowed user successfully";
    }
    catch (err) {
        console.error(err);
        return `Error unfollowing user: ${err}`;
    }
});