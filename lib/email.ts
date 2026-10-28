import nodemailer, { type Transporter } from 'nodemailer';

export interface EmailDispatchOptions {
  to: string;
  recipientName?: string;
  subject: string;
  html: string;
  text?: string;
  emailType: 'QUOTATION' | 'SAFETY_ALERT' | 'INVOICE' | 'PO_APPROVAL' | 'SYSTEM';
}

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

const defaultFrom = process.env.SMTP_FROM || '"CONTEC Operations" <operations@contec.com>';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(smtpConfig);
  }
  return transporter;
}

/**
 * Dispatch an email with fallback/simulation logging if SMTP credentials are test defaults
 */
export async function sendEmail(options: EmailDispatchOptions): Promise<EmailDispatchResult> {
  const isMockSmtp =
    !process.env.SMTP_PASS ||
    process.env.SMTP_PASS.includes('your_app') ||
    process.env.SMTP_PASS === 'test_contec_pass';

  if (isMockSmtp) {
    console.log(`[CONTEC EMAIL DISPATCHED (SIMULATED)]
To: ${options.to} (${options.recipientName || 'Client'})
Subject: ${options.subject}
Type: ${options.emailType}
Timestamp: ${new Date().toISOString()}
`);
    return {
      success: true,
      simulated: true,
      messageId: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    };
  }

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from: defaultFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.subject,
    });

    return {
      success: true,
      messageId: info.messageId,
      simulated: false,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'SMTP dispatch failure';
    console.error('[CONTEC EMAIL ERROR]', errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Send Construction Quotation Email to Client
 */
export async function sendQuotationEmail(
  to: string,
  clientName: string,
  quotation: {
    quoteNumber: string;
    projectScope: string;
    grandTotal: number;
    validUntil: string;
  }
): Promise<EmailDispatchResult> {
  const subject = `Official Construction Quotation & Tender ${quotation.quoteNumber} — CONTEC Design & Build`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #050811; color: #f4f4f7; padding: 32px; border-radius: 12px; border: 1px solid #1D4ED8;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #FFB800; margin: 0; font-size: 24px; letter-spacing: 1px;">CONTEC DESIGN & BUILD</h1>
        <p style="color: #93c5fd; font-size: 13px; margin-top: 4px;">Building Visions, Designing Futures • Aerospace Structural Engineering</p>
      </div>

      <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <p style="margin-top: 0;">Dear <strong>${clientName}</strong>,</p>
        <p>We are pleased to submit our formal commercial proposal and Bill of Quantities (BOQ) for <strong>${quotation.projectScope}</strong>.</p>
        
        <div style="margin: 20px 0; padding: 16px; background-color: #080e1c; border-left: 4px solid #FFB800; border-radius: 4px;">
          <div style="font-size: 12px; color: #a1a1aa;">Quotation Reference: <span style="color: #fff; font-family: monospace;">${quotation.quoteNumber}</span></div>
          <div style="font-size: 20px; color: #FFB800; font-weight: bold; margin-top: 6px;">Total Tender Value: $${quotation.grandTotal.toLocaleString()} USD</div>
          <div style="font-size: 12px; color: #a1a1aa; margin-top: 4px;">Validity Period: Until ${quotation.validUntil}</div>
        </div>

        <p>This quotation includes our robotic pre-fabrication schedule, certified structural engineering BIM modeling, and standard 5% warranty defect retention terms.</p>
        <p>An official PDF certificate is attached to this transmission. Please reach out to your designated commercial manager or reply directly to execute the contract.</p>
      </div>

      <div style="margin-top: 24px; font-size: 11px; color: #71717a; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
        CONTEC Design & Build • Colombo & Kandy Headquarters • Tel: +94 77 781 2141 • Email: operations@contec.com
      </div>
    </div>
  `;

  return await sendEmail({
    to,
    recipientName: clientName,
    subject,
    html,
    emailType: 'QUOTATION',
  });
}

/**
 * Send Safety & OSHA Alert Email to Operations Leadership
 */
export async function sendSafetyAlertEmail(
  to: string,
  siteName: string,
  incident: {
    date: string;
    severity: string;
    details: string;
    supervisor: string;
  }
): Promise<EmailDispatchResult> {
  const subject = `[CRITICAL SAFETY NOTICE] Site Telemetry Alert — ${siteName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #050811; color: #f4f4f7; padding: 24px; border-radius: 8px; border: 1px solid #ef4444;">
      <h2 style="color: #ef4444; margin: 0 0 12px 0;">Site Incident Telemetry Dispatch</h2>
      <p>Site: <strong>${siteName}</strong></p>
      <p>Timestamp: <strong>${incident.date}</strong></p>
      <p>Incident Level: <strong style="color: #f97316;">${incident.severity}</strong></p>
      <div style="background-color: #1c1917; padding: 14px; border-radius: 6px; margin: 16px 0; border: 1px solid #78350f;">
        <p style="margin: 0; color: #fef08a;">${incident.details}</p>
      </div>
      <p style="font-size: 12px; color: #a1a1aa;">Logged by Site Supervisor: ${incident.supervisor}</p>
    </div>
  `;

  return await sendEmail({
    to,
    subject,
    html,
    emailType: 'SAFETY_ALERT',
  });
}
