import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  User as UserIcon,
  Edit,
  Trash2,
  Crown,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User } from '../types';

export function UserManagement() {
  const { users, currentUser, addUser, updateUser, deleteUser, getCurrentBoardTasks } = useApp();
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
  });
  const [error, setError] = useState('');

  const tasks = getCurrentBoardTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (editingUser) {
      updateUser(editingUser.id, formData);
      setEditingUser(null);
      setShowAddUser(false);
    } else {
      const result = await addUser(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setShowAddUser(false);
    }
    
    setFormData({ name: '', email: '', role: 'user' });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowAddUser(true);
    setError('');
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      alert('Вы не можете удалить свой собственный аккаунт.');
      return;
    }
    
    if (window.confirm(`Вы уверены, что хотите удалить ${user.name}?`)) {
      deleteUser(user.id);
    }
  };

  const getUserTaskStats = (userId: string) => {
    const userTasks = tasks.filter(task => task.assigneeId === userId);
    return {
      total: userTasks.length,
      completed: userTasks.filter(task => task.status === 'completed').length,
      inProgress: userTasks.filter(task => task.status === 'in-progress').length,
    };
  };

  const cancelEdit = () => {
    setShowAddUser(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'user' });
    setError('');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Управление пользователями</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {users.length} пользователей
          </span>
        </div>
        
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium"
        >
          <UserPlus className="w-5 h-5" />
          <span>Добавить пользователя</span>
        </button>
      </div>

      {/* Add/Edit User Form */}
      {showAddUser && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingUser ? 'Редактировать пользователя' : 'Добавить нового пользователя'}
          </h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Полное имя
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Введите полное имя"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email адрес
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Введите email адрес"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Роль
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </div>

            <div className="md:col-span-3 flex items-center space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingUser ? 'Обновить пользователя' : 'Добавить пользователя'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Пользователь</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Роль</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Статистика задач</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Дата регистрации</th>
                <th className="text-right py-4 px-6 font-medium text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => {
                const stats = getUserTaskStats(user.id);
                const isCurrentUser = user.id === currentUser?.id;
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center space-x-2">
                            <span>{user.name}</span>
                            {isCurrentUser && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Вы
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{user.email}</td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' ? (
                          <Crown className="w-4 h-4" />
                        ) : (
                          <UserIcon className="w-4 h-4" />
                        )}
                        <span className="capitalize">
                          {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        <div>{stats.total} всего</div>
                        <div className="text-xs text-green-600">{stats.completed} выполнено</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}