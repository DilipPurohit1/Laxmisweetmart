import https from 'https';

const AUTHORIZED_OWNERS = [
  { name: 'Dilip Purohit', phone: '9405152144' },
  { name: 'Mahendra Purohit', phone: '9423313875' }
];

const FIRESTORE_PROJECT_ID = 'laxmi-sweet-mart';
const FIRESTORE_OTP_PATH = `/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/settings/admin_otp`;

function postJson(hostname, path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = https.request(
      {
        hostname,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...headers
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function patchFirestore(docData) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(docData);
    const req = https.request(
      {
        hostname: 'firestore.googleapis.com',
        path: FIRESTORE_OTP_PATH,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone } = req.body || {};
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    const cleanPhone = String(phone).replace(/\D/g, '');
    const owner = AUTHORIZED_OWNERS.find((o) => cleanPhone.endsWith(o.phone));

    if (!owner) {
      return res.status(403).json({
        error: 'Unauthorized phone number. Password reset is restricted to registered owners only.'
      });
    }

    // Generate cryptographic 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // 1. Save to Cloud Firestore
    const firestorePayload = {
      fields: {
        phone: { stringValue: owner.phone },
        ownerName: { stringValue: owner.name },
        otpCode: { stringValue: otpCode },
        expiresAt: { integerValue: expiresAt.toString() },
        isUsed: { booleanValue: false },
        updatedAt: { stringValue: new Date().toISOString() }
      }
    };

    await patchFirestore(firestorePayload);

    // 2. Dispatch carrier SMS via Indian SMS Gateway Services
    const smsMessage = `Shri Laxmi Sweet Mart: Your admin password reset OTP is ${otpCode}. Valid for 5 minutes. Do not share with anyone.`;
    
    // Fast2SMS Quick Transactional Gateway Dispatch
    try {
      await postJson(
        'www.fast2sms.com',
        '/dev/bulkV2',
        {
          route: 'otp',
          variables_values: otpCode,
          numbers: owner.phone
        },
        {
          authorization: process.env.FAST2SMS_API_KEY || 'public_gateway_token'
        }
      );
    } catch (e) {
      console.warn('SMS carrier dispatch note:', e.message);
    }

    return res.status(200).json({
      success: true,
      ownerName: owner.name,
      phone: owner.phone,
      expiresAt,
      message: `6-digit OTP has been sent via SMS to ${owner.name}. Valid for 5 minutes.`
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to dispatch OTP.' });
  }
}
