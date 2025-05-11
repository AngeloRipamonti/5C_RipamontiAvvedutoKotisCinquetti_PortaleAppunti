export const generateDocument = (id, created_at, visibility, path, text, tags, author, starsAvg) => {
    return {
        getPath: () => path,
        getText: () => text,
        getTags: () => tags,
        getAuthor: () => author,
        getID: () => id, 
        getStarsAvg: () => starsAvg,
        setValues:(data) => {
            path = data.path_note;
            text = data?.text ?? null ;
            author = data.author_email;
            id = data.id;
            created_at = data.created_at;
            visibility = data.visibility;
        },
        toString: () => {
            return `${path} 
                    ${text}, 
                    ${tags}
                    ${id},
                    ${author},
                    ${starsAvg}
                    `;
        }
    }
}