import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { useApp } from '../context/AppContext';
import { Task } from '../types';

export function KanbanBoard() {
  const { users, updateTask, getCurrentBoardTasks } = useApp();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createInColumn, setCreateInColumn] = useState<string | null>(null);

  const tasks = getCurrentBoardTasks();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const columns = [
    { id: 'created', title: 'К ВЫПОЛНЕНИЮ', color: 'blue' },
    { id: 'in-progress', title: 'В ПРОЦЕССЕ', color: 'yellow' },
    { id: 'completed', title: 'ВЫПОЛНЕНО', color: 'green' },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];
    
    if (columns.some(col => col.id === newStatus)) {
      updateTask(taskId, { status: newStatus });
    }
    
    setActiveTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = (columnId?: string) => {
    setSelectedTask(null);
    setCreateInColumn(columnId || null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setCreateInColumn(null);
  };

  // Sort tasks: pinned first, then by creation date
  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  return (
    <div className="h-[calc(100vh-180px)] overflow-auto">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-center space-x-6 p-6 min-w-full h-full">
          {columns.map((column) => {
            const columnTasks = sortTasks(
              tasks.filter(task => task.status === column.id)
            );

            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={columnTasks}
                users={users}
                onTaskClick={handleTaskClick}
                onCreateTask={() => handleCreateTask(column.id)}
                color={column.color}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              users={users}
              onClick={() => {}}
              className="rotate-3 opacity-90"
            />
          )}
        </DragOverlay>
      </DndContext>

      <TaskModal
        task={selectedTask || undefined}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        defaultStatus={createInColumn as Task['status'] || 'created'}
      />
    </div>
  );
}