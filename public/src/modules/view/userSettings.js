export const generateUserSettings = (parentElement, pubSub) => {

    return {
        render: function (uData) {
            parentElement.innerHTML = `<div class="columns m-6">
                                        <div class="column is-5">

                                            <div class="group">
                                                <div></div>
                                                <h1 class="title"> Settings </h1>
                                            </div>

                                            <div class="field">
                                                <label class="label">Username</label>
                                                <div class="control">
                                                    <input id="usernameChange" class="input" type="text" value="${uData.getUsername()}"> 
                                                    <button id="changeUsername"  class="button is-primary">Change Username</button>
                                                </div>
                                            </div>

                                            
                                            <div class="field">
                                                <label class="label">Old password</label>
                                                <div class="control">
                                                    <input id="oldPassword" class="input" type="text" placeholder="Insert your old password"/>
                                                </div>
                                            </div>
                                            

                                            <div class="field">
                                                <label class="label">New password</label>
                                                <div class="control">
                                                    <input id="newPassword" class="input" type="text" placeholder="Insert your new password"/> 
                                                </div>
                                            </div>

                                            <div class="field">
                                                <label class="label">Confirm password</label>
                                                <div class="control">
                                                    <input id="confirmPassword" class="input" type="text" placeholder="Confirm your new password"/>
                                                    <button id="changePsw" class="button is-primary">Change Password</button>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="column is-1">
                                            2
                                        </div>
                                        <div class="column is-5">
                                        <img class="user-icon" src="${uData.getThumbnail()}">
                                            <button id="changeThumb" class="button is-primary">Change Thumbnail</button> 

                                            <textarea id="bioChange" class="textarea" value="${uData.getBio()}"></textarea>
                                            <button id="changeBio" class="button is-primary">Change Bio</button>
                                        </div>

                                        <button class="button is-danger">Logout</button>
                                        <button class="button is-danger">Delete Account</button>
                                    </div>`;

            document.getElementById("changeUsername").onclick =  () => pubSub.publish("changeUsername", document.getElementById("usernameChange").value);
            document.getElementById("changePassword").onclick =  () => {
                if(document.getElementById("newPassword").value === document.getElementById("confirmPassword").value) pubSub.publish("changePassword", [document.getElementById("oldPassword").value, document.getElementById("newPassword").value]);
                else alert("Passwords don't match");
            }
            document.getElementById("changeThumb").onclick =  () => {
                // form ecc
            }
            document.getElementById("changeBio").onclick =  () => pubSub.publish("changeBio", document.getElementById("bioChange").value);

            
        }
    }
}