export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  // This is a placeholder URL. I will provide the Google Apps Script code for you to deploy.
  // Once deployed, replace this URL with your Web App URL.
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxYgGJvd0dMm8DYvgYGunjl91H_RVyN05MtNmVWy3MLssk6BU_MwYCrDAoePSIz67Sn/exec";
  
  try {
    const params = new URLSearchParams({ to, subject, body });
    await fetch(`${SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });
    return true;
  } catch (error) {
    console.error("Failed to send email", error);
    return false;
  }
}
