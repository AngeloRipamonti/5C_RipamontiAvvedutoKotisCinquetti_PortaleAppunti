export const generateViewNote = (parentElement, pubSub) => {
    let currentRating = 0;

    function renderStars(starsAvg) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < starsAvg) {
                stars += '<i class="fa-solid fa-star"></i>';
            } else {
                stars += '<i class="fa-regular fa-star"></i>';
            }
        }
        return stars;
    }
    function updateStars(rating, post) {
        currentRating = rating;
        const starsBtns = post.querySelectorAll('.btn-star')
        starsBtns.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            const icon = star.querySelector("svg");
            if (starValue <= rating) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid'); 
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    }
    return{
        render: function(doc) {
            currentRating = 0;
            let starsHTML = '';
            for (let i = 0; i < 5; i++) {
                starsHTML += `<button class="btn-star" data-value="${i + 1}"><i class="fa-regular fa-star star"></i></button>`;
            }
            parentElement.innerHTML = `
                <div class="post-container">
                    <div class="post box">
                        <div class="header is-flex is-justify-content-space-between">
                            <div>${doc.getAuthor()}</div>
                            <div>${renderStars(doc.getStarsAvg())}</div>
                        </div>
                        <div class="preview" style="text-align: center !important;">
                            <img src="/assets/images/doc-preview.png" alt="doc-thumbnail" id="doc-thumbnail">
                        </div>
                        <div class="columns">
                            <div class="vote-wrapper column is-half">
                                <span class="vote-section">${starsHTML}</span>
                                <button type="button" id="vote-button" class="button btn-transparent">
                                    <span class="icon">
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </span>
                                </button>
                            </div>
                            <div class="column is-half has-text-right">
                               <button type="button" id="open-fullscreen">
                                    <a href="#fullscreen-view" class="button btn-transparent">
                                        <span class="icon">
                                            <i class="fa-solid fa-up-right-and-down-left-from-center" style="color: #ffffff;"></i>
                                        </span>
                                    </a>
                               </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const thisPost = parentElement;
            console.log(parentElement.parentElement)
            const starsBtns = thisPost.querySelectorAll('.btn-star');
            starsBtns.forEach(star => {
                star.addEventListener('click', function() {
                    let rating = parseInt(star.getAttribute('data-value'));
                    updateStars(rating, thisPost);
                });
            });

            const vote_button = thisPost.querySelector("#vote-button");
            vote_button.onclick = () => pubSub.publish("post-voted", {star: currentRating, id: doc.getID()});

            const fullscreen_button = thisPost.querySelector("#open-fullscreen");
            fullscreen_button.onclick = () => pubSub.publish("open-document-fullscreen",doc.getPath());
        }
    }
}