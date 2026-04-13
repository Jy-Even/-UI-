import React, { useState, useRef, useEffect } from 'react';
import { FolderHeart, Plus, Info, Users, ShieldCheck, FileOutput, Trash2, Settings, LayoutDashboard, ChevronDown, FileText, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';

interface SidebarProps {
  onCreateNew?: () => void;
}

export default function Sidebar({ onCreateNew }: SidebarProps) {
  const { state, setView, setManagementTab, selectKB } = useApp();
  const [isKBMenuOpen, setIsKBMenuOpen] = useState(false);
  const kbMenuRef = useRef<HTMLDivElement>(null);
  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (kbMenuRef.current && !kbMenuRef.current.contains(event.target as Node)) {
        setIsKBMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'docs', icon: FileText, label: '文档管理' },
    { id: 'members', icon: Users, label: '成员权限' },
    { id: 'info', icon: Info, label: '基础设置' },
    { id: 'permissions', icon: ShieldCheck, label: '高级权限' },
    { id: 'export', icon: FileOutput, label: '数据导出' },
    { id: 'audit', icon: ShieldCheck, label: '安全审计' },
  ];

  return (
    <aside className="fixed left-0 top-16 w-[260px] h-[calc(100vh-64px)] bg-white flex flex-col py-8 px-5 gap-y-2 overflow-y-auto border-r border-gray-100 custom-scrollbar z-40">
      <div className="mb-8 space-y-6">
        {/* KB Switcher */}
        <div className="relative" ref={kbMenuRef}>
          <button 
            onClick={() => setIsKBMenuOpen(!isKBMenuOpen)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${
              isKBMenuOpen 
                ? 'bg-white border-gray-200 shadow-xl shadow-black/5' 
                : 'bg-gray-50 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#141414] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-black/10">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="font-bold text-sm truncate text-gray-900">{selectedKB?.name || '未选择知识库'}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Team Space</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isKBMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isKBMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden"
              >
                <div className="px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">切换知识库</div>
                <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                  {state.knowledgeBases.map(kb => (
                    <button
                      key={kb.id}
                      onClick={() => {
                        selectKB(kb.id);
                        setIsKBMenuOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-sm transition-all flex items-center justify-between group ${
                        kb.id === state.selectedKBId 
                          ? 'text-black font-bold bg-gray-50' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="truncate">{kb.name}</span>
                      {kb.id === state.selectedKBId && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-50 px-3">
                  <button 
                    onClick={() => {
                      setView('management');
                      setManagementTab('info');
                      setIsKBMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-900 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    管理知识库
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
          <input 
            type="text" 
            placeholder="搜索文档..."
            className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:bg-white focus:border-gray-200 transition-all font-medium"
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNew}
          className="w-full bg-[#141414] text-white py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-black/5 hover:bg-gray-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          新建文档
        </motion.button>
      </div>

      <div className="space-y-1.5">
        <SidebarItem 
          active={state.view === 'workbench'} 
          onClick={() => setView('workbench')}
          icon={LayoutDashboard}
          label="工作台"
        />

        {state.view === 'management' && (
          <div className="pt-6 space-y-1.5">
            <div className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">管理</div>
            {navItems.map((item) => (
              <SidebarItem 
                key={item.id}
                active={state.managementTab === item.id}
                onClick={() => setManagementTab(item.id as any)}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-8 space-y-1.5">
        <SidebarItem 
          active={state.view === 'trash'}
          onClick={() => setView('trash')}
          icon={Trash2}
          label="回收站"
          variant="danger"
        />
        <SidebarItem 
          active={false}
          onClick={() => {
            setManagementTab('permissions');
            setView('management');
          }}
          icon={Settings}
          label="系统设置"
        />
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  variant?: 'default' | 'danger';
}

const SidebarItem: React.FC<SidebarItemProps> = ({ active, onClick, icon: Icon, label, variant = 'default' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-2xl transition-all group ${
        active 
          ? variant === 'danger' 
            ? 'text-red-600 font-bold bg-red-50 border border-red-100'
            : 'text-black font-bold bg-gray-50 border border-gray-100' 
          : variant === 'danger'
            ? 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            : 'text-gray-500 hover:text-black hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 transition-colors ${
          active 
            ? variant === 'danger' ? 'text-red-600' : 'text-black' 
            : 'text-gray-400 group-hover:text-current'
        }`} />
        {label}
      </div>
      {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
    </button>
  );
}
