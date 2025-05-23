export const generateMiddleware = (pubsub, socket) => {
    return {
        connect: function () {
            let token = sessionStorage.getItem("token");
            if (token) socket.emit("connect_", { token });
        },

        //Account
        login: function (email, password, rememberMe) {
            socket.emit("login", { email: email, password: password, rememberMe });
        },
        register: function (usr, mail) {
            socket.emit("register", { username: usr, email: mail });
        },
        changeUsername: function (email, username) {
            let token = sessionStorage.getItem("token");
            socket.emit("changeUsername", { email, username, token: token ? token : undefined });
        },
        changePassword: function (email, oldPassword, newPassword) {
            socket.emit("changePassword", { email, oldPassword, newPassword });
        },
        changeThumbnail: function (fileName, fileData, email) {
            let token = sessionStorage.getItem("token");
            socket.emit("changeThumbnail", { fileName, fileData, email, token: token ? token : undefined });
        },
        changeBio: function (bio, email) {
            let token = sessionStorage.getItem("token");
            socket.emit("changeBio", { email, bio, token: token ? token : undefined });
        },
        deleteAccount: function (email) {
            let token = sessionStorage.getItem("token");
            socket.emit("deleteAccount", { email, token: token ? token : undefined });
        },
        logout: function () {
            let token = sessionStorage.getItem("token");
            socket.emit("logout", { token: token ? token : undefined });
        },
        getProfile: function (username) {
            socket.emit("getProfile", { username });
        },
        getPublicData: function (username, all) {
            socket.emit("getUserPublicData", {username, all});
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
        giveFeedback: function(author_email, id, star){
            socket.emit("giveFeedback", { id, author_email, star });
        },
        
        getDocument: function (path_note) {
            socket.emit("getDocumentByPath", { path_note });
        },
        checkFollow: function (me, user) {
            socket.emit("checkFollow", {me, user});
        },
        getDocumentText: function (path_note) {
            socket.emit("getDocumentText", { path_note });
        },
        modifyDocument: function (path_note, id ,text, author_email) {
            socket.emit("modifyDocument", { path_note, id, text, author_email });
        },
        getDocTag: function (tag) {
            socket.emit("getDocTag", { tag });
        },
        getDocByTag: function (tag) {
            socket.emit("getDocByTag", { tag });
        },
        changeVisibility: function (doc, visibility) {
            socket.emit("changeVisibility", {id: doc, visibility});
        },
        exportDocument: function (path_note, format, text) {
            socket.emit("exportDocument", {path_note, format, text});
        },
        createTag: function (tag) {
            socket.emit("createTag", { tag });
        },
        getFeed: function (email) {
            socket.emit("getFollowDocuments", { email });
        },
        databaseAddTag: function (id, tag) {
            socket.emit("addNoteTag", {id, tag});
        }
    }
}