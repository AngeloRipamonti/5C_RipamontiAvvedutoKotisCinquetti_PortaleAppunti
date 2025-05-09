export const generateUserPresenter = (pubSub,userData,view) => {
    
    return{
        render: function() {
            view.render(userData);
        },
        follow: function (target){

        },
        unfollow: function (target){

        }

    }
}