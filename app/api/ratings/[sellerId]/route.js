import { NextResponse } from 'next/server';
import { firestoreAdmin, authAdmin } from '../../../../configuration/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const sellerId = params.sellerId;
    const { searchParams } = new URL(request.url);
    const summaryOnly = searchParams.get('summary') === 'true';
    const postId = searchParams.get('postId') || undefined;
    const snapshot = await firestoreAdmin
      .collection('ratings')
      .where('sellerId', '==', sellerId)
      .get();
    let ratings = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a,b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
    if (postId) {
      ratings = ratings.filter(r => (r.postId || '') === postId);
    }
    const count = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + Number(r.stars || 0), 0);
    const average = count > 0 ? Number((sum / count).toFixed(2)) : 0;
    const trusted = average >= 4.5 && count >= 10;
    if (summaryOnly) {
      return NextResponse.json({ success: true, average, count, trusted });
    }
    return NextResponse.json({ success: true, ratings, average, count, trusted });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل في جلب التقييمات' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const sellerId = params.sellerId;
    const authHeader = request.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    if (!idToken) return NextResponse.json({ success: false, message: 'مصادقة مطلوبة' }, { status: 401 });
    let decoded;
    try {
      decoded = await authAdmin.verifyIdToken(idToken);
    } catch (_) {
      return NextResponse.json({ success: false, message: 'رمز المصادقة غير صالح' }, { status: 401 });
    }
    const buyerId = decoded.uid;
    const body = await request.json();
    const stars = Math.max(1, Math.min(5, Number(body?.stars || 0)));
    const review = String(body?.review || '').slice(0, 2000);
    const postId = String(body?.postId || '').trim();
    if (!postId) {
      return NextResponse.json({ success: false, message: 'postId مطلوب' }, { status: 400 });
    }
    const existing = await firestoreAdmin
      .collection('ratings')
      .where('sellerId', '==', sellerId)
      .where('buyerId', '==', buyerId)
      .where('postId', '==', postId)
      .limit(1)
      .get();
    if (!existing.empty) {
      const doc = existing.docs[0];
      await firestoreAdmin.collection('ratings').doc(doc.id).update({ stars, review, timestamp: new Date() });
      return NextResponse.json({ success: true, updated: true });
    }
    await firestoreAdmin.collection('ratings').add({ sellerId, buyerId, postId, stars, review, timestamp: new Date() });
    return NextResponse.json({ success: true, created: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل في إرسال التقييم' }, { status: 500 });
  }
}


