import React from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";

const ProductivityChart = ({ data = generateMockData() }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
        <XAxis
          dataKey="day"
          stroke="#6B7280"
          tick={{ fill: "#6B7280", fontSize: 12 }}
        />
        <YAxis
          yAxisId="left"
          stroke="#6B7280"
          tick={{ fill: "#6B7280", fontSize: 12 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#6B7280"
          tick={{ fill: "#6B7280", fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "none",
            borderRadius: "8px",
            color: "#F3F4F6",
          }}
        />

        {/* Tasks Completed Bar */}
        <Bar
          yAxisId="left"
          dataKey="tasks"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
          barSize={20}
        />

        {/* Focus Time Line */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="focus"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: "#10B981", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Generate mock data for the chart
const generateMockData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    tasks: Math.floor(Math.random() * 8) + 2,
    focus: Math.floor(Math.random() * 240) + 60,
  }));
};

export default ProductivityChart;
