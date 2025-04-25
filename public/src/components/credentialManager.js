export const credentialManager = (parentElement, pubSub) => {

    return{
        renderLogin: function() {

            parentElement.innerHTML = `
            <div>
                <h2>Take notes and share them with everyone</h2>
            </div>

            <div>
                <h3>Welcome on mind sharing!</h3>
            </div>

           <div>
                <label for="email">Sign in to get started</label>
                <input type="text" id="emailInput" placeholder="Email">
            </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="loginButton" class="btn btn-primary">Login</button>
            </div>
            <div id="error_area">
            </div>`;

            document.getElementById("loginButton").onclick =  () => {
                const email = document.getElementById("emailInput").value;
                 pubSub.publish("isLogged", email);
            }

            document.getElementById("signupButton").onclick =  () => {
                 pubSub.publish("signUp");
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