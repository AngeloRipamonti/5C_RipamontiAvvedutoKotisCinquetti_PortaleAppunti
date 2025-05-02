module.exports = function middleware(pubsub) {
    return {
        register: async function(email, username, password) {
            return await pubsub.publish("databaseRegisterAccount", {
                email: email,
                username: username,
                password: password
            });
        },
        login: function(username, password) {
        
        },
        createDocument: function(title){
        },
        saveDocument: function (title){
        },
        getProfile: function(username){
        },
        getDocument: function(title){
        },
        deleteDocument: function(title){
        },
        getDocTag: function (tag){
        },
        getDocByAuthor: function (author){
        },
        changeVisibility: function(doc){
        },
        importDocumentt: function(doc){
        },
        exportDocument: function(doc){
        },
        changeUsername: function(user){
        },
        changePassword: function(password){
        },
        changeThumbnail: function (img){
        },
        changeBio: function(bio){
        },
        deleteAccount: function(acc){
        },
        followAccount: function(acc, target){
        },
        unfollowAccount: function(acc, target){
        },
        createTag: function(tag){
        }
    }
}