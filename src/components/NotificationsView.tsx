import { Bell, Check, Trash2, ArrowLeft, Search, Filter, Clock, User, MessageSquare, FileText, Share2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'mention' | 'comment' | 'share' | 'system';
  title: string;
  content: string;
  time: string;
  read: boolean;
  user?: {
    name: string;
    avatar: string;
  };
}

export default function NotificationsView() {
  const { setView } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState('');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'mention',
      title: '林知非 在文档中提到了你',
      content: '"@jyu222950 请确认一下第三章节的市场数据是否准确。"',
      time: '10 分钟前',
      read: false,
      user: { name: '林知非', avatar: 'https://picsum.photos/seed/user1/100/100' }
    },
    {
      id: '2',
      type: 'comment',
      title: '陈子珊 回复了你的评论',
      content: '"好的，我已经按照你的建议修改了排版。"',
      time: '2 小时前',
      read: false,
      user: { name: '陈子珊', avatar: 'https://picsum.photos/seed/user2/100/100' }
    },
    {
      id: '3',
      type: 'share',
      title: '系统通知：文档共享成功',
      content: '你已成功将 "2024 年度战略规划" 共享给 市场部 团队。',
      time: '昨天 14:20',
      read: true
    },
    {
      id: '4',
      type: 'system',
      title: '系统更新公告',
      content: '智识云库 v2.5 版本已发布，新增了互动白板和数据表格功能。',
      time: '3 天前',
      read: true
    },
    {
      id: '5',
      type: 'mention',
      title: '王小明 在文档中提到了你',
      content: '"@jyu222950 这里的逻辑需要再对一下。"',
      time: '4 天前',
      read: true,
      user: { name: '王小明', avatar: 'https://picsum.photos/seed/user3/100/100' }
    }
  ]);

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || !n.read;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                         n.content.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'mention': return <User className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'share': return <Share2 className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getIconBg = (type: Notification['type']) => {
    switch (type) {
      case 'mention': return 'bg-blue-50 text-blue-500';
      case 'comment': return 'bg-green-50 text-green-500';
      case 'share': return 'bg-purple-50 text-purple-500';
      default: return 'bg-amber-50 text-amber-500';
    }
  };

  return (
    <div className="p-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('workbench')}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors border border-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">通知中心</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">查看您的所有消息、提醒和系统通知</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={markAllAsRead}
            className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-50"
          >
            <Check className="w-4 h-4" />
            全部标记为已读
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              全部
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'unread' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              未读
            </button>
          </div>
          
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="搜索通知内容..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border-transparent rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-200 transition-all font-medium"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredNotifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-8 hover:bg-gray-50/50 transition-all group relative ${!n.read ? 'bg-blue-50/10' : ''}`}
            >
              <div className="flex gap-6">
                <div className="relative shrink-0">
                  {n.user ? (
                    <img src={n.user.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt={n.user.name} referrerPolicy="no-referrer" />
                  ) : (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getIconBg(n.type)}`}>
                      {getIcon(n.type)}
                    </div>
                  )}
                  {!n.read && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-base font-bold truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {n.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" />
                      {n.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium mb-4">{n.content}</p>
                  
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.read && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        标记已读
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(n.id)}
                      className="text-[11px] font-bold text-gray-400 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                <Bell className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">暂无通知</p>
              <p className="text-gray-500">您已经处理完了所有的消息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
