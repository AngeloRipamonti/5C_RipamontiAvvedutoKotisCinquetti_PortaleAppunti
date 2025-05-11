export const generateUserData = (postManager, email, username, bio, thumbnail) => {
    return {
        getPostManager: () => postManager,
        getEmail: () => email,
        getUsername: () => username,
        getBio: () => bio,
        setBio: (value) => bio = value,
        getThumbnail: () => thumbnail,
        setThumbnail: (value) => thumbnail = value,
        toString: () => {
            return `Email: ${email}
                    Username: ${username}
                    Bio: ${bio}
                    Thumbnail: ${thumbnail}
                    PostManager: ${postManager}`;
        }
    }
}