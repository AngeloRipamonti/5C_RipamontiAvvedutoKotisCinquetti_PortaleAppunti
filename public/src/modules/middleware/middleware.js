export const generateMiddleware = (pubsub,socket) => {
    const events = {};

    return {
        login : function(email,password,token) {
            console.log(token)
            if(token) socket.emit("login", {email: email, password: password, token: token});
            else socket.emit("login", {email: email, password: password});
        },

        register : function(usr,mail) {
            socket.emit("register", {username:usr, email: mail});
        },
        createDocument : function(email) {
            socket.emit("createDocument", { email });
        },
        saveDocument : function(path_note, text, author_email) {
            socket.emit("saveDocument", { path_note, text, author_email });
        },
        getProfile : function(username) {

        },
        getDocument : function(title) {

        },
        deleteDocument : function(title) {

        },
        getDocByTag : function(tag) {

        },
        getDocByAuthor : function(author) {

        },
        changeVisibility : function(doc) {

        },
        importDocument : function(doc) {
            socket.emit("importDocument", doc);
        },
        exportDocument : function(doc) {

        },
        changeUsername : function(usr) {

        },
        changePassword : function(psw) {

        },
        changeThumbnail : function(img) {

        },
        changeBio : function(bio) {

        },
        deleteAccount : function(acc) {

        },
        followAccount : function(acc, target) {

        },
        unfollowAccount : function(acc, target) {

        },
        createTag : function(tag){
            
        },
        connect: function() {
            let token = sessionStorage.getItem("token");
            if(token) socket.emit("connect_", {token});
        }
    };
};