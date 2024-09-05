"use client";

import React from "react";
import { useHttpClient } from "./hook/useHttpClient";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { sendRequest } = useHttpClient();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await sendRequest(`${process.env.API_URL}/posts`, "GET");
        setPosts(res);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    }

    fetchPost();
  }, [sendRequest]);

  return (
    <div>
      {loading ? (
        <div className="text-center mt-10">
          <p className="text-gray-500">Loading posts...</p>
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-bold mb-6">All Posts</h1>
          <ul className="space-y-4">
            {posts.map((post: { id: number; title: string }) => (
              <li
                key={post.id}
                className="p-4 border rounded-md hover:shadow-md"
              >
                <a
                  href={`/${post.id}`}
                  className="text-blue-500 font-semibold text-lg hover:underline"
                >
                  {post.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
