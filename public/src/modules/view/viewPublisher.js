export const generateViewPublisher = (parentElement, pubSub) => {
    return {
        render: function () {
            let prompt = "";

            parentElement.innerHTML = `
                <div class="modal" id="publish-modal">
                    <div class="modal-background"></div>
                    <div class="modal-content">
                        <div id="body-pub" class="section" style="background-color:rgba(255,255,255,1) !important;">
                            <h1 class="title has-text-centered has-text-black">Publish your draft</h1>
                            <div>
                                <label class="checkbox">
                                    <input type="checkbox" id="vis_toggle" />
                                    Public post
                                </label>
                            </div>
                            <div class="tag-row is-flex is-align-items-center">
                                <button class="button is-link" id="add-tag">+</button>
                                <div id="tags-container" class="ml-2 is-flex is-flex-wrap-wrap"></div>
                            </div>
                            <div id="search-tag-container" class="hide">
                                <p class="control has-icons-left">
                                    <input class="input" type="text" placeholder="search for tags" id="tag-searchbar">
                                    <span class="icon is-left clickableIcon" id="search-icon">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </p>
                                <div id="search-result"></div>
                            </div>
                            <button type="button" class="button is-link" id="publish-post">Publish</button>
                        </div>
                        <button class="modal-close is-large" aria-label="close" id="close-pub-modal"></button>
                    </div>
                </div>
            `;

            const close_modal = document.getElementById("close-pub-modal");
            close_modal.addEventListener("click", () => {
                close_modal.classList.remove("is-active");
                pubSub.publish("delete-draft");
                location.href = "#personal";
            });

            const search_container = document.getElementById("search-tag-container");
            const search_input = document.getElementById("tag-searchbar");
            const search_icon = document.getElementById("search-icon");
            const search_result = document.getElementById("search-result");
            const tags_container = document.getElementById("tags-container");

            const addTag = document.getElementById("add-tag");
            addTag.onclick = () => {
                search_container.classList.remove("hide");
                search_input.focus();
                search_input.value = "";
                search_result.innerHTML = "";
            };

            const doSearch = () => {
                if (search_input.value.trim()) {
                    prompt = search_input.value.trim();
                    pubSub.publish("search-tag", prompt);
                }
            };

            search_icon.onclick = doSearch;
            search_input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    doSearch();
                }
            });

            const publish_post = document.getElementById("publish-post");
            const visibility = document.getElementById("vis_toggle");
            publish_post.onclick = () => {
                pubSub.publish("publish-button-clicked", visibility.checked);
            };

            pubSub.subscribe("tags-result", ([tags, tag]) => {
                search_container.classList.remove("hide");

                const filter = tags.filter(e => e.name == tag);

                if (filter && filter.length > 0) {
                    search_result.innerHTML = filter.map((tag) => {
                        return `<div class="tag-display clickableTag">${tag.name}</div>`;
                    }).join('');

                    // Aggiunge il tag cliccato
                    document.querySelectorAll(".clickableTag").forEach((el) => {
                        el.onclick = () => {
                            tags_container.innerHTML += `
                                <span class="tag is-info m-1">${el.textContent}</span>
                            `;
                            search_container.classList.add("hide");
                        };
                    });

                } else {
                    search_result.innerHTML = `
                        <h3 class="has-text-centered">No results found for "${prompt}"</h3>
                        <button class="button is-text" id="create-new-tag">Wanna create it?</button>
                    `;
                    const create_new_tag = document.getElementById("create-new-tag");
                    create_new_tag.onclick = () => {
                        pubSub.publish("create-new-tag", prompt);
                        search_container.classList.add("hide");
                    };
                }
            });
        }
    };
};
