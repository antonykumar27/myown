import React, { useState } from "react";
import { useGetTasksQuery } from "../store/api/TaskApi";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: tasks, isLoading } = useGetTasksQuery({ limit: 100 });

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const getTasksForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return (
      tasks?.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toISOString().split("T")[0];
        return taskDate === dateStr;
      }) || []
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        />,
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateTasks = getTasksForDate(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );

      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`h-24 p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border ${
            isToday
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className={`font-semibold ${isToday ? "text-blue-600" : ""}`}>
              {day}
            </span>
            {dateTasks.length > 0 && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 rounded-full">
                {dateTasks.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dateTasks.slice(0, 2).map((task) => (
              <div
                key={task._id}
                className="text-xs truncate p-1 rounded bg-gray-100 dark:bg-gray-700"
                title={task.title}
              >
                {task.title}
              </div>
            ))}
            {dateTasks.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dateTasks.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage tasks by date
          </p>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <CalendarIcon className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center font-medium text-gray-500 text-sm py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      </div>
    </div>
  );
};

export default Calendar;
