import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadFormSchema } from "@/lib/validations";
import { createHubSpotLead } from "@/lib/hubspot";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = leadFormSchema.parse(body);

    console.log("Lead form submission received:", {
      email: validatedData.email,
      organization: validatedData.organization,
    });

    // Parallel execution: Send email and create HubSpot lead simultaneously
    const [emailResult, hubspotResult] = await Promise.allSettled([
      // Send email notification
      sendEmailNotification(validatedData),
      // Create HubSpot contact and deal
      createHubSpotLead(validatedData),
    ]);

    // Log results
    if (emailResult.status === "fulfilled") {
      console.log("Email sent successfully:", emailResult.value.id);
    } else {
      console.error("Email sending failed:", emailResult.reason);
    }

    if (hubspotResult.status === "fulfilled") {
      console.log("HubSpot lead created:", hubspotResult.value);
    } else {
      console.error("HubSpot creation failed:", hubspotResult.reason);
    }

    // Return success even if some integrations fail
    // (user shouldn't see errors for backend integration issues)
    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
        integrations: {
          email: emailResult.status === "fulfilled",
          hubspot: hubspotResult.status === "fulfilled",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Form submission error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to submit form" },
      { status: 500 }
    );
  }
}

/**
 * Send email notification via Resend
 */
async function sendEmailNotification(data: {
  name: string;
  email: string;
  organization: string;
  role?: string;
  message?: string;
}) {
  const emailTo = process.env.EMAIL_TO || "bill@vonga.io";
  const emailFrom = process.env.EMAIL_FROM || "leads@vonga.io";

  return await resend.emails.send({
    from: emailFrom,
    to: emailTo,
    subject: `New Lead: ${data.organization}`,
    replyTo: data.email,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #0A1422;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #33BECC 0%, #0A1422 100%);
      color: white;
      padding: 30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #E5E7EB;
      border-top: none;
    }
    .field {
      margin-bottom: 20px;
    }
    .label {
      font-weight: 600;
      color: #374151;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .value {
      font-size: 16px;
      color: #0A1422;
    }
    .message-box {
      background: #F3F4F6;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #33BECC;
      margin-top: 10px;
    }
    .footer {
      background: #F9FAFB;
      padding: 20px 30px;
      border: 1px solid #E5E7EB;
      border-top: none;
      border-radius: 0 0 8px 8px;
      font-size: 12px;
      color: #6B7280;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      background: #FF6B6B;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 New Lead Submission</h1>
  </div>
  
  <div class="content">
    <div class="field">
      <div class="label">Team / Organization</div>
      <div class="value"><strong>${data.organization}</strong></div>
    </div>

    <div class="field">
      <div class="label">Contact Name</div>
      <div class="value">${data.name}</div>
    </div>

    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${data.email}" style="color: #33BECC;">${data.email}</a></div>
    </div>

    ${
      data.role
        ? `
    <div class="field">
      <div class="label">Role</div>
      <div class="value">${data.role}</div>
    </div>
    `
        : ""
    }

    ${
      data.message
        ? `
    <div class="field">
      <div class="label">Message</div>
      <div class="message-box">${data.message}</div>
    </div>
    `
        : ""
    }

    <a href="mailto:${data.email}" class="cta-button">Reply to ${data.name}</a>
  </div>

  <div class="footer">
    <p>This lead was submitted via the vonga.io contact form.</p>
    <p>Timestamp: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</p>
  </div>
</body>
</html>
    `,
  });
}
