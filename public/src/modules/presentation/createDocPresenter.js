//import { generateDocument } from "/public/src/modules/model/document.js";

export const generateDocPresenter = () => {
  let document;
  let quill;
  let view;

  return {
    render: function () {
      quill = new Quill("#editor", {
        modules: {
          toolbar: [
            [
              {
                header: [1, 2, false],
              },
            ],
            ["bold", "italic", "underline"],
          ],
        },
        placeholder: "Write something...",
        theme: "snow",
      });
    },
    import: function () {},
  };
};
