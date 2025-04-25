import { generateNavbar } from "./components/navbar.js";
import { generatePubSub } from "./components/pubsub.js";
import { generateNavigator } from "./components/navigator.js";

const navbarContainer = document.getElementById("navbar-container");
const pages = document.querySelector(".pages");

const pubsub = generatePubSub();
const navigator = generateNavigator(pages, pubsub);

const navbar = generateNavbar(navbarContainer, pubsub);
navbar.render();