import { AUTHORIZED_OWNERS, AuthorizedOwner } from './firebaseRest';

const FIRESTORE_PROJECT_ID = 'laxmi-sweet-mart';
const FIRESTORE_OTP_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/settings/admin_otp`;

export interface OtpDispatchResult {
  success: boolean;
  ownerName: string;
  email: string;
  phone: string;
  expiresAt: number;
  message: string;
}

/**
 * Dispatches 6-digit Email OTP to owner's email address with fast delivery
 */
export async function sendEmailOtpToOwner(rawEmail: string): Promise<OtpDispatchResult> {
  const cleanEmail = rawEmail.trim().toLowerCase();

  const owner = AUTHORIZED_OWNERS.find(
    (o) => o.email.toLowerCase() === cleanEmail || cleanEmail.includes(o.email.toLowerCase())
  );

  if (!owner) {
    throw new Error('Unauthorized email address. Password reset is restricted to registered owner email addresses only.');
  }

  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // 1. Dispatch via Serverless API endpoint (Primary Single Source of Truth)
  try {
    const apiRes = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: owner.email })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      return {
        success: true,
        ownerName: owner.name,
        email: owner.email,
        phone: owner.phone,
        expiresAt: data.expiresAt || expiresAt,
        message: `6-digit OTP sent to your email. Valid for 5 minutes.`
      };
    }
  } catch (e) {
    console.warn('Serverless API dispatch note:', e);
  }

  // 2. Direct client-side FormSubmit fallback ONLY IF serverless endpoint is unreachable
  const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await fetch(`https://formsubmit.co/ajax/${owner.email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        _subject: `Shri Laxmi Sweet Mart - Admin OTP Verification: ${generatedCode}`,
        name: 'Shri Laxmi Sweet Mart Security',
        owner_name: owner.name,
        otp_code: generatedCode,
        message: `Your 6-digit OTP for Shri Laxmi Sweet Mart Admin Password Reset is: ${generatedCode}. This code is valid for 5 minutes. Do not share with anyone.`,
        _template: 'table',
        _captcha: 'false'
      })
    });

    // Save in Firestore
    const payload = {
      fields: {
        email: { stringValue: owner.email },
        ownerName: { stringValue: owner.name },
        otpCode: { stringValue: generatedCode },
        previousCodes: {
          arrayValue: {
            values: [{ stringValue: generatedCode }]
          }
        },
        expiresAt: { integerValue: expiresAt.toString() },
        isUsed: { booleanValue: false },
        updatedAt: { stringValue: new Date().toISOString() }
      }
    };

    await fetch(FIRESTORE_OTP_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (err: any) {
    console.warn('Fallback sync note:', err);
  }

  return {
    success: true,
    ownerName: owner.name,
    email: owner.email,
    phone: owner.phone,
    expiresAt,
    message: `6-digit OTP sent to your email. Valid for 5 minutes.`
  };
}

/**
 * Strictly verifies the 6-digit Email OTP against all active codes
 */
export async function verifyEmailOtp(rawEmail: string, enteredCode: string): Promise<{ success: boolean; owner: AuthorizedOwner }> {
  const cleanEmail = rawEmail.trim().toLowerCase();
  const owner = AUTHORIZED_OWNERS.find(
    (o) => o.email.toLowerCase() === cleanEmail || cleanEmail.includes(o.email.toLowerCase())
  );

  if (!owner) {
    throw new Error('Unauthorized email address.');
  }

  const cleanCode = enteredCode.trim().replace(/\D/g, '');
  if (cleanCode.length !== 6) {
    throw new Error('Please enter the 6-digit OTP code received in your email.');
  }

  // 1. Verify via Serverless API endpoint
  try {
    const apiRes = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: owner.email, otp: cleanCode })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.success) {
        return { success: true, owner };
      }
    } else {
      const errData = await apiRes.json().catch(() => ({}));
      if (errData.error) {
        throw new Error(errData.error);
      }
    }
  } catch (e: any) {
    if (e.message && !e.message.includes('fetch')) {
      throw e;
    }
  }

  // 2. Direct Cloud Firestore fallback check
  const res = await fetch(FIRESTORE_OTP_URL);
  if (!res.ok) {
    throw new Error('Could not verify OTP. Please request a fresh code.');
  }

  const doc = await res.json();
  if (!doc || !doc.fields) {
    throw new Error('No active OTP found. Please request a fresh code.');
  }

  const f = doc.fields;
  const storedEmail = (f.email?.stringValue || '').toLowerCase();
  const storedCode = f.otpCode?.stringValue || '';
  const expiresAt = Number(f.expiresAt?.integerValue || 0);
  const isUsed = f.isUsed?.booleanValue ?? false;

  const validCodes = [storedCode];
  if (f.previousCodes?.arrayValue?.values) {
    f.previousCodes.arrayValue.values.forEach((v: any) => {
      if (v.stringValue) validCodes.push(v.stringValue);
    });
  }

  if (storedEmail !== owner.email.toLowerCase()) {
    throw new Error('OTP was issued for a different email address.');
  }

  if (Date.now() > expiresAt) {
    throw new Error('This OTP has expired (5-minute limit). Please request a fresh OTP.');
  }

  if (isUsed) {
    throw new Error('This OTP has already been used. Please request a fresh OTP.');
  }

  if (!validCodes.includes(cleanCode)) {
    throw new Error('Incorrect 6-digit OTP code. Please check your email inbox.');
  }

  // Mark as used
  fetch(FIRESTORE_OTP_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        ...f,
        isUsed: { booleanValue: true },
        updatedAt: { stringValue: new Date().toISOString() }
      }
    })
  }).catch(() => {});

  return { success: true, owner };
}
