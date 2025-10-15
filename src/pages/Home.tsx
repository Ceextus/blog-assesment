
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { Post } from "../types";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch posts on component mount
  useEffect(() => {
    

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Post[]>(
        "https://jsonplaceholder.typicode.com/posts"
      );
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (err) {
      setError("Failed to load posts. Please try again later.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setFilteredPosts(posts);
        return;
      }

      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    },
    [posts]
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading posts...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
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
            Oops!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchPosts}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get featured post (first post)
  const featuredPost = posts[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {featuredPost && (
          <div
            onClick={() => (window.location.href = `/post/${featuredPost.id}`)}
            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg mb-12 cursor-pointer group"
          >
            <div className="relative h-[500px]">
              <img
                src={`https://picsum.photos/seed/${featuredPost.id}/1200/600`}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md mb-4">
                  Featured
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl leading-tight group-hover:text-blue-400 transition-colors">
                  {featuredPost.title}
                </h1>
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://i.pravatar.cc/40?img=${featuredPost.userId}`}
                    alt="Author"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div className="text-sm text-white">
                    <p className="font-medium">User {featuredPost.userId}</p>
                    <p className="text-gray-300">Featured Post</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Latest Posts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Latest Post
          </h2>

          {/* Search Results Info */}
          {searchQuery && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Found {filteredPosts.length} result
              {filteredPosts.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
          )}

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>

        {/* View All Posts Button */}
        {!searchQuery && filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-500 rounded-lg font-medium transition-all">
              View All Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
