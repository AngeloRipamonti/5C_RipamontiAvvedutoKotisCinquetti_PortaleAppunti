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
    function updateStars(rating) {
        currentRating = rating;
        document.querySelectorAll('.btn-star').forEach(star => {
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
            parentElement.innerHTML += `
                <div class="post-container">
                    <div class="post box">
                        <div class="header is-flex is-justify-content-space-between">
                            <div>${doc.getAuthor()}</div>
                            <div>${renderStars(doc.getStarsAvg())}</div>
                        </div>
                        <div class="preview" style="text-align: center !important;">
                            <img src="/assets/images/doc-preview.png" alt="doc-thumbnail" id="doc-thumbnail">
                        </div>
                        <div class="vote-wrapper">
                            <span class="vote-section">${starsHTML}</span>
                            <button type="button" id="vote-button" class="button btn-transparent">
                                <span class="icon">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            const starsBtns = document.querySelectorAll('.btn-star');
            starsBtns.forEach(star => {
                star.addEventListener('click', function() {
                    let rating = parseInt(star.getAttribute('data-value'));
                    updateStars(rating);
                });
            });

            const vote_button = document.getElementById("vote-button");
            vote_button.onclick = () => pubSub.publish("post-voted", currentRating); //aggiungere il post votatoe freezare stelline dopo aver votato
        }
    }
}