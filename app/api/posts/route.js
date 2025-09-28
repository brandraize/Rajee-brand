import { NextResponse } from 'next/server';
import { firestoreAdmin } from '../../../configuration/firebase-admin';

const toSlug = (value) => {
  if (!value) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({
        success: false,
        message: 'Category parameter is required.'
      }, { status: 400 });
    }

    const slugifiedCategory = toSlug(category);

    // Fetch all posts
    const postsSnapshot = await firestoreAdmin.collection('posts').get();

    // Filter posts by category
    const filteredPosts = postsSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate
          ? doc.data().createdAt.toDate()
          : doc.data().createdAt,
      }))
      .filter((post) => toSlug(post.category || 'Main') === slugifiedCategory);

    if (filteredPosts.length === 0) {
      return NextResponse.json({
        success: true,
        posts: [],
        message: 'No posts found for this category.',
      });
    }

    // Get unique clientIds from posts
    const clientIds = [...new Set(filteredPosts.map((post) => post.clientId))];

    // Batch fetch user documents based on clientIds
    const userDocs = await Promise.all(
      clientIds.map(async (uid) => {
        const userSnap = await firestoreAdmin.collection('users').doc(uid).get();
        return userSnap.exists ? { uid, ...userSnap.data() } : null;
      })
    );

    // Map uid -> user object for quick lookup
    const userMap = {};
    userDocs.forEach(user => {
      if (user) userMap[user.uid] = user;
    });

    // Attach sellerName to each post
    const postsWithSeller = filteredPosts.map(post => {
      const user = userMap[post.clientId];
      return {
        ...post,
        sellerName: user?.name || 'Unknown Seller',
      };
    });

    return NextResponse.json({
      success: true,
      posts: postsWithSeller,
    });

  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في جلب البيانات',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
