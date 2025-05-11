export const generateFeed = (pubSub) => {
    return{
        render: function(posts) {
            posts.forEach(element => {
                element.render()}
            );
        }
    }
}