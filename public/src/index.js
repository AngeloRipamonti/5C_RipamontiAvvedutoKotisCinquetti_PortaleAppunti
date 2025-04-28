//Importations
import { generateNavbar } from "./components/navBar.js";
import { generatePubSub } from "./components/pubsub.js";
import { generateNavigator } from "./components/navigator.js";
import { generateCredentialManager } from "./components/credentialManager.js";

//Container objects
const navbarContainer = document.getElementById("navbar-container");
const credentialContainer = document.getElementById("credential-container");
const pages = document.querySelector(".pages");

//pubSub and Navigator
const pubsub = generatePubSub();
const navigator = generateNavigator(pages, pubsub);

//Components
const navbar = generateNavbar(navbarContainer, pubsub);
const credential = generateCredentialManager (credentialContainer, pubsub);
navbar.render();
credential.renderLogin();
pubsub.subscribe("sign-up", ()=>{
    credential.renderRegister();
});
pubsub.subscribe("close-modal", ()=>{
    credential.renderLogin();
});
