import sgMail from "@sendgrid/mail"

export const sendEmailUsingSendgrid = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const msg = {
    to: to,
    from: "noreply@norg.ai",
    subject,
    html: htmlContent,
  }

  return await sgMail.send(msg)
}
