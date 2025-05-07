export const generateUserData = (postManager, email, username, bio, thumbnail) => {
    return {
        getPostManager: () => postManager,
        getEmail: () => email,
        getUsername: () => username,
        getBio: () => bio,
        getThumbnail: () => thumbnail,

        getFollowers: () => followers, // pubsub richiedi database conteggio
        getFollows: () => follows, // pubsub richiedi database conteggio
        getPosts: () => posts, // pubsub richiedi database tutti post author he
    }
}