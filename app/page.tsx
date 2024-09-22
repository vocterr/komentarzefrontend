"use client";

import { useState, useEffect, FormEvent } from "react";
import config from "dotenv";
import {motion, AnimatePresence} from "framer-motion"

interface Comment {
  id: number;
  username: string;
  content: string;
  createdAt: string;
}

const HomePage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
      });
      const data = await res.json();
      console.log("Comments fetched:", data);
      setComments(data);
    }
    catch(error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if(content.length > 2000) {
      setError("Comment exceeds maximum length of 2000 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username, content})
      });

      if(!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to add comment");
        setLoading(false);
        return;
      }

      const newComment = await res.json();
      setComments([...comments, newComment]);
      setUsername("");
      setContent("");
      setLoading(false);
    }
    catch(err) {
      console.error(err);
      setError("An unexpected error occured.");
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <Navbar/>
      <main className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero/>
        <CommentForm
        username={username}
        setUsername={setUsername}
        content={content}
        setContent={setContent}
        handleSubmit={handleSubmit}
        error={error}
        loading={loading}
        />
        <CommentsSection comments={comments}/>
      </main>
      <Footer/>
    </div>
  );

};

export default HomePage;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white fixed w-full top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="text-xl font-bold">PENN Stack App</a>
          </div>

          <div className="hidden md:flex md:items-center">
            <ul className="flex space-x-6">
              <li><a href="#hero" className="hover:text-gray-200">Home</a></li>
              <li><a href="#comments" className="hover:text-gray-200">Comments</a></li>
              <li><a href="#Contact" className="hover:text-gray-200">Contact</a></li>
            </ul>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
               <svg className="h-6 w-6" 
                   xmlns="http://www.w3.org/2000/svg" 
                   fill="none" 
                   viewBox="0 0 24 24" 
                   stroke="currentColor">
                {isOpen ? (
                  // Close icon
                  <path strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Hamburger icon
                  <path strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{y: -20, height: 0}}
          animate={{y: 0, height: "auto"}}
          exit={{y: -20, height: 0}}
          transition={{duration: 0.3}}
          className="md:hidden bg-blue-600 overflow-hidden">
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <li><a href="#hero" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500">Home</a></li>
            <li><a href="#comments" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500">Comments</a></li>
            <li><a href="#footer" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500">Contact</a></li>
          </ul>
        </motion.div>
      )}
        </AnimatePresence>
    </header>
  );
};


const Hero = () => {
  return (
    <section id="hero" className="bg-gray-100 py-12">
      <div className="flex flex-col-reverse md:flex-row items-center">
        <div className="md:w-1/2">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
            Welcome to the PENN Stack App
          </h1>
          <p className="mt-4 text-lg text-gray-600">
          Experience seamless interaction with our responsive and interactive comment system.
          </p>
        </div>

        <div className="md:w-1/2 mb-8 md:mb-0">
          <img src="https://via.placeholder.com/600x400" alt="Hero Image" className="w-full h-auto rounded-lg shadow-lg"/>
        </div>
      </div>
    </section>
  );
};


interface CommentFormProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: FormEvent) => void;
  error: string | null;
  loading: boolean;
}

const CommentForm = ({username, setUsername, content, setContent, handleSubmit, error, loading}:CommentFormProps) => {
  return (
    <section id="comments" className="bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Leave a comment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2"></label>
              <textarea
                id="content"
                name="content"
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none"
                placeholder="Your Comment"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength={2000}
              />
              <p className="text-sm text-gray-500 mt-1">{content.length}/2000 characters</p>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="text-center">
            <button
              type="submit"
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Comment"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};


interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection = ({comments}:CommentsSectionProps) => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Comments</h2>
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment}/>
          ))}
        </div>
      </div>
    </section>
  );
};

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({comment}:CommentItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxDisplayLength = 150;

  const isLong = comment.content && comment.content.length > maxDisplayLength;
  const displayedContent = isExpanded 
  ? (comment.content || '') 
  : (comment.content?.slice(0, maxDisplayLength) || '');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">{comment.username}</h3>
        <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
      </div>
      <p className="mt-4 text-gray-700 break-words">
        {displayedContent}
        {isLong && !isExpanded && "..."}
      </p>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-600 hover:underline focus:outline-none"
        >
          {isExpanded ? "View Less" : "View More"}
        </button>
      )}
    </div>
  );
};



const Footer = () => {
  return (
    <footer id="footer" className="bg-blue-600 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
      <p className="text-center md:text-left">&copy; {new Date().getFullYear()} PENN Stack App. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-200">Facebook</a>
          <a href="#" className="hover:text-gray-200">Twitter</a>
          <a href="#" className="hover:text-gray-200">Instagram</a>
          <a href="#" className="hover:text-gray-200">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}