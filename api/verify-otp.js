import https from 'https';

const AUTHORIZED_OWNERS = [
  { 
    name: 'Dilip Purohit', 
    email: 'imdilippurohit@gmail.com', 
    phone: '9405152144',
    passcodes: ['2144', '940515', '9405152144'] 
  },
  { 
    name: 'Mahendra Purohit', 
    email: 'laxmisweetmart@gmail.com', 
    phone: '9423313875',
    passcodes: ['3875', '942331', '9423313875'] 
  }
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
      return res.status(400).json({ error: 'Both email and verification code are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim().replace(/\D/g, '');

    const owner = AUTHORIZED_OWNERS.find(
      (o) => o.email.toLowerCase() === cleanEmail || cleanEmail.includes(o.email.toLowerCase())
    );

    if (!owner) {
      return res.status(403).json({ error: 'Unauthorized email address.' });
    }

    // Check if entered code matches owner's registered passcodes
    const isOwnerPasscode = owner.passcodes.includes(cleanOtp);

    // Read active OTP from Cloud Firestore
    const { status, data } = await getJson(FIRESTORE_OTP_URL);
    let isMatch = false;

    if (status === 200 && data && data.fields) {
      const f = data.fields;
      const storedEmail = (f.email?.stringValue || '').toLowerCase();
      const storedCode = f.otpCode?.stringValue || '';
      const expiresAt = Number(f.expiresAt?.integerValue || 0);
      const isUsed = f.isUsed?.booleanValue ?? false;

      if (storedEmail === owner.email.toLowerCase() && !isUsed && Date.now() <= expiresAt && storedCode === cleanOtp) {
        isMatch = true;
      }
    }

    if (!isMatch && !isOwnerPasscode) {
      return res.status(400).json({
        error: 'Invalid verification code. Please check and re-enter.'
      });
    }

    // Mark as used in Firestore
    await patchFirestore({
      fields: {
        email: { stringValue: owner.email },
        ownerName: { stringValue: owner.name },
        otpCode: { stringValue: cleanOtp },
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
