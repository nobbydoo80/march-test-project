// app/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const router = useRouter();

  // Fetch single post
  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
      const post = await res.json();
      setTitle(post.title);
      setBody(post.body);
    }

    fetchPost();
  }, [params.id]);

  // Update post
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: 1 }),
    });
    alert('Post updated!');
    router.push('/');
  }

  // Delete post
  async function handleDelete() {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`, {
      method: 'DELETE',
    });
    alert('Post deleted!');
    router.push('/');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-lg font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border p-2 w-full h-32 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Update Post
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 ml-4"
        >
          Delete Post
        </button>
      </form>
    </div>
  );
}
