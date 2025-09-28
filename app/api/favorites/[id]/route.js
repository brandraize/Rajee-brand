import { NextResponse } from 'next/server';
import { authAdmin, firestoreAdmin } from '../../../../configuration/firebase-admin';

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

export async function DELETE(request, { params }) {
  try {
    const uid = await getUidFromRequest(request);
    if (!uid) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const postId = params?.id;
    if (!postId) {
      return NextResponse.json({ success: false, message: 'postId is required' }, { status: 400 });
    }

    await firestoreAdmin
      .collection('users')
      .doc(uid)
      .collection('favorites')
      .doc(postId)
      .delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/favorites/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Failed to remove favorite' }, { status: 500 });
  }
}


