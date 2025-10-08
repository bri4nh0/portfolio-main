import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { Footer } from "../components/footer";

export default function BlogPost () {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // ✅ Use relative URL for Vercel
        const res = await fetch(`https://portfolio-main-i403.onrender.com//api/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10">Post not found.</p>;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ThemeToggle />

      <main className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <Link
            to="/blog"
            className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition"
          >
            ← Back to Blog Directory
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted-foreground text-sm mb-6">
          By {post.author} • {new Date(post.created_at).toLocaleDateString()}
        </p>
        <div className="prose dark:prose-invert">{post.content}</div>
      </main>

      <Footer />
    </div>
  );
}
