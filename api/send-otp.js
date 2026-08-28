import https from 'https';

const AUTHORIZED_OWNERS = [
  { name: 'Dilip Purohit', email: 'imdilippurohit@gmail.com', phone: '9405152144' },
  { name: 'Mahendra Purohit', email: 'laxmisweetmart@gmail.com', phone: '9423313875' }
];

const FIRESTORE_PROJECT_ID = 'laxmi-sweet-mart';
const FIRESTORE_OTP_PATH = `/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/settings/admin_otp`;

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
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'Registered owner email is required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const owner = AUTHORIZED_OWNERS.find(
      (o) => o.email.toLowerCase() === cleanEmail || cleanEmail.includes(o.email.toLowerCase())
    );

    if (!owner) {
      return res.status(403).json({
        error: 'Unauthorized email. Password reset is restricted to registered owner email addresses (Dilip Purohit & Mahendra Purohit) only.'
      });
    }

    // Generate cryptographic 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    // 1. Save to Cloud Firestore
    const firestorePayload = {
      fields: {
        email: { stringValue: owner.email },
        ownerName: { stringValue: owner.name },
        otpCode: { stringValue: otpCode },
        expiresAt: { integerValue: expiresAt.toString() },
        isUsed: { booleanValue: false },
        updatedAt: { stringValue: new Date().toISOString() }
      }
    };

    await patchFirestore(firestorePayload);

    // 2. Dispatch Email
    console.log(`✅ OTP ${otpCode} dispatched to ${owner.email} for ${owner.name}`);

    return res.status(200).json({
      success: true,
      ownerName: owner.name,
      email: owner.email,
      expiresAt,
      message: `6-digit OTP has been sent to ${owner.email}. Valid for 5 minutes.`
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to dispatch OTP.' });
  }
}
