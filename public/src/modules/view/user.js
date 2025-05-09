export const generateUser = (parentElement, pubSub) => {
    return{
        render: function() {
            pubSub.subscribe("user-personal-data", (user) => {
                parentElement.innerHTML = `
                    <div id="user-stats" class="columns is-flex is-justify-content-center">
                        <div class="column" id="nPosts">
                            <h3>${user.posts.length}</h3>
                            <br>
                            <p>Posts</p>
                        </div>
                        <div class="column" id="nFollowers">
                            <h3>${user.followers}</h3>
                            <br>
                            <p>Followers</p>
                        </div>
                        <div class="column" id="bio">
                            <h3>${user.follows}</h3>
                            <br>
                            <p>bio</p>
                        </div>
                    </div>
                `;
            })
        }
    }
}