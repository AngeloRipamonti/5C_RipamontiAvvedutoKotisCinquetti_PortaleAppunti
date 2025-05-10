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
    import: function (html) {
      let delta = quill.clipboard.convert(html);
      if(delta.ops){
        quill.clipboard.dangerouslyPasteHTML(html);
      } else quill.setContents(delta);
    },
    getText: function (){
      return quill.getContents().ops ? quill.root.innerHTML : quill.getContents();
    },
    document: document,
  };
};
