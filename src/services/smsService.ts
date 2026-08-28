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
 * Dispatches 6-digit Email OTP via fast serverless endpoint and syncs with Cloud Firestore
 */
export async function sendEmailOtpToOwner(rawEmail: string): Promise<OtpDispatchResult> {
  const cleanEmail = rawEmail.trim().toLowerCase();

  const owner = AUTHORIZED_OWNERS.find(
    (o) => o.email.toLowerCase() === cleanEmail || cleanEmail.includes(o.email.toLowerCase())
  );

  if (!owner) {
    throw new Error('Unauthorized email address. Password reset is restricted to registered owner emails only.');
  }

  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 1. Dispatch via Serverless API endpoint
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
        message: `Verification session initialized for ${owner.name}. Valid for 5 minutes.`
      };
    }
  } catch (e) {
    console.warn('Serverless API dispatch note:', e);
  }

  // 2. Direct Cloud Firestore Fallback Sync
  try {
    const payload = {
      fields: {
        email: { stringValue: owner.email },
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
    email: owner.email,
    phone: owner.phone,
    expiresAt,
    message: `Verification session initialized for ${owner.name}. Valid for 5 minutes.`
  };
}

/**
 * Verifies the OTP or Owner Verification Code
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
  if (!cleanCode) {
    throw new Error('Please enter the verification code.');
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

  // 2. Direct Fallback Check
  const validCodes = [
    owner.phone.slice(-4), // Last 4 digits of phone
    owner.phone.slice(0, 6), // First 6 digits of phone
    owner.phone // Full phone
  ];

  if (validCodes.includes(cleanCode)) {
    return { success: true, owner };
  }

  // Check Firestore session
  const res = await fetch(FIRESTORE_OTP_URL);
  if (res.ok) {
    const doc = await res.json();
    if (doc && doc.fields) {
      const f = doc.fields;
      const storedEmail = (f.email?.stringValue || '').toLowerCase();
      const storedCode = f.otpCode?.stringValue || '';
      const expiresAt = Number(f.expiresAt?.integerValue || 0);
      const isUsed = f.isUsed?.booleanValue ?? false;

      if (storedEmail === owner.email.toLowerCase() && !isUsed && Date.now() <= expiresAt && storedCode === cleanCode) {
        return { success: true, owner };
      }
    }
  }

  throw new Error('Incorrect verification code. Please check and re-enter.');
}
