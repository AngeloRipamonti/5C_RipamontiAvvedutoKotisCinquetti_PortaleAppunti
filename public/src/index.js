//Importations
import io from "/node_modules/socket.io/client-dist/socket.io.esm.min.js";
import { generateNavbar } from "./modules/view/navbar.js";
import { generatePubSub } from "./modules/middleware/pubsub.js";
import { generateNavigator } from "./modules/view/navigator.js";
import { generateCredentialManager } from "./modules/view/credentialManager.js";
import { generateSearchbar } from "./modules/view/searchbar.js";
import { generateMiddleware } from "./modules/middleware/middleware.js";
import { generateUserData } from "./modules/model/userData.js";
import { generateDocument } from "./modules/model/document.js";
import { generateDocumentCreation } from "./modules/view/documentCreation.js";
import { generateDocPresenter } from "./modules/presentation/createDocPresenter.js";
import { generateFeed } from "./modules/view/feed.js";
import { generatePostManager } from "./modules/presentation/postManager.js";
import { generatePublisher } from "./modules/presentation/publisher.js";
import { generateViewPublisher } from "./modules/view/viewPublisher.js";
import { v4 as uuidv4 } from '/node_modules/uuid/dist/esm-browser/index.js';
import { generateNote } from "./modules/presentation/note.js";
import { generateViewNote } from "./modules/view/viewNote.js";
import { generateUserPresenter } from "./modules/presentation/userPresenter.js";
import { generateUser } from "./modules/view/user.js";

location.href = "#entry"; //se loggati #feed

//Container objects
const navbarContainer = document.getElementById("navbar-container");
const credentialContainer = document.getElementById("credential-container");
const pages = document.querySelector(".pages");
const searchbarContainer = document.getElementById("searchbar-container");
const editor = document.querySelector("#editor");
const creation = document.getElementById("creation-start");
const feedContainer = document.getElementById("posts");
const publisherContainer = document.getElementById("publisher");
const personalContainer = document.getElementById("personal");

//pubSub and Navigator
const pubsub = generatePubSub();
const navigator = generateNavigator(pages, pubsub);

//Components
const navbar = generateNavbar(navbarContainer, pubsub);
const searchbar = generateSearchbar(searchbarContainer, pubsub);
const credential = generateCredentialManager (credentialContainer, pubsub);
let userObject;

const createDocument = generateDocPresenter(generateDocument(null,null,null,null,null,null), generateDocumentCreation(creation, pubsub));
const post = generateNote(pubsub,generateDocument(null,null,null,null,"Luke",5),generateViewNote(feedContainer,pubsub));
const post2 = generateNote(pubsub,generateDocument(null,null,null,null,"alex",3),generateViewNote(feedContainer,pubsub));
const postManager = generatePostManager(pubsub,[post,post2],generateFeed(pubsub));
postManager.updateFeed();

let user;
const socket = io();
const middleware = generateMiddleware(pubsub, socket);
middleware.connect();
navbar.render();
searchbar.render("searchbar", "search for tags or users...");
credential.renderLogin();


//Apertura e Chiusura della modale di registrazione
pubsub.subscribe("sign-up", () => {
    credential.renderRegister();
});
pubsub.subscribe("close-modal", () => {
    credential.renderLogin();
});
//registrazione
pubsub.subscribe("isRegisted", (data) => {
    middleware.register(data[0],data[1]);
});
//login
pubsub.subscribe("isLogged", (data) => {
    if(data[2]) {
        const token = uuidv4();
        sessionStorage.setItem("token", token);
        middleware.login(data[0], data[1], token);
    }else {
        middleware.login(data[0], data[1]);
    }
});
pubsub.subscribe("doc-creation", () => {
    createDocument.render();
    location.href = "#creation";
});
pubsub.subscribe("zero-start", () => {
    middleware.createDocument(user.getEmail());
    socket.on("createDocument", ([data])=>{
        createDocument.document.setValues(data);
    })
});
pubsub.subscribe('uploadFile', file => {
    file.author_email = user.getEmail();
    middleware.importDocument(file)
});


/* Sockets */
socket.on("login", ([data]) => {
    user = generateUserData(null, data.email, data.username, data.bio, data.path_thumbnail);
    userObject = generateUserPresenter(pubsub,user,generateUser(personalContainer, pubsub));
    userObject.render();
    navbar.setUserData(data);
    location.href = "#feed";
});
socket.on("importDocument", ([data]) => {
    createDocument.document.setValues(data);
    createDocument.import(createDocument.document.getText());
    pubsub.publish("importDocumentSocket");
});
socket.on("connect_", (data) => {
   if(data && data.length > 0) {
    console.log(data);
    user = generateUserData(null, data[0].user.email, data[0].user.username, data[0].user.bio, data[0].user.path_thumbnail);
    userObject = generateUserPresenter(pubsub,user,generateUser(personalContainer, pubsub));
    userObject.render();
    navbar.setUserData(data[0].user);
    location.href = "#feed";
   }
});

/* Callback */
document.getElementById("saveDocument").onclick = () => {
    middleware.saveDocument(createDocument.document.getPath(), createDocument.getText(), createDocument.document.getAuthor());
    const publisher = generatePublisher(pubsub, createDocument.document, generateViewPublisher(publisherContainer, pubsub));
    document.getElementById("publish-modal").classList.add("is-active");
};

window.addEventListener("popstate", () => {
    if(new URL(location.href).hash === "#personal") {
        middleware.getPublicData(user.getUsername());
        socket.on("public-data", (data) => {
            pubsub.publish("user-personal-data",data);
        }); 
    }
});