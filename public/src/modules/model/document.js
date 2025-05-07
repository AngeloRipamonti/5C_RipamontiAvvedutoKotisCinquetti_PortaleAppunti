export const generateDocument = (path, text, title, tags, author, starsAvg) => {
    return {
        getPath: () => path,
        getText: () => text,
        getTitle: () => title,
        getTags: () => tags,
        getAuthor: () => author,
        getStarsAvg: () => starsAvg,
        setValues:(data) => {
            path = data.path;
            text = data.text;
            author = data.author;
        }
    }
}