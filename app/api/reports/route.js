import { NextResponse } from 'next/server';
import { authAdmin, firestoreAdmin, serverTimestamp } from '../../../configuration/firebase-admin';

export const dynamic = 'force-dynamic';

async function getUidFromRequest(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return null;
    const decoded = await authAdmin.verifyIdToken(token);
    return decoded?.uid || null;
  } catch (_) {
    return null;
  }
}

export async function POST(request) {
  try {
    const uid = await getUidFromRequest(request);
    if (!uid) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const listingId = String(body?.listingId || '').trim();
    const reason = String(body?.reason || '').trim();
    if (!listingId || !reason) {
      return NextResponse.json({ success: false, message: 'listingId and reason are required' }, { status: 400 });
    }

    let userDisplayName = '';
    let userEmail = '';
    try {
      const userDoc = await firestoreAdmin.collection('users').doc(uid).get();
      if (userDoc.exists) {
        userDisplayName = userDoc.data()?.displayName || '';
        userEmail = userDoc.data()?.email || '';
      }
    } catch (_) {}

    await firestoreAdmin.collection('reports').add({
      listingId,
      userId: uid,
      userDisplayName,
      userEmail,
      reason,
      status: 'open',
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/reports error:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit report' }, { status: 500 });
  }
}


