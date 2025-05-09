export const generateUser = (parentElement, pubSub) => {
  return {
    render: function (userData) {
      pubSub.subscribe("user-personal-data", (user) => {
        parentElement.innerHTML = `
                    <div id="user-stats" class="columns is-flex is-justify-content-center">
                        <div class="column is-one-third has-text-centered" id="nPosts">
                            <h3>${user.posts.length}</h3>
                            <br>
                            <p>Posts</p>
                        </div>
                        <div class="column is-one-third has-text-centered" id="nFollowers">
                            <h3>${user.followers}</h3>
                            <br>
                            <p>Followers</p>
                        </div>
                        <div class="column is-one-third has-text-centered" id="bio">
                            <h3>${user.follows}</h3>
                            <br>
                            <p>follows</p>
                        </div>
                    </div>
                    <div id="bio-container">
                        <div class="columns">
                            <div class="column is-one-fifth has-text-centered">
                                <h1 class="title has-text-white">Bio</h1>
                                <div class="line"></div>
                            </div>
                        </div>
                        <h2 class="user-bio">${
                          userData.getBio() || "No bio setted"
                        }</h2>
                    </div>
                    <div id="posts-container">
                        <div class="columns">
                            <div class="column is-one-fifth has-text-centered">
                                <h1 class="title has-text-white">Posts</h1>
                                <div class="line"></div>
                            </div>
                        </div>
                        <div class="posts">${user.posts.map((e) => {
                          return `
                                    <div class="post-container">
                                        <div class="post box" id="${e.id}">
                                        <div class="post-tabs columns">
                                            <div class="column is-one-third has-text-centered post-tab">
                                                <button type="button delete-doc-button" id="${
                                                  e.id
                                                }" class="button btn-transparent">
                                                    <span class="icon">
                                                        <i class="fa-solid fa-trash" style="color: #ff0000;"></i>
                                                    </span>
                                                </button>
                                            </div>
                                            <div class="column is-one-third has-text-centered post-tab">
                                                <button type="button modify-doc-button" id="${
                                                  e.id
                                                }" class="button btn-transparent">
                                                        <span class="icon">
                                                            <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                                                        </span>
                                                </button>
                                            </div>
                                            <div class="column is-one-third has-text-centered post-tab">
                                                <button type="button modify-doc-button" id="${
                                                  e.id
                                                }" class="button btn-transparent">
                                                        <span class="icon">
                                                            <i class="fa-solid fa-file-export" style="color: #ffffff;"></i>
                                                        </span>
                                                </button>
                                            </div>
                                        </div>
                                            <div class="header is-flex is-justify-content-space-between">
                                                <div>${userData.getUsername()}</div>
                                            </div>
                                            <div class="preview" style="text-align: center !important;">
                                                <img src="/assets/images/doc-preview.png" alt="doc-thumbnail" id="doc-thumbnail">
                                            </div>
                                        </div>
                                    </div>
                                `;
                        })}</div>
                    </div>
                `;
      });
    },
  };
};
