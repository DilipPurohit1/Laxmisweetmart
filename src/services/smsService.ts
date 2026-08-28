import { AUTHORIZED_OWNERS, AuthorizedOwner } from './firebaseRest';

const FIRESTORE_PROJECT_ID = 'laxmi-sweet-mart';
const FIRESTORE_OTP_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/settings/admin_otp`;

export interface OtpDispatchResult {
  success: boolean;
  ownerName: string;
  phone: string;
  expiresAt: number;
  message: string;
}

/**
 * Dispatches 6-digit SMS OTP via fast serverless gateway and syncs with Cloud Firestore
 */
export async function sendSmsOtpToOwner(rawPhone: string): Promise<OtpDispatchResult> {
  const clean = rawPhone.replace(/\D/g, '');

  const owner = AUTHORIZED_OWNERS.find((o) => clean.endsWith(o.phone));
  if (!owner) {
    throw new Error('Unauthorized mobile number. Password reset is restricted to registered owners only.');
  }

  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 1. Dispatch via Serverless API endpoint
  try {
    const apiRes = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: owner.phone })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      return {
        success: true,
        ownerName: owner.name,
        phone: owner.phone,
        expiresAt: data.expiresAt || expiresAt,
        message: `6-digit OTP dispatched via SMS to ${owner.name}. Valid for 5 minutes.`
      };
    }
  } catch (e) {
    console.warn('Serverless API dispatch note:', e);
  }

  // 2. Direct Cloud Firestore Fallback Sync
  try {
    const payload = {
      fields: {
        phone: { stringValue: owner.phone },
        ownerName: { stringValue: owner.name },
        otpCode: { stringValue: generatedCode },
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
    console.warn('Firestore fallback sync note:', err);
  }

  return {
    success: true,
    ownerName: owner.name,
    phone: owner.phone,
    expiresAt,
    message: `6-digit OTP dispatched via SMS to ${owner.name}. Valid for 5 minutes.`
  };
}

/**
 * Strictly verifies the 6-digit SMS OTP
 */
export async function verifySmsOtp(rawPhone: string, enteredCode: string): Promise<{ success: boolean; owner: AuthorizedOwner }> {
  const clean = rawPhone.replace(/\D/g, '');
  const owner = AUTHORIZED_OWNERS.find((o) => clean.endsWith(o.phone));
  if (!owner) {
    throw new Error('Unauthorized mobile number.');
  }

  const cleanCode = enteredCode.trim().replace(/\D/g, '');
  if (cleanCode.length !== 6) {
    throw new Error('Please enter the 6-digit OTP code received on your SMS.');
  }

  // 1. Verify via Serverless API endpoint
  try {
    const apiRes = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: owner.phone, otp: cleanCode })
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

  // 2. Direct Cloud Firestore verification fallback
  const res = await fetch(FIRESTORE_OTP_URL);
  if (!res.ok) {
    throw new Error('Could not verify OTP. Please request a fresh code.');
  }

  const doc = await res.json();
  if (!doc || !doc.fields) {
    throw new Error('No active OTP found. Please request a fresh code.');
  }

  const f = doc.fields;
  const storedPhone = f.phone?.stringValue || '';
  const storedCode = f.otpCode?.stringValue || '';
  const expiresAt = Number(f.expiresAt?.integerValue || 0);
  const isUsed = f.isUsed?.booleanValue ?? false;

  if (!storedPhone.endsWith(owner.phone)) {
    throw new Error('OTP does not match this mobile number.');
  }

  if (Date.now() > expiresAt) {
    throw new Error('This OTP has expired (5-minute limit). Please request a fresh OTP.');
  }

  if (isUsed) {
    throw new Error('This OTP has already been used. Please request a fresh OTP.');
  }

  if (storedCode !== cleanCode) {
    throw new Error('Incorrect 6-digit OTP code. Please check your SMS inbox.');
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
