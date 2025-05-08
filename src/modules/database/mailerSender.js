const nodemailer = require('nodemailer');

module.exports = function mailerSender(config) {
    const transporter = nodemailer.createTransport(config);
    transporter.verify((err, success) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Your node mailer config is correct');
        }
    });

    return {
        send: async (email, subject, text) => {
            try {
                return await transporter.sendMail({
                    from: config.auth.user,
                    to: email,
                    subject: subject,
                    text: text
                });
            } catch (error) {
                console.error("Error sending email: " + error);
                throw error;
            }
        }
    }
}