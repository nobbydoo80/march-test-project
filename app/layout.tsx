// app/layout.tsx
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto">
            <a href="/" className="text-white font-bold mr-6 hover:text-gray-400">
              Home
            </a>
            <a href="/new" className="text-white font-bold hover:text-gray-400">
              Create New Post
            </a>
          </div>
        </nav>
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
