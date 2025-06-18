import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  Users,
  LogOut,
  Bell,
  Plus,
  LayoutGrid,
  ChevronDown,
  Folder,
  FolderPlus,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BoardModal } from './BoardModal';

interface HeaderProps {
  currentView: 'board' | 'calendar' | 'users' | 'analytics';
  onViewChange: (view: 'board' | 'calendar' | 'users' | 'analytics') => void;
  onCreateTask: () => void;
}

export function Header({ currentView, onViewChange, onCreateTask }: HeaderProps) {
  const { currentUser, logout, boards, currentBoardId, setCurrentBoard, getCurrentBoardTasks } = useApp();
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);

  const tasks = getCurrentBoardTasks();
  const pendingTasks = tasks.filter(task => task.status !== 'completed').length;
  const currentBoard = boards.find(board => board.id === currentBoardId);

  const handleBoardChange = (boardId: string) => {
    setCurrentBoard(boardId);
    setShowBoardDropdown(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 uppercase">KANBANPRO</h1>
              <p className="text-sm text-gray-500 uppercase">{pendingTasks} АКТИВНЫХ ЗАДАЧ</p>
            </div>
          </div>

          {/* Board Selector */}
          <div className="relative">
            <button
              onClick={() => setShowBoardDropdown(!showBoardDropdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#CCCCFF] hover:bg-blue-200 rounded-lg transition-colors"
            >
              <Folder className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900 uppercase">
                {currentBoard?.name || 'ВЫБЕРИТЕ ДОСКУ'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showBoardDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
                    ДОСКИ
                  </div>
                  {boards.map(board => (
                    <button
                      key={board.id}
                      onClick={() => handleBoardChange(board.id)}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                        board.id === currentBoardId ? 'bg-[#CFE8FF] text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="font-medium uppercase">{board.name}</div>
                      {board.description && (
                        <div className="text-xs text-gray-500 truncate uppercase">{board.description}</div>
                      )}
                    </button>
                  ))}
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      setShowBoardModal(true);
                      setShowBoardDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-blue-600 flex items-center space-x-2"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span className="uppercase">СОЗДАТЬ НОВУЮ ДОСКУ</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onViewChange('board')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'board'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="uppercase">ДОСКА</span>
            </button>
            <button
              onClick={() => onViewChange('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'calendar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="uppercase">КАЛЕНДАРЬ</span>
            </button>
            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'analytics'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="uppercase">АНАЛИТИКА</span>
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onViewChange('users')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'users'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="uppercase">ПОЛЬЗОВАТЕЛИ</span>
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onCreateTask}
            className="flex items-center space-x-2 bg-[#CCCCFF] text-gray-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline uppercase">СОЗДАТЬ ЗАДАЧУ</span>
          </button>

          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900 uppercase">{currentUser?.name}</div>
              <div className="text-xs text-gray-500 uppercase">{currentUser?.role}</div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center space-x-1 mt-4 bg-gray-50 rounded-lg p-1">
        <button
          onClick={() => onViewChange('board')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md font-medium transition-colors ${
            currentView === 'board'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-sm uppercase">ДОСКА</span>
        </button>
        <button
          onClick={() => onViewChange('calendar')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md font-medium transition-colors ${
            currentView === 'calendar'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm uppercase">КАЛЕНДАРЬ</span>
        </button>
        <button
          onClick={() => onViewChange('analytics')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md font-medium transition-colors ${
            currentView === 'analytics'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm uppercase">АНАЛИТИКА</span>
        </button>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => onViewChange('users')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md font-medium transition-colors ${
              currentView === 'users'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-sm uppercase">ПОЛЬЗОВАТЕЛИ</span>
          </button>
        )}
      </nav>

      <BoardModal
        isOpen={showBoardModal}
        onClose={() => setShowBoardModal(false)}
      />
    </header>
  );
}