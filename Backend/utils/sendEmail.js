import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use Mailtrap / any SMTP service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html, // ✅ use html instead of text
    });

    console.log("Email sent successfully ✅");
  } catch (error) {
    console.error("Email sending failed ❌", error);
  }
};

export default sendEmail;
