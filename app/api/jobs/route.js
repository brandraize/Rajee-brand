import { NextResponse } from 'next/server';
import { firestoreAdmin } from '../../../configuration/firebase-admin';

export const dynamic = 'force-dynamic';

const ALLOWED_CATEGORIES = [
  'Main',
  'electrical-tools',
  'construction-equipment',
  'iron-tools',
  'plastic-tools',
  'old-electronics',
  'fashion',
  'furniture',
  'cars'
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limitNum = Math.min(Math.max(parseInt(limitParam || '12', 10) || 12, 0), 100);

    // Step 1: Get all posts from Firestore
    const snapshot = await firestoreAdmin.collection('posts').get();
    let posts = snapshot.docs.map((d) => {
      const data = d.data();
      return { 
        id: d.id, 
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        location: data.location,
        images: data.images || [],
        products: data.products || [],
        status: data.status,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        clientId: data.clientId
      };
    });

    // Step 2: Filter only Active posts
    posts = posts.filter(post => post.status === 'Active');

    // Step 3: Filter by allowed categories
    posts = posts.filter(post => {
      const postCategory = post.category || 'Main';
      return ALLOWED_CATEGORIES.includes(postCategory);
    });

    // Step 4: Get unique clientIds
    const clientIds = [...new Set(posts.map(post => post.clientId).filter(Boolean))];

    // Step 5: Fetch user data for those clientIds
    const userDocs = await Promise.all(
      clientIds.map(id => firestoreAdmin.collection('users').doc(id).get())
    );

    const userMap = {};
    userDocs.forEach(doc => {
      if (doc.exists) {
        userMap[doc.id] = doc.data().name || 'Unknown';
      }
    });

    // Step 6: Attach sellerName to each post
    posts = posts.map(post => ({
      ...post,
      sellerName: userMap[post.clientId] || 'Unknown'
    }));

    // Step 7: Sort and limit
    posts = posts.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });

    if (limitNum > 0) {
      posts = posts.slice(0, limitNum);
    }

    return NextResponse.json({ 
      success: true, 
      posts,
      total: posts.length
    });

  } catch (error) {
    console.error('GET /api/jobs error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'فشل في جلب الوظائف',
      error: process.env.NODE_ENV === 'development' ? (error?.message || String(error)) : undefined
    }, { status: 500 });
  }
}
