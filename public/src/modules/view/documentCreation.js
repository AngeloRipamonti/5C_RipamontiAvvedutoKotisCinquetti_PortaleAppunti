export const generateDocumentCreation = (parentElement, pubSub) => {
    pubSub.subscribe("zero-start", () => {
        const modal = document.getElementById("md");
        if (modal) modal.classList.remove("is-active");
        if (document.getElementById("editor-wrapper").classList.contains("hide")) document.getElementById("editor-wrapper").classList.remove("hide");
    });
    pubSub.subscribe("importDocumentSocket", () => {
        const modal = document.getElementById("md");
        if (modal) modal.classList.remove("is-active");
        if (document.getElementById("editor-wrapper").classList.contains("hide")) document.getElementById("editor-wrapper").classList.remove("hide");
    });
    
    return {
        render: function () {
            const html = `
            <div class="modal is-active" id="md">
            <div class="modal-background"></div>
            <div class="modal-content">
             <h1 id="header" class="title has-text-centered">From zero to hero!</h1>
                <div class="tabs is-centered is-toggle is-toggle-rounded">
                    <ul>
                        <li class="is-active"><a class="tab-doc" id="upload-doc">Upload a document</a></li>
                        <li><a class="tab-doc" id="blank-doc">Start from zero</a></li>
                    </ul>
                </div>
                <div id="body-doc" class="section has-text-centered" style="background-color:rgba(255,255,255,1) !important;">
                <div class="file has-name">
                    <label class="file-label">
                        <input id="file-input" class="file-input" type="file" accept=".docx,.doc" />
                        <span class="file-cta">
                        <span class="file-icon">
                            <i class="fas fa-upload"></i>
                        </span>
                        <span class="file-label">Choose a file…</span>
                        </span>
                        <span class="file-name" style="color: black !important;">Just docx</span>
                    </label>
                    </div>                            
                    <button type="button" class="button is-link" id="submit-doc">SUBMIT</button>
                </div>
            </div>
            <button class="modal-close is-large" id="md-close"></button>
            </div>
            `;
            parentElement.innerHTML = html;
            document.getElementById("md-close").addEventListener("click", () => {
                document.getElementById("md").classList.remove("is-active");
                document.getElementById("editor-wrapper").classList.add("hide");
                location.href = "#personal";
            });
            const nodes = document.querySelectorAll(".tab-doc");
            const header = document.getElementById("header");
            const body_doc = document.getElementById("body-doc");
            if (document.getElementById("submit-doc")) document.getElementById("submit-doc").onclick = () => {
                const fileInput = document.getElementById('file-input');
                const file = fileInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const arrayBuffer = event.target.result;
                        const uint8Array = new Uint8Array(arrayBuffer);
                        pubSub.publish('uploadFile', {
                            fileName: file.name,
                            fileData: Array.from(uint8Array),
                        });
                    };
                    reader.readAsArrayBuffer(file);
                }
            };
            nodes.forEach(element => {
                element.onclick = () => {
                    if (!element.parentNode.classList.contains("is-active")) {
                        nodes.forEach(e => e.parentNode.classList.remove("is-active"));
                        element.parentNode.classList.add("is-active");
                        if (element.id === "upload-doc") {
                            header.innerText = "Upload a document";
                            body_doc.innerHTML = `
                            <div class="file has-name">
                                <label class="file-label">
                                    <input id="file-input" class="file-input" type="file" accept=".docx,.doc" />
                                    <span class="file-cta">
                                    <span class="file-icon">
                                        <i class="fas fa-upload"></i>
                                    </span>
                                    <span class="file-label">Choose a file…</span>
                                    </span>
                                    <span class="file-name" style="color: black !important;">Just docx</span>
                                </label>
                                </div>                            
                                <button type="button" class="button is-link" id="submit-doc">SUBMIT</button>
                            </div>                           
                            `;
                            document.getElementById("submit-doc").onclick = () => {
                                const fileInput = document.getElementById('file-input');
                                const file = fileInput.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = function (event) {
                                        const arrayBuffer = event.target.result;
                                        const uint8Array = new Uint8Array(arrayBuffer);
                                        pubSub.publish('uploadFile', {
                                            fileName: file.name,
                                            fileData: Array.from(uint8Array),
                                        });
                                    };
                                    reader.readAsArrayBuffer(file);
                                }
                            }
                        }
                        else {
                            header.innerText = "From zero to hero!";
                            body_doc.innerHTML = `
                                <button type="button" class="button is-link" id="start-zero">Start from zero</button>
                                <p style="color: black !important;">Start with a black file!</p>
                                `;
                            document.getElementById("start-zero").onclick = () => pubSub.publish("zero-start");
                        }
                    }
                }
            });
        }
    }
}