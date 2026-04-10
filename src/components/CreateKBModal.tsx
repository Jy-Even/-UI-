import { X, Globe, Users, Lock, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useApp } from '../AppContext';
import { AccessLevel } from '../types';

interface CreateKBModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateKBModal({ isOpen, onClose }: CreateKBModalProps) {
  const { createKB } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [access, setAccess] = useState<AccessLevel>('TEAM');

  const handleCreate = () => {
    if (!name.trim()) return;
    createKB(name, description, access);
    onClose();
    setName('');
    setDescription('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/10 backdrop-blur-[8px]"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface-container-lowest w-full max-w-xl rounded-3xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(24,28,34,0.12)] border border-outline-variant/10 flex flex-col"
          >
            <div className="px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-headline font-bold text-on-surface">创建知识库</h2>
                <p className="text-on-surface-variant/60 text-sm mt-1">为您的知识体系搭建一个结构化的港湾</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar space-y-8">
              <section className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface ml-1">知识库名称</label>
                  <input 
                    className="w-full bg-transparent border-none border-b-2 border-outline-variant/20 focus:ring-0 focus:border-primary-container px-1 py-3 text-lg transition-all placeholder:text-on-surface-variant/30 outline-none" 
                    placeholder="例如：产品设计规范" 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface ml-1">描述</label>
                  <textarea 
                    className="w-full bg-surface-container-low border-none rounded-xl focus:ring-1 focus:ring-primary-container/20 px-4 py-3 text-sm resize-none placeholder:text-on-surface-variant/30 outline-none" 
                    placeholder="描述这个知识库的用途（可选）" 
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-sm font-semibold text-on-surface ml-1">可见性设置</label>
                <div className="grid grid-cols-1 gap-3">
                  <VisibilityOption 
                    icon={Globe} 
                    title="公开" 
                    desc="互联网上的任何人都可以查看此知识库" 
                    active={access === 'PUBLIC'}
                    onClick={() => setAccess('PUBLIC')}
                  />
                  <VisibilityOption 
                    icon={Users} 
                    title="仅团队" 
                    desc="只有团队内的成员可以访问并协作" 
                    active={access === 'TEAM'}
                    onClick={() => setAccess('TEAM')}
                  />
                  <VisibilityOption 
                    icon={Lock} 
                    title="私密" 
                    desc="只有您自己可以查看并编辑此内容" 
                    active={access === 'PRIVATE'}
                    onClick={() => setAccess('PRIVATE')}
                  />
                </div>
              </section>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                  <Settings2 className="w-4 h-4" />
                  高级选项 (水印、评论权限等)
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
            </div>

            <div className="px-8 py-6 bg-surface-container-low flex items-center justify-end gap-4">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleCreate}
                disabled={!name.trim()}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-primary to-primary-container shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                立即创建
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function VisibilityOption({ icon: Icon, title, desc, active = false, onClick }: { icon: any, title: string, desc: string, active?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low cursor-pointer border-2 transition-all group ${
        active ? 'border-primary-container' : 'border-transparent hover:border-primary-container/20'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center transition-colors ${
        active ? 'text-primary-container' : 'text-on-surface-variant group-hover:text-primary-container'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">{title}</span>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            active ? 'border-primary-container bg-primary-container' : 'border-outline-variant/30 bg-white'
          }`}>
            {active && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>
        <p className="text-xs text-on-surface-variant/60 mt-1">{desc}</p>
      </div>
    </div>
  );
}
