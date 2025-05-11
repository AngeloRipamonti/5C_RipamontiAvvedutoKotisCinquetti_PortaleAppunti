module.exports = function middleware(pubsub) {
    return {
        // Account
        register: async function (email, username, password) {
            return await pubsub.publish("databaseRegisterAccount", {
                email: email,
                username: username,
                password: password
            });
        },
        login: async function (email, password, token) {
            return await pubsub.publish("databaseLoginAccount", token ? {
                email: email,
                password: password,
                token: token
            } :
            {
                email: email,
                password: password
            });
        },
        changeUsername: async function (email, username) {
            return await pubsub.publish("databaseChangeUsername", {
                email: email,
                username: username
            });
        },
        changePassword: async function (email, password) {
            return await pubsub.publish("databaseChangePassword", {
                email: email,
                password: password
            });
        },
        changeThumbnail: async function (img, email) {
            return await pubsub.publish("databaseChangeThumbnail", {
                email: email,
                thumbnail: img
            });
        },
        changeBio: async function (bio, email) {
            return await pubsub.publish("databaseChangeBio", {
                email: email,
                bio: bio
            });
        },
        deleteAccount: async function (email) {
            return await pubsub.publish("databaseDeleteAccount", { email: email });
        },
        getProfile: async function (username) {
            return await pubsub.publish("databaseFindUser", { username: username });
        },
        followAccount: async function (email, username) {
            return await pubsub.publish("databaseFollowUser", {
                email: email,
                username: username
            });
        },
        unfollowAccount: async function (email, username) {
            return await pubsub.publish("databaseUnfollowUser", {
                email: email,
                username: username
            });
        },
        getFollows: async function (username) {
            return await pubsub.publish("databaseGetFollows", { username });
        },
        getFollowers: async function (username) {
            return await pubsub.publish("databaseGetFollowers", { username });
        },
        // Document
        createDocument: function (email) {
            return pubsub.publish("databaseCreateDocument", { email: email });
        },
        deleteDocument: function (id) {
            return pubsub.publish("databaseDeleteDocument", { id: id });
        },
        importDocument: async function (fileName, fileData, author_email) {
            return await pubsub.publish("databaseImportDocument", { 
                fileName: fileName,
                fileData: fileData,
                author_email: author_email
            });
        },
        saveDocument: function (path_note, text, author_email) {
            return pubsub.publish("databaseSaveDocument", {
                path_note: path_note,
                text: text,
                author_email: author_email
            });
        },
        getDocByAuthor: async function (username) {
            return await pubsub.publish("databaseGetDocByAuthor", { username });
        },
        exportDocument: async function (path_note, format, text) {
            return await pubsub.publish("databaseExportDocument", {
                path_note: path_note,
                format: format,
                text: text
            });
        },
        giveFeedback: async function(author_email, id, n_star){
            return await pubsub.publish("databaseGiveFeedback", { author_email, id, n_star });
        },
        getDocument: async function (path_note) {
            return await pubsub.publish("databaseGetDocument", { path_note });
        },
        changeVisibility: async function (id, visibility) {
            return await pubsub.publish("databaseChangeVisibility", { id, visibility });
        },
        getFollowDocuments: async function (email) {
            return await pubsub.publish("databaseGetFollowDocuments", { email });
        },
        // Tag
        createTag: function (tag) {
            return pubsub.publish("databaseCreateTag", { tag });
        },
        getDocTag: function (tag) {
            return pubsub.publish("databaseGetDocTag", { tag });
        }
    }
}