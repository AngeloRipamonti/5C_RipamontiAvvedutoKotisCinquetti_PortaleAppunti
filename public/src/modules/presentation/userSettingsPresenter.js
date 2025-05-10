export const generateUserSettingsPresenter = (pubSub, view, userData) => {
    
    return{
        changeBio: function() {

        },
        changeUsername: function(usr) {

        },
        changeThumbnail: function(img) {

        },
        changePassword: function(psw) {

        },
        renderSettings: function() {
            view.render(userData);
        }
    }
}