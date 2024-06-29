const nodemailer = require('nodemailer');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const MY_PASSWORD = process.env.MY_PASSWORD;
const sendEmail = async (email, createOtp, userName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for other ports
    auth: {
      user: ADMIN_EMAIL,
      pass: MY_PASSWORD,
    },
  });
  const mailOptions = {
    from: {
      name: "Treat Tracker",
      address: ADMIN_EMAIL
    },
    to: email,
    subject: "Treat Tracker Password Reset",
    text: "Hello world?",
    html: `<!DOCTYPE html>
    <html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Static Template</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&amp;display=swap" rel="stylesheet">
  </head>
  <body style="margin: 0;font-family: 'Poppins', sans-serif;background: #ffffff;font-size: 14px;
    ">
    <div style="max-width: 640px;margin: 0 auto;padding: 1px 40px 40px;background: #f4f7ff;background-color: orange;background-repeat: no-repeat;background-size: 792px 440px;background-position: top center;font-size: 14px;color: #434343;">
      <main>
        <div style="margin: 0;margin-top: 40px;padding: 33px 23px 33px;background: #ffffff;border-radius: 30px;text-align: center;">
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1 style="margin: 0;font-size: 24px;font-weight: 500;color: #1f1f1f;">
              Your OTP
            </h1>
            <p style="margin: 0;margin-top: 17px;font-size: 16px;font-weight: 500;">
              Hey ${userName},
            </p>
            <p style="margin: 0;margin-top: 17px;font-weight: 500;letter-spacing: 0.56px;">
              Use the following OTP to complete the procedure to change your Password. OTP is
              valid for
              <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
            </p>
            <p style="margin: 0;margin-top: 10px;font-size: 35px;font-weight: 600;letter-spacing: 15px;color: orange;padding: 10px;border-radius: 20px;">
              ${createOtp}
            </p>
            <p style="max-width: 400px;margin: 0 auto;margin-top: 30px;margin-bottom: 10px;text-align: center;font-weight: 500;color: black;">
          <span>Need help? Ask at</span>
          <a href="" style="color: orange;text-decoration: none;">Admin Team</a>
          <span>or visit our</span>
          <a href="" target="_blank" style="color: orange;text-decoration: none;">Help Center</a>
        </p>
          </div>
        </div>
      </main>
    </div>
</body></html>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email has been sent!");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { sendEmail };