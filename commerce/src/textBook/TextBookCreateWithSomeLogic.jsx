//////teacher related page

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGetTextBooksQuery,
  useCreateTextBookMutation,
  useUpdateTextBookMutation,
  useDeleteTextBookMutation,
} from "../store/api/TextBookApi";
import { toast } from "react-toastify";

import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  School,
  Globe,
  X,
  Sun,
  Moon,
  Search,
  Home,
} from "lucide-react";
import { useAuth } from "../common/AuthContext";
import StandardSubjectForm from "./TextBookCreateWithSomeLogicCreate";

const TextBookCreateWithSomeLogic = () => {
  const { user } = useAuth();
  const isPrimaryStudent = user?.primaryStudents === "primaryStudent";
  const navigate = useNavigate();

  // State management
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  console.log("deleteConfirm", deleteConfirm);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("darkMode") === "true" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Fetch data
  const { data, isLoading } = useGetTextBooksQuery();

  const [deleteTextBook] = useDeleteTextBookMutation();
  const handleDelete = async (id) => {
    try {
      const res = await deleteTextBook(id).unwrap();

      // success message from backend
      toast.success(res.message);

      setDeleteConfirm(null);
    } catch (error) {
      console.log("Delete error:", error);

      // show backend error message
      const errorMessage = error?.data?.message || "Failed to delete textbook";

      toast.error(errorMessage);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingId(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
              <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const textbooks = data?.data || [];

  // Filter textbooks
  let filteredTextbooks = [...textbooks];

  if (searchQuery) {
    filteredTextbooks = filteredTextbooks.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  // Sort textbooks by title
  const sortedTextbooks = filteredTextbooks.sort((a, b) => {
    return a.title?.localeCompare(b.title);
  });

  // Simple Card Component
  const TextbookCard = ({ item }) => {
    const imageUrl = item.media?.[0]?.url;
    const subject = item.subject || "Unknown Subject";
    const title = item.title || "Untitled";

    // Subject-based colors for fallback
    const getBgColor = () => {
      const subjectLower = subject.toLowerCase();
      if (subjectLower.includes("math") || subjectLower.includes("lcm"))
        return "bg-gradient-to-br from-blue-600 to-indigo-800";
      if (subjectLower.includes("science"))
        return "bg-gradient-to-br from-green-600 to-emerald-800";
      if (subjectLower.includes("english"))
        return "bg-gradient-to-br from-purple-600 to-pink-800";
      if (subjectLower.includes("social"))
        return "bg-gradient-to-br from-orange-600 to-red-800";
      return "bg-gradient-to-br from-gray-700 to-gray-900";
    };

    // Navigate to view page
    const handleCardClick = () => {
      navigate(`/adminSelf/createContent/${item._id}`);
    };

    // Handle edit button click with event propagation stopped
    const handleEditClick = (e) => {
      e.stopPropagation(); // Important: stops the click from reaching parent
      setEditingId(item._id);
      setShowForm(true);
    };

    // Handle delete button click with event propagation stopped
    const handleDeleteClick = (e) => {
      e.stopPropagation(); // Important: stops the click from reaching parent
      setDeleteConfirm(item._id);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onClick={handleCardClick}
        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
      >
        {/* Image/Cover Section */}
        <div className={`relative h-48 ${!imageUrl ? getBgColor() : ""}`}>
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-white/50" />
            </div>
          )}

          {/* Subject Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 bg-black/50 dark:bg-black/60 backdrop-blur-sm text-white text-sm font-bold rounded-full flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {subject}
            </span>
          </div>

          {/* Admin Actions - Fixed for mobile */}

          <div
            className="absolute top-4 right-4 flex gap-2"
            onClick={(e) => e.stopPropagation()} // Prevent clicks in this div from navigating
          >
            <button
              onClick={handleEditClick}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors md:opacity-0 md:group-hover:opacity-100 opacity-100" // Always visible on mobile
              title="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors md:opacity-0 md:group-hover:opacity-100 opacity-100" // Always visible on mobile
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title/Info Section */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              {subject}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Click to view details
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Home className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Textbooks
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {!isPrimaryStudent && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Textbook
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isPrimaryStudent
                  ? "Available Textbooks"
                  : "Textbook Management"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isPrimaryStudent
                  ? "Select your textbook to continue"
                  : `${textbooks.length} textbook${textbooks.length !== 1 ? "s" : ""} available`}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Welcome Banner for Students */}
        {isPrimaryStudent && (
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                📚 Choose Your Textbook
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Select a textbook to start learning
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {sortedTextbooks.length > 0 ? (
            <>
              {/* Results Info */}
              {searchQuery && (
                <div className="flex justify-between items-center mb-4 px-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found {sortedTextbooks.length} result
                    {sortedTextbooks.length !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTextbooks.map((item) => (
                  <TextbookCard key={item._id} item={item} />
                ))}
              </div>
            </>
          ) : (
            // Empty state
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
              <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {searchQuery
                  ? "No matching textbooks found"
                  : isPrimaryStudent
                    ? "No Textbooks Available"
                    : "No Textbooks Available"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search"
                  : isPrimaryStudent
                    ? "Please check back later"
                    : "Start by adding your first textbook"}
              </p>
              {!isPrimaryStudent && !searchQuery && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add First Textbook
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {editingId ? "Edit Textbook" : "Add New Textbook"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <StandardSubjectForm
                standardSubjectId={editingId}
                onSuccess={handleSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete Textbook?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TextBookCreateWithSomeLogic;
