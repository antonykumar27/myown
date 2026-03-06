import React, { useState } from "react";
import { X } from "lucide-react";
import { useCreateProjectMutation } from "../store/api/ProjectApi";
import { toast } from "react-toastify";

const colors = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // yellow
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#6366F1", // indigo
  "#14B8A6", // teal
];

const CreateProjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: colors[0],
    dueDate: "",
  });

  const [createProject, { isLoading }] = useCreateProjectMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(formData).unwrap();
      toast.success("Project created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-2xl font-bold mb-6">Create New Project</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                placeholder="Enter project title"
              />
            </div>

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
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                placeholder="Enter project description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.color === color
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
