import {generateUserSettingsPresenter} from "../presentation/userSettingsPresenter.js";

export const generateUserSettings = (parentElement, pubSub) => {

    //variables
    
    return{
        render : function (settings){
            settings
            const html = `
            <div class="columns">
        <div class="column is-5">

            <div class="group">
                <div></div>
                <h1 class="title"> Settings </h1>
            </div>

            <div class="field">
                <label class="label">Username</label>
                <div class="control">
                    <input class="input" type="text" placeholder="Username"/><!-- da sostituire il placeholder -->
                </div>
            </div>

            <div class="field">
                <label class="label">Old password</label>
                <div class="control">
                    <input class="input" type="text" placeholder="password"/> <!-- da sostituire il placeholder -->
                </div>
            </div>

            <div class="field">
                <label class="label">New password</label>
                <div class="control">
                    <input class="input" type="text" placeholder="new password"/> <!-- da sostituire il placeholder -->
                </div>
            </div>

            <div class="field">
                <label class="label">Confirm password</label>
                <div class="control">
                    <input class="input" type="text" placeholder="new password"/> <!-- da sostituire il placeholder -->
                </div>
            </div>

        </div>
        <div class="column is-1">
            2
        </div>
        <div class="column is-5">
            <textarea class="textarea" placeholder="bio content"></textarea>
        </div>
    </div>
            `;
            parentElement.innerHTML = html;
        }
    }
}