export const generateCredentialManager = (parentElement, pubSub) => {
  return {
    renderLogin: function () {
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
                <input class="input" type="email" id="emailInput" placeholder="Email" required>
              </div>
              <div class="control">
                <button type="button" id="loginButton" class="button is-success">Login</button>
              </div>
            </div>
          </div>
    
          <div id="error_area" class="has-text-danger mt-2"></div>
        </div>
      `;
    
      document.getElementById("loginButton").onclick = () => {
        const emailInput = document.getElementById("emailInput");
        const errorArea = document.getElementById("error_area");
    
        if (!emailInput.checkValidity()) {
          errorArea.textContent = "Please enter a valid email address.";
          return;
        }
    
        errorArea.textContent = "";
        pubSub.publish("isLogged", emailInput.value);
      };
    },

    renderRegister: function () {
      parentElement.innerHTML = `
        <div class="modal is-active">
          <div class="modal-background"></div>
    
          <div class="modal-content">
            <div class="box">
              <h2 class="title is-4 has-text-centered">Sign up</h2>
    
              <div class="field">
                <label class="label" for="usernameInput">Username</label>
                <div class="control">
                  <input class="input" type="text" id="usernameInput" placeholder="Enter username" required>
                </div>
              </div>
    
              <div class="field">
                <label class="label" for="emailInput">Email</label>
                <div class="control">
                  <input class="input" type="email" id="emailInput" placeholder="Enter email" required>
                </div>
              </div>
    
              <div class="field is-grouped is-grouped-centered">
                <div class="control">
                  <button type="button" id="signupButton" class="button is-primary">Sign up</button>
                </div>
              </div>
    
              <div id="error_area" class="has-text-danger mt-2"></div>
            </div>
          </div>
    
          <button class="modal-close is-large" id="closeModal" aria-label="close"></button>
        </div>
      `;
    
      document.getElementById("signupButton").onclick = () => {
        const usernameInput = document.getElementById("usernameInput");
        const emailInput = document.getElementById("emailInput");
        const errorArea = document.getElementById("error_area");
    
        if (!usernameInput.checkValidity()) {
          errorArea.textContent = "Please enter a username.";
          return;
        }
    
        if (!emailInput.checkValidity()) {
          errorArea.textContent = "Please enter a valid email address.";
          return;
        }
    
        errorArea.textContent = "";
        pubSub.publish("isRegisted", [usernameInput.value, emailInput.value]);
      };
    
      document.getElementById("closeModal").onclick = () => {
        pubSub.publish("close-modal");
      };
    }    

  };
};
