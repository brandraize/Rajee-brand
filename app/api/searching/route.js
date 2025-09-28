import { NextResponse } from 'next/server';
import { firestoreAdmin } from '../../../configuration/firebase-admin'; // adjust path if needed

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
    const query = searchParams.get('q')?.trim().toLowerCase();

    if (!query) {
      return NextResponse.json({
        success: false,
        message: 'Query parameter "q" is required.',
      }, { status: 400 });
    }

    // Fetch posts from Firestore
    const postsSnapshot = await firestoreAdmin.collection('posts').get();

    // Filter posts based on query matching post title (case-insensitive)
    const matchingPosts = postsSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        };
      })
      .filter(post =>
        post.title?.toLowerCase().includes(query)
      );

    // Extract unique clientIds from matching posts
    const clientIds = [...new Set(matchingPosts.map(post => post.clientId).filter(Boolean))];

    // Fetch users whose uid is in clientIds
    let usersMap = {};
    if (clientIds.length > 0) {
      const usersSnapshot = await firestoreAdmin.collection('users')
        .where('uid', 'in', clientIds)
        .get();

      usersSnapshot.docs.forEach(userDoc => {
        const userData = userDoc.data();
        usersMap[userData.uid] = userData.name || null;
      });
    }

    // Attach user names to posts
    const postsWithUserNames = matchingPosts.map(post => ({
      ...post,
      sellerName: usersMap[post.clientId] || null,
    }));

    return NextResponse.json({
      success: true,
      posts: postsWithUserNames,
    });

  } catch (error) {
    console.error('GET /api/searching error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}
