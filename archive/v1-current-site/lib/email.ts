import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize Resend client
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'orders@vonga.io';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://vonga.io' : 'http://localhost:3000');

// Load and encode logo as base64 for email embedding (works better than external URLs in email clients)
const getLogoDataUri = () => {
  try {
    const logoPath = join(process.cwd(), 'public', 'images', 'logos', 'logo.svg');
    const svg = readFileSync(logoPath, 'utf8');
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  } catch (error) {
    console.error('Failed to load logo for email:', error);
    // Fallback to URL if file read fails
    return 'https://vonga.io/images/logos/logo.svg';
  }
};

// Email template styles
const emailStyles = {
  container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;',
  header: 'background-color: #303E55; color: white; padding: 30px; text-align: center;',
  logo: 'font-size: 24px; font-weight: bold; margin: 0;',
  content: 'padding: 30px; background-color: #f7f7f7;',
  card: 'background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px;',
  button: 'display: inline-block; background-color: #33BECC; color: #303E55; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;',
  footer: 'text-align: center; padding: 20px; color: #666; font-size: 12px;',
  divider: 'border-top: 2px solid #33BECC; margin: 20px 0;',
};

interface OrderEmailData {
  organizationName: string;
  contactName: string;
  email: string;
  orderId: string;
  totalUnits: number;
  subtotal: number;
  depositAmount?: number;
  paymentAmount?: number;
  paymentType?: 'second' | 'final';
  starterKit: 'Core' | 'Pro';
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const resend = getResendClient();
  if (!resend) return { success: false, error: 'Email service not configured' };

  const html = `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.logo}">VONGA</h1>
        <p>Order Confirmation</p>
      </div>
      
      <div style="${emailStyles.content}">
        <h2 style="color: #303E55;">Thank you for your order, ${data.contactName}!</h2>
        
        <div style="${emailStyles.card}">
          <h3 style="color: #303E55; margin-top: 0;">Order Summary</h3>
          <p><strong>Organization:</strong> ${data.organizationName}</p>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Starter Kit:</strong> ${data.starterKit} Kit</p>
          <p><strong>Total Units:</strong> ${data.totalUnits}</p>
          <p><strong>Order Total:</strong> $${data.subtotal.toLocaleString()}</p>
          <p><strong>Deposit Paid (10%):</strong> $${(data.depositAmount || 0).toLocaleString()}</p>
        </div>

        <div style="${emailStyles.divider}"></div>

        <h3 style="color: #303E55;">What Happens Next?</h3>
        <p>Our design team will review your order and create mockups based on your specifications. This typically takes 2-3 business days.</p>
        
        <p><strong>Payment Schedule:</strong></p>
        <ul>
          <li>✅ 10% Deposit - Paid</li>
          <li>⏳ 40% - Due upon design approval</li>
          <li>⏳ 50% - Due before shipment</li>
        </ul>

        <a href="${BASE_URL}/club/order/${data.orderId}?email=${encodeURIComponent(data.email)}" style="${emailStyles.button}">
          View Order Status
        </a>

        <p style="margin-top: 30px;">If you have any questions, please don't hesitate to reach out to our team.</p>
      </div>

      <div style="${emailStyles.footer}">
        <p>© ${new Date().getFullYear()} Vonga. All rights reserved.</p>
        <p>Questions? Contact us at <a href="mailto:support@vonga.io">support@vonga.io</a></p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Order Confirmation - ${data.organizationName} (${data.orderId})`,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendPaymentRequestEmail(data: OrderEmailData) {
  const resend = getResendClient();
  if (!resend) return { success: false, error: 'Email service not configured' };

  const isSecondPayment = data.paymentType === 'second';
  const paymentLabel = isSecondPayment ? '40% Payment' : 'Final 50% Payment';
  const subject = isSecondPayment ? 'Design Approved - Payment Required' : 'Order Ready to Ship - Final Payment Required';

  const html = `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.logo}">VONGA</h1>
        <p>${subject}</p>
      </div>
      
      <div style="${emailStyles.content}">
        <h2 style="color: #303E55;">Hello ${data.contactName},</h2>
        
        ${isSecondPayment ? `
          <p style="font-size: 16px; line-height: 1.6;">Great news! Your design has been approved and we're ready to move into production.</p>
        ` : `
          <p style="font-size: 16px; line-height: 1.6;">Your order is complete and ready to ship! Please submit your final payment to complete the process.</p>
        `}

        <div style="${emailStyles.card}">
          <h3 style="color: #303E55; margin-top: 0;">Order Details</h3>
          <p><strong>Organization:</strong> ${data.organizationName}</p>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Total Units:</strong> ${data.totalUnits}</p>
          <p><strong>Order Total:</strong> $${data.subtotal.toLocaleString()}</p>
        </div>

        <div style="${emailStyles.card}; background-color: #FFF4E6; border-left: 4px solid #33BECC;">
          <h3 style="color: #303E55; margin-top: 0;">${paymentLabel} Due</h3>
          <p style="font-size: 24px; font-weight: bold; color: #303E55; margin: 10px 0;">
            $${(data.paymentAmount || 0).toLocaleString()}
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${BASE_URL}/club/payment/${data.paymentType}?orderId=${data.orderId}&email=${encodeURIComponent(data.email)}" style="${emailStyles.button}">
            Pay Now
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          You can also view your complete order status and payment details by visiting your order page.
        </p>

        <a href="${BASE_URL}/club/order/${data.orderId}?email=${encodeURIComponent(data.email)}" style="color: #33BECC; text-decoration: none;">
          View Order Status →
        </a>
      </div>

      <div style="${emailStyles.footer}">
        <p>© ${new Date().getFullYear()} Vonga. All rights reserved.</p>
        <p>Questions? Contact us at <a href="mailto:support@vonga.io">support@vonga.io</a></p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `${subject} - ${data.organizationName}`,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send payment request email:', error);
    return { success: false, error };
  }
}

export async function sendOrderCompleteEmail(data: OrderEmailData) {
  const resend = getResendClient();
  if (!resend) return { success: false, error: 'Email service not configured' };

  const html = `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.logo}">VONGA</h1>
        <p>Order Complete!</p>
      </div>
      
