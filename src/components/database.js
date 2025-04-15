const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { join } = require("path");

module.exports = async function database() {
    let db;

    await open({
        filename: join(process.cwd(), 'NotesPortal.db'),
        driver: sqlite3.cached.Database,
        mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
    }).then((d) => {
        console.log('Connessione al database avvenuta con successo');
        db = d;
    }).catch((err) => {
        console.error(`Errore nella connessione al database: ${err.message}`);
        throw err;
    });

    
    async function _query(sql, params) {
        return db.all(sql, params);
    }

    async function _get(sql, params) {
        return db.get(sql, params);
    }

    return {
        setup: async function () {
            await Promise.all([
                db.run(`CREATE TABLE IF NOT EXISTS users(
                            email TEXT PRIMARY KEY,
                            password TEXT NOT NULL,
                            username TEXT NOT NULL,
                            bio TEXT,
                            path_thumbnail TEXT DEFAULT '/assets/images/default_profile.png'
                        );`),
            ]).catch((err) => {
                console.error(`Errore nella creazione delle tabelle: ${err.message}`);
                throw err;
            });
            console.log("Database setup completato.");
        }
    }
}