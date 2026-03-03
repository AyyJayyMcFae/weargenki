import square from 'square';
import crypto from 'crypto';
const squareSdk = square?.default || square || {};
const ClientCtor = squareSdk.Client || squareSdk.SquareClient;
const EnvironmentEnum = squareSdk.Environment || squareSdk.SquareEnvironment || {
  Production: 'https://connect.squareup.com',
  Sandbox: 'https://connect.squareupsandbox.com',
};

const RESEND_API_URL = 'https://api.resend.com/emails';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatMoney = (cents) => `$${(Number(cents) / 100).toFixed(2)}`;

const buildOrderEmail = ({ paymentId, amount, buyer, items, cancelCode, cancelWindowHours }) => {
  const itemRows = (items || [])
    .map((it) => {
      const title = escapeHtml(it.title || it.id || 'Item');
      const qty = Number(it.qty || 1);
      const color = it.color ? ` / ${escapeHtml(it.color)}` : '';
      const size = it.size ? ` / ${escapeHtml(it.size)}` : '';
      const line = `${title}${color}${size}`;
      return `<tr>
        <td style="padding:6px 0;">${line}</td>
        <td style="padding:6px 0; text-align:center;">${qty}</td>
        <td style="padding:6px 0; text-align:right;">${formatMoney(it.priceCents)}</td>
      </tr>`;
    })
    .join('');

  const buyerName = escapeHtml(buyer?.name || 'N/A');
  const buyerEmail = escapeHtml(buyer?.email || 'N/A');
  const buyerAddress = escapeHtml(buyer?.address || 'N/A');
  const total = formatMoney(amount);
  const cancelCodeSafe = cancelCode ? escapeHtml(cancelCode) : 'N/A';
  const cancelWindowSafe = cancelWindowHours ? escapeHtml(cancelWindowHours) : 'N/A';

  return {
    subject: `New order - ${total}`,
    html: `
      <div style="font-family:Arial,sans-serif; color:#111;">
        <h2>New order received</h2>
        <p><strong>Payment ID:</strong> ${escapeHtml(paymentId || 'N/A')}</p>
        <p><strong>Total:</strong> ${total}</p>
        <p><strong>Cancel Code:</strong> ${cancelCodeSafe}</p>
        <p><strong>Cancel Window:</strong> ${cancelWindowSafe} hours</p>
        <h3>Customer</h3>
        <p><strong>Name:</strong> ${buyerName}<br/>
           <strong>Email:</strong> ${buyerEmail}<br/>
           <strong>Address:</strong> ${buyerAddress}</p>
        <h3>Items</h3>
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left; padding-bottom:6px;">Item</th>
              <th style="text-align:center; padding-bottom:6px;">Qty</th>
              <th style="text-align:right; padding-bottom:6px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows || '<tr><td colspan="3">No items supplied.</td></tr>'}
          </tbody>
        </table>
      </div>
    `,
    text: `New order received
Payment ID: ${paymentId || 'N/A'}
Total: ${total}

Customer:
Name: ${buyerName}
Email: ${buyerEmail}
Address: ${buyerAddress}

Cancel Code: ${cancelCodeSafe}
Cancel Window: ${cancelWindowSafe} hours

Items:
${(items || [])
  .map((it) => {
    const title = it.title || it.id || 'Item';
    const qty = it.qty || 1;
    const color = it.color ? ` / ${it.color}` : '';
    const size = it.size ? ` / ${it.size}` : '';
    return `- ${title}${color}${size} x${qty} (${formatMoney(it.priceCents)})`;
  })
  .join('\n')}`,
  };
};

const sendOrderEmail = async ({ to, from, subject, html, text }) => {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, error: 'Missing RESEND_API_KEY' };
  }
  const payload = { from, to, subject, html, text };
  const resp = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const detail = await resp.text();
    return { sent: false, error: detail || 'Resend failed' };
  }
  return { sent: true };
};

const parsePayload = (body) => {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (_err) {
      return null;
    }
  }
  if (typeof body === 'object') return body;
  return null;
};

const getErrorMessage = (err, fallback = 'Server error while processing payment.') => {
  const msg = err?.result?.errors?.[0]?.detail || err?.message || fallback;
  return typeof msg === 'string' && msg.trim() ? msg : fallback;
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }
    if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
      res.status(500).json({ error: 'Square environment variables are not set.' });
      return;
    }

    const payload = parsePayload(req.body);
    if (!payload) {
      res.status(400).json({ error: 'Invalid JSON payload.' });
      return;
    }

    const { sourceId, amount, buyer, items = [], cancelCode, cancelWindowHours } = payload;
    const amountInt = parseInt(amount, 10);

    if (!sourceId || !amountInt || amountInt <= 0) {
      res.status(400).json({ error: 'Missing or invalid payment details.' });
      return;
    }

    const note = Array.isArray(items)
      ? items
          .map(
            (it) =>
              `${it.title || it.id || 'item'} x${it.qty || 1} ${it.color ? `(${it.color})` : ''} ${
                it.size ? `[${it.size}]` : ''
              }`
          )
          .join('; ')
          .slice(0, 450)
      : undefined;

    if (!ClientCtor) {
      throw new Error('Square SDK client constructor is unavailable in this runtime.');
    }

    const rawSquareEnv = String(process.env.SQUARE_ENV || 'sandbox').trim().toLowerCase();
    const isProductionEnv = rawSquareEnv === 'production' || rawSquareEnv === 'prod' || rawSquareEnv === 'live';
    const normalizedEnvironment = isProductionEnv
      ? (EnvironmentEnum.Production || EnvironmentEnum.PRODUCTION || 'https://connect.squareup.com')
      : (EnvironmentEnum.Sandbox || EnvironmentEnum.SANDBOX || 'https://connect.squareupsandbox.com');

    const client = new ClientCtor({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: normalizedEnvironment,
    });

    const legacyCreatePayment = client?.paymentsApi?.createPayment?.bind(client.paymentsApi);
    const modernCreatePayment = client?.payments?.create?.bind(client.payments);
    const createPayment = legacyCreatePayment || modernCreatePayment;

    if (!createPayment) {
      throw new Error('Square client is missing a payments create method.');
    }

    // Square SDK v43 expects bigint for amount; older SDK clients expect number.
    const amountValue = modernCreatePayment ? BigInt(amountInt) : amountInt;

    const { result } = await createPayment({
      sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: { amount: amountValue, currency: 'USD' },
      locationId: process.env.SQUARE_LOCATION_ID,
      buyerEmailAddress: buyer?.email,
      note,
      billingAddress: buyer?.address
        ? {
            addressLine1: buyer.address,
          }
        : undefined,
    });

    const emailTo = process.env.ORDER_EMAIL_TO || 'ayyjayy.genki@gmail.com';
    const emailFrom = process.env.ORDER_EMAIL_FROM || 'orders@resend.dev';
    const emailPayload = buildOrderEmail({
      paymentId: result.payment?.id,
      amount: amountInt,
      buyer,
      items,
      cancelCode,
      cancelWindowHours,
    });

    const emailResult = await sendOrderEmail({
      to: emailTo,
      from: emailFrom,
      subject: emailPayload.subject,
      html: emailPayload.html,
      text: emailPayload.text,
    });

    res.status(200).json({
      success: true,
      paymentId: result.payment?.id,
      emailSent: emailResult.sent,
      emailError: emailResult.sent ? undefined : emailResult.error,
    });
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('Square payment error', err);
    res.status(500).json({ error: message });
  }
}