      <div style="${emailStyles.content}">
        <h2 style="color: #303E55;">🎉 Thank you, ${data.contactName}!</h2>
        
        <p style="font-size: 16px; line-height: 1.6;">Your order is fully paid and will be shipped soon. We'll send you tracking information once your order is on its way.</p>

        <div style="${emailStyles.card}">
          <h3 style="color: #303E55; margin-top: 0;">Order Summary</h3>
          <p><strong>Organization:</strong> ${data.organizationName}</p>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Starter Kit:</strong> ${data.starterKit} Kit</p>
          <p><strong>Total Units:</strong> ${data.totalUnits}</p>
          <p><strong>Total Paid:</strong> $${data.subtotal.toLocaleString()}</p>
        </div>

        <div style="${emailStyles.card}; background-color: #E8F5E9; border-left: 4px solid #4CAF50;">
          <p style="margin: 0; font-weight: bold; color: #2E7D32;">✓ Payment Complete</p>
          <p style="margin: 5px 0 0 0; color: #666;">All payments have been received. Your order will ship within 2-3 weeks.</p>
        </div>

        <a href="${BASE_URL}/club/order/${data.orderId}?email=${encodeURIComponent(data.email)}" style="${emailStyles.button}">
          View Order Status
        </a>

        <div style="${emailStyles.divider}"></div>

        <h3 style="color: #303E55;">What's Next?</h3>
        <p>1. Your order will be prepared for shipment</p>
        <p>2. You'll receive tracking information via email</p>
        <p>3. Your custom gear will arrive within 2-3 weeks</p>

        <p style="margin-top: 30px;">We're excited to help you build your community with Vonga!</p>
      </div>

      <div style="${emailStyles.footer}">
        <p>© ${new Date().getFullYear()} Vonga. All rights reserved.</p>
        <p>Questions? Contact us at <a href="mailto:support@vonga.io">support@vonga.io</a></p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Order Complete - ${data.organizationName} (${data.orderId})`,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send order complete email:', error);
    return { success: false, error };
  }
}

interface WilliamsRacingSampleRequest {
  name: string;
  email: string;
  phone?: string;
  organization: string;
  size: string;
  street: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  notes?: string;
}

export async function sendWilliamsRacingSampleRequestEmail(data: WilliamsRacingSampleRequest) {
  const resend = getResendClient();
  if (!resend) {
    console.error('Resend client not available. RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Not set');
    return { success: false, error: 'Email service not configured' };
  }

  const fullAddress = `${data.street}\n${data.city}${data.state ? `, ${data.state}` : ''} ${data.zip}\n${data.country}`;
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  
  console.log('Attempting to send email to bill@vonga.io');
  console.log('From email:', FROM_EMAIL);

  const html = `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.logo}">VONGA</h1>
        <p style="margin: 0; font-size: 18px; color: white;">🎁 New Williams Racing Sample Request</p>
      </div>
      
      <div style="${emailStyles.content}">
        <h2 style="color: #303E55;">New Sample Request</h2>
        
        <div style="${emailStyles.card}">
          <h3 style="color: #303E55; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Organization:</strong> ${data.organization}</p>
        </div>

        <div style="${emailStyles.card}">
          <h3 style="color: #303E55; margin-top: 0;">Sample Details</h3>
          <p><strong>T-shirt Size:</strong> ${data.size}</p>
        </div>

        <div style="${emailStyles.card}">
          <h3 style="color: #303E55; margin-top: 0;">Shipping Address</h3>
          <p style="white-space: pre-line;">${fullAddress}</p>
        </div>

        ${data.notes ? `
          <div style="${emailStyles.card}">
            <h3 style="color: #303E55; margin-top: 0;">Additional Notes</h3>
            <p>${data.notes}</p>
          </div>
        ` : ''}

        <div style="${emailStyles.divider}"></div>

        <p style="color: #666; font-size: 12px;">Submitted at: ${timestamp}</p>
      </div>

      <div style="${emailStyles.footer}">
        <p>© ${new Date().getFullYear()} Vonga. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: 'bill@vonga.io',
      subject: `Williams Racing Sample Request - ${data.name} (${data.organization})`,
      html,
    });
    console.log('Email sent successfully. Result:', JSON.stringify(result, null, 2));
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send Williams Racing sample request email:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // Also check if it's a Resend API error
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Resend API error:', JSON.stringify(error, null, 2));
    }
    return { success: false, error };
  }
}

