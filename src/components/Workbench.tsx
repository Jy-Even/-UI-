import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FolderHeart, Clock, Star, Plus, Eye, History, ChevronRight, FileText } from 'lucide-react';
import DocumentPreviewModal from './DocumentPreviewModal';

export default function Workbench() {
  const { state, selectKB, setView, setIsCreateModalOpen, openEditor, openVersionHistory } = useApp();
  const [previewDoc, setPreviewDoc] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: '' });
  const [visibleKBCount, setVisibleKBCount] = useState(7);

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

  const filteredKBs = state.knowledgeBases.filter(kb => 
    kb.name.toLowerCase().includes(state.globalSearchQuery.toLowerCase()) ||
    kb.description.toLowerCase().includes(state.globalSearchQuery.toLowerCase())
  );

  const recentDocs = [
    { title: '2024 年度战略规划白皮书 v1.0', time: '1 HOURS AGO' },
    { title: '2024 年度战略规划白皮书 v2.0', time: '2 HOURS AGO' },
    { title: '2024 年度战略规划白皮书 v3.0', time: '3 HOURS AGO' },
  ].filter(doc => doc.title.toLowerCase().includes(state.globalSearchQuery.toLowerCase()));

  const starredDocs = [
    { title: '产品设计规范 - 核心组件库', date: '2024-03-11' },
    { title: 'Q3 季度研发团队 OKR 目标对齐', date: '2024-03-12' },
  ].filter(doc => doc.title.toLowerCase().includes(state.globalSearchQuery.toLowerCase()));

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
          <button 
            onClick={() => setView('all-kbs')}
            className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1 group"
          >
            查看全部
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gray-50/50 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-gray-900 hover:text-gray-900 transition-all cursor-pointer group h-full min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-900 group-hover:text-white transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-xs uppercase tracking-widest">创建新知识库</span>
          </motion.div>

          {filteredKBs.slice(0, visibleKBCount).map((kb) => (
            <motion.div
              key={kb.id}
              whileHover={{ y: -6 }}
              onClick={() => handleKBClick(kb.id)}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full min-h-[220px]"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mb-5 group-hover:bg-[#141414] group-hover:text-white transition-all duration-500">
                <FolderHeart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-black transition-colors">{kb.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-6 min-h-[32px] leading-relaxed font-medium">{kb.description}</p>
              <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{kb.members.length} 成员</span>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{kb.createdAt}</span>
              </div>
            </motion.div>
          ))}

          {filteredKBs.length > visibleKBCount && (
            <motion.div
              whileHover={{ scale: 0.98 }}
              onClick={() => setVisibleKBCount(prev => prev + 8)}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-gray-900 group h-full min-h-[220px]"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-gray-100 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
              <span className="font-bold text-[10px] uppercase tracking-widest">显示更多 ({filteredKBs.length - visibleKBCount})</span>
            </motion.div>
          )}
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
            {recentDocs.length > 0 ? recentDocs.map((doc, i) => {
              return (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 8 }}
                  onClick={() => openEditor(doc.title)}
                  className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#141414] group-hover:text-white transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base text-gray-900 group-hover:text-black transition-colors truncate">{doc.title}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">UPDATED {doc.time}</div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <ActionButton icon={Eye} onClick={(e) => openPreview(doc.title, e)} title="预览" />
                    <ActionButton icon={History} onClick={(e) => openHistory(doc.title, e)} title="历史" />
                  </div>
                </motion.div>
              );
            }) : (
              <p className="text-sm text-gray-400 py-4">未找到匹配的文档</p>
            )}
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
            {starredDocs.length > 0 ? starredDocs.map((doc, i) => {
              return (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 8 }}
                  onClick={() => openEditor(doc.title)}
                  className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base text-gray-900 group-hover:text-black transition-colors truncate">{doc.title}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">STARRED ON {doc.date}</div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <ActionButton icon={Eye} onClick={(e) => openPreview(doc.title, e)} title="预览" />
                    <ActionButton icon={History} onClick={(e) => openHistory(doc.title, e)} title="历史" />
                  </div>
                </motion.div>
              );
            }) : (
              <p className="text-sm text-gray-400 py-4">未找到匹配的文档</p>
            )}
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
