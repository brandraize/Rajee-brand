import { NextResponse } from 'next/server';
import { authAdmin, firestoreAdmin, serverTimestamp } from '../../../../../configuration/firebase-admin';

export const dynamic = 'force-dynamic';

export async function PATCH(request) {
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

    // Check if user is admin
    const isAdmin = decoded.email === "admin@gmail.com" || decoded.email?.includes("admin");
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: 'صلاحيات الإدارة مطلوبة' }, { status: 403 });
    }

    const body = await request.json();
    const { postId, status } = body;

    if (!postId || !status) {
      return NextResponse.json({
        success: false,
        message: 'معرف الإعلان والحالة مطلوبان'
      }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['Pending', 'Active', 'Deactive'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'حالة غير صالحة. الحالات المسموحة: Pending, Active, Deactive'
      }, { status: 400 });
    }

    // Check if post exists
    const doc = await firestoreAdmin.collection('posts').doc(postId).get();
    if (!doc.exists) {
      return NextResponse.json({ success: false, message: 'الإعلان غير موجود' }, { status: 404 });
    }

    // Update post status
    await firestoreAdmin.collection('posts').doc(postId).update({
      status,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الإعلان بنجاح'
    });

  } catch (error) {
    console.error('PATCH /api/posts/admin/update-status error:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في تحديث حالة الإعلان',
      error: process.env.NODE_ENV === 'development' ? (error?.message || String(error)) : undefined
    }, { status: 500 });
  }
}
