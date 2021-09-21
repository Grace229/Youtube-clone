const nodemailer = require('../misc/mailer')
const verifyUserEmail = async (req, userName, email, secretToken) => {
const html = `
Hello ${username},
<br/>
<br/>

Thank you for registering an account with us at WAAWTube
<br/> <br/> 
please click the click below or copy to any browser to verify your account
<a href="http://${req.headers.host}/auth/verify-token/${secretToken}">
http://${req.headers.host}/auth/verify-token/${secretToken}
</a>

<br/> <br/> 
Kind regards,
<br/> 
 <strong>Team WAAWTube</strong>


`;
await sendMail(
    'itiunggrace@gmail.com',
    email,
    "please verify your account",
    html
)
};





module.exports = verifyUserEmail