// app/api/settings/route.js

import { NextResponse } from 'next/server';
import admin, { db, auth } from '../../../lib/firebaseAdmin'; // ✅ your preferred import

// 🔍 Basic email format validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 🔍 Optional phone validation
function isValidPhone(phone) {
  const phoneRegex = /^\+?\d{7,15}$/;
  return phoneRegex.test(phone);
}

// ✅ GET /api/settings?uid=USER_ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 });
    }

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    // ❌ Exclude sensitive fields
    delete userData.password;

    return NextResponse.json(userData);
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ✅ POST /api/settings
export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, deleteAccount, ...updates } = body;

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 🗑️ Delete user document and Auth account
    if (deleteAccount) {
      await userRef.delete();
      try {
        await auth.deleteUser(uid); // ✅ Optional: delete from Firebase Auth too
      } catch (authError) {
        console.warn('Auth deletion failed or skipped:', authError.message);
      }

      return NextResponse.json({ message: 'Account deleted successfully' });
    }

    // ✅ Validation (optional but recommended)
    if (updates.email && !isValidEmail(updates.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (updates.phone && !isValidPhone(updates.phone)) {
      return NextResponse.json({ error: 'Invalid phone format. Use + and digits only.' }, { status: 400 });
    }

    // ⏱️ Add timestamp
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await userRef.update(updates);

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('POST /api/settings error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
