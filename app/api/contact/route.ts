// import { sendEmailUsingSendgrid } from "@/lib/sendgrid"O

// export const fetchCache = 'force-no-store'
export async function POST(request: Request) {
  const req = await request.json()
  const { message, firstName, lastName, phone, email, typeOfEnquiry } = req.body

  try {
    // await sendEmailUsingSendgrid("jack@norg.ai", subject, htmlContent)
    // await sendEmailUsingVercelEmail("jack@norg.ai", subject, htmlContent)

    const resp = await fetch("https://mailer.norg.ai/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAILER_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        phone,
        message,
        typeOfEnquiry,
      }),
    })

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    })
  }
}
