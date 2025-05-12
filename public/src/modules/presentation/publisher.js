export const generatePublisher = (pubsub, document, view) => {
    view.render();
    pubsub.subscribe("delete-draft", () => {
        pubsub.publish("delete-document", document.getID());
    });
    return{
        /*
        addTag: function(tag) {
            
        },
        createNewTag: function(tag) {

        }*/
    }
}