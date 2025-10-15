// pages/PostDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Post, User } from "../types";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPostAndAuthor();
    }
  }, [id]);

  const fetchPostAndAuthor = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch post
      const postResponse = await axios.get<Post>(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      setPost(postResponse.data);

      // Update document title
      document.title = `${postResponse.data.title} - MetaBlog`;
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          postResponse.data.body.substring(0, 150)
        );
      }

      // Fetch author
      const userResponse = await axios.get<User>(
        `https://jsonplaceholder.typicode.com/users/${postResponse.data.userId}`
      );
      setAuthor(userResponse.data);
    } catch (err) {
      setError("Failed to load post. Please try again later.");
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading post...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The post you are looking for does not exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const imageId = (post.id % 50) + 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Category Badge */}
        <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md mb-4">
          Technology
        </span>

        {/* Post Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center space-x-3 mb-8">
          <img
            src={`https://i.pravatar.cc/48?img=${(post.userId % 70) + 1}`}
            alt={author?.name || "Author"}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-gray-900 dark:text-white font-medium">
              {author?.name || "Loading..."}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {formatDate()}
            </p>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={`https://picsum.photos/seed/${imageId}/1200/600`}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>

        {/* Post Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.body}
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.body}
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
            Research Your Destination
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.body}
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.body}
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
            Plan Your Itinerary
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.body}
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.body}
          </p>

          {/* Quote Block */}
          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-6 my-8 italic text-gray-700 dark:text-gray-300 text-lg">
            "Traveling can expose you to new environments and potential health
            risks, so it's crucial to take precautions to stay safe and
            healthy."
          </blockquote>

          {/* Additional Image */}
          <div className="my-8 rounded-xl overflow-hidden">
            <img
              src={`https://picsum.photos/seed/${imageId + 1}/1200/600`}
              alt="Additional"
              className="w-full h-auto"
            />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
            Pack Lightly and Smartly
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.title}
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
            Stay Safe and Healthy
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.body}
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
            Immerse Yourself in the Local Culture
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.body}
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
            Capture Memories
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {post.body}
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
            Conclusion:
          </h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            _{post.body}
          </p>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
