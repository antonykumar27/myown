import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../store/api/ProjectApi";
import { useGetTasksQuery } from "../store/api/TaskApi";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import TaskBoard from "./TaskBoard";
import CreateTaskModal from "./CreateTaskModal";
import { toast } from "react-toastify";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const { data: project, isLoading: projectLoading } = useGetProjectQuery(id);
  const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery({
    projectId: id,
  });
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    try {
      await updateProject({
        id: draggableId,
        status: destination.droppableId,
      }).unwrap();
      toast.success("Task status updated");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteProject = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      try {
        await deleteProject(id).unwrap();
        toast.success("Project deleted successfully");
        navigate("/projects");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleUpdateTitle = async () => {
    if (editTitle.trim() && editTitle !== project.title) {
      try {
        await updateProject({ id, title: editTitle }).unwrap();
        toast.success("Project title updated");
      } catch (error) {
        toast.error("Failed to update title");
      }
    }
    setIsEditing(false);
  };

  if (projectLoading || tasksLoading) return <LoadingSpinner />;
  if (!project) return <div>Project not found</div>;

  const stats = {
    total: tasks?.length || 0,
    completed: tasks?.filter((t) => t.status === "done").length || 0,
    inProgress: tasks?.filter((t) => t.status === "in-progress").length || 0,
    todo: tasks?.filter((t) => t.status === "todo").length || 0,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleUpdateTitle}
                onKeyPress={(e) => e.key === "Enter" && handleUpdateTitle()}
                className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none"
                autoFocus
              />
            </div>
          ) : (
            <h1 className="text-2xl font-bold">{project.title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditTitle(project.title);
              setIsEditing(true);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit Project"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={handleDeleteProject}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-500"
            title="Delete Project"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Project Description */}
      {project.description && (
        <p className="text-gray-600 dark:text-gray-400">
          {project.description}
        </p>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.inProgress}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">To Do</p>
              <p className="text-2xl font-bold text-gray-600">{stats.todo}</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <AlertCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Due Date */}
      {project.dueDate && (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="h-5 w-5" />
          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
        </div>
      )}

      {/* Task Board */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        <TaskBoard
          tasks={tasks || []}
          onDragEnd={handleDragEnd}
          onTaskClick={(task) => navigate(`/tasks/${task._id}`)}
        />
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        projectId={id}
      />
    </div>
  );
};

export default ProjectDetail;
