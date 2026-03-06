import React, { useState } from "react";
import { X } from "lucide-react";
import { useCreateTaskMutation } from "../store/api/TaskApi";
import { useGetProjectsQuery } from "../store/api/ProjectApi";
import { toast } from "react-toastify";

const CreateTaskModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    projectId: "",
    dueDate: "",
    estimatedTime: "",
  });

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: projects } = useGetProjectsQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(formData).unwrap();
      toast.success("Task created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-2xl font-bold mb-6">Create New Task</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                placeholder="Enter task title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                placeholder="Enter task description"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <select
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="">No Project</option>
                {projects?.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                placeholder="e.g., 60"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
