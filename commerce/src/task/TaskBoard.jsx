import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import TaskCard from "./TaskCard";
import SortableTaskItem from "./SortableTaskItem";

const columns = {
  todo: { title: "To Do", color: "gray" },
  "in-progress": { title: "In Progress", color: "yellow" },
  done: { title: "Done", color: "green" },
};

const TaskBoard = ({ tasks, onDragEnd, onTaskClick }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the tasks
    const activeTask = tasks.find((t) => t._id === activeId);
    const overTask = tasks.find((t) => t._id === overId);

    if (!activeTask || !overTask) return;

    // If moving between columns
    if (activeTask.status !== overTask.status) {
      onDragEnd({
        draggableId: activeId,
        destination: {
          droppableId: overTask.status,
          index: 0,
        },
        source: {
          droppableId: activeTask.status,
        },
      });
    } else {
      // Reordering within same column
      const columnTasks = getTasksByStatus(activeTask.status);
      const oldIndex = columnTasks.findIndex((t) => t._id === activeId);
      const newIndex = columnTasks.findIndex((t) => t._id === overId);

      const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);

      // Update order
      reorderedTasks.forEach((task, index) => {
        task.order = index;
      });

      // Call onDragEnd with reorder info
      onDragEnd({
        type: "reorder",
        status: activeTask.status,
        tasks: reorderedTasks,
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, { title, color }]) => {
          const columnTasks = getTasksByStatus(status);

          return (
            <div
              key={status}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`font-semibold text-${color}-600 dark:text-${color}-400`}
                >
                  {title}
                </h3>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                  {columnTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <SortableContext
                items={columnTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <SortableTaskItem
                      key={task._id}
                      task={task}
                      onClick={() => onTaskClick(task)}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
};

export default TaskBoard;
