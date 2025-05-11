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
app.use("/dist", express.static(path.join(process.cwd(), "dist")));

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
database.setup(config.database);
const encrypter = generateEncrypter(pubsub);
let users = [];

// Start Server
server.listen(5500, () => {
    console.log("- server running");
});

// Sockets
io.on('connection', (socket) => {
    console.log("Socket Connected: " + socket.id);

    socket.on("connect_", (values) => {
        socket.emit("connect_", {response: users.filter(user => user.token === values.token)});
    });

    // Account
    socket.on("register", async (values) => {
        const res = await middleware.register(values.email, values.username, uuidv4())
        socket.emit("register", res);
    });

    socket.on("login", async (values) => {
        const res = await middleware.login(values.email, values.password, values.token);
        socket.emit("login", res);
    });

    socket.on("changeUsername", async (values) => {
        const res = await middleware.changeUsername(values.email, values.username);
        socket.emit("changeUsername", res);
    });

    socket.on("changePassword", async (values) => {
        const res = await middleware.changePassword(values.email, values.oldPassword, values.newPassword);
        socket.emit("changePassword", res);
    });

    socket.on("changeThumbnail", async (values) => {
        const res = await middleware.changeThumbnail(values.fileName, values.fileData, values.email);
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

    socket.on("checkFollow", async ({me, user}) => {
        const res = await middleware.checkFollow(me, user);
        socket.emit("checkFollow", res);
    })

    socket.on("getUserPublicData", async (values) => {
        const [followers] = await middleware.getFollowers(values);
        const [follows] = await middleware.getFollows(values);
        const [posts] = await middleware.getDocByAuthor(values);
        if(followers?.error || follows?.error || posts?.error) {
            socket.emit("public-data", {response: { followers: [], follows: [], posts: [] }});
            return;
        }
        socket.emit("public-data", {response: { followers: followers.response, follows: follows.response, posts: posts.response }});
    });

    // Follow
    socket.on("followAccount", async (values) => {
        const res = await middleware.followAccount(values.email, values.username);
        socket.emit("followAccount", res);
    });

    socket.on("unfollowAccount", async (values) => {
        const res = await middleware.unfollowAccount(values.email, values.username);
        socket.emit("unfollowAccount", res);
    });

    socket.on("getFollowers", async (values) => {
        const res = await middleware.getFollowers(values.username);
        socket.emit("getFollowers", res);
    });

    socket.on("getFollows", async (values) => {
        const res = await middleware.getFollows(values.username);
        socket.emit("getFollows", res);
    });

    // Document
    socket.on("createDocument", async (values) => {
        const res = await middleware.createDocument(values.email);
        socket.emit("createDocument", res)
    });

    socket.on("importDocument", async (values) => {
        const res = await middleware.importDocument(values.fileName, values.fileData, values.author_email);
        socket.emit("importDocument", res);
    });

    socket.on("saveDocument", async (values) => {
        const res = await middleware.saveDocument(values.path_note, values.text, values.author_email);
        socket.emit("saveDocument", res);
    });

    socket.on("deleteDocument", async (values) => {
        const res = await middleware.deleteDocument(values.id);
        socket.emit("deleteDocument", res);
    });

    socket.on("getDocumentByAuthor", async (values) => {
        const res = await middleware.getDocByAuthor(values.username);
        socket.emit("getDocumentByAuthor", res);
    });

    socket.on("exportDocument", async (values) => {
        const res = await middleware.exportDocument(values.path_note, values.format, values.text);
        socket.emit("exportDocument", res);
    });

    socket.on("changeVisibility", async (values) => {
        const res = await middleware.changeVisibility(values.id, values.visibility);
        socket.emit("changeVisibility", res);
    });

    socket.on("getDocumentByPath", async (values) => {
        const res = await middleware.getDocument(values.path_note);
        socket.emit("getDocumentByPath", res);
    });

    socket.on("getFollowDocuments", async (values) => {
        const res = await middleware.getFollowDocuments(values.email);
        socket.emit("getFollowDocuments", res);
    });

    socket.on("getDocumentText", async (values) => {
        const res = await middleware.getDocumentText(values.path_note);
        socket.emit("getDocumentText", res);
    });

    // Tag
    socket.on("createTag", async (values) => {
        const res = await middleware.createTag(values.tag);
        socket.emit("createTag", res);
    });
    socket.on("getDocTag", async (values) =>{
        console.log(values);
        const res = await middleware.getDocTag(values.tag);
        console.log(res);
        socket.emit("getDocTag", res);
    });

    // Feedback
    socket.on("giveFeedback", async (values) => {
        const res = await middleware.giveFeedback(values.id, values.author_email, values.star);
        socket.emit("giveFeedback", res);
    });

    socket.on("disconnect", () => console.log("socket disconnected: " + socket.id));
});

/* PubSub */
// Account
pubsub.subscribe("databaseRegisterAccount", async (data) => {
    try {
        const psw = encrypter.encrypt(data.password);
        await database.registerUser(data.email, psw.hash, psw.salt, data.username);
        await mailer.send(data.email, "Benvenuto! Ecco le tue credenziali di accesso", `Ciao ${data.username},

Benvenuto su MindSharing!
Il tuo account è stato creato ed è pronto per essere utilizzato.

Ecco le tua password: ${data.password}

Per la tua sicurezza, ti consigliamo di cambiare la password al primo accesso.

Se non hai richiesto questo account, ignora semplicemente questa email.

Grazie e benvenuto a bordo!
Il Team di MindSharing`);
        return { response: "Account created successfully" };
    }
    catch (err) {
        return { error: `Error creating account: ${err}` };
    }
});
pubsub.subscribe("databaseLoginAccount", async (data) => {
    try {
        const res = await database.loginUser(data.email);
        const { password, password_salt, ...user } = res;
        if (data.token) {
            users.push({ token: data.token, user: user });
        }
        return encrypter.check(data.password, res.password_salt, res.password) ? { response: user } : { error: "Credentials are incorrect!" };
    }
    catch (err) {
        return { error: `Error logging in: ${err}` };
    }
});
pubsub.subscribe("databaseChangeUsername", async (data) => {
    try {
        await database.updateUserUsername(data.email, data.username);
        return { response: "Username changed successfully" };
    }
    catch (err) {
        return { error: `Error changing username: ${err}` };
    }
});

pubsub.subscribe("checkFollow", async ({me, user}) => {
    try {
        const response = (await database.checkFollow(me, user)) || false;
        return { response: response };
    }
    catch (err) {
        return { error: `Error check follow: ${err}` };
    }
});

pubsub.subscribe("databaseChangePassword", async (data) => {
    try {
        const res = await database.loginUser(data.email);
        if(encrypter.check(data.oldPassword, res.password_salt, res.password)){
            const psw = encrypter.encrypt(data.newPassword);
            await database.updateUserPassword(data.email, psw.hash, psw.salt);
            return { response: "Password changed successfully" };
        }
        else return { error: "Old password is incorrect!" };
    }
    catch (err) {
        return { error: `Error changing password: ${err}` };
    }
});
pubsub.subscribe("databaseChangeThumbnail", async (data) => {
    try {
        const thumbnail = fileManager.saveImage(data.fileData, data.fileName);
        await database.updateUserThumbnail(data.email, thumbnail);
        return { response: thumbnail };
    }
    catch (err) {
        return { error: `Error changing thumbnail: ${err}` };
    }
});
pubsub.subscribe("databaseChangeBio", async (data) => {
    try {
        await database.updateUserBio(data.email, data.bio);
        return { response: "Bio changed successfully" };
    }
    catch (err) {
        return { error: `Error changing bio: ${err}` };
    }
});
pubsub.subscribe("databaseDeleteAccount", async (data) => {
    try {
        await database.deleteUser(data.email);
        return { response: "Account deleted successfully" };
    }
    catch (err) {
        return { error: `Error deleting account: ${err}` };
    }
});
pubsub.subscribe("databaseFindUser", async (data) => {
    try {
        const response = await database.getUser(data.username);
        return { response };
    }
    catch (err) {
        return { error: `Error finding user: ${err}` };
    }
});
// Follow
pubsub.subscribe("databaseFollowUser", async (data) => {
    try {
        await database.followUser(data.email, data.username);
        return { response: "Followed user successfully" };
    }
    catch (err) {
        return { error: `Error following user: ${err}` };
    }
});
pubsub.subscribe("databaseUnfollowUser", async (data) => {
    try {
        await database.unfollowUser(data.email, data.username);
        return { response: "Unfollowed user successfully" };
    }
    catch (err) {
        return { error: `Error unfollowing user: ${err}` };
    }
});
pubsub.subscribe("databaseGetFollowers", async (data) => {
    try {
        const response = await database.getFollowers(data.username);
        return { response };
    }
    catch (err) {
        return { error: `Error getting followers: ${err}` };
    }
});
pubsub.subscribe("databaseGetFollows", async (data) => {
    try {
        const response = await database.getFollows(data.username);
        return { response };
    }
    catch (err) {
        return { error: `Error getting follows: ${err}` };
    }
});
// Document
pubsub.subscribe("databaseCreateDocument", async (data) => {
    try {
        const path_note = `/dist/assets/md/${uuidv4()}.md`;
        await database.createNote(path_note, data.email);
        const response = await database.findNote(path_note);
        return { response };
    }
    catch (err) {
        return { error: "Error creating document " + err };
    }
});
pubsub.subscribe("databaseDeleteDocument", async (data) => {
    try {
        await database.deleteNote(data.id);
        return { response: "Document deleted successfully" };
    }
    catch (err) {
        return { error: "Error deleting document " + err };
    }
});
pubsub.subscribe("databaseImportDocument", async (data) => {
    try {
        const path_note = fileManager.saveWord(data.fileData, data.fileName);
        await database.createNote(path_note, data.author_email);
        const response = await database.findNote(path_note);
        response.text = await fileManager.importFromDocx(path_note);
        return { response };
    }
    catch (err) {
        return { error: "Error importing document " + err };
    }
});
pubsub.subscribe("databaseSaveDocument", async (data) => {
    try {
        let pathNote = path.basename(data.path_note);
        fileManager.saveInMd(data.text, pathNote);
        return { response: "Document saved successfully" };
    }
    catch (err) {
        return { error: "Error saving document " + err };
    }
});
pubsub.subscribe("databaseGetDocByAuthor", async (data) => {
    try {
        const response = await database.findNoteByUser(data.username);
        return { response };
    }
    catch (err) {
        return { error: "Error finding document " + err };
    }
});
pubsub.subscribe("databaseExportDocument", async (data) => {
    try {
        if (data.format == 'docx') {
            const response = await fileManager.saveInDocx(data.text, path.basename(data.path_note) + ".docx")
            return { response };
        }
        else if (data.format == 'pdf') {
            const response = await fileManager.saveInPdf(data.text, path.basename(data.path_note) + ".pdf");
            return { response };
        }
        else return { response: "Format not supported" };
    }
    catch (err) {
        return { error: "Error exporting document " + err };
    }
});
pubsub.subscribe("databaseChangeVisibility", async (data) => {
    try {
        await database.changeVisibility(data.id, data.visibility);
        return { response: "Visibility changed successfully" };
    }
    catch (err) {
        return { error: "Error changing visibility " + err };
    }
});
pubsub.subscribe("databaseGetDocument", async (data) => {
    try {
        const response = await database.findNote(data.path_note);
        response.text = fileManager.importFromMd(data.path_note);
        return { response };
    }
    catch (err) {
        return { error: "Error finding document " + err };
    }
});
pubsub.subscribe("databaseGetFollowDocuments", async (data) => {
    try {
        const response = await database.getFollowDocuments(data.email);
        return { response };
    }
    catch (err) {
        return { error: "Error finding documents " + err };
    }
});
pubsub.subscribe("fileGetDocumentText", async (data) => {
    try {
        const response = fileManager.importFromMd(data.path_note);
        return { response };
    }
    catch (err) {
        return { error: "Error finding documents " + err };
    }
});
// Tag
pubsub.subscribe("databaseCreateTag", async (data) => {
    try {
        await database.createTag(data.tag);
        return { response: "Tag created successfully" };
    }
    catch (err) {
        return { error: "Error creating tag " + err };
    }
});

pubsub.subscribe("databaseGetDocTag", async (data) => {
    try {
        const getDoc= await database.getDocTag(data.tag);
        return { response: getDoc };
    }
    catch (err) {
        return { error: "Error creating tag " + err };
    }
});
// Feedback
pubsub.subscribe("databaseGiveFeedback", async (data) => {
    try {
        console.log(data)
        await database.createFeedback(data.id, data.star, data.author_email );
        return { response: "Feedback created successfully" };
    }
    catch (err) {
        return { error: "Error giving feedback " + err };
    }
});