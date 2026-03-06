import React, { useState } from "react";
import { useGetTasksQuery } from "../store/api/TaskApi";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "../textBook/EmptyState";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";

const Tasks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all, todo, in-progress, done
  const [priority, setPriority] = useState("all"); // all, low, medium, high, urgent

  const { data: tasks, isLoading } = useGetTasksQuery({ limit: 100 });

  // Filter tasks
  const filteredTasks = tasks?.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = filter === "all" || task.status === filter;

    // Priority filter
    const matchesPriority = priority === "all" || task.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group tasks by status
  const groupedTasks = {
    todo: filteredTasks?.filter((t) => t.status === "todo") || [],
    "in-progress":
      filteredTasks?.filter((t) => t.status === "in-progress") || [],
    done: filteredTasks?.filter((t) => t.status === "done") || [],
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your tasks
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Task
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
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-5 w-5 text-gray-400" />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks by Status */}
      {!filteredTasks || filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          message={
            searchQuery
              ? "Try a different search term"
              : "Create your first task to get started"
          }
          actionText={searchQuery ? "Clear Search" : "Create Task"}
          onAction={() =>
            searchQuery ? setSearchQuery("") : setShowCreateModal(true)
          }
          icon={<CheckSquare className="h-16 w-16 text-gray-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">
                To Do
              </h2>
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                {groupedTasks.todo.length}
              </span>
            </div>
            <div className="space-y-3">
              {groupedTasks.todo.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">
                In Progress
              </h2>
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                {groupedTasks["in-progress"].length}
              </span>
            </div>
            <div className="space-y-3">
              {groupedTasks["in-progress"].map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                />
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">
                Done
              </h2>
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                {groupedTasks.done.length}
              </span>
            </div>
            <div className="space-y-3">
              {groupedTasks.done.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Tasks;
