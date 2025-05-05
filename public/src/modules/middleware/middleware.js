export const generateMiddleware = (pubsub,socket) => {
    const events = {};

    return {
        login : function(username,password) {

        },
        register : function(usr,mail) {

        },
        createDocument : function(title) {

        },
        saveDocument : function(title) {

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
            
        }
    };
};