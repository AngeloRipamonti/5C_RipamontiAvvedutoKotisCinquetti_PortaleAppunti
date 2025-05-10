export const generateSearchbar = (parentElement, pubsub) => {

    return {
        render: (id, placeholder) => {
            let html = `<p class="control has-icons-left has-icons-right" id="$IDContainer">
                            <input class="input" type="text" placeholder="$PLACEHOLDER" id="$ID">
                            <span class="icon is-left clickableIcon" id="$IDSearch">
                                <i class="fas fa-search"></i>
                            </span>
                            <span class="icon is-right clickableIcon" id="$IDCancelSearch">
                                <i class="fa-solid fa-xmark"></i>
                            </span>
                        </p>`.replaceAll("$ID", id).replace("$PLACEHOLDER", placeholder);
            parentElement.innerHTML = html;

            const searchBar = document.getElementById(id);

            const triggerSearch = () => {
                const value = searchBar.value.trim();
                if (value) {
                    if (value.startsWith('#')) {
                        pubsub.publish('onsearch-tag', { id, tag: value.slice(1) });
                    } else {
                        pubsub.publish('onsearch-user', { id, username: value });
                    }
                }
            };

            const cancelSearchIcon = document.getElementById(id + "CancelSearch");
            const searchIcon = document.getElementById(id + "Search");

            cancelSearchIcon.onclick = () => {
                searchBar.value = "";
                pubsub.publish("oncancel", { id });
            };

            searchIcon.onclick = triggerSearch;

            searchBar.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    triggerSearch();
                }
            });
        },
    };
};
