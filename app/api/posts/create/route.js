import { NextResponse } from 'next/server';
import { authAdmin, firestoreAdmin, serverTimestamp } from '../../../../configuration/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {

    if (!authAdmin || !firestoreAdmin) {
      console.error('Firebase Admin not properly initialized');
      return NextResponse.json({
        success: false,
        message: 'خطأ في إعداد الخادم. يرجى التحقق من إعدادات Firebase'
      }, { status: 500 });
    }

    const authHeader = request.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'مصادقة مطلوبة' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await authAdmin.verifyIdToken(idToken);
    } catch (e) {
      console.error('Invalid ID token:', e);
      return NextResponse.json({ success: false, message: 'رمز المصادقة غير صالح' }, { status: 401 });
    }

    const body = await request.json();

    const { title, description, price, category, location, products, images } = body;

    if (!title || !description || !price || !category || !location) {
      return NextResponse.json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      }, { status: 400 });
    }

    if (!products || products.length < 3) {
      return NextResponse.json({
        success: false,
        message: 'يجب إضافة 3 منتجات على الأقل'
      }, { status: 400 });
    }

    if (!images || images.length < 3) {
      return NextResponse.json({
        success: false,
        message: 'يجب إضافة 3 صور على الأقل'
      }, { status: 400 });
    }

    // Validate products
    const validProducts = products.every(product =>
      product.name && product.condition && product.originalPrice
    );

    if (!validProducts) {
      return NextResponse.json({
        success: false,
        message: 'جميع المنتجات يجب أن تحتوي على الاسم والحالة والسعر الأصلي'
      }, { status: 400 });
    }

    const postData = {
      clientId: decoded.uid,
   
      title,
      description,
      price: parseFloat(price),
      category,
      location,
      products,
      images,
      status: 'Pending', // Posts need admin approval
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };


    const docRef = await firestoreAdmin.collection('posts').add(postData);

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الإعلان للمراجعة. سيتم نشره بعد موافقة الإدارة',
      postId: docRef.id,
      redirect: '/seller/dashboard'
    });

  } catch (error) {
    console.error('Error creating post:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);

    return NextResponse.json({
      success: false,
      message: 'فشل نشر الإعلان. حاول مرة أخرى',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
