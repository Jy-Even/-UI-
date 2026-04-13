import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FolderHeart, Clock, Star, Plus, Eye, History, ChevronRight, FileText } from 'lucide-react';
import DocumentPreviewModal from './DocumentPreviewModal';

export default function Workbench() {
  const { state, selectKB, setView, setIsCreateModalOpen, openEditor, openVersionHistory } = useApp();
  const [previewDoc, setPreviewDoc] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: '' });

  const handleKBClick = (id: string) => {
    selectKB(id);
    setView('management');
  };

  const openPreview = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewDoc({ isOpen: true, title });
  };

  const openHistory = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    openVersionHistory(title);
  };

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900">
              <FolderHeart className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">我的知识库</h2>
          </div>
          <button className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1 group">
            查看全部
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {state.knowledgeBases.map((kb) => (
            <motion.div
              key={kb.id}
              whileHover={{ y: -8 }}
              onClick={() => handleKBClick(kb.id)}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-6 group-hover:bg-[#141414] group-hover:text-white transition-all duration-500">
                <FolderHeart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-black transition-colors">{kb.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-8 min-h-[40px] leading-relaxed font-medium">{kb.description}</p>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kb.members.length} MEMBERS</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kb.createdAt}</span>
              </div>
            </motion.div>
          ))}
          <motion.div
            whileHover={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gray-50/50 rounded-3xl p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-gray-900 hover:text-gray-900 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-900 group-hover:text-white transition-all">
              <Plus className="w-7 h-7" />
            </div>
            <span className="font-bold text-sm uppercase tracking-widest">创建新知识库</span>
          </motion.div>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-12">
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">最近编辑</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => {
              const title = `2024 年度战略规划白皮书 v${i}.0`;
              return (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 8 }}
                  onClick={() => openEditor(title)}
                  className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#141414] group-hover:text-white transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base text-gray-900 group-hover:text-black transition-colors truncate">{title}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">UPDATED {i} HOURS AGO</div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <ActionButton icon={Eye} onClick={(e) => openPreview(title, e)} title="预览" />
                    <ActionButton icon={History} onClick={(e) => openHistory(title, e)} title="历史" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Star className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">收藏夹</h2>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => {
              const title = i === 1 ? '产品设计规范 - 核心组件库' : 'Q3 季度研发团队 OKR 目标对齐';
              return (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 8 }}
                  onClick={() => openEditor(title)}
                  className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base text-gray-900 group-hover:text-black transition-colors truncate">{title}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">STARRED ON 2024-03-1{i}</div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <ActionButton icon={Eye} onClick={(e) => openPreview(title, e)} title="预览" />
                    <ActionButton icon={History} onClick={(e) => openHistory(title, e)} title="历史" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      <DocumentPreviewModal 
        isOpen={previewDoc.isOpen} 
        onClose={() => setPreviewDoc({ ...previewDoc, isOpen: false })} 
        documentTitle={previewDoc.title} 
      />
    </div>
  );
}

function ActionButton({ icon: Icon, onClick, title }: { icon: any; onClick: (e: any) => void; title: string }) {
  return (
    <button 
      onClick={onClick}
      className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
