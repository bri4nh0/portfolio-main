import { useEffect, useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { Link } from "react-router-dom";

export default function BlogDirectory () {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // ✅ Relative URL works for both local dev and Vercel
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ThemeToggle />
      
      <main className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">Blog Posts</h1>

        {loading ? (
          <p className="text-center">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="border-b pb-4">
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="text-muted-foreground text-sm mb-2">
                  By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p>{post.content.slice(0, 150)}...</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
