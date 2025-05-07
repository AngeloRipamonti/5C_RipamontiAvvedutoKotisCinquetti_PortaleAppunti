export const generateDocumentCreation = (parentElement, pubSub) => {
    pubSub.subscribe("zero-start", () => {
        console.log("dentro")
        const modal = document.getElementById("md");
        if(modal) modal.classList.remove("is-active");
        if(document.getElementById("editor-wrapper").classList.contains("hide")) document.getElementById("editor-wrapper").classList.remove("hide");
    }
);
    return{
        render: function() {
            const html = `
            <div class="modal is-active" id="md">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="tabs is-centered">
                    <ul>
                        <li class="is-active"><a class="tab-doc" id="upload-doc">Upload a document</a></li>
                        <li><a class="tab-doc" id="blank-doc">Start from zero</a></li>
                    </ul>
                </div>
                <div id="body-doc" style="background-color:rgba(225,255,255,1) !important;">
                <div class="file has-name">
                    <label class="file-label">
                        <input class="file-input" type="file" accept=".docx,.doc" />
                        <span class="file-cta">
                        <span class="file-icon">
                            <i class="fas fa-upload"></i>
                        </span>
                        <span class="file-label"> Choose a file… </span>
                        </span>
                    </label>
                    </div>                            
                    <button type="button" class="button is-white" id="submit-doc">SUBMIT</button>
                </div>
            </div>
            <button class="modal-close is-large" id="md-close"></button>
            </div>
            `;
            parentElement.innerHTML = html;
            console.log(document.getElementById("md"));
            document.getElementById("md-close").addEventListener("click", () => {
                document.getElementById("md").classList.remove("is-active");
                document.getElementById("editor-wrapper").classList.add("hide");
                location.href = "#personal";
            });            
            const nodes = document.querySelectorAll(".tab-doc");
            const body_doc = document.getElementById("body-doc");
            if(document.getElementById("submit-doc")) document.getElementById("submit-doc").onclick = () => pubSub.publish("doc-submit");
            nodes.forEach(element => {
                element.onclick = () => {
                    if(!element.parentNode.classList.contains("is-active")) {
                        nodes.forEach(e => e.parentNode.classList.remove("is-active"));
                        element.parentNode.classList.add("is-active");
                        if(element.id === "upload-doc"){
                            body_doc.innerHTML = `
                            <div class="file has-name">
                            <label class="file-label">
                                <input class="file-input" type="file" accept=".docx,.doc" />
                                <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label"> Choose a file… </span>
                                </span>
                            </label>
                            </div>                            
                            <button type="button" class="button is-white" id="submit-doc">SUBMIT</button>`;
                        document.getElementById("submit-doc").onclick = () => pubSub.publish("doc-submit");
                        }else {
                            body_doc.innerHTML = '<button type="button" class="button is-white" id="start-zero">Start from zero</button>';
                            document.getElementById("start-zero").onclick = () => pubSub.publish("zero-start");
                        }
                    }
                }
            });
        }
    }
}