export const generateCredentialManager = (parentElement, pubSub) => {

    return{
        renderLogin: function() {

            parentElement.innerHTML = `
            <div class="container has-text-centered">

                <div class="titles">
                    <h1 class="title is-1">Take notes and share them with everyone</h1>
                    <h2 class="subtitle is-3">Welcome on mind sharing!</h2>
                </div>
            
           <div class="mt-5">
                <p class="has-text-centered mb-3 is-size-4"><strong>Sign in to get started</strong></p>
                <div class="login-box">
                    <input type="text" id="emailInput" placeholder="Email">
                    <button type="button" id="loginButton" class="button is-link is-light">Login</button>
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

                <h2>Sign up</h2>

                <div class="input-container">
                    <label for="username">Username</label>
                    <input type="text" id="username">
                </div>
                <div class="input-container">
                    <label for="email">Email</label>
                    <input type="email" id="email">
                </div>
                
                <div class="modal-footer">
                    <button type="button" id="signupButton" class="btn btn-primary">Sign up</button>
                </div>`;

                document.getElementById("signupButton").onclick =  () => {
                    let username = document.getElementById("username").value;
                    let email = document.getElementById("email").value;

                     pubSub.publish("isRegisted", [username, email]);
                }

        }
    }
}