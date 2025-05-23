const crypto = require('crypto');
module.exports = function encrypter() {
    const algorithm = 'sha512';
    const iterations = 10000;
    const keylen = 64;
    const bytes = 16;

    function generateSalt(bytes) {
        return crypto.randomBytes(bytes).toString('hex');
    }

    return {
        encrypt: function (password) {
            const salt = generateSalt(bytes);
            const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, algorithm).toString('hex');
            return {
                salt: salt,
                hash: hash
            }
        },
        check: function (password, salt, hash) {
            return hash === crypto.pbkdf2Sync(password, salt, iterations, keylen, algorithm).toString('hex');
        }
    }
}