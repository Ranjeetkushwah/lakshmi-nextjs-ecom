import nodemailer from 'nodemailer'
import { success } from 'zod'

export const sendMail = async (subject, receiver, body) => {
  const transporter = nodemailer.createTransport({
    // host: `"Devloper Ranjeet" <${process.env.NODEMAILER_HOST}>`,
    service: process.env.NODEMAILER_HOST,
    // port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_MAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
  })

  const mailOptions = {
    from: `"Devloper Ranjeet" <${process.env.NODEMAILER_MAIL}>`,
    to: receiver,
    subject: subject,
    html: body
  }

  try {
    await transporter.sendMail(mailOptions)
    return {success:true}
  } catch (error) {
    return {success:false,message: error.message}
  }
}