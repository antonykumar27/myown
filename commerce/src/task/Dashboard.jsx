import React, { useState, useEffect } from "react";
import { useGetTodayTasksQuery } from "../store/api/DailyTaskApi";
import { useGetTasksQuery } from "../store/api/TaskApi";
import { useGetProjectsQuery } from "../store/api/ProjectApi";
import {
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import TodayTasks from "./TodayTasks";
import ProductivityChart from "./ProductivityChart";
import StatsCard from "./StatsCard";
import QuickActions from "./QuickActions";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    productivity: 0,
  });

  const { data: todayTasks, isLoading: tasksLoading } = useGetTodayTasksQuery();
  const { data: allTasks } = useGetTasksQuery({ limit: 100 });
  const { data: projects } = useGetProjectsQuery();

  useEffect(() => {
    if (allTasks?.tasks) {
      const total = allTasks.tasks.length;
      const completed = allTasks.tasks.filter(
        (t) => t.status === "done",
      ).length;
      const pending = total - completed;
      const productivity =
        total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
        productivity,
      });
    }
  }, [allTasks]);

  if (tasksLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={Target}
          color="blue"
          trend="+12%"
        />
        <StatsCard
          title="Completed"
          value={stats.completedTasks}
          icon={CheckCircle}
          color="green"
          trend="+5%"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingTasks}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Productivity"
          value={`${stats.productivity}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <TodayTasks tasks={todayTasks?.tasks || []} />
        </div>

        {/* Projects Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Active Projects
          </h2>
          <div className="space-y-4">
            {projects?.slice(0, 5).map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="font-medium">{project.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {project.progress}%
                  </span>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Productivity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Weekly Productivity</h2>
        <ProductivityChart />
      </div>
    </div>
  );
};

export default Dashboard;
