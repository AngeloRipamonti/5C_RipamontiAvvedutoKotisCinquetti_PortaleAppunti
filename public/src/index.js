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

location.href = "#entry"; 

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
const search_result = document.getElementById("search-results");
const modify_doc = document.getElementById("modify");
const modify_editor = document.getElementById("modify-editor");
const loader = document.querySelector("#loader-container");

//pubSub and Navigator
const pubsub = generatePubSub();
const navigator = generateNavigator(pages, pubsub);

//Components
const navbar = generateNavbar(navbarContainer, pubsub);
const searchbar = generateSearchbar(searchbarContainer, pubsub);
const credential = generateCredentialManager(credentialContainer, pubsub);
let userObject;
let keyCounter = 0;



let user;
const socket = io();
const middleware = generateMiddleware(pubsub, socket);
middleware.connect();
navbar.render();
searchbar.render("searchbar", "search for tags or users...");
credential.renderLogin();

const quillAdd = new Quill(editor, {
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],      
        ['blockquote', 'code-block'],
        ['link', 'formula'],
        [{ 'list': 'ordered'}],
        ['clean']
      ]
    },
    placeholder: "Write something...",
    theme: "snow"
});  

const quillModify = new Quill(modify_editor, {
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],      
        ['blockquote', 'code-block'],
        ['link', 'formula'],
        [{ 'list': 'ordered'}],
        ['clean']
      ]
    },
    placeholder: "Write something...",
    theme: "snow"
});  


const createDocument = generateDocPresenter(quillAdd, generateDocument(), generateDocumentCreation(creation, pubsub));


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
        document.getElementById("editor").addEventListener("keydown", (key) => {
            keyCounter++;
            if(keyCounter == 10) {
                middleware.modifyDocument(data.response.path_note, data.response.id, createDocument.getText(), user.getEmail());
                keyCounter = 0;
            }
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
    showLoader()
    let called = true;
    document.getElementById("error-div").innerText = ""; 
    middleware.getDocByTag(data.tag); 

    socket.on("getDocByTag", ([stats]) => {
        if (!called || !stats || !stats.response  || stats.error) return hideLoader();
        const results = stats.response;

        if (!Array.isArray(results) || results.length === 0) {
            hideLoader();
            return document.getElementById("error-div").innerText = "No content found for this tag";
        }
        pubsub.publish("navbar-result-tags");
        getFeedByTag(results);
        hideLoader();
        location.href = "#search-results"; 
        called = false;
    });
});

pubsub.subscribe("change-visibility-btn-clicked", (values) => {
    showLoader();
    const visibility = values.public === true ? 1 : 0;
    middleware.changeVisibility(values.id, visibility);
    socket.on("changeVisibility", ([resp]) => {
        hideLoader();
    });
})

pubsub.subscribe('onsearch-user', (data) => {
    showLoader();
    let called = true;
    if (data.username.toLowerCase() === user.getUsername().toLowerCase()) return document.getElementById("error-div").innerText = "You are that user!";
    middleware.getPublicData(data.username);
    socket.on("public-data", (stats) => {
        if (!called) return;
        called = false;
        if (stats?.error) {
            hideLoader();
            return document.getElementById("error-div").innerText = "No user found";
        }
        location.href = "#search-results";
        middleware.getProfile(data.username);
        socket.on("getProfile", ([dat]) => {
            middleware.checkFollow(user.getUsername(), dat.response.username);
            socket.on("checkFollow", ([res]) => {
                pubsub.publish("navbar-follows", res?.response ? true : false);
                const target = generateUserPresenter(pubsub, generateUserData(null, null, dat.response.username, dat.response.bio, dat.response.path_thumbnail), generateUser(search_result, pubsub));
                target.render(false);
                called = false;
                pubsub.publish("user-personal-data", stats.response);
                hideLoader();
                pubsub.subscribe("follow_user", async () => {
                    showLoader();
                    middleware.followAccount(user.getEmail(), target.follow());
                    socket.on("followAccount", ([data]) => {
                        if (data?.response) pubsub.publish("navbar-follows", true);
                        pubsub.publish("navbar-result-users");
                    });
                    hideLoader();
                });
                pubsub.subscribe("unFollow_user", async () => {
                    showLoader();
                    middleware.unfollowAccount(user.getEmail(), target.follow());
                    pubsub.publish("navbar-follows", false);
                    hideLoader();
                });
            })
        });
    });
    hideLoader();
});

