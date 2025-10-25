'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

// جلب المقالات من الـ API
async function fetchPosts() {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

// حذف مقال
async function deletePost(id: number) {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
  return id;
}

type Post = { id: string, title: string, content: string, createdAt: string };

export default function HomePage() {
  const queryClient = useQueryClient();

  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => deletePost(Number(id)),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);

      queryClient.setQueryData<Post[]>(['posts'], (old: Post[] = []) =>
        old.filter((p) => p.id !== id)
      );

      return { previousPosts };
    },

    onError: (err, id, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (isError)
    return <p className="text-center mt-10 text-red-500">Error fetching posts</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📰 Blog Posts</h1>

      <div className="flex justify-end mb-6">
        <Link
          href="/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ New Post
        </Link>
      </div>

      <ul className="space-y-4">
        { posts.length === 0 ? (
          <p className="text-gray-500 text-center">No posts yet 😅</p>
        ) : (
          posts.map((post: Post) => (
            <li
              key={ post.id }
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <Link
                href={ `/edit/${post.id}` }
                className="text-lg font-semibold text-blue-700 hover:underline"
              >
                { post.title }
              </Link>
              { post.content && (
                <p className="text-gray-600 mt-2 line-clamp-2">
                  { post.content }
                </p>
              ) }
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-400">
                  { new Date(post.createdAt).toLocaleString() }
                </p>
                <button
                  onClick={ () => mutation.mutate(post.id) }
                  className="text-red-500 text-sm hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))
        ) }
      </ul>
    </main>
  );
}
