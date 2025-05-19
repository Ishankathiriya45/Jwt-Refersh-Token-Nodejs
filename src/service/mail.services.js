const nodemailer = require('nodemailer')

async function mailSend(mailData) {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth:{
            user: process.env.USERNAME,
            pass: process.env.PASSWORD
        }
    })

    const mainOption = {
        from: process.env.USERNAME,
        to: mailData.email,
        subject: mailData.subject
    }

    const responce = await transporter.sendMail(mainOption).then((data)=>{
        console.log(data)
    }).catch((err)=>{console.log(err)})

    if(responce){
        return true
    }else{return false}
}

module.exports = {
    mailSend
}