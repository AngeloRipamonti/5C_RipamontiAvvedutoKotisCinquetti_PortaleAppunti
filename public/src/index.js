import { generateNavbar } from "./components/navbar.js";
import { generatePubSub } from "./components/pubsub.js";
import { generateNavigator } from "./components/navigator.js";
import { generateCredentialManager } from "./components/credentialManager.js";

const navbarContainer = document.getElementById("navbar-container");
const credentialContainer = document.getElementById("credential-container");
const pages = document.querySelector(".pages");

const pubsub = generatePubSub();
const navigator = generateNavigator(pages, pubsub);

const navbar = generateNavbar(navbarContainer, pubsub);
const credential = generateCredentialManager (credentialContainer, pubsub);
navbar.render();
credential.renderLogin();