const mysql = require('mysql2/promise');

module.exports = function database() {
    let db;

    async function _query(sql, params) {
        return (await db.execute(sql, params))[0];
    }

    async function _get(sql, params) {
        return (await db.execute(sql, params))[0][0] || null;
    }

    return {
        setup: async function (config) {
            try {
                db = await mysql.createConnection(config);
            } catch (err) {
                console.error(`Errore nella connessione al database: ${err.message}`);
                throw err;
            }

            await Promise.all([
                db.execute(`CREATE TABLE IF NOT EXISTS users(
                            email VARCHAR(255) PRIMARY KEY,
                            password TEXT NOT NULL,
                            password_salt TEXT NOT NULL,
                            username VARCHAR(255) NOT NULL UNIQUE,
                            bio TEXT,
                            path_thumbnail VARCHAR(255) DEFAULT '/assets/images/default_profile.png'
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS follows_users(
                            email_parent VARCHAR(255),
                            email_child VARCHAR(255),
                            PRIMARY KEY (email_parent, email_child),
                            CONSTRAINT fk_parent FOREIGN KEY (email_parent) REFERENCES users(email)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE,
                            CONSTRAINT fk_child FOREIGN KEY (email_child) REFERENCES users(email)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS notes(
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            path_note TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            visibility BOOL DEFAULT false,
                            author_email VARCHAR(255) NOT NULL,
                            CONSTRAINT fk_notes_author FOREIGN KEY (author_email) REFERENCES users(email)
                                ON DELETE RESTRICT
                                ON UPDATE CASCADE
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS tags(
                            name VARCHAR(255) PRIMARY KEY
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS notes_tags(
                            id INT,
                            name VARCHAR(255),
                            PRIMARY KEY (id, name),
                            CONSTRAINT fk_notes_tags_id FOREIGN KEY (id) REFERENCES notes(id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE,
                            CONSTRAINT fk_notes_tags_name FOREIGN KEY (name) REFERENCES tags(name)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS notes_edit(
                            author_email VARCHAR(255),
                            id INT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (author_email, id),
                            CONSTRAINT fk_notes_edit_author FOREIGN KEY (author_email) REFERENCES users(email)
                                ON DELETE RESTRICT
                                ON UPDATE CASCADE,
                            CONSTRAINT fk_notes_edit_id FOREIGN KEY (id) REFERENCES notes(id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS feedbacks(
                            author_email VARCHAR(255),
                            id INT,
                            n_star INT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (author_email, id),
                            CONSTRAINT fk_feedbacks_author FOREIGN KEY (author_email) REFERENCES users(email)
                                ON DELETE RESTRICT
                                ON UPDATE CASCADE,
                            CONSTRAINT fk_feedbacks_id FOREIGN KEY (id) REFERENCES notes(id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
                        );`)
            ]).catch((err) => {
                console.error(`Errore nella creazione delle tabelle: ${err.message}`);
                throw err;
            });
            console.log("Database setup completato.");
        },
        // Users
        registerUser: async function (email, password, password_salt, username) {
            await db.execute(`INSERT INTO users (email, password, password_salt, username) VALUES (?, ?, ?, ?);`, [email, password, password_salt, username]);
        },
        loginUser: async function (email) {
            return await _get(`SELECT * FROM users WHERE email = ?;`, [email]);
        },
        updateUserPassword: async function (email, password, password_salt) {
            await db.execute(`UPDATE users SET password = ?, password_salt = ? WHERE email = ?;`, [password, password_salt, email]);
        },
        updateUserUsername: async function (email, username) {
            await db.execute(`UPDATE users SET username = ? WHERE email = ?;`, [username, email]);
        },
        updateUserThumbnail: async function (email, path_thumbnail) {
            await db.execute(`UPDATE users SET path_thumbnail = ? WHERE email = ?;`, [path_thumbnail, email]);
        },
        updateUserBio: async function (email, bio) {
            await db.execute(`UPDATE users SET bio = ? WHERE email = ?;`, [bio, email]);
        },
        deleteUser: async function (email) {
            await db.execute(`DELETE FROM users WHERE email = ?;`, [email]);
        },
        getUser: async function (username) {
            return await _get(`SELECT username, bio, path_thumbnail FROM users WHERE username = ?;`, [username]);
        },
        // Follow
        followUser: async function (email, username) {
            const email_child = await _get(`SELECT email FROM users WHERE username = ?;`, [username]);
            await db.execute(`INSERT INTO follows_users (email_parent, email_child) VALUES (?, ?);`, [email, email_child]);
        },
        unfollowUser: async function (email, username) {
            const email_child = await _get(`SELECT email FROM users WHERE username = ?;`, [username]);
            await db.execute(`DELETE FROM follows_users WHERE email_parent = ? AND email_child = ?;`, [email, email_child]);
        },
        getFollows: async function (username) {
            const email = (await _get(`SELECT email FROM users WHERE username = ?;`, [username])).email;
            return (await _get(`SELECT COUNT(*) AS count FROM follows_users WHERE email_parent = ?;`, [email])).count;
        },
        getFollowers: async function (username) {
            const email = (await _get(`SELECT email FROM users WHERE username = ?;`, [username])).email;
            return (await _get(`SELECT COUNT(*) AS count FROM follows_users WHERE email_child = ?;`, [email])).count;
        },
        // Notes
        createNote: async function (path_note, author_email){
            await db.execute("INSERT INTO notes (path_note, author_email) VALUES (?, ?);", [path_note, author_email]);
        },
        deleteNote: async function (id){
            await db.execute("DELETE FROM notes WHERE id = ?;", [id]);
        },
        findNote: async function (path){
            return await _get(`SELECT * FROM notes WHERE path_note = ?;`, [path]);
        },
        findNoteByUser: async function(username){
            const email = (await _get(`SELECT email FROM users WHERE username = ?;`, [username])).email;
            return await _get(`SELECT * FROM notes WHERE author_email = ?;`, [email]);
        }
    }
}