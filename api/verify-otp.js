import https from 'https';

const AUTHORIZED_OWNERS = [
  { name: 'Dilip Purohit', email: 'imdilippurohit@gmail.com', phone: '9405152144' },
  { name: 'Mahendra Purohit', email: 'laxmisweetmart@gmail.com', phone: '9423313875' }
];

const FIRESTORE_PROJECT_ID = 'laxmi-sweet-mart';
const FIRESTORE_OTP_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/settings/admin_otp`;

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: null });
        }
      });
    }).on('error', reject);
  });
}

function patchFirestore(docData) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(docData);
    const req = https.request(
      {
        hostname: 'firestore.googleapis.com',
        path: `/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/settings/admin_otp`,
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
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ error: 'Both email and 6-digit OTP are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim().replace(/\D/g, '');

    const owner = AUTHORIZED_OWNERS.find(
      (o) => o.email.toLowerCase() === cleanEmail || cleanEmail.includes(o.email.toLowerCase())
    );

    if (!owner) {
      return res.status(403).json({ error: 'Unauthorized email address.' });
    }

    if (cleanOtp.length !== 6) {
      return res.status(400).json({ error: 'Please enter the 6-digit OTP code received in your email.' });
    }

    // Read active OTP from Cloud Firestore
    const { status, data } = await getJson(FIRESTORE_OTP_URL);
    if (status !== 200 || !data || !data.fields) {
      return res.status(400).json({ error: 'No active OTP found. Please request a new code.' });
    }

    const f = data.fields;
    const storedEmail = (f.email?.stringValue || '').toLowerCase();
    const storedCode = f.otpCode?.stringValue || '';
    const expiresAt = Number(f.expiresAt?.integerValue || 0);
    const isUsed = f.isUsed?.booleanValue ?? false;

    // Collect all valid codes for this session
    const validCodes = [storedCode];
    if (f.previousCodes?.arrayValue?.values) {
      f.previousCodes.arrayValue.values.forEach((v) => {
        if (v.stringValue) validCodes.push(v.stringValue);
      });
    }

    if (storedEmail !== owner.email.toLowerCase()) {
      return res.status(400).json({ error: 'OTP was issued for a different email address.' });
    }

    if (Date.now() > expiresAt) {
      return res.status(400).json({
        error: 'This OTP has expired (15-minute limit). Please request a fresh OTP.'
      });
    }

    if (isUsed) {
      return res.status(400).json({
        error: 'This OTP has already been used. Please request a new OTP.'
      });
    }

    if (!validCodes.includes(cleanOtp)) {
      return res.status(400).json({
        error: 'Incorrect OTP code. Please check the 6-digit code received in your email inbox.'
      });
    }

    // Mark as used
    await patchFirestore({
      fields: {
        ...f,
        isUsed: { booleanValue: true },
        updatedAt: { stringValue: new Date().toISOString() }
      }
    });

    return res.status(200).json({
      success: true,
      owner: {
        name: owner.name,
        email: owner.email,
        phone: owner.phone
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ error: error.message || 'Verification failed.' });
  }
}
