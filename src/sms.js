const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken =
  process.env.TWILIO_AUTH_TOKEN1 + process.env.TWILIO_AUTH_TOKEN2;
const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "This is test beep beep",
    from: "+19036486787",
    to: "+19182605895",
  })
  .then((message) => console.log(message.sid));
