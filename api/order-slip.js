const RESEND_API_URL = 'https://api.resend.com/emails';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatMoney = (cents) => `$${(Number(cents) / 100).toFixed(2)}`;

const buildOrderEmail = ({ amount, buyer, items }) => {
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

  return {
    subject: `Test order - ${total}`,
    html: `
      <div style="font-family:Arial,sans-serif; color:#111;">
        <h2>Test order received</h2>
        <p><strong>Total:</strong> ${total}</p>
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
    text: `Test order received
Total: ${total}

Customer:
Name: ${buyerName}
Email: ${buyerEmail}
Address: ${buyerAddress}

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const payload = parsePayload(req.body);
  if (!payload) {
    res.status(400).json({ error: 'Invalid JSON payload.' });
    return;
  }

  const { amount, buyer, items = [] } = payload;
  const amountInt = parseInt(amount, 10);

  if (!amountInt || amountInt <= 0) {
    res.status(400).json({ error: 'Missing or invalid order total.' });
    return;
  }

  const emailTo = process.env.ORDER_EMAIL_TO || 'ayyjayy.genki@gmail.com';
  const emailFrom = process.env.ORDER_EMAIL_FROM || 'orders@resend.dev';
  const emailPayload = buildOrderEmail({ amount: amountInt, buyer, items });

  const emailResult = await sendOrderEmail({
    to: emailTo,
    from: emailFrom,
    subject: emailPayload.subject,
    html: emailPayload.html,
    text: emailPayload.text,
  });

  if (!emailResult.sent) {
    res.status(500).json({ error: emailResult.error || 'Email failed.' });
    return;
  }

  res.status(200).json({ success: true });
}
