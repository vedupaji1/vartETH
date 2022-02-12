const nodemailer = require("nodemailer");

const sendMail = (mailData) => {
    return new Promise((res, rej) => {
        let transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: 'vartmywork@hotmail.com',
                pass: '8490856735v@'
            }
        });
        console.log(mailData);

        let mailOptions = {
            from: 'vartmywork@hotmail.com',
            to: mailData.to,
            subject: mailData.subject,
            html: `<h1>OTP For SignUp</h1><p>Your OTP Is <b>${mailData.text}</b></p>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res(false);
            } else {
                console.log('Email sent: ' + info.response);
                res(true);
            }
        });
    })
}

module.exports = sendMail;