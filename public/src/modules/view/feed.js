export const generateFeed = (pubSub) => {
    return{
        render: function(posts) {
            console.log(posts);
            posts.forEach(element => {
                element.render()}
            );
        }
    }
}