import React from "react";

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
  };

  const bgColors = {
    blue: "bg-blue-50 dark:bg-blue-900/20",
    green: "bg-green-50 dark:bg-green-900/20",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20",
    purple: "bg-purple-50 dark:bg-purple-900/20",
    red: "bg-red-50 dark:bg-red-900/20",
  };

  const textColors = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    purple: "text-purple-600 dark:text-purple-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {value}
          </h3>
          {trend && (
            <p className="text-xs text-green-500 mt-1">
              {trend} from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColors[color]}`}>
          <Icon className={`h-6 w-6 ${textColors[color]}`} />
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div className="mt-4">
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colors[color]}`}
            style={{ width: `${Math.min(100, (value / 100) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
