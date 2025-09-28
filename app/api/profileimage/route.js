import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// ✅ Initialize Admin SDK only once
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

/**
 * Save profile or cover image
 */
export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = await getAuth().verifyIdToken(token);

    const { imageUrl, type } = await req.json();

    if (!['profile', 'cover'].includes(type)) {
      return NextResponse.json({ error: 'Invalid image type' }, { status: 400 });
    }

    await db.collection('users').doc(decoded.uid).set(
      {
        [`${type}Image`]: imageUrl,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error updating profile image:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * Get current user profile (with images)
 */
export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = await getAuth().verifyIdToken(token);

    const doc = await db.collection('users').doc(decoded.uid).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: doc.data() });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
