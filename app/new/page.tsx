"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHttpClient } from "../hook/useHttpClient";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { sendRequest } = useHttpClient();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await sendRequest(
      `${process.env.API_URL}/posts`,
      "POST",
      JSON.stringify({ title: title, body: body, userId: 1 })
    );
    alert("Post created!");
    router.push("/");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border p-2 w-full h-32 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post body"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
