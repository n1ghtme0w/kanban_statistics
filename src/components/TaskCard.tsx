import React from 'react';
import {
  Calendar,
  Pin,
  MessageCircle,
  Paperclip,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  User,
} from 'lucide-react';
import { Task, User as UserType } from '../types';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { useApp } from '../context/AppContext';

interface TaskCardProps {
  task: Task;
  users: UserType[];
  onClick: () => void;
  className?: string;
}

export function TaskCard({ task, users, onClick, className = '' }: TaskCardProps) {
  const { deleteTask, toggleTaskPin } = useApp();
  const assignee = users.find(user => user.id === task.assigneeId);
  
  const isOverdue = task.deadline && isBefore(new Date(task.deadline), startOfDay(new Date()));
  const isDueSoon = task.deadline && isAfter(new Date(task.deadline), new Date()) && 
    isBefore(new Date(task.deadline), new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };

  const priorityLabels = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
  };

  const statusIcons = {
    created: Clock,
    'in-progress': AlertCircle,
    completed: CheckCircle2,
  };

  const StatusIcon = statusIcons[task.status];

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskPin(task.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      deleteTask(task.id);
    }
  };

  // Get the latest comment for display
  const latestComment = task.comments.length > 0 ? task.comments[task.comments.length - 1] : null;
  const commentAuthor = latestComment ? users.find(user => user.id === latestComment.userId) : null;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300 group ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`w-4 h-4 ${
            task.status === 'completed' ? 'text-green-500' :
            task.status === 'in-progress' ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <button
            onClick={handlePinClick}
            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
              task.isPinned ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
            }`}
          >
            <Pin className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
          <button
            onClick={handleDeleteClick}
            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Latest Comment Preview */}
      {latestComment && commentAuthor && (
        <div className="bg-gray-50 rounded-lg p-2 mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <User className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">{commentAuthor.name}:</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{latestComment.content}</p>
        </div>
      )}

      {/* Deadline */}
      {task.deadline && (
        <div className={`flex items-center space-x-1 mb-3 text-xs ${
          isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-500'
        }`}>
          <Calendar className="w-4 h-4" />
          <span>Срок {format(new Date(task.deadline), 'dd.MM.yyyy')}</span>
          {isOverdue && <span className="text-red-600 font-medium">(Просрочено)</span>}
          {isDueSoon && <span className="text-orange-600 font-medium">(Скоро срок)</span>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Attachments and Comments */}
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            {task.attachments.length > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachments.length}</span>
              </div>
            )}
            {task.comments.length > 0 && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{task.comments.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Assignee */}
        {assignee && (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {assignee.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-600 hidden sm:inline">
              {assignee.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}