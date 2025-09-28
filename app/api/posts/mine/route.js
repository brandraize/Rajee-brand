import { NextResponse } from 'next/server';
import { authAdmin, firestoreAdmin } from '../../../../configuration/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'مصادقة مطلوبة' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await authAdmin.verifyIdToken(idToken);
    } catch (e) {
      return NextResponse.json({ success: false, message: 'رمز المصادقة غير صالح' }, { status: 401 });
    }
    try {
      const snapshot = await firestoreAdmin
        .collection('posts')
        .where('clientId', '==', decoded.uid)
        .orderBy('createdAt', 'desc')
        .get();
      const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      return NextResponse.json({ success: true, posts });
    } catch (orderedError) {
      console.error('Ordered posts query failed, retrying without orderBy:', orderedError);
      const snapshot2 = await firestoreAdmin
        .collection('posts')
        .where('clientId', '==', decoded.uid)
        .get();
      const posts = snapshot2.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const aTs = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const bTs = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return bTs - aTs;
        });
      return NextResponse.json({ success: true, posts });
    }
  } catch (error) {
    console.error('GET /api/posts/mine error:', error);
    return NextResponse.json({ success: false, message: 'فشل في جلب البيانات', error: process.env.NODE_ENV === 'development' ? (error?.message || String(error)) : undefined }, { status: 500 });
  }
}


