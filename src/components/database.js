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
                            email TEXT PRIMARY KEY,
                            password TEXT NOT NULL,
                            password_salt TEXT NOT NULL,
                            username TEXT NOT NULL,
                            bio TEXT,
                            path_thumbnail TEXT DEFAULT '/assets/images/default_profile.png'
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS follows_users(
                            email_parent TEXT,
                            email_child TEXT,
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
                            author_email TEXT NOT NULL,
                            CONSTRAINT fk_notes_author FOREIGN KEY (author_email) REFERENCES users(email)
                                ON DELETE RESTRICT
                                ON UPDATE CASCADE
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS tags(
                            name TEXT PRIMARY KEY
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS notes_tags(
                            id INT,
                            name TEXT,
                            PRIMARY KEY (id, name),
                            CONSTRAINT fk_notes_tags_id FOREIGN KEY (id) REFERENCES notes(id)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE,
                            CONSTRAINT fk_notes_tags_name FOREIGN KEY (name) REFERENCES tags(name)
                                ON DELETE CASCADE
                                ON UPDATE CASCADE
                        );`),
                db.execute(`CREATE TABLE IF NOT EXISTS notes_edit(
                            author_email TEXT,
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
                            author_email TEXT,
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
        }
    }
}