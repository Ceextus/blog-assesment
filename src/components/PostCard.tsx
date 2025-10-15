// components/PostCard.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../types";
import AOS from "aos";
import "aos/dist/aos.css";

interface PostCardProps {
  post: Post;
  index?: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, index = 0 }) => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  // Generate consistent image based on post ID
  const imageId = (post.id % 50) + 1;

  // Rotate through author names
  const authors = [
    "Jason Francisco",
    "Tracey Wilson",
    "Ernie Smith",
    "Eric Smith",
    "Elizabeth Slavin",
  ];
  const authorName = authors[post.userId % authors.length];

  // Format current date
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate stagger delay
  const delay = (index % 3) * 100;

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={delay}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer group"
      onClick={() => navigate(`/post/${post.id}`)}
    >
      {/* Featured Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${imageId}/600/400`}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-md mb-3">
          Technology
        </span>

        {/* Post Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors leading-snug">
          {post.title}
        </h3>

        {/* Author & Date */}
        <div className="flex items-center space-x-3">
          <img
            src={`https://i.pravatar.cc/40?img=${(post.userId % 70) + 1}`}
            alt={authorName}
            className="w-9 h-9 rounded-full"
          />
          <div className="text-sm">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {authorName}
            </p>
            <p className="text-gray-500 dark:text-gray-400">{formatDate()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