pubsub.subscribe('oncancel', (data) => {
    //console.log('Cancellazione ricerca per:', data.id);
});

//Publisher and tags
pubsub.subscribe("publish-button-clicked", (data) => {
    showLoader();
    middleware.saveDocument(createDocument.document.getPath(), createDocument.getText(), createDocument.document.getAuthor());
    if(data[0]) {
        middleware.changeVisibility(createDocument.document.getID(), data[0]);
        hideLoader();
    }
    if(data[1]){
        data[1].forEach(e => middleware.databaseAddTag(createDocument.document.getID(), e));
        //socket.on("addNoteTag",(res)=>console.log(res))
        socket.on("changeVisibility", () => {
            document.getElementById("publish-modal").classList.remove("is-active");
            createDocument.import("");
            location.href = "#personal";
            hideLoader();
        })
    }
});


pubsub.subscribe("search-tag", (tag)=>{
    showLoader();
    middleware.getDocTag(tag);
    socket.on("getDocTag", ([values])=>{
        pubsub.publish("tags-result", [values.response, tag]);
        hideLoader();
    })
});

pubsub.subscribe("create-new-tag", (tag)=>{
    showLoader();
    middleware.createTag(tag);
    socket.on("createTag", ([values]) => {
        hideLoader();
    })
});

pubsub.subscribe("delete-document", (id) => {
    showLoader();
    middleware.deleteDocument(id);
    middleware.getPublicData(user.getUsername());
    socket.on("public-data", (data) => {
        pubsub.publish("user-personal-data", data.response);
        hideLoader();
    });
});

pubsub.subscribe("modify-document", (values) => {
    showLoader();
    middleware.getDocumentText(values[0]);
    socket.on("getDocumentText", ([data]) => {
        const createDocument = generateDocPresenter(quillModify, generateDocument(null,null,null,null,data.response,null,null,null));
        createDocument.import(data.response);
        createDocument.render();
        location.href = "#modify";
        keyCounter = 0;
        document.getElementById("modify-editor").addEventListener("keydown", (key) => {
            keyCounter++;
            if(keyCounter == 10) {
                middleware.modifyDocument(values[0], values[1], createDocument.getText(), user.getEmail());
                //socket.on("modifyDocument", (res) => console.log(res));
                keyCounter = 0;
            }
        })
        document.getElementById("saveModify").onclick = () => {
            showLoader();
            middleware.modifyDocument(values[0], values[1] ,createDocument.getText(), user.getEmail());
            //socket.on("modifyDocument", (res) => console.log(res));
            location.href = "#personal";
            hideLoader();
        };
        hideLoader();
    })
})

pubsub.subscribe("export-pdf-document", (path) => {
    showLoader();
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
            hideLoader();
        })
    })
});

pubsub.subscribe("export-docx-document", (path) => {
    showLoader();
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
            hideLoader();
        })
    })
});

pubsub.subscribe("open-document-fullscreen", (path) => {
    showLoader();
    middleware.getDocumentText(path);
    socket.on("getDocumentText", ([data]) => {
        document.getElementById("fullscreen-view").innerHTML = data.response;
        hideLoader();
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
    showLoader();
    middleware.changeBio(bio, user.getEmail());
    socket.on("changeBio", ([data]) => {
        if(data?.response) user.setBio(bio);
        hideLoader();
    })
});

pubsub.subscribe("changeThumbnail", (thumbnail) => {
    showLoader();
    middleware.changeThumbnail(thumbnail.fileName, thumbnail.fileData, user.getEmail());
    socket.on("changeThumbnail", ([data]) => {
        if(data?.response) user.setThumbnail(data.response);
        hideLoader();
    })
});
pubsub.subscribe("changeUsername", (username)=> {
    showLoader();
    middleware.changeUsername(user.getEmail(), username);
    socket.on("changeUsername", ([data]) => {
        if(data?.response) user.setUsername(username);
        hideLoader();
    })
})
pubsub.subscribe("changePassword", ([oldPassword, newPassword]) => {
    showLoader();
    middleware.changePassword(user.getEmail(), oldPassword, newPassword);
    socket.on("changePassword", ([data]) => {
        if(data?.response) {
            location.href = "#entry";
            hideLoader();
        }
    })
});
pubsub.subscribe("logout", () => {
    middleware.logout(user.getEmail());
    socket.on("logout", (data) => {
        if(data?.response) {
            location.href = "#entry";
        }
    })
});

pubsub.subscribe("deleteAccount", () => {
    middleware.deleteAccount(user.getEmail());
    socket.on("deleteAccount", ([data]) => {
        if(data?.response) {
            location.href = "#entry";
        }
    })
});

/* Calllback */
document.getElementById("saveDocument").onclick = () => {
    document.getElementById("publisher").classList.remove("is-hidden");
    publisherContainer.innerHTML = `<div class="modal is-active" id="middle-modal">
                                        <div class="modal-background"></div>
                                        <div class="modal-content" id="middle-modal-content">
                                            <h1 class="title has-text-black has-text-center">Wanna publish it?</h1>
                                            <div class="columns">
                                                <div class="column has-text-center">
                                                    <button id="continue_publish" class="button is-link">Publish</button>
                                                </div>
                                                <div class="column has-text-center">
                                                    <button id="continue_private" class="button is-black">Archive</button>
                                                </div>
                                            </div>
                                            <button id="close-middle-modal" class="btn is-trasparent">Back to editor <i class="fa-solid fa-arrow-right"></i></button>
                                        </div>
                                    </div>`;
                                    
    document.getElementById("close-middle-modal").onclick = () => document.getElementById("middle-modal").classList.remove("is-active");
    document.getElementById("continue_publish").onclick = () => {
        const publisher = generatePublisher(pubsub, createDocument.document, generateViewPublisher(publisherContainer, pubsub));
        document.getElementById("publish-modal").classList.add("is-active");    
    }
    document.getElementById("continue_private").onclick = () => {
        pubsub.publish("publish-button-clicked",[false]);
        document.getElementById("publisher").classList.add("is-hidden");
        location.href = "#personal"  
    }
};



/* EVENT LISTENER */
window.addEventListener("popstate", () => {
    if (new URL(location.href).hash === "#personal") {
        middleware.getPublicData(user.getUsername());
        socket.on("public-data", (data) => {
            if(data?.error) return;
            pubsub.publish("user-personal-data", data.response);
        });
    }else if (new URL(location.href).hash === "#feed") {
        getFeed(user);
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
    location.href = "#personal";
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
        location.href = "#personal";
    }
});

function getFeed(user) {
    middleware.getFeed(user.getEmail());
    const posts = [];
    socket.on("getFollowDocuments", ([res]) => {
        feedContainer.innerHTML = "";
        res.response.forEach(e => feedContainer.innerHTML += `<div id="${e.id}"></div>`)
        res.response.forEach(e => posts.push(generateNote(pubsub, generateDocument(e.id, e.created_at, e.visibility, e.path_note,null,e.tags,e.author_email,e.average_stars), generateViewNote(document.getElementById(e.id), pubsub))));
        const postManager = generatePostManager(pubsub, posts, generateFeed(pubsub));
        postManager.updateFeed();
    });
}

function getFeedByTag(posts) {
    const postsByTag = [];
    search_result.innerHTML = posts.map(e => `<div id="result-${e.id}"></div>`);
    posts.forEach(e => postsByTag.push(generateNote(pubsub, generateDocument(e.id, e.created_at, e.visibility, e.path_note,null,e.tags,e.author_email,e.average_stars), generateViewNote(document.getElementById(`result-${e.id}`), pubsub))));
    const postManager = generatePostManager(pubsub, postsByTag, generateFeed(pubsub));
    postManager.updateFeed();
}

function showLoader() {
    loader.classList.remove("is-hidden");
}

function hideLoader() {
    loader.classList.add("is-hidden");
}

socket.on("disconnect", () => {
    location.href = "#error";
})