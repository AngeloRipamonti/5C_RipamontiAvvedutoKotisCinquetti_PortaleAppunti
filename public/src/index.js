//Importations
import { generateNavbar } from "./modules/view/navbar.js";
import { generatePubSub } from "./modules/middleware/pubsub.js";
import { generateNavigator } from "./modules/view/navigator.js";
import { generateCredentialManager } from "./modules/view/credentialManager.js";
import { generateSearchbar } from "./modules/view/searchbar.js";

//Container objects
const navbarContainer = document.getElementById("navbar-container");
const credentialContainer = document.getElementById("credential-container");
const pages = document.querySelector(".pages");
const searchbarContainer = document.getElementById("searchbar-container");

//pubSub and Navigator
const pubsub = generatePubSub();
const navigator = generateNavigator(pages, pubsub);

//Components
const navbar = generateNavbar(navbarContainer, pubsub);
const searchbar = generateSearchbar(searchbarContainer, pubsub);
const credential = generateCredentialManager (credentialContainer, pubsub);
navbar.render();
searchbar.build("searchbar", "search for tags or users...");
searchbar.render();
credential.renderLogin();


pubsub.subscribe("sign-up", () => {
    credential.renderRegister();
});
pubsub.subscribe("close-modal", () => {
    credential.renderLogin();
});
