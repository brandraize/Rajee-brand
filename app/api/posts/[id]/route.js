import { NextResponse } from 'next/server';
import { firestoreAdmin } from '../../../../configuration/firebase-admin';

export const dynamic = 'force-dynamic';

// =================== GET /api/posts/[id] ===================
export async function GET(_request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرّف غير صالح' },
        { status: 400 }
      );
    }

    const doc = await firestoreAdmin.collection('posts').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'غير موجود' },
        { status: 404 }
      );
    }

    const postData = doc.data();

    // 🔍 Fetch seller name from users collection
    let sellerName = '';
    let sellerProfileImage = ''; 
    if (postData.clientId) {
      const userDoc = await firestoreAdmin.collection('users').doc(postData.clientId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        sellerName = userData?.name || '';
          sellerProfileImage = userData?.profileImage || '';
      }
    }

    return NextResponse.json({
      success: true,
      post: {
        id: doc.id,
        ...postData,
        createdAt: postData.createdAt?.toDate
          ? postData.createdAt.toDate()
          : postData.createdAt,
        sellerName, // ✅ Add seller name here
sellerProfileImage,
      },  
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'فشل في جلب البيانات',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// =================== DELETE /api/posts/[id] ===================
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرّف غير صالح' },
        { status: 400 }
      );
    }

    // 🔐 Extract Bearer token
    const authHeader = request.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: 'مصادقة مطلوبة' },
        { status: 401 }
      );
    }

    // 🔐 Verify token
    let decoded;
    try {
      const { authAdmin } = await import('../../../../configuration/firebase-admin');
      decoded = await authAdmin.verifyIdToken(idToken);
    } catch (e) {
      return NextResponse.json(
        { success: false, message: 'رمز المصادقة غير صالح' },
        { status: 401 }
      );
    }

    // 📄 Get the post
    const doc = await firestoreAdmin.collection('posts').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: 'غير موجود' },
        { status: 404 }
      );
    }

    const postData = doc.data();

    // ✅ Optional: Resolve sellerName (for logging or returning)
    let sellerName = '';
    if (postData.clientId) {
      const userDoc = await firestoreAdmin.collection('users').doc(postData.clientId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log(userDoc);
        sellerName = userData?.name || '';
       
      }
    }

    // ❌ Deny if user is not owner
    if (postData.clientId !== decoded.uid) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف هذا الإعلان' },
        { status: 403 }
      );
    }

    // 🗑️ Delete the post
    await firestoreAdmin.collection('posts').doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'تم حذف الإعلان بنجاح',
    });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'فشل في حذف الإعلان',
        error: process.env.NODE_ENV === 'development' ? (error?.message || String(error)) : undefined,
      },
      { status: 500 }
    );
  }
}
