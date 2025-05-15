export const generatePostManager = (pubsub,documents,feed) => {
    pubsub.subscribe("newVote", (post, vote) => {
        votePost(post,vote);
        updateFeed();
    });
    return{
        updateFeed: function() {
            feed.render(documents);
        }
    }
}