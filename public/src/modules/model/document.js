export const generateDocument = (path, text, title, tags, author, starsAvg) => {
    let id;
    let created_at;
    let visibility;
    return {
        getPath: () => path,
        getText: () => text,
        getTitle: () => title,
        getTags: () => tags,
        getAuthor: () => author,
        getStarsAvg: () => starsAvg,
        setValues:(data) => {
            path = data.path;
            text = data?.text ?? null ;
            author = data.author_email;
            id = data.id;
            created_at = data.created_at;
            visibility = data.visibility;
        }
    }
}