import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Content Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Sorry, the blog post or content you are looking for could not be found.
      </p>
      <Link
        href="/blog"
        className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Back to Blog
      </Link>
    </div>
  );
}
