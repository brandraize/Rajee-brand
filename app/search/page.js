'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get('q')?.trim() || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setPosts([]);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/searching?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch posts');
        }

        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h1>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p>No posts found.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
