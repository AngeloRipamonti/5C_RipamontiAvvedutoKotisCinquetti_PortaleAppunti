module.exports = function middleware(pubsub) {
    return {
        // Account
        register: async function(email, username, password) {
            return await pubsub.publish("databaseRegisterAccount", {
                email: email,
                username: username,
                password: password
            });
        },
        login: async function(email, password) {
            return await pubsub.publish("databaseLoginAccount", {
                email: email,
                password: password
            });
        },
        changeUsername: async function(email, username){
            return await pubsub.publish("databaseChangeUsername", {
                email: email,
                username: username
            });
        },
        changePassword: async function(email, password){
            return await pubsub.publish("databaseChangePassword", {
                email: email,
                password: password
            });
        },
        changeThumbnail: async function (img, email){
            return await pubsub.publish("databaseChangeThumbnail", {
                email: email,
                thumbnail: img
            });
        },
        changeBio: async function(bio, email){
            return await pubsub.publish("databaseChangeBio", {
                email: email,
                bio: bio
            });
        },
        deleteAccount: async function(email){
            return await pubsub.publish("databaseDeleteAccount", { email: email });
        },
        getProfile: async function(username){
            return await pubsub.publish("databaseFindUser", { username: username });
        },
        followAccount: async function(email, username){
            return await pubsub.publish("databaseFollowUser", {
                email: email,
                username: username
            });
        },
        unfollowAccount: async function(email, username){
            return await pubsub.publish("databaseUnfollowUser", {
                email: email,
                username: username
            });
        },

        createDocument: function(title){
        },
        saveDocument: function (title){
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
        createTag: function(tag){
        }
    }
}