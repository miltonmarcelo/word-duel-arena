import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/email-preview")({
  head: () => ({ meta: [{ title: "Email Preview — tazlo" }] }),
  component: EmailPreview,
});

// Mirrors emails/confirm-signup.html. {{ .ConfirmationURL }} is swapped for a
// sample link so the template renders in the browser preview.
const SAMPLE_URL = "https://playtazlo.com/auth/confirm?token=sample-token-123";

const emailHtml = `
<div style="margin:0;padding:0;background:#0F0F14;font-family:Inter,'Helvetica Neue',Arial,sans-serif;color:#FFFFFF;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F14;margin:0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1A1A2E;border:1px solid #2A2A3C;border-radius:22px;overflow:hidden;">

          <tr>
            <td style="padding:40px 32px 8px 32px;text-align:center;">
              <div style="font-size:30px;font-weight:800;letter-spacing:-0.04em;color:#FFFFFF;">
                tazlo
              </div>
              <div style="margin:14px auto 0 auto;width:44px;height:3px;background:#538D4E;border-radius:999px;"></div>
              <div style="margin-top:16px;font-size:13px;line-height:20px;letter-spacing:0.04em;text-transform:uppercase;color:#A0A0B0;">
                Competitive word battles in five letters
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 8px 32px;">
              <h1 style="margin:0;font-size:26px;line-height:34px;font-weight:700;color:#FFFFFF;text-align:center;letter-spacing:-0.02em;">
                Confirm your email
              </h1>
              <p style="margin:18px 0 0 0;font-size:16px;line-height:25px;color:#E2E2EC;text-align:center;">
                You're one step away from joining <strong style="color:#FFFFFF;">tazlo</strong>.
              </p>
              <p style="margin:10px 0 0 0;font-size:15px;line-height:24px;color:#A0A0B0;text-align:center;">
                Activate your account to start playing competitive word battles and step into the arena.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:32px 32px 24px 32px;">
              <a href="${SAMPLE_URL}" style="display:inline-block;background:#538D4E;color:#0F0F14;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.01em;padding:16px 34px;border-radius:999px;border:1px solid #6AAF60;">
                Confirm my account
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 28px 32px;">
              <p style="margin:0;font-size:13px;line-height:20px;color:#A0A0B0;text-align:center;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:10px 0 0 0;font-size:12px;line-height:18px;color:#6AAF60;word-break:break-all;text-align:center;">
                ${SAMPLE_URL}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 36px 32px;border-top:1px solid #2A2A3C;">
              <p style="margin:0;font-size:12px;line-height:19px;color:#6C6C7E;text-align:center;">
                You're receiving this email because someone signed up for tazlo using this address.
                If that wasn't you, you can safely ignore this message.
              </p>
              <p style="margin:14px 0 0 0;font-size:12px;line-height:18px;color:#A0A0B0;text-align:center;font-weight:600;letter-spacing:0.02em;">
                tazlo · playtazlo.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>
`;

function EmailPreview() {
  return (
    <div style={{ minHeight: "100vh", background: "#08080C" }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "16px 16px 0",
          color: "#A0A0B0",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 13,
        }}
      >
        Preview of <code>emails/confirm-signup.html</code> — the confirmation
        link is sample data.
      </div>
      <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
    </div>
  );
}
