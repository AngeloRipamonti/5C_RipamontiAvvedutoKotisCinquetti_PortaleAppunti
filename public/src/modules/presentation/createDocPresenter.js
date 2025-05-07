export const generateDocPresenter = (document,view) => {
  const quill = new Quill("#editor", {
    modules: {
      toolbar: [
        ["bold", "italic", "underline"]
      ]
    },
    placeholder: "Write something...",
    theme: "snow"
  });  

  return {

    render: function () {
      quill.root.blur();
      view.render();
    },
    import: function () {

    },
    document: document,
  };
};
