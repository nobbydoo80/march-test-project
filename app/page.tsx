// app/page.tsx
export default async function HomePage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">All Posts</h1>
      <ul className="space-y-4">
        {posts.map((post: { id: number, title: string }) => (
          <li key={post.id} className="p-4 border rounded-md hover:shadow-md">
            <a href={`/${post.id}`} className="text-blue-500 font-semibold text-lg hover:underline">
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
