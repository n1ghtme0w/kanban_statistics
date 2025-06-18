import React from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, subDays, isAfter, isBefore } from 'date-fns';

export function Analytics() {
  const { users, getCurrentBoardTasks } = useApp();
  const tasks = getCurrentBoardTasks();

  // Task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const createdTasks = tasks.filter(task => task.status === 'created').length;

  // Overdue tasks
  const overdueTasks = tasks.filter(task => 
    task.deadline && isBefore(new Date(task.deadline), new Date()) && task.status !== 'completed'
  ).length;

  // Tasks created in last 7 days
  const recentTasks = tasks.filter(task => 
    isAfter(new Date(task.createdAt), subDays(new Date(), 7))
  ).length;

  // User task distribution
  const userTaskStats = users.map(user => {
    const userTasks = tasks.filter(task => task.assigneeId === user.id);
    return {
      name: user.name,
      total: userTasks.length,
      completed: userTasks.filter(task => task.status === 'completed').length,
      inProgress: userTasks.filter(task => task.status === 'in-progress').length,
      created: userTasks.filter(task => task.status === 'created').length,
    };
  });

  // Completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: {
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1 uppercase">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 uppercase">АНАЛИТИКА ЗАДАЧ</h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={CheckCircle2}
          title="ВСЕГО ЗАДАЧ"
          value={totalTasks}
          subtitle={`${completionRate}% ВЫПОЛНЕНО`}
          color="bg-blue-400"
        />
        <StatCard
          icon={TrendingUp}
          title="ВЫПОЛНЕНО"
          value={completedTasks}
          subtitle="ЗАВЕРШЕННЫЕ ЗАДАЧИ"
          color="bg-green-400"
        />
        <StatCard
          icon={Clock}
          title="В ПРОЦЕССЕ"
          value={inProgressTasks}
          subtitle="АКТИВНЫЕ ЗАДАЧИ"
          color="bg-yellow-400"
        />
        <StatCard
          icon={AlertTriangle}
          title="ПРОСРОЧЕНО"
          value={overdueTasks}
          subtitle="ТРЕБУЕТ ВНИМАНИЯ"
          color="bg-red-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Task Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            <span className="uppercase">РАСПРЕДЕЛЕНИЕ ПО СТАТУСАМ</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-sm text-gray-700 uppercase">СОЗДАНО</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{createdTasks}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-300 h-2 rounded-full" 
                    style={{ width: `${totalTasks > 0 ? (createdTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                <span className="text-sm text-gray-700 uppercase">В ПРОЦЕССЕ</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{inProgressTasks}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-300 h-2 rounded-full" 
                    style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-300 rounded"></div>
                <span className="text-sm text-gray-700 uppercase">ВЫПОЛНЕНО</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{completedTasks}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-300 h-2 rounded-full" 
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Count Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <span className="uppercase">ГРАФИК ЗАДАЧ</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-end space-x-2 h-32">
              <div className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gray-300 rounded-t"
                  style={{ height: `${totalTasks > 0 ? (createdTasks / totalTasks) * 100 : 0}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2 uppercase">СОЗДАНО</span>
                <span className="text-sm font-bold text-gray-900">{createdTasks}</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-yellow-300 rounded-t"
                  style={{ height: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2 uppercase">В ПРОЦЕССЕ</span>
                <span className="text-sm font-bold text-gray-900">{inProgressTasks}</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-green-300 rounded-t"
                  style={{ height: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2 uppercase">ВЫПОЛНЕНО</span>
                <span className="text-sm font-bold text-gray-900">{completedTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-600" />
          <span className="uppercase">ПРОИЗВОДИТЕЛЬНОСТЬ ПОЛЬЗОВАТЕЛЕЙ</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700 uppercase">ПОЛЬЗОВАТЕЛЬ</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 uppercase">ВСЕГО</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 uppercase">ВЫПОЛНЕНО</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 uppercase">В ПРОЦЕССЕ</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 uppercase">СОЗДАНО</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 uppercase">ЭФФЕКТИВНОСТЬ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userTaskStats.map((user, index) => {
                const efficiency = user.total > 0 ? Math.round((user.completed / user.total) * 100) : 0;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 uppercase">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-900 font-medium">{user.total}</td>
                    <td className="text-center py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {user.completed}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        {user.inProgress}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {user.created}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              efficiency >= 80 ? 'bg-green-300' : 
                              efficiency >= 60 ? 'bg-yellow-300' : 'bg-red-300'
                            }`}
                            style={{ width: `${efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span className="uppercase">НЕДАВНЯЯ АКТИВНОСТЬ</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{recentTasks}</div>
            <div className="text-sm text-blue-700 uppercase">ЗАДАЧ СОЗДАНО ЗА НЕДЕЛЮ</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
            <div className="text-sm text-green-700 uppercase">ОБЩИЙ ПРОЦЕНТ ВЫПОЛНЕНИЯ</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{users.length}</div>
            <div className="text-sm text-purple-700 uppercase">АКТИВНЫХ ПОЛЬЗОВАТЕЛЕЙ</div>
          </div>
        </div>
      </div>
    </div>
  );
}