export const userData = (postManager, thumbnail, followers, follows, posts) => {
    return {
        getPostManager: () => postManager,
        getThumbnail: () => thumbnail,
        getFollowers: () => followers,
        getFollows: () => follows,
        getPosts: () => posts,
    }
}