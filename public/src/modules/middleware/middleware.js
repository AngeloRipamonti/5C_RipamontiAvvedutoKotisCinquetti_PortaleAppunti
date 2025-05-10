export const generateMiddleware = (pubsub, socket) => {
    return {
        connect: function () {
            let token = sessionStorage.getItem("token");
            if (token) socket.emit("connect_", { token });
        },

        //Account
        login: function (email, password, token) {
            console.log(token)
            if (token) socket.emit("login", { email: email, password: password, token: token });
            else socket.emit("login", { email: email, password: password });
        },
        register: function (usr, mail) {
            socket.emit("register", { username: usr, email: mail });
        },
        changeUsername: function (email, username) {
            socket.emit("changeUsername", { email, username });
        },
        changePassword: function (email, password) {
            socket.emit("changePassword", { email, password });
        },
        changeThumbnail: function (img, email) {
            socket.emit("changeThumbnail", { thumbnail: img, email });
        },
        changeBio: function (bio, email) {
            socket.emit("changeBio", { email, bio });
        },
        deleteAccount: function (email) {
            socket.emit("deleteAccount", { email });
        },
        getProfile: function (username) {
            socket.emit("getProfile", { username });
        },
        getPublicData: function (username) {
            socket.emit("getUserPublicData", username);
        },
        followAccount: function (email, username) {
            socket.emit("followAccount", { email, username });
        },
        unfollowAccount: function (email, username) {
            socket.emit("unfollowAccount", { email, username });
        },

        // Document
        createDocument: function (email) {
            socket.emit("createDocument", { email });
        },
        saveDocument: function (path_note, text, author_email) {
            socket.emit("saveDocument", { path_note, text, author_email });
        },
        importDocument: function (doc) {
            socket.emit("importDocument", doc);
        },
        deleteDocument: function (id) {
            socket.emit("deleteDocument", { id });
        },
        getDocByAuthor: function (author_email) {
            socket.emit("getDocumentByAuthor", { author_email });
        },
        giveFeedback: function(author_email, id, n_star){
            socket.emit("giveFeedback", { author_email, id, n_star });
        },
        
        getDocument: function (path_note) {
            socket.emit("getDocumentByPath", { path_note });
        },
        getDocTag: function (tag) {
        },
        changeVisibility: function (doc) {
        },
        exportDocument: function (path_note, format, text) {
            socket.emit("exportDocument", {path_note, format, text});
        },
        createTag: function (tag) {
        }
    }
}