export const generateUserSettings = (parentElement, pubSub) => {

    return {
        render: function (uData) {
            parentElement.innerHTML = `
                <h1 class="title has-text-white">Settings</h1>
                <div id="formThumbnail" class="is-hidden">
                    <div class="file is-normal is-boxed">
                        <label class="file-label">
                            <input id="thumbnailUpload" class="file-input" accept="image/*" type="file" name="resume" />
                            <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label"> Thumbnail </span>
                              <button id="thumbnailConfirm" class="button is-primary">Submit</button>
                            </span>
                        </label>
                    </div>
                </div>
                <div class="columns mt-6">
                    <div class="column is-half">
                        <div class="columns is-vcentered">
                            <div class="column">
                                <label class="label" for="usernameChange">Username</label>
                                <input id="usernameChange" class="input" type="text" value="${uData.getUsername()}"> 
                            </div>
                            <div class="column is-narrow">
                                <button id="changeUsername" class="button is-primary">Change Username</button>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <label class="label" for="oldPassword">Old password</label>
                                <input id="oldPassword" class="input" type="password" placeholder="Insert your old password"/>
                            </div>
                            </div>

                            <div class="columns">
                            <div class="column">
                                <label class="label" for="newPassword">New password</label>
                                <input id="newPassword" class="input" type="password" placeholder="Insert your new password"/> 
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <label class="label" for="confirmPassword">Confirm password</label>
                                <input id="confirmPassword" class="input" type="password" placeholder="Confirm your new password"/>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <button id="changePassword" class="button is-primary mt-4">Change Password</button>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column is-one-fifth">
                                <img class="user-icon" src="${uData.getThumbnail()}">
                            </div>
                            <div class="column">
                                <button id="changeThumb" class="button is-primary mt-5">Change Thumbnail</button>
                            </div>
                        </div>
                    </div>
                    <div class="column is-half">
                        <textarea id="bioChange" class="textarea mt-4">${uData.getBio() || ""}</textarea>
                        <div class="mt-4">
                            <button id="changeBio" class="button is-primary">Change Bio</button>
                        </div>

                        <div class="mt-4">
                            <button class="button is-danger">Logout</button>
                        </div>

                        <div class="mt-4">
                            <button class="button is-danger">Delete Account</button>
                        </div>
                    </div>
                </div>`;
            document.getElementById("changeUsername").onclick = () => pubSub.publish("changeUsername", document.getElementById("usernameChange").value);
            document.getElementById("changePassword").onclick = () => {
                if (document.getElementById("newPassword").value === document.getElementById("confirmPassword").value) pubSub.publish("changePassword", [document.getElementById("oldPassword").value, document.getElementById("newPassword").value]);
                else alert("Passwords don't match");
            }
            document.getElementById("changeThumb").onclick = () => {
                document.getElementById("formThumbnail").classList.remove("is-hidden");
                document.getElementById("thumbnailConfirm").onclick = () => {
                    const fileInput = document.getElementById("thumbnailUpload");
                    const file = fileInput.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            pubSub.publish('changeThumbnail', { fileName: file.name, fileData: event.target.result });
                        };
                        reader.readAsDataURL(file);
                    }
                }
                document.getElementById("changeBio").onclick = () => pubSub.publish("changeBio", document.getElementById("bioChange").value);
            }
        }
    }
}