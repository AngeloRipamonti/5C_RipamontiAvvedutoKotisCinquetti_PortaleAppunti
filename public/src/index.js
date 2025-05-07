//Importations
import { generateNavbar } from "./modules/view/navbar.js";
import { generatePubSub } from "./modules/middleware/pubsub.js";
import { generateNavigator } from "./modules/view/navigator.js";
import { generateCredentialManager } from "./modules/view/credentialManager.js";
import { generateSearchbar } from "./modules/view/searchbar.js";
import { generateMiddleware } from "./modules/middleware/middleware.js";
import io from "/node_modules/socket.io/client-dist/socket.io.esm.min.js";
import { generateDocPresenter } from "./modules/presentation/createDocPresenter.js";
import { generateDocumentCreation } from "./modules/view/documentCreation.js";
import { generateDocument } from "./modules/model/document.js";

//Container objects
const navbarContainer = document.getElementById("navbar-container");
const credentialContainer = document.getElementById("credential-container");
const pages = document.querySelector(".pages");
const searchbarContainer = document.getElementById("searchbar-container");
const editor = document.querySelector("#editor");

//pubSub and Navigator
const pubsub = generatePubSub();
const navigator = generateNavigator(pages, pubsub);

//Components
const navbar = generateNavbar(navbarContainer, pubsub);
const searchbar = generateSearchbar(searchbarContainer, pubsub);
const credential = generateCredentialManager (credentialContainer, pubsub);
const socket = io();
const middleware = generateMiddleware(pubsub, socket);
navbar.render();
searchbar.render("searchbar", "search for tags or users...");
//Login
credential.renderLogin();
const createDocument = generateDocPresenter(generateDocument(null,null,null,null,null,null),generateDocumentCreation(editor, pubsub));
createDocument.render();

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
    middleware.login(data[0], data[1]);
});