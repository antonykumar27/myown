import React from "react";
import { Calendar, Tag, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const TaskCard = ({ task, onClick }) => {
  const priorityColors = {
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {task.title}
        </h3>
        {task.priority && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(task.dueDate), "MMM dd")}</span>
          </div>
        )}

        {task.tags?.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>{task.tags.length}</span>
          </div>
        )}

        {task.estimatedTime && (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>{task.estimatedTime}m</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
