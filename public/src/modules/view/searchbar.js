export const generateSearchbar = (parentElement, pubsub) => {
    let id, placeholder;

    const searchbar = {
        build: (inputId, inputPlaceholder) => {
            id = inputId;
            placeholder = inputPlaceholder;
        },
        render: () => {
            let html = `
                        <p class="control has-icons-left has-icons-right" id="${id}Container">
                            <input class="input" type="text" placeholder="${placeholder}" id="${id}">
                            <span class="icon is-left clickableIcon" id="${id}Search">
                                <i class="fas fa-search"></i>
                            </span>
                            <span class="icon is-right clickableIcon" id="${id}CancelSearch">
                                <i class="fa-solid fa-xmark"></i>
                            </span>							
                        </p>`;

            parentElement.innerHTML = html;

            const searchBar = document.getElementById(id);

            searchBar.oninput = () => {
                if (searchBar.value === "") {
                    pubsub.publish(id + "-oncancel");
                }
            };
            searchBar.addEventListener("keydown", (event) => {
                if (event.key === "Enter" && searchBar.value) {
                    pubsub.publish(id + "-onsearch", searchBar.value);
                }
            });
            
            const cancelSearchIcon = document.getElementById(id + "CancelSearch");
            
            cancelSearchIcon.onclick = () => {
                if (searchBar.value) {
                    searchBar.value = "";
                    pubsub.publish(id + "-oncancel");
                }
            };

            const searchIcon = document.getElementById(id + "Search");
            
            searchIcon.onclick = () => {
                if (searchBar.value) {
                    pubsub.publish(id + "-onsearch", searchBar.value);
                }
            };
        },
        changeVisibility: (visibility) => {
            if (visibility) {
                document.getElementById(id + "Container").classList.remove("is-hidden");
            }
            else {
                document.getElementById(id + "Container").classList.add("is-hidden");
            }
        }
    };

    return searchbar;
};