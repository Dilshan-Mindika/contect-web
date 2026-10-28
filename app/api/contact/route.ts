import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, projectType, location, budget, timeline, message } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: 'Full name and email are required fields.' },
        { status: 400 }
      );
    }

    const inquiryId = `inq-${Date.now()}`;
    const fullMessage = `Location: ${location || 'N/A'} | Timeline: ${timeline || 'N/A'}\n\nClient Note:\n${message || 'No additional notes provided.'}`;

    // 1. Persist inquiry into MySQL website_inquiries table
    await query(
      `INSERT INTO website_inquiries (id, client_name, email, phone, project_type, budget_range, message, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW')`,
      [inquiryId, fullName, email, phone || 'N/A', projectType || 'General Consultation', budget || 'Flexible', fullMessage]
    );

    // 2. Dispatch acknowledgement email to the client & alert operations team
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #080e1c; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #1e293b;">
        <div style="border-bottom: 2px solid #FFB800; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #FFB800; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">CONTEC Design & Build</h1>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Turnkey Architecture & Heavy Civil Engineering</p>
        </div>

        <h2 style="font-size: 18px; color: #f8fafc; margin-top: 0;">Consultation Request Received</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Dear <strong>${fullName}</strong>,<br/><br/>
          Thank you for initiating your project inquiry with <strong>CONTEC Design & Build</strong>. Our principal architects, BIM coordinators, and structural engineering directors have received your dossier.
        </p>

        <div style="background: rgba(255, 255, 255, 0.05); padding: 18px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;"><strong style="color: #e2e8f0;">Inquiry Reference:</strong> ${inquiryId}</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;"><strong style="color: #e2e8f0;">Project Classification:</strong> ${projectType || 'General Consultation'}</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;"><strong style="color: #e2e8f0;">Target Budget:</strong> ${budget || 'To Be Determined'}</p>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;"><strong style="color: #e2e8f0;">Target Location:</strong> ${location || 'Global Site'}</p>
        </div>

        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
          A licensed structural engineer will evaluate your site parameters and contact you within 48 business hours to schedule a confidential technical conference.
        </p>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center;">
          CONTEC EPC & Infrastructure Holdings • Colombo Financial City & Global Studios<br/>
          Direct Inquiries: inquiries@contec.com | Emergency Engineering Desk: +94 (11) 234-5678
        </div>
      </div>
    `;

    // Attempt to dispatch email (simulation fallback works seamlessly)
    const emailResult = await sendEmail({
      to: email,
      recipientName: fullName,
      subject: `[CONTEC Project Consultation] Confirmation & Next Steps (#${inquiryId})`,
      html: emailHtml,
      text: `Thank you for contacting CONTEC. Your consultation reference is ${inquiryId}. Our engineering team will review your parameters within 48 hours.`,
      emailType: 'SYSTEM',
    });

    return NextResponse.json({
      success: true,
      inquiryId,
      emailDispatched: emailResult.success,
      simulated: emailResult.simulated,
      message: 'Consultation request successfully registered with CONTEC executive team.',
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[CONTEC INQUIRY API ERROR]', errorMsg);
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

