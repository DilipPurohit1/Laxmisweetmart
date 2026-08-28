import https from 'https';

const AUTHORIZED_OWNERS = [
  { name: 'Dilip Purohit', email: 'imdilippurohit@gmail.com', phone: '9405152144' },
  { name: 'Mahendra Purohit', email: 'laxmisweetmart@gmail.com', phone: '9423313875' }
];

const FIRESTORE_PROJECT_ID = 'laxmi-sweet-mart';
const FIRESTORE_OTP_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/settings/admin_otp`;

function getJson(url) {
  return new Promise((resolve) => {
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
    }).on('error', () => resolve({ status: 500, data: null }));
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

function sendFormSubmitEmail(targetEmail, otpCode, ownerName) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      _subject: `Shri Laxmi Sweet Mart - Admin OTP Verification: ${otpCode}`,
      name: 'Shri Laxmi Sweet Mart Security',
      owner_name: ownerName,
      otp_code: otpCode,
      message: `Your 6-digit OTP for Shri Laxmi Sweet Mart Admin Password Reset is: ${otpCode}. This code is valid for 15 minutes. Do not share with anyone.`,
      _template: 'table',
      _captcha: 'false'
    });

    const req = https.request(
      {
        hostname: 'formsubmit.co',
        path: `/ajax/${targetEmail}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://shri-laxmi-sweet-mart.vercel.app',
          'Referer': 'https://shri-laxmi-sweet-mart.vercel.app/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Content-Length': Buffer.byteLength(postData)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', () => resolve({ status: 500, body: 'Network error' }));
    req.write(postData);
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
        error: 'Unauthorized email. Password reset is restricted to registered owner email addresses only.'
      });
    }

    // Read existing OTP session to keep previous codes valid as well
    const existing = await getJson(FIRESTORE_OTP_URL);
    let validCodes = [];
    if (existing.status === 200 && existing.data && existing.data.fields) {
      const f = existing.data.fields;
      if (f.email?.stringValue?.toLowerCase() === owner.email.toLowerCase() && !f.isUsed?.booleanValue) {
        if (f.otpCode?.stringValue) validCodes.push(f.otpCode.stringValue);
        if (f.previousCodes?.arrayValue?.values) {
          f.previousCodes.arrayValue.values.forEach((v) => {
            if (v.stringValue) validCodes.push(v.stringValue);
          });
        }
      }
    }

    // Generate new 6-digit OTP code
    const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    validCodes.push(newOtpCode);
    validCodes = Array.from(new Set(validCodes)); // unique

    // 15-minute validity window
    const expiresAt = Date.now() + 15 * 60 * 1000;

    // 1. Save to Cloud Firestore
    const firestorePayload = {
      fields: {
        email: { stringValue: owner.email },
        ownerName: { stringValue: owner.name },
        otpCode: { stringValue: newOtpCode },
        previousCodes: {
          arrayValue: {
            values: validCodes.map((c) => ({ stringValue: c }))
          }
        },
        expiresAt: { integerValue: expiresAt.toString() },
        isUsed: { booleanValue: false },
        updatedAt: { stringValue: new Date().toISOString() }
      }
    };

    await patchFirestore(firestorePayload);

    // 2. Dispatch Email directly via FormSubmit
    sendFormSubmitEmail(owner.email, newOtpCode, owner.name).catch(() => {});

    return res.status(200).json({
      success: true,
      ownerName: owner.name,
      email: owner.email,
      expiresAt,
      message: `6-digit OTP has been sent to your email. Valid for 15 minutes.`
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to dispatch OTP.' });
  }
}
