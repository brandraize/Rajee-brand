import { NextResponse } from 'next/server';
import admin from "../../../lib/firebaseAdmin"

const adminDb = admin.firestore();

// Securely extract UID from Bearer token in Authorization header
async function getCurrentUserId(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('No valid Authorization header provided.');
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error.message);
    return null;
  }
}

// Fetch user document from Firestore (Admin SDK)
async function getUserFromUID(uid) {
  const userDoc = await adminDb.collection('users').doc(uid).get();
  return userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null;
}

// Fetch posts created by the user (Admin SDK)
async function getPostsFromUID(uid) {
  const postsSnapshot = await adminDb.collection('posts').where('clientId', '==', uid).get();
  return postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch reports submitted by the user (Admin SDK)
async function getReportsFromUID(uid) {
  const reportsSnapshot = await adminDb.collection('reports').where('userId', '==', uid).get();
  return reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// GET handler for /api/profile
export async function GET(request) {
  try {
    const uid = await getCurrentUserId(request);

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user, posts, and reports in parallel
    const [user, posts, reports] = await Promise.all([
      getUserFromUID(uid),
      getPostsFromUID(uid),
      getReportsFromUID(uid),
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user, posts, reports });
  } catch (error) {
    console.error('API /profile GET error:', error.message, error.stack);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
