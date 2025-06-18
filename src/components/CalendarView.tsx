import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useApp } from '../context/AppContext';
import { TaskModal } from './TaskModal';
import { Task } from '../types';

export function CalendarView() {
  const { users, getCurrentBoardTasks } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasks = getCurrentBoardTasks();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      if (!task.deadline) return false;
      return isSameDay(new Date(task.deadline), date);
    });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const priorityColors = {
    high: 'bg-[#FFE1E7] text-red-700 border-red-200',
    medium: 'bg-[#FCFCE9] text-yellow-700 border-yellow-200',
    low: 'bg-[#DFFAD7] text-green-700 border-green-200',
  };

  const priorityLabels = {
    high: 'ВЫСОКИЙ',
    medium: 'СРЕДНИЙ',
    low: 'НИЗКИЙ',
  };

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="w-6 h-6 text-[#8f8fff]" />
          <h2 className="text-2xl font-bold text-gray-900 uppercase">
            {format(currentDate, 'LLLL yyyy', { locale: ru }).toUpperCase()}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-[#8f8fff] hover:bg-blue-50 rounded-lg transition-colors font-medium uppercase"
          >
            СЕГОДНЯ
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-[#CFE8FF]">
          {['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);

            return (
              <div
                key={index}
                className={`min-h-32 p-2 border-b border-r border-gray-200 ${
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isDayToday 
                    ? 'bg-[#8f8fff] text-white w-6 h-6 rounded-full flex items-center justify-center'
                    : isCurrentMonth 
                    ? 'text-gray-900' 
                    : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => {
                    const assignee = users.find(user => user.id === task.assigneeId);
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-all ${priorityColors[task.priority]}`}
                      >
                        <div className="font-medium truncate uppercase">{task.title}</div>
                        {assignee && (
                          <div className="text-xs opacity-75 truncate uppercase">
                            {assignee.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 text-center uppercase">
                      +{dayTasks.length - 3} ЕЩЕ
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#FFE1E7] border border-red-200 rounded"></div>
          <span className="text-gray-600 uppercase">ВЫСОКИЙ ПРИОРИТЕТ</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#FCFCE9] border border-yellow-200 rounded"></div>
          <span className="text-gray-600 uppercase">СРЕДНИЙ ПРИОРИТЕТ</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#DFFAD7] border border-green-200 rounded"></div>
          <span className="text-gray-600 uppercase">НИЗКИЙ ПРИОРИТЕТ</span>
        </div>
      </div>

      <TaskModal
        task={selectedTask || undefined}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}