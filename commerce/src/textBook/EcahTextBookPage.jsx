import React, { useState, useEffect } from "react";
import {
  useGetTextContentByIdQuery,
  useGetTextContentCountQuery,
  useDeleteTextContentPageMutation,
} from "../store/api/TextBookApi";
import { useParams, useNavigate } from "react-router-dom";
import {
  Eye,
  Brain,
  Sparkles,
  Search,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Edit,
  Video,
  Music,
  Zap,
  Clock,
  Layers,
  Bookmark,
  Filter,
  Grid,
  List,
  Moon,
  Sun,
  ChevronRight,
  Trophy,
  Target,
  AlertCircle,
  CheckCircle,
  Trash2,
  MoreVertical,
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import { useAuth } from "../common/AuthContext";
import { toast } from "react-toastify";

// ====================== BADGE COMPONENTS ======================
const PageNumberBadge = ({ pageNumber, darkMode }) => (
  <span
    className={`px-2 py-0.5 text-xs font-bold rounded ${
      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
    }`}
  >
    Page {pageNumber}
  </span>
);

const MediaIndicator = ({ type, darkMode }) => {
  const icons = {
    video: Video,
    audio: Music,
  };

  const colors = {
    video: darkMode
      ? "bg-red-900/80 text-red-300"
      : "bg-red-500/20 text-red-600",
    audio: darkMode
      ? "bg-blue-900/80 text-blue-300"
      : "bg-blue-500/20 text-blue-600",
  };

  const Icon = icons[type];

  return Icon ? (
    <div className={`p-1.5 rounded-full ${colors[type]}`}>
      <Icon className="h-3 w-3" />
    </div>
  ) : null;
};

// ====================== PAGE CARD COMPONENT ======================
const PageCard = ({
  page,
  darkMode,
  onView,
  onEdit,
  onDelete,
  user,
  isDeleting,
}) => {
  console.log("PageCard - page:", page._id);

  const mainImage = page.media?.find((m) => m.type === "image");
  const hasVideo = page.media?.some((m) => m.type === "video");
  const hasAudio = page.media?.some((m) => m.type === "audio");
  const isTeacher = user?.primaryStudents !== "primaryStudent";

  // Event handlers with stopPropagation
  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("✏️ Edit button clicked for page:", page._id);
    if (onEdit) onEdit();
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🗑️ Delete button clicked for page:", page._id);
    if (onDelete) onDelete();
  };

  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("👁️ View button clicked for page:", page._id);
    if (onView) onView();
  };

  return (
    <div
      className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border relative ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={page.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              darkMode
                ? "bg-gray-700"
                : "bg-gradient-to-br from-blue-50 to-indigo-50"
            }`}
          >
            <ImageIcon
              className={`h-16 w-16 ${darkMode ? "text-gray-600" : "text-blue-300"}`}
            />
          </div>
        )}

        {/* Page Number Badge - Top Left */}
        <div className="absolute top-4 left-4">
          <PageNumberBadge pageNumber={page.pageNumber} darkMode={darkMode} />
        </div>

        {/* 🔥 FIXED: Media Type Indicators - Moved to left side */}
        <div className="absolute top-4 left-24 flex gap-2">
          {hasVideo && <MediaIndicator type="video" darkMode={darkMode} />}
          {hasAudio && <MediaIndicator type="audio" darkMode={darkMode} />}
        </div>

        {/* 🔥 FIXED: Action Icons - Now clearly separated and only for teachers */}
        {isTeacher && (
          <div className="absolute top-4 right-4 flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-1 z-20">
            <button
              type="button"
              onClick={handleEditClick}
              className="p-1.5 bg-blue-500/80 hover:bg-blue-600 rounded-lg transition-colors"
              title="Edit Page"
            >
              <Edit className="h-4 w-4 text-white" />
            </button>
            <button
              type="button"
              onClick={handleDeleteClick}
              className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors"
              title="Delete Page"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-white" />
            </button>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button
            type="button"
            onClick={handleViewClick}
            className="w-full px-4 py-2 bg-white/90 text-gray-800 rounded-lg font-semibold hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="h-4 w-4" />
            <span>Start Learning</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className={`text-lg font-bold line-clamp-2 flex-1 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {page.title}
          </h3>

          {/* View Button */}
          <button
            type="button"
            onClick={handleViewClick}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
            title="View Page"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {page.description && (
          <p
            className={`text-sm mb-4 line-clamp-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {page.description}
          </p>
        )}
      </div>
    </div>
  );
};

// ====================== PAGE LIST ITEM COMPONENT ======================
const PageListItem = ({
  page,
  darkMode,
  onView,
  onEdit,
  onDelete,
  user,
  isDeleting,
}) => {
  const mainImage = page.media?.find((m) => m.type === "image");
  const isTeacher = user?.primaryStudents !== "primaryStudent";

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("✏️ List Edit clicked for page:", page._id);
    if (onEdit) onEdit();
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🗑️ List Delete clicked for page:", page._id);
    if (onDelete) onDelete();
  };

  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("👁️ List View clicked for page:", page._id);
    if (onView) onView();
  };

  const handleContentClick = () => {
    console.log("📄 Content area clicked for page:", page._id);
    if (onView) onView();
  };

  return (
    <div
      className={`rounded-2xl p-4 ${
        darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"
      } shadow hover:shadow-lg transition-all ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div
          className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={handleContentClick}
        >
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={page.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <FileText
                className={`h-8 w-8 ${darkMode ? "text-gray-600" : "text-gray-400"}`}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={handleContentClick}
        >
          <div className="flex items-center gap-3 mb-1">
            <PageNumberBadge pageNumber={page.pageNumber} darkMode={darkMode} />
            <h3
              className={`font-bold truncate ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {page.title}
            </h3>
          </div>

          {page.description && (
            <p
              className={`text-sm truncate ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {page.description}
            </p>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {/* View Icon */}
          <button
            type="button"
            onClick={handleViewClick}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-blue-400"
                : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
            }`}
            title="View Page"
          >
            <Eye className="h-5 w-5" />
          </button>

          {/* Teacher Actions */}
          {isTeacher && (
            <>
              <button
                type="button"
                onClick={handleEditClick}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-yellow-400"
                    : "hover:bg-gray-100 text-gray-500 hover:text-yellow-600"
                }`}
                title="Edit Page"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-red-400"
                    : "hover:bg-gray-100 text-gray-500 hover:text-red-600"
                }`}
                title="Delete Page"
                disabled={isDeleting}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ====================== MAIN COMPONENT ======================
const EcahTextBookPage = () => {
  const { id: ChapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedTags, setSelectedTags] = useState([]);
  const [deletingPageId, setDeletingPageId] = useState(null);

  // API calls
  const {
    data: responseData,
    isLoading,
    refetch,
    error,
  } = useGetTextContentByIdQuery(ChapterId);

  const [deletePage, { isLoading: isDeleteLoading }] =
    useDeleteTextContentPageMutation();

  // Data extraction
  const chapterData = responseData?.chapter || null;
  const pages = responseData?.pages || [];
  const subjectInfo = responseData?.chapter?.subject || {};

  // Refetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // User status
  const isTeacher = user?.primaryStudents !== "primaryStudent";
  const isStudent = user?.primaryStudents === "primaryStudent";

  // Filter pages based on search query
  const filteredPages = searchQuery
    ? pages.filter(
        (page) =>
          page?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page?.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          page?.pageNumber?.toString().includes(searchQuery),
      )
    : pages;

  // Filter based on selected tags
  const getFilteredPages = () => {
    if (selectedTags.length === 0) return filteredPages;

    return filteredPages.filter((page) => {
      if (
        selectedTags.includes("With Images") &&
        page.media?.some((m) => m.type === "image")
      )
        return true;
      if (
        selectedTags.includes("With Videos") &&
        page.media?.some((m) => m.type === "video")
      )
        return true;
      if (
        selectedTags.includes("With Audio") &&
        page.media?.some((m) => m.type === "audio")
      )
        return true;
      if (selectedTags.includes("Recent")) return true; // You can implement recent logic
      return false;
    });
  };

  const displayPages = getFilteredPages();

  // Navigation handlers
  const handleCreatePage = () => {
    if (chapterData?._id) {
      navigate(`/teacherDetails/teacherCreateCourseForm/${chapterData._id}`);
    }
  };

  const handleCreateMathPage = () => {
    if (chapterData?._id) {
      navigate(`/adminSelf/createContentPage/${chapterData._id}`);
    }
  };

  const handleEditChapter = () => {
    if (chapterData?._id) {
      navigate(`/adminSelf/contentEdit/${chapterData._id}`);
    }
  };

  // Page action handlers
  const handleViewPage = (pageId) => {
    navigate(`/adminSelf/displayContentPage/${pageId}`);
  };

  const handleEditPage = (pageId) => {
    navigate(`/adminSelf/contentEdit/${pageId}`);
  };

  const handleDeletePage = async (pageId) => {
    console.log("pageId", pageId);
    if (
      !window.confirm(
        "Are you sure you want to delete this page? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingPageId(pageId);
    try {
      await deletePage({ id: pageId }).unwrap();
      toast.success("Page deleted successfully");
      refetch(); // Refresh the data
    } catch (error) {
      console.error("Failed to delete page:", error);
      toast.error("Failed to delete page");
    } finally {
      setDeletingPageId(null);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-red-600 dark:text-red-400 mb-4 text-lg">
          Failed to load chapter pages
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // No chapter found
  if (!chapterData) {
    return (
      <EmptyState
        title="Chapter not found"
        message="The requested chapter could not be found."
        actionText="Back to Chapters"
        onAction={() => navigate(-1)}
        icon={
          <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600" />
        }
      />
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "dark bg-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30 text-gray-900"
      }`}
    >
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20" />

        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg">
                  Chapter {chapterData?.chapterNumber}
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    chapterData?.isActive
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300"
                  }`}
                >
                  {chapterData?.isActive ? "Active" : "Draft"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">
                {chapterData?.chapterTitle}
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                {subjectInfo?.subject} • {subjectInfo?.standard}{" "}
                {subjectInfo?.part ? `• Part ${subjectInfo?.part}` : ""}
              </p>
            </div>

            {/* Theme Toggle and View Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-xl ${
                  darkMode
                    ? "bg-gray-800 text-yellow-400"
                    : "bg-white text-gray-700 shadow-lg"
                } hover:shadow-xl transition-all`}
                title={
                  darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Pages
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {pages.length}
                  </p>
                </div>
                <Layers className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Videos
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {
                      pages.filter((p) =>
                        p.media?.some((m) => m.type === "video"),
                      ).length
                    }
                  </p>
                </div>
                <Video className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Audio
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {
                      pages.filter((p) =>
                        p.media?.some((m) => m.type === "audio"),
                      ).length
                    }
                  </p>
                </div>
                <Music className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Images
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {
                      pages.filter((p) =>
                        p.media?.some((m) => m.type === "image"),
                      ).length
                    }
                  </p>
                </div>
                <ImageIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Top Action Bar */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pages by title, description, or number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all"
                  />
                </div>
              </div>

              {/* Teacher Actions - Only show for teachers */}
              {isTeacher && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCreatePage}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Video className="h-4 w-4" />
                    <span>Add Video</span>
                  </button>

                  <button
                    onClick={handleCreateMathPage}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Add Content</span>
                  </button>

                  <button
                    onClick={handleEditChapter}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Chapter</span>
                  </button>
                </div>
              )}
            </div>

            {/* Additional Filters */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Filter by:
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {["With Images", "With Videos", "With Audio", "Recent"].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(
                            selectedTags.filter((t) => t !== tag),
                          );
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ),
                )}
              </div>

              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pages Grid/List */}
        {pages.length === 0 ? (
          <EmptyState
            title="No pages yet"
            message="This chapter doesn't have any pages yet. Start by creating the first page."
            actionText="Create First Page"
            onAction={handleCreatePage}
            icon={
              <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            }
          />
        ) : displayPages.length === 0 ? (
          <EmptyState
            title="No matching pages"
            message={`No pages found matching your criteria`}
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedTags([]);
            }}
            icon={
              <Search className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            }
          />
        ) : viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPages.map((page) => (
              <PageCard
                key={page._id}
                page={page}
                darkMode={darkMode}
                onView={() => handleViewPage(page._id)}
                onEdit={() => handleEditPage(page._id)}
                onDelete={() => handleDeletePage(page._id)}
                user={user}
                isDeleting={deletingPageId === page._id}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayPages.map((page) => (
              <PageListItem
                key={page._id}
                page={page}
                darkMode={darkMode}
                onView={() => handleViewPage(page._id)}
                onEdit={() => handleEditPage(page._id)}
                onDelete={() => handleDeletePage(page._id)}
                user={user}
                isDeleting={deletingPageId === page._id}
              />
            ))}
          </div>
        )}

        {/* Progress Section for Students */}

        <div className="mt-12 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Progress</h2>
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>25%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-1/4"></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold">3/{pages.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Pages Completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcahTextBookPage;
