export const generateDocPresenter = (document,view) => {
    const quill = new Quill("#editor", {
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

  return {

    render: function () {
      view.render();
    },
    import: function () {

    },
  };
};
