import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_RECIPIENT_EMAIL = process.env.BREVO_RECIPIENT_EMAIL;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "No FC Contact Form";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// HTML escape utility to prevent XSS attacks
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot spam detection - silently reject if filled
    const website = body.website?.trim();
    if (website) {
      // Return success to not reveal to attacker that honeypot exists
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Extract and trim fields
    const name = body.name?.trim();
    const email = body.email?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();
    const privacy = body.privacy;

    // Validate required fields
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string") {
      return NextResponse.json(
        { success: false, message: "Subject is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    if (privacy !== true) {
      return NextResponse.json(
        { success: false, message: "Privacy policy acceptance is required" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length > 100) {
      return NextResponse.json(
        { success: false, message: "Name must not exceed 100 characters" },
        { status: 400 }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        { success: false, message: "Subject must not exceed 200 characters" },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { success: false, message: "Message must not exceed 5000 characters" },
        { status: 400 }
      );
    }

    // Guard: Check Brevo configuration
    if (!BREVO_API_KEY) {
      console.error("Missing BREVO_API_KEY in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!BREVO_RECIPIENT_EMAIL) {
      console.error("Missing BREVO_RECIPIENT_EMAIL in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!BREVO_SENDER_EMAIL) {
      console.error("Missing BREVO_SENDER_EMAIL in environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Sanitize and escape user input for email
    const escapedName = escapeHtml(name);
    const escapedSubject = escapeHtml(subject);
    const escapedMessage = escapeHtml(message);
    const submissionTime = new Date().toISOString();

    // Generate HTML email content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; margin-top: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; word-wrap: break-word; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouveau message du formulaire de contact</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Nom :</div>
            <div class="value">${escapedName}</div>
          </div>
          <div class="field">
            <div class="label">Email :</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          <div class="field">
            <div class="label">Sujet :</div>
            <div class="value">${escapedSubject}</div>
          </div>
          <div class="field">
            <div class="label">Message :</div>
            <div class="value">${escapedMessage.replace(/\n/g, "<br>")}</div>
          </div>
        </div>
        <div class="footer">
          <p>Soumis le : ${submissionTime}</p>
          <p>Politique de confidentialité acceptée : Oui</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Generate plain text email content
    const textContent = `
NOUVEAU MESSAGE DU FORMULAIRE DE CONTACT
-----------------------------------------

Nom : ${name}
Email : ${email}
Sujet : ${subject}

Message :
${message}

-----------------------------------------
Soumis le : ${submissionTime}
Politique de confidentialité acceptée : Oui
    `;

    // Call Brevo API to send email
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: BREVO_RECIPIENT_EMAIL,
          },
        ],
        subject: `Formulaire de contact : ${subject}`,
        htmlContent: htmlContent,
        textContent: textContent,
        replyTo: {
          email: email,
          name: name,
        },
      }),
    });

    const brevoData = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error("Brevo API error:", brevoData);
      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messageId: brevoData.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form API error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