export async function sendWilliamsRacingSampleRequestConfirmationEmail(data: WilliamsRacingSampleRequest) {
  const resend = getResendClient();
  if (!resend) {
    console.error('Resend client not available. RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Not set');
    return { success: false, error: 'Email service not configured' };
  }

  const fullAddress = `${data.street}\n${data.city}${data.state ? `, ${data.state}` : ''} ${data.zip}\n${data.country}`;

  const html = `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.logo}">VONGA</h1>
        <p style="margin: 0; font-size: 18px; color: white;">Sample Request Received</p>
      </div>
      
      <div style="${emailStyles.content}">
        <h2 style="color: #303E55;">Thank you, ${data.name}!</h2>
        
        <p style="font-size: 16px; line-height: 1.6;">We've received your Williams Racing sample request and will send a ${data.size} t-shirt to the address you provided.</p>

        <div style="${emailStyles.card}">
          <h3 style="color: #303E55; margin-top: 0;">Your Request Details</h3>
          <p><strong>Organization:</strong> ${data.organization}</p>
          <p><strong>T-shirt Size:</strong> ${data.size}</p>
          <p><strong>Shipping Address:</strong></p>
          <p style="white-space: pre-line; margin-left: 20px;">${fullAddress}</p>
        </div>

        <div style="${emailStyles.card}; background-color: #E8F5E9; border-left: 4px solid #4CAF50;">
          <p style="margin: 0; font-weight: bold; color: #2E7D32;">✓ Request Confirmed</p>
          <p style="margin: 5px 0 0 0; color: #666;">We'll process your sample request and ship it to you soon.</p>
        </div>

        <div style="${emailStyles.divider}"></div>

        <h3 style="color: #303E55;">What's Next?</h3>
        <p>Our team will review your request and prepare your Williams Racing sample. You'll receive tracking information once your sample ships.</p>

        <p style="margin-top: 30px;">If you have any questions, feel free to reach out to us.</p>
      </div>

      <div style="${emailStyles.footer}">
        <p>© ${new Date().getFullYear()} Vonga. All rights reserved.</p>
        <p>Questions? Contact us at <a href="mailto:support@vonga.io">support@vonga.io</a></p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Williams Racing Sample Request Confirmation - ${data.organization}`,
      html,
    });
    console.log('Confirmation email sent successfully to:', data.email);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return { success: false, error };
  }
}

interface MicrositeContactForm {
  name: string;
  email: string;
  organization?: string;
  message?: string;
  source?: string; // e.g., "indy-ignite"
}

export async function sendMicrositeContactEmail(data: MicrositeContactForm) {
  const resend = getResendClient();
  if (!resend) {
    console.error('Resend client not available');
    return { success: false, error: 'Email service not configured' };
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const sourceLabel = data.source ? data.source.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Microsite';

  const html = `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.logo}">VONGA</h1>
        <p style="margin: 0; font-size: 18px; color: white;">📧 New Contact Form Submission</p>
      </div>
      
      <div style="${emailStyles.content}">
        <h2 style="color: #303E55;">New Contact from ${sourceLabel}</h2>
        
        <div style="${emailStyles.card}">
          <h3 style="color: #303E55; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.organization ? `<p><strong>Organization:</strong> ${data.organization}</p>` : ''}
          ${data.source ? `<p><strong>Source:</strong> ${sourceLabel}</p>` : ''}
        </div>

        ${data.message ? `
          <div style="${emailStyles.card}">
            <h3 style="color: #303E55; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
        ` : ''}

        <div style="${emailStyles.divider}"></div>

        <p style="color: #666; font-size: 12px;">Submitted at: ${timestamp}</p>
      </div>

      <div style="${emailStyles.footer}">
        <p>© ${new Date().getFullYear()} Vonga. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: 'bill@vonga.io',
      subject: `Contact Form - ${data.name}${data.organization ? ` (${data.organization})` : ''}${data.source ? ` [${sourceLabel}]` : ''}`,
      html,
    });
    console.log('Microsite contact email sent successfully');
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send microsite contact email:', error);
    return { success: false, error };
  }
}

