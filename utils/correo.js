var nodeMailer = require('nodemailer');

var sendEmail = async options => {
    // 1 crear4 transportador
    var transportador = nodeMailer.createTransport({
        port: process.env.EMAIL_PORT,
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //2 crear cuerpo correo

    var emailBody = {
        from: 'Luis Garcia <lhgc@yahoo.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    //3 mandar corro

    await transportador.sendMail(emailBody)

}

module.exports = sendEmail;