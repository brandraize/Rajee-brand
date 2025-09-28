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

export async function GET(request) {
  try {
    const uid = await getUidFromRequest(request);
    if (!uid) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const snap = await firestoreAdmin
      .collection('users')
      .doc(uid)
      .collection('favorites')
      .orderBy('createdAt', 'desc')
      .get();

    const favorites = snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
    return NextResponse.json({ success: true, favorites });
  } catch (error) {
    console.error('GET /api/favorites error:', error);
    return NextResponse.json({ success: false, message: 'Failed to load favorites' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const uid = await getUidFromRequest(request);
    if (!uid) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const postId = String(body?.postId || '').trim();
    if (!postId) {
      return NextResponse.json({ success: false, message: 'postId is required' }, { status: 400 });
    }

    const postRef = firestoreAdmin.collection('posts').doc(postId);
    const postDoc = await postRef.get();
    if (!postDoc.exists) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }
    const data = postDoc.data();

    await firestoreAdmin
      .collection('users')
      .doc(uid)
      .collection('favorites')
      .doc(postId)
      .set({
        postId,
        title: data.title || '',
        price: data.price || 0,
        category: data.category || 'Main',
        subcategory: data.subcategory || data.subCategory || '',
        images: Array.isArray(data.images) ? data.images : [],
        status: data.status || 'Active',
        createdAt: serverTimestamp(),
      }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/favorites error:', error);
    return NextResponse.json({ success: false, message: 'Failed to add favorite' }, { status: 500 });
  }
}


