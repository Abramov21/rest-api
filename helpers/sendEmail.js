// const sendgrid = require("@sendgrid/mail");
// const { sendgrid_api_key } = process.env;

// sendgrid.setApiKey(sendgrid_api_key);

// const mail = {
//   to: "кому",
//   from: "почта з якої регались",
//   subject: "здарова отец",
//   html: "<h1>my first mail</h1>",
// };

// sendgrid
//   .send(mail)
//   .then(() => console.log("yyyyyyyy"))
//   .catch((err) => console.log(err.message));

const sendgrid = require("@sendgrid/mail");
const { SENDGRID_API_KEY, SENDGRID_FROM } = process.env;

sendgrid.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data, from = SENDGRID_FROM) => {
  try {
    const email = { ...data, from };
    await sendgrid.send(email);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = sendEmail;
