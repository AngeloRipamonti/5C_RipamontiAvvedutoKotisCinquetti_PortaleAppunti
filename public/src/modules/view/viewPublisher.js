export const generateViewPublisher = (parentElement, pubSub) => {
    
    return {
        render: function() {
            let prompt = "";
            parentElement.innerHTML = `
            <div class="modal">
            <div class="modal-background"></div>
            <div class="modal-content">
             <h1 id="header" class="title has-text-centered">From zero to hero!</h1>
                <div class="tabs is-centered is-toggle is-toggle-rounded">
                    <ul>
                        <li class="is-active"><a class="tab-doc" id="upload-doc">Upload a document</a></li>
                        <li><a class="tab-doc" id="blank-doc">Start from zero</a></li>
                    </ul>
                </div>
                <div id="body-doc" class="section has-text-centered" style="background-color:rgba(255,255,255,1) !important;">
                    <h1 class="title has-text-centered">Publish your draft</h1>
                    <input class="input" type="text" placeholder="Text title" />
                    <label class="checkbox">
                        <input type="checkbox" />
                        Public post
                    </label>
                    <button class="button is-link" id="add-tag">+</button>
                    <div id="search-tag" class="hide">
                        <p class="control has-icons-left">
							<input class="input" type="text" placeholder="search for tags" id="$tag-searchbar">
							<span class="icon is-left clickableIcon" id="search-tag">
								<i class="fas fa-search"></i>
							</span>
						</p>
                        <div id="search-result"></div>
                    </div>
                    <div id="tags-container"></div>
                </div>
            <button class="modal-close is-large"></button>
            </div>
            `;

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

            pubSub.subsribe("tags-result", (tags) => {
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