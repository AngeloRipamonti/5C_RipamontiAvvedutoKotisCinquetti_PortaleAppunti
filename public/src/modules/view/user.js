export const generateUser = (parentElement, pubSub) => {
  return {
    render: function (userData, itsme) {
      pubSub.subscribe("user-personal-data", (user) => {
        parentElement.innerHTML = `
                <div class="columns">
                    <div class="column is-half has-text-left">
                        <h1 class="title has-text-white">${userData.getUsername()}</h1>
                    </div>
                </div>
                <div id="user-stats" class="columns is-flex is-justify-content-center">
                    <div class="column is-one-third has-text-centered" id="nPosts">
                        <h3>${user.posts?.length}</h3>
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
                    ${user.posts ? user.posts.map((e, index) => {
                            return `
                                ${index % 2 === 0 ? "<div class='columns'>" : ""}
                                <div class="column is-half">
                                    <a class="hidden" id="download-file-${e.id}" target="_blank" download></a>
                                    <div class="post box" id="${e.id}">
                                        ${itsme ? `<div class="post-tabs columns">
                                            <div class="column is-one-third has-text-centered post-tab">
                                                <button type="button" class="delete-doc-button" id="${e.id}" class="button btn-transparent">
                                                    <span class="icon">
                                                        <i class="fa-solid fa-trash" style="color: #ff0000;"></i>
                                                    </span>
                                                </button>
                                            </div>
                                            <div class="column is-one-third has-text-centered post-tab">
                                                <button type="button" class="modify-doc-button" id="${e.id}" class="button btn-transparent">
                                                    <span class="icon">
                                                        <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                                                    </span>
                                                </button>
                                            </div>
                                            <div class="column is-one-third post-tab">
                                                <div class="columns">
                                                    <div class="column has-text-centered">
                                                        <button type="button" class="export-pdf-button" id="${e.id}" class="button btn-transparent">
                                                            <span class="icon">
                                                                <i class="fa-solid fa-file-pdf" style="color: #ffffff;"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <div class="column has-text-centered">
                                                        <button type="button" class="export-docx-button" id="${e.id}" class="button btn-transparent">
                                                            <span class="icon">
                                                                <i class="fa-solid fa-file-word" style="color: #ffffff;"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>` : "" }
                                        <div class="header is-flex is-justify-content-space-between">
                                            <div>${userData.getUsername()}</div>
                                        </div>
                                        <div class="personal-preview" style="text-align: center !important;">
                                            <img src="/assets/images/doc-preview.png" alt="doc-thumbnail" id="doc-thumbnail">
                                        </div>
                                        <button type="button" class="mypost-fullscreen" id="${e.id}">
                                            <a href="#fullscreen-view" class="button btn-transparent">
                                                <span class="icon">
                                                    <i class="fa-solid fa-up-right-and-down-left-from-center" style="color: #ffffff;"></i>
                                                </span>
                                            </a>
                                        </button>
                                    </div>
                                </div>
                                ${index % 2 === 1 ? "</div>" : ""}
                            `;
                        }).join("") + (user.posts.length % 2 === 1 ? "</div>" : "") : ""}
                </div>
            `;
            const deleteButtons = document.querySelectorAll(".delete-doc-button");
            deleteButtons.forEach(element => {
                element.onclick = () => {
                    pubSub.publish("delete-document", element.id);
                }
            });

            const fullscreenButtons = document.querySelectorAll(".mypost-fullscreen");
            fullscreenButtons.forEach(element => {
                element.onclick = () => {
                    console.log(element)
                    const post = user.posts.find(e => e.id == element.id);
                    pubSub.publish("open-document-fullscreen",post.path_note);
                }
            });

            const modifyButtons = document.querySelectorAll(".modify-doc-button");
            modifyButtons.forEach(element => {
                element.onclick = () => {
                   const post = user.posts.find(e => e.id == element.id);
                    pubSub.publish("modify-document", [post.path_note, post.id]);
                }
            });

            const exportPdfButtons = document.querySelectorAll(".export-pdf-button");
            exportPdfButtons.forEach(element => {
                element.onclick = () => {
                    pubSub.publish("export-pdf-document", user.posts.find(e => e.id == element.id).path_note);
                }
            });

            const exportDocxButtons = document.querySelectorAll(".export-docx-button");
            exportDocxButtons.forEach(element => {
                element.onclick = () => {
                    pubSub.publish("export-docx-document", user.posts.find(e => e.id == element.id).path_note);
                }
            });
      });
    },
  };
};
