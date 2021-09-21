const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        pass: '',
        user: '',
    },
    tls:{
        rejectUnauthorized: false,
    }
});
module.exports = {
    sendEmail(from, to, subject, message){
        return new Promise((resolve, reject) => {
            transport.sendMail({from, subject, to, message}, (err, info) => {
                if(err) reject(err);
                resolve(info)
            })
        })
    }
}