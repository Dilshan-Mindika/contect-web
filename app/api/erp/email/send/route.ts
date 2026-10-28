import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, COOKIE_NAME } from '@/lib/erp/auth';
import { sendEmail, sendQuotationEmail, sendSafetyAlertEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    // Authenticate operator
    let token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const user = await verifyJwtToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired session token' }, { status: 401 });
    }

    const body = await req.json();
    const { type, to, clientName, quotation, incident } = body;

    if (!to) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    let result;
    if (type === 'QUOTATION' && quotation) {
      result = await sendQuotationEmail(to, clientName || 'Client', quotation);
    } else if (type === 'SAFETY_ALERT' && incident) {
      result = await sendSafetyAlertEmail(to, incident.siteName || 'Construction Site', incident);
    } else {
      result = await sendEmail({
        to,
        recipientName: clientName,
        subject: body.subject || 'CONTEC Construction Dispatch Notice',
        html: body.html || `<p>${body.text || 'Operational transmission.'}</p>`,
        emailType: type || 'SYSTEM',
      });
    }

    return NextResponse.json({
      success: result.success,
      simulated: result.simulated ?? false,
      messageId: result.messageId,
      error: result.error,
    });
  } catch (error) {
    console.error('Email API failure:', error);
    return NextResponse.json({ error: 'Internal email dispatch failure' }, { status: 500 });
  }
}

