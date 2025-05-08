export const generatePublisher = (pubsub, document, view) => {
    view.render();
    pubsub.subscribe("publish-button-clicked", () => {
        //pubblica documento
    });
    
    return{
        addTag: function(tag) {

        },
        createNewTag: function(tag) {

        }
    }
}