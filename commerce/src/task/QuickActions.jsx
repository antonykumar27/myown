import React, { useState } from "react";
import { Plus, FileText, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateTaskModal from "./CreateTaskModal";
import CreateProjectModal from "./CreateProjectModal";

const QuickActions = () => {
  const navigate = useNavigate();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const actions = [
    {
      label: "New Task",
      icon: Plus,
      onClick: () => setShowTaskModal(true),
      color: "blue",
    },
    {
      label: "New Project",
      icon: FileText,
      onClick: () => setShowProjectModal(true),
      color: "green",
    },
    {
      label: "Calendar",
      icon: Calendar,
      onClick: () => navigate("/calendar"),
      color: "purple",
    },
  ];

  return (
    <>
      <div className="flex gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const colors = {
            blue: "bg-blue-500 hover:bg-blue-600",
            green: "bg-green-500 hover:bg-green-600",
            purple: "bg-purple-500 hover:bg-purple-600",
          };

          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`p-2.5 ${colors[action.color]} text-white rounded-xl transition-all hover:shadow-lg flex items-center gap-2`}
              title={action.label}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
      />
      <CreateProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />
    </>
  );
};

export default QuickActions;
