import { generateNavbar } from "./scripts/navbar.js";
import { generatePubSub } from "./scripts/pubsub.js";
import { generateNavigator } from "./scripts/navigator.js";

const navbarContainer = document.getElementById("navbar-container");

const pubsub = generatePubSub();
//const navigator = generateNavigator();

const navbar = generateNavbar(navbarContainer, pubsub);
navbar.render();