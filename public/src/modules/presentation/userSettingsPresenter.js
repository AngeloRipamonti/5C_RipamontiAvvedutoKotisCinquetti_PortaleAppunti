export const generateUserSettingsPresenter = (pubSub, view, userData) => {
    
    return{
        renderSettings: function() {
            view.render(userData);
        }
    }
}