"use client";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import {
  FiHome,
  FiSearch,
  FiHeart,
  FiUser,
  FiMoreHorizontal,
  FiSend,
  FiUpload,
  FiX,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { RiInstagramFill } from "react-icons/ri";

type Comment = { id: string; text: string };
type Post = {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
};
type Story = { id: string; username: string; avatar: string; image: string };

const sampleStories: Story[] = [
  {
    id: "1",
    username: "john",
    avatar: "https://i.pravatar.cc/50?img=1",
    image: "https://picsum.photos/400/700?random=1",
  },
  {
    id: "2",
    username: "jane",
    avatar: "https://i.pravatar.cc/50?img=2",
    image: "https://picsum.photos/400/700?random=2",
  },
  {
    id: "3",
    username: "user123",
    avatar: "https://i.pravatar.cc/50?img=3",
    image: "https://picsum.photos/400/700?random=3",
  },
  {
    id: "4",
    username: "alice",
    avatar: "https://i.pravatar.cc/50?img=4",
    image: "https://picsum.photos/400/700?random=4",
  },
  {
    id: "5",
    username: "bob",
    avatar: "https://i.pravatar.cc/50?img=5",
    image: "https://picsum.photos/400/700?random=5",
  },
];

const InstagramClone: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("posts");
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNewPost = () => {
    if (!preview) return;
    if (editPostId) {
      // Edit post
      setPosts(
        posts.map((p) =>
          p.id === editPostId ? { ...p, image: preview, caption } : p
        )
      );
      setEditPostId(null);
    } else {
      // New post
      const newPost: Post = {
        id: uuidv4(),
        image: preview,
        caption,
        likes: 0,
        comments: [],
      };
      setPosts([newPost, ...posts]);
    }
    setCaption("");
    setPreview(null);
  };

  const handleLike = (id: string) =>
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );

  const handleComment = (id: string) => {
    const text = commentText[id];
    if (!text) return;
    setPosts(
      posts.map((p) =>
        p.id === id
          ? { ...p, comments: [...p.comments, { id: uuidv4(), text }] }
          : p
      )
    );
    setCommentText({ ...commentText, [id]: "" });
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleEdit = (post: Post) => {
    setEditPostId(post.id);
    setCaption(post.caption);
    setPreview(post.image);
  };

  // Story
  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
  };

  const nextStory = useCallback(() => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < sampleStories.length - 1)
      setActiveStoryIndex(activeStoryIndex + 1);
    else setActiveStoryIndex(null);
    setStoryProgress(0);
  }, [activeStoryIndex]);

  const prevStory = useCallback(() => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) setActiveStoryIndex(activeStoryIndex - 1);
    setStoryProgress(0);
  }, [activeStoryIndex]);

  useEffect(() => {
    if (activeStoryIndex !== null) {
      setStoryProgress(0);
      if (progressRef.current) clearInterval(progressRef.current);
      progressRef.current = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + 1;
        });
      }, 30);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [activeStoryIndex, nextStory]);

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-2 sm:px-4">
      {/* Navbar */}
      <nav className="bg-gray-800 h-[60px] shadow-md sticky top-0 z-10 px-3 py-2 flex justify-between items-center w-full max-w-[600px] mx-auto">
        <div className="text-xl flex font-bold tracking-tight">
          Instagram <RiInstagramFill className="mt-1.5 ml-1" />
        </div>
        <div className="flex space-x-4 text-lg text-gray-300">
          <FiHome className="hover:scale-110 transition-transform cursor-pointer" />
          <FiSearch className="hover:scale-110 transition-transform cursor-pointer" />
          <FiSend className="hover:scale-110 transition-transform cursor-pointer" />
          <FiHeart className="hover:scale-110 transition-transform cursor-pointer" />
          <FiUser className="hover:scale-110 transition-transform cursor-pointer" />
        </div>
      </nav>

      {/* Story Bar */}
      <div className="flex space-x-4 overflow-x-auto py-4 w-full max-w-[600px]">
        {sampleStories.map((story, index) => (
          <div
            key={story.id}
            className="flex flex-col items-center flex-shrink-0 w-20 cursor-pointer"
            onClick={() => openStory(index)}
          >
            <div className="w-16 h-16 rounded-full border-2 border-pink-500 overflow-hidden mb-1">
              <Image
                src={story.avatar}
                width={64}
                height={64}
                alt={story.username}
                className="object-cover"
              />
            </div>
            <span className="text-xs text-gray-300 truncate w-full text-center">
              {story.username}
            </span>
          </div>
        ))}
      </div>

      {/* New Post */}
      <div
        className="bg-gray-800 w-full max-w-[600px] rounded-xl shadow-xl p-4 flex flex-col items-center space-y-4 mb-6 transition-all duration-300 hover:shadow-2xl hover:bg-gray-700"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {!preview ? (
          <div
            className="w-full h-52 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700 transition-all duration-300 group"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <FiUpload className="text-5xl text-gray-400 mb-2 group-hover:text-blue-400 transition-colors duration-300" />
            <p className="text-gray-400 text-center group-hover:text-white transition-colors duration-300">
              Click or Drag & Drop to upload your photo
            </p>
          </div>
        ) : (
          <div className="w-full relative rounded-xl overflow-hidden h-64">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-600 transition"
            >
              <FiX />
            </button>
          </div>
        )}

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border border-gray-700 rounded-md p-2 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleNewPost}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {editPostId ? "Edit Post" : "Post"}
        </button>
      </div>

      {/* Feed */}
      <div className="flex flex-col items-center w-full max-w-[600px] space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              layout
              className="bg-gray-800 rounded-md shadow-md overflow-hidden w-full"
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
                    <Image alt="Hami" src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png' width={1000} height={1000}></Image>
                  </div>
                  <span className="font-semibold text-white">Hami Parsa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiEdit
                    className="cursor-pointer text-gray-300 hover:text-blue-400"
                    onClick={() => handleEdit(post)}
                  />
                  <FiTrash2
                    className="cursor-pointer text-gray-300 hover:text-red-500"
                    onClick={() => handleDelete(post.id)}
                  />
                  <FiMoreHorizontal className="cursor-pointer text-gray-400" />
                </div>
              </div>
              <div className="relative w-full h-[500px]">
                <Image
                  src={post.image}
                  alt="Post"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="text-red-500 hover:scale-110 transition-transform flex items-center"
                  >
                    <FiHeart className="mr-1" /> {post.likes}
                  </button>
                  <FiSend className="cursor-pointer hover:scale-110 transition-transform text-gray-300" />
                </div>
              </div>
              <div className="px-3 pb-2">
                <span className="font-semibold mr-2">username</span>
                {post.caption}
              </div>
              <div className="px-3 space-y-1 mb-2 text-gray-300">
                {post.comments.map((c) => (
                  <div key={c.id}>
                    <span className="font-semibold mr-2 text-white">user</span>
                    {c.text}
                  </div>
                ))}
              </div>
              <div className="px-3 pb-3 flex">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post.id]: e.target.value,
                    })
                  }
                  className="flex-1 border border-gray-700 rounded-md p-2 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => handleComment(post.id)}
                  className="ml-2 text-blue-500 font-semibold hover:text-blue-600"
                >
                  Post
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Story Modal */}
      <AnimatePresence>
        {activeStoryIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm h-[80vh] bg-gray-900 rounded-md overflow-hidden">
              <button
                onClick={() => setActiveStoryIndex(null)}
                className="absolute top-2 right-2 text-white text-2xl z-10"
              >
                <FiX />
              </button>
              <div className="absolute inset-0 flex z-10">
                <div className="flex-1 h-full" onClick={prevStory} />
                <div className="flex-1 h-full" onClick={nextStory} />
              </div>
              <div className="absolute top-2 left-2 right-2 flex space-x-1 z-20">
                {sampleStories.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 bg-gray-500 rounded-sm overflow-hidden flex-1"
                  >
                    <motion.div
                      animate={{
                        width:
                          i === activeStoryIndex
                            ? `${storyProgress}%`
                            : i < activeStoryIndex
                            ? "100%"
                            : "0%",
                      }}
                      className="h-1 bg-white"
                    />
                  </div>
                ))}
              </div>
              <Image
                src={sampleStories[activeStoryIndex].image}
                alt={sampleStories[activeStoryIndex].username}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 text-white font-semibold z-20">
                {sampleStories[activeStoryIndex].username}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstagramClone;
