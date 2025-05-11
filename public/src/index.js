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
import { generateUserSettingsPresenter } from "./modules/presentation/userSettingsPresenter.js";
import { generateUserSettings } from "./modules/view/userSettings.js";

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
const search_result = document.getElementById("search-results")

//pubSub and Navigator
const pubsub = generatePubSub();
const navigator = generateNavigator(pages, pubsub);

//Components
const navbar = generateNavbar(navbarContainer, pubsub);
const searchbar = generateSearchbar(searchbarContainer, pubsub);
const credential = generateCredentialManager(credentialContainer, pubsub);
let userObject;

const createDocument = generateDocPresenter(generateDocument(), generateDocumentCreation(creation, pubsub));


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
    middleware.register(data[0], data[1]);
});
//login
pubsub.subscribe("isLogged", (data) => {
    if (data[2]) {
        const token = uuidv4();
        sessionStorage.setItem("token", token);
        middleware.login(data[0], data[1], token);
    } else {
        middleware.login(data[0], data[1]);
    }
});
pubsub.subscribe("doc-creation", () => {
    createDocument.render();
    location.href = "#creation";
});
pubsub.subscribe("zero-start", () => {
    middleware.createDocument(user.getEmail());
    socket.on("createDocument", ([data]) => {
        createDocument.document.setValues(data.response);
        const discardButton = document.getElementById("discard-button");
        discardButton.addEventListener("click", () => {
            middleware.deleteDocument(createDocument.document.getID());
            createDocument.import("");
        })
    })
});
pubsub.subscribe('uploadFile', file => {
    file.author_email = user.getEmail();
    middleware.importDocument(file);
});
pubsub.subscribe("post-voted", (data) => {
    middleware.giveFeedback(user.getEmail(), data.id, data.star);
});
//SearchBar
pubsub.subscribe('onsearch-tag', (data) => {
    console.log('Ricerca per tag:', data.tag);
    middleware.getDocTag(data.tag);
    socket.on("public-data", (data) => {
        console.log(data); //da implementare
    });
});

pubsub.subscribe('onsearch-user', (data) => {
    let called = true;
    if (data.username.toLowerCase() === user.getUsername().toLowerCase()) return document.getElementById("error-div").innerText = "You are that user!";
    middleware.getPublicData(data.username);
    socket.on("public-data", (stats) => {
        if (!called) return;
        if (isNaN(stats.response.followers)) return document.getElementById("error-div").innerText = "No user found";
        location.href = "#search-results";
        middleware.getProfile(data.username);
        socket.on("getProfile", ([dat]) => {
            middleware.checkFollow(user.getUsername(), dat.response.username);
            socket.on("checkFollow", (res) => {
                pubsub.publish("navbar-follows", res);
                const target = generateUserPresenter(pubsub, generateUserData(null, null, dat.response.username, dat.response.bio, dat.response.path_thumbnail), generateUser(search_result, pubsub));
                target.render(false);
                called = false;
                pubsub.publish("user-personal-data", stats.response);
                pubsub.subscribe("follow_user", async () => {
                    middleware.followAccount(user.getEmail(), target.follow());
                    socket.on("followAccount", ([data]) => {
                        if (data?.response) pubsub.publish("follow_user_success", data.response);
                    });
                });
            })
        });
    });
});

pubsub.subscribe('oncancel', (data) => {
    console.log('Cancellazione ricerca per:', data.id);
});

pubsub.subscribe("publish-button-clicked", (checked) => {
    middleware.saveDocument(createDocument.document.getPath(), createDocument.getText(), createDocument.document.getAuthor());
    if(checked) middleware.changeVisibility(createDocument.document.getID(), checked);
    socket.on("changeVisibility", () => {
         document.getElementById("publish-modal").classList.remove("is-active");
        createDocument.import("");
        location.href = "#feed";
    })
});

pubsub.subscribe("delete-document", (id) => {
    middleware.deleteDocument(id);
    middleware.getPublicData(user.getUsername());
    socket.on("public-data", (data) => {
        pubsub.publish("user-personal-data", data.response);
    });
});

pubsub.subscribe("export-pdf-document", (path) => {
    let called = true;
    middleware.getDocument(path);
    socket.on("getDocumentByPath", ([doc]) => {
        middleware.exportDocument(path, "pdf", doc.response.text);
        socket.on("exportDocument", ([path]) => {
            if (called) {
                const target = document.getElementById(`download-file-${doc.response.id}`);
                target.href = path.response;
                target.click();
                called = false;
            }
        })
    })
});

pubsub.subscribe("export-docx-document", (path) => {
    let called = true;
    middleware.getDocument(path);
    socket.on("getDocumentByPath", ([doc]) => {
        middleware.exportDocument(path, "docx", doc.response.text);
        socket.on("exportDocument", ([path]) => {
            if (called) {
                const target = document.getElementById(`download-file-${doc.response.id}`);
                target.href = path.response;
                target.click();
                called = false;
            }
        })
    })
});

pubsub.subscribe("open-document-fullscreen", (path) => {
    middleware.getDocumentText(path);
    socket.on("getDocumentText", ([data]) => {
        document.getElementById("fullscreen-view").innerHTML = data.response;
    });
});

pubsub.subscribe("user-settings", value => {
    location.href = "#settings";
    let uSettings = generateUserSettingsPresenter(pubsub, generateUserSettings(document.getElementById("settings"), pubsub), user);
    uSettings.renderSettings();
});

pubsub.subscribe("post-voted", (result) => {
    let called = true;
    if(called) {
        middleware.giveFeedback(user.getEmail(), result.id, result.star);
        socket.on("giveFeedback", ([data]) => {
            if(data.response) getFeed(user);
        });
        called = false;
    }
});
pubsub.subscribe("changeBio", (bio) =>{
    middleware.changeBio(bio, user.getEmail());
    socket.on("changeBio", ([data]) => {
        if(data?.response) user.setBio(bio);
    })
});
pubsub.subscribe("changeThumbnail", (thumbnail) => {
    middleware.changeThumbnail(thumbnail.fileName, thumbnail.fileData, user.getEmail());
    socket.on("changeThumbnail", ([data]) => {
        console.log(data);
        if(data?.response) user.setThumbnail(thumbnail);
    })
});

/* Calllback */
document.getElementById("saveDocument").onclick = () => {
    const publisher = generatePublisher(pubsub, createDocument.document, generateViewPublisher(publisherContainer, pubsub));
    document.getElementById("publish-modal").classList.add("is-active");
};

/* EVENT LISTENER */
window.addEventListener("popstate", () => {
    if (new URL(location.href).hash === "#personal") {
        middleware.getPublicData(user.getUsername());
        socket.on("public-data", (data) => {
            pubsub.publish("user-personal-data", data.response);
        });
    }
});


/* Sockets */
socket.on("login", ([data]) => {
    if (data.error) return document.getElementById("error_area").innerHTML = "<p class='has-text-red'>Wrong credential!</p>";
    user = generateUserData(null, data.response.email, data.response.username, data.response.bio, data.response.path_thumbnail);
    userObject = generateUserPresenter(pubsub, user, generateUser(personalContainer, pubsub));
    userObject.render(true);
    navbar.setUserData(data.response);
    getFeed(user);
    location.href = "#feed";
});
socket.on("importDocument", ([data]) => {
    if (data.error) return;
    createDocument.document.setValues(data.response);
    createDocument.import(createDocument.document.getText());
    pubsub.publish("importDocumentSocket");
    const discardButton = document.getElementById("discard-button");
    discardButton.addEventListener("click", () => {
        middleware.deleteDocument(createDocument.document.getID());
        createDocument.import("");
    })
});
socket.on("connect_", (data) => {
    if (data?.response && data?.response.length > 0) {
        user = generateUserData(null, data.response[0].user.email, data.response[0].user.username, data.response[0].user.bio, data.response[0].user.path_thumbnail);
        userObject = generateUserPresenter(pubsub, user, generateUser(personalContainer, pubsub));
        userObject.render(true);
        navbar.setUserData(data.response[0].user);
        getFeed(user);
        location.href = "#feed";
    }
});

function getFeed(user) {
    middleware.getFeed(user.getEmail());
    const posts = [];
    feedContainer.innerHTML = "";
    socket.on("getFollowDocuments", ([res]) => {
        res.response.forEach(e => feedContainer.innerHTML += `<div id="${e.id}"></div>`)
        res.response.forEach(e => posts.push(generateNote(pubsub, generateDocument(e.id, e.created_at, e.visibility, e.path_note,null,e.tags,e.author_email,e.average_stars), generateViewNote(document.getElementById(e.id), pubsub))));
        const postManager = generatePostManager(pubsub, posts, generateFeed(pubsub));
        postManager.updateFeed();
    });
}