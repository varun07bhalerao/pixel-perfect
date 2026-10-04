import { sendEmail } from "./src/lib/email";

sendEmail({
  to: "smartbpi@gmail.com",
  subject: "Browser Test",
  body: "This is a test from the browser."
}).then(console.log).catch(console.error);
