const express = require("express");
const bodyParser = require('body-parser');
let http = require("http");
const path = require('path');
const app = express();
const fileManager = require("./components/fileManager");
const fm = fileManager();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(process.cwd(), "public")));
app.use("/docs", express.static(path.join(process.cwd(), "docs")));
app.use("/node_modules", express.static(path.join(process.cwd(), "node_modules")));
app.use("/assets", express.static(path.join(process.cwd(), "assets")));

const server = http.createServer(app);

server.listen(5500, () => {
    console.log("- server running");
});

async function a () {
    await fm.saveFile("<p><b>Hello World</b> <u>come state</u> <br> <i>tutto bene?</i> <br> Spero di si</p>", "test.md");
};
a();