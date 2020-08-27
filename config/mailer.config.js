const nodemailer = require('nodemailer');

const host = process.env.HOST || 'http://localhost:3000';
const user = process.env.NM_USER;

const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: user,
            pass: process.env.NM_PASS
        }
    })
    // console.log(transport.auth)
module.exports.sendValidationEmail = (email, activationToken, name) => {
    transport.sendMail({
        to: email,
        from: `IronBar Team <${user}>`,
        subject: 'Activate your account here!',
        html: `
			<h1>Hi ${name}</h1>
			<p>Click on the button below to activate your account ❤️</p>
			<a href="${host}/activate/${activationToken}" style="padding: 10px 20px; color: white; background-color: black; border-radius: 5px;">Click here</a>
		`
    })
}