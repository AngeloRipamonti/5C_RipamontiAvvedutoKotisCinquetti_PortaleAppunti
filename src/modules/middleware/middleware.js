module.exports = function middleware() {
    return {
        login: function(username, password) {
        
        },
        register: function(username, email) {
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