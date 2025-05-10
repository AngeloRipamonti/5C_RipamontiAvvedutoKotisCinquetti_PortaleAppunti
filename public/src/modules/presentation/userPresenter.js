export const generateUserPresenter = (pubSub,userData,view) => {
    
    return{
        render: function(itsme) {
            view.render(userData, itsme);
        },
        follow: () => userData.getUsername(),
        unfollow: function (target){

        }

    }
}