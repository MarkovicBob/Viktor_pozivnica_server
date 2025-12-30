import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendRsvpNotification({ familyName, members, status, attendeesCount, adultCount, childCount, message }) {
  const recipient = process.env.RSVP_EMAIL || "sayby19@gmail.com";
  const statusText = status === "accepted" ? "✅ DOLAZI" : "❌ NE DOLAZI";
  const membersText = members.map(m => m.name).join(", ");

  const subject = `RSVP: ${familyName} - ${statusText}`;
  const html = `
    <h2>Nova RSVP potvrda</h2>
    <p><strong>Porodica:</strong> ${familyName}</p>
    <p><strong>Članovi:</strong> ${membersText}</p>
    <p><strong>Status:</strong> ${statusText}</p>
    ${status === "accepted" ? `
      <p><strong>Ukupno dolazi:</strong> ${attendeesCount}</p>
      <p><strong>Odrasli:</strong> ${adultCount}</p>
      <p><strong>Deca:</strong> ${childCount}</p>
    ` : ""}
    ${message ? `<p><strong>Poruka:</strong> ${message}</p>` : ""}
    <hr>
    <p><small>Poslato sa Viktor pozivnica sistema</small></p>
  `;

  try {
    await transporter.sendMail({
      from: `"Viktor RSVP" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${recipient}`);
  } catch (err) {
    console.error("Email send error:", err);
  }
}
