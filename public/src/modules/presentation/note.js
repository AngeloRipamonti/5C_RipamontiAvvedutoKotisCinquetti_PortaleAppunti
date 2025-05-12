export const generateNote = (pubSub, document, view) => {
    return{
        render: () => {
            view.render(document)
        },
        /*
        export: function(type) {
            
        },
        archive: function() {
            
        },
        save: function() {
            
        }*/
    }
}