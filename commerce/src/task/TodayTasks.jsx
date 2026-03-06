import React from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const TodayTasks = ({ tasks }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "high":
        return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "medium":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Today's Tasks
        </h2>
        <span className="text-sm text-gray-500">
          {completedTasks}/{totalTasks} completed
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No tasks for today
            </p>
            <p className="text-sm text-gray-400">
              Add some tasks to get started
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`p-3 rounded-xl border ${
                task.completed
                  ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                  : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => {
                    /* Toggle task completion */
                  }}
                  className={`mt-0.5 ${
                    task.completed
                      ? "text-green-500"
                      : "text-gray-400 hover:text-green-500"
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                </button>

                {/* Task Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-medium ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.priority && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </div>

                  {task.timeBlock && (
                    <p className="text-xs text-gray-500">
                      {task.timeBlock.start} - {task.timeBlock.end}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodayTasks;
