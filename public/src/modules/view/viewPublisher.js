export const generateViewPublisher = (parentElement, pubSub) => {
    return {
        render: function() {
            let prompt = "";
            parentElement.innerHTML = `
            <div class="modal" id="publish-modal">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div id="body-pub" class="section" style="background-color:rgba(255,255,255,1) !important;">
                    <h1 class="title has-text-centered has-text-black">Publish your draft</h1>
                    <input class="input" id="title-field" type="text" placeholder="Text title" />
                    <div>
                        <label class="checkbox">
                            <input type="checkbox" />
                            Public post
                        </label>
                    </div>
                    <div class="tag-row is-flex is-align-items-center">
                        <button class="button is-link" id="add-tag">+</button>
                        <div id="tags-container" class="ml-2 is-flex is-flex-wrap-wrap"></div>
                    </div>
                    <div id="search-tag" class="hide">
                        <p class="control has-icons-left">
							<input class="input" type="text" placeholder="search for tags" id="tag-searchbar">
							<span class="icon is-left clickableIcon" id="search-tag">
								<i class="fas fa-search"></i>
							</span>
						</p>
                        <div id="search-result"></div>
                    </div>
                    <button type="button" class="button is-link" id="publish-post">Publish</button>
                </div>
                <button class="modal-close is-large" aria-label="close" id="close-pub-modal"></button>
            </div>
            `;

            const close_modal = document.getElementById("close-pub-modal");
            close_modal.addEventListener("click", () => {
                close_modal.classList.remove("is-active");
                location.href = "#personal";
            });

            const search_container = document.getElementById("search-tag");
            const search_tag = document.getElementById("search-tag");
            const search_result = document.getElementById("search-result");
            const addTag = document.getElementById("add-tag");
            addTag.onclick = () => {
                search_container.classList.remove("hide");
            }
            search_container.onclick = () => {
                if(search_tag.value) {
                    prompt = search_tag.value;
                    search_container.classList.add("hide");
                    pubSub.publish("search-tag", search_tag.value);
                }
            }

            const publish_post = document.getElementById("publish-post");
            publish_post.onclick = () => {
                pubSub.publish("publish-button-clicked");
            }

            pubSub.subscribe("tags-result", (tags) => {
                if(tags) {
                    search_result.innerHTML = tags.map((e) => {
                        return `
                            <div class="tag-display">${e}</div>
                        `;
                    })
                }
                else {
                    search_result.innerHTML = `
                        <h3 class="has-text-centered">No results found for ${prompt}</h3>
                        <button class="btn is-trasparent" id="create-new-tag">Wanna create it?</button>
                    `;
                    const create_new_tag = document.getElementById("create-new-tag");
                    create_new_tag.onclick = () => {
                        pubSub.publish("create-new-tag", prompt);
                    }
                }
            });
        }
    }
}