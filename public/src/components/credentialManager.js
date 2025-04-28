export const generateCredentialManager = (parentElement, pubSub) => {

    return{
        renderLogin: function() {

            parentElement.innerHTML = `
                <div class="container has-text-centered">

            <div class="section">
                <h1 class="title is-1">Take notes and share them with everyone</h1>
                <h2 class="subtitle is-3">Welcome on mind sharing!</h2>
            </div>

            <div class="section">
                <p class="has-text-centered mb-4 is-size-4"><strong>Sign in to get started</strong></p>

                <div class="field is-grouped is-grouped-centered">
                <div class="control">
                    <input class="input" type="email" id="emailInput" placeholder="Email">
                </div>
                <div class="control">
                    <button type="button" id="loginButton" class="button is-success">Login</button>
                </div>
                </div>
            </div>

            <div id="error_area"></div>

            </div>

            `;

            document.getElementById("loginButton").onclick =  () => {
                const email = document.getElementById("emailInput").value;
                 pubSub.publish("isLogged", email);
            }
        },

        renderRegister: function() {

            parentElement.innerHTML = `
                    <div class="modal is-active">
            <div class="modal-background"></div>

            <div class="modal-content">
                <div class="box">
                <h2 class="title is-4 has-text-centered">Sign up</h2>

                <div class="field">
                    <label class="label" for="username">Username</label>
                    <div class="control">
                    <input class="input" type="text" id="usernameInput" placeholder="Enter username">
                    </div>
                </div>

                <div class="field">
                    <label class="label" for="email">Email</label>
                    <div class="control">
                    <input class="input" type="email" id="emailInput" placeholder="Enter email">
                    </div>
                </div>

                <div class="field is-grouped is-grouped-centered">
                    <div class="control">
                    <button type="button" id="signupButton" class="button is-primary">Sign up</button>
                    </div>
                </div>
                </div>
            </div>

            <button class="modal-close is-large" id="closeModal" aria-label="close"></button>
            </div>
               `;

                document.getElementById("signupButton").onclick =  () => {
                    let username = document.getElementById("username").value;
                    let email = document.getElementById("email").value;

                     pubSub.publish("isRegisted", [username, email]);
                }
                document.getElementById("closeModal").onclick =  () => {
                    pubSub.publish("close-modal");
                }
        }
    }
}