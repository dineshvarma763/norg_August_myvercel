import Email from "vercel-email"

export const sendEmailUsingVercelEmail = async (
  to: string,
  subject: string,
  htmlContent: string
) => {
  const msg = {
    to: to,
    from: "noreply@norg.ai",
    subject,
    html: htmlContent,
  }

  return await Email.send(msg)
}
