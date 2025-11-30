import nodemailer from "nodemailer";

const sendOtpEmail = async (email,otp) => {
    const transporter = nodemailer.createTransport({
        service : "Gmail",
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from : process.env.EMAIL_USER,
        to : email,
        subject : "Your otp for SignUp is here",
        text : `Your One Time Password (OTP) for signing up is ${otp}. It is valid for 10 minutes. Please do not share it with anyone.`
    }

    await transporter.sendMail(mailOptions)
}

export default sendOtpEmail;