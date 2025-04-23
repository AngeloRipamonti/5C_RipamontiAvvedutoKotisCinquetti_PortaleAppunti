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
            try{
                db = await mysql.createConnection({
                    host: config.host,       
                    user: config.user,        
                    password: config.password,
                    database: config.portal,
                    port: config.port  
                });
            }
            catch(err){
                console.error(`Errore nella connessione al database: ${err.message}`);
                throw err;
            }

            await Promise.all([
                db.execute(`CREATE TABLE IF NOT EXISTS users(
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