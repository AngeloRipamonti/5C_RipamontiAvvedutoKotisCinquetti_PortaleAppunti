export const generateDocPresenter = (quill, document,view) => {
  return {
    render: function () {
      quill.root.blur();
      if(view) view.render();
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
