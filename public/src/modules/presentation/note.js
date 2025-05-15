export const generateNote = (pubSub, document, view) => {
    return{
        render: () => {
            view.render(document)
        }
    }
}