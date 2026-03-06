import React, { useState } from "react";
import { useGetProjectsQuery } from "../store/api/ProjectApi";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Plus, Search, Filter } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "../textBook/EmptyState";
import CreateProjectModal from "./CreateProjectModal";

const Projects = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all, active, archived, completed

  const { data: projects, isLoading } = useGetProjectsQuery();

  // Filter projects
  const filteredProjects = projects?.filter((project) => {
    // Search filter
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = filter === "all" || project.status === filter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your projects
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {!filteredProjects || filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects found"
          message={
            searchQuery
              ? "Try a different search term"
              : "Create your first project to get started"
          }
          actionText={searchQuery ? "Clear Search" : "Create Project"}
          onAction={() =>
            searchQuery ? setSearchQuery("") : setShowCreateModal(true)
          }
          icon={<FolderKanban className="h-16 w-16 text-gray-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Color Header */}
              <div
                className="h-2"
                style={{ backgroundColor: project.color || "#3B82F6" }}
              />

              <div className="p-6">
                {/* Title and Status */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {project.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      project.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : project.status === "completed"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="font-semibold">
                      {project.progress || 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Due Date */}
                {project.dueDate && (
                  <div className="mt-4 text-sm text-gray-500">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Projects;
