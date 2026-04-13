import { Search, Bell, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { useApp } from '../AppContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TopNav() {
  const { state, setView, setGlobalSearchQuery } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full h-16 z-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 border-b border-gray-100">
      <div className="flex items-center gap-10">
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => setView('workbench')}
        >
          <div className="w-9 h-9 bg-[#141414] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/10 group-hover:scale-105 transition-transform">
            K
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">知识空间</span>
        </div>
        
        <nav className="hidden md:flex gap-1 items-center">
          <NavButton 
            active={state.view === 'workbench'} 
            onClick={() => setView('workbench')}
            label="工作台"
          />
          <NavButton 
            active={state.view === 'management'} 
            onClick={() => setView('management')}
            label="管理中心"
          />
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:flex items-center group">
          <Search className="absolute left-3.5 text-gray-400 w-4 h-4 group-focus-within:text-gray-900 transition-colors" />
          <input 
            className="bg-gray-50 border border-gray-100 text-sm rounded-xl pl-10 pr-4 py-2 w-72 focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-200 outline-none transition-all" 
            placeholder="搜索文档、知识库..." 
            type="text"
            value={state.globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-sans font-medium text-gray-400 bg-white border border-gray-200 rounded-md">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-sans font-medium text-gray-400 bg-white border border-gray-200 rounded-md">K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`text-gray-500 hover:text-gray-900 hover:bg-gray-50 p-2.5 rounded-xl transition-all relative group ${isNotificationsOpen ? 'bg-gray-50 text-gray-900' : ''}`}
            >
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">通知消息</span>
                      <button className="text-[10px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest">全部已读</button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                      <NotificationItem 
                        title="文档更新" 
                        content="林知非 更新了《2024 年度战略规划白皮书》" 
                        time="10分钟前" 
                        unread 
                      />
                      <NotificationItem 
                        title="权限变更" 
                        content="陈子珊 将您的角色调整为 管理员" 
                        time="2小时前" 
                        unread 
                      />
                      <NotificationItem 
                        title="新成员加入" 
                        content="王小明 加入了 产品设计知识库" 
                        time="昨天" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setView('notifications');
                        setIsNotificationsOpen(false);
                      }}
                      className="w-full py-3 text-xs font-bold text-gray-400 hover:text-gray-900 border-t border-gray-50 transition-colors"
                    >
                      查看全部通知
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
            >
              <img 
                alt="User Avatar" 
                className="w-8 h-8 rounded-lg border border-gray-100 object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXaoqNiHOVZ0boo64UEJXIH_1cqNCqF6V1LaJZ7UKpv1KbbQAypgngUKMbcDU-nMwDvfEJcEJgwUAT_2GVT53Bwab0saEAGIj2QDUXZ5SzFyh-2a-DI7IGMWRDNZv6cDTZ1J_FaB-2g3BRc4dwSXZBs4ttWOl3I8NaQmqLMUXzYrA1Hu7pEZuh_DKsuxEFP7BlpSWZGR08lcVX26JcDC9P4wDsJ-YsOrzPszpdRBQYs6PGcnndy16DB868SGds5ggOXXX-3Z0OnU0"
                referrerPolicy="no-referrer"
              />
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-gray-900">林知非</p>
                      <p className="text-xs text-gray-500 truncate">zhifei.lin@knowledge.com</p>
                    </div>
                    <DropdownItem icon={User} label="个人资料" />
                    <DropdownItem icon={Settings} label="账号设置" />
                    <div className="h-px bg-gray-50 my-1" />
                    <DropdownItem icon={LogOut} label="退出登录" variant="danger" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-gray-900 text-white shadow-lg shadow-black/5' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}

function DropdownItem({ icon: Icon, label, variant = 'default' }: { icon: any; label: string; variant?: 'default' | 'danger' }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
      variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
    }`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function NotificationItem({ title, content, time, unread = false }: { title: string; content: string; time: string; unread?: boolean }) {
  return (
    <button className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 relative">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-gray-900">{title}</span>
        <span className="text-[10px] text-gray-400">{time}</span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{content}</p>
      {unread && <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />}
    </button>
  );
}
