import { FileText, Clock, Star, Eye, History, Trash2, Plus, Search, Download, X } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import DocumentPreviewModal from './DocumentPreviewModal';
import ExportDocModal from './ExportDocModal';
import EmptyState from './common/EmptyState';

export default function DocumentManagement() {
  const { state, openEditor, setIsCreateDocModalOpen, openVersionHistory, setGlobalSearchQuery } = useApp();
  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);
  
  const [previewDoc, setPreviewDoc] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: '' });
  const [exportDoc, setExportDoc] = useState<{ isOpen: boolean; title: string; type: 'doc' | 'sheet' | 'board' }>({ isOpen: false, title: '', type: 'doc' });

  // Mock documents data for the current KB
  const documents = [
    { id: 'doc-1', title: '2024 年度战略规划白皮书 v3.0', author: '林知非', updatedAt: '2 小时前', isStarred: true, type: 'doc' as const },
    { id: 'doc-2', title: '产品设计规范 - 核心组件库', author: '陈子珊', updatedAt: '昨天 18:30', isStarred: true, type: 'board' as const },
    { id: 'doc-3', title: 'Q3 季度研发团队 OKR 目标对齐', author: '林知非', updatedAt: '2024-03-15', isStarred: false, type: 'sheet' as const },
    { id: 'doc-4', title: '新员工入职指南与系统配置说明', author: 'HR 团队', updatedAt: '2024-03-10', isStarred: false, type: 'doc' as const },
    { id: 'doc-5', title: '竞品分析报告：Q1 市场动态', author: '市场部', updatedAt: '2024-03-05', isStarred: false, type: 'doc' as const },
  ];

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(state.globalSearchQuery.toLowerCase()) ||
    doc.author.toLowerCase().includes(state.globalSearchQuery.toLowerCase())
  );

  const openPreview = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewDoc({ isOpen: true, title });
  };

  const openHistory = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    openVersionHistory(title);
  };

  const openExport = (title: string, type: 'doc' | 'sheet' | 'board', e: React.MouseEvent) => {
    e.stopPropagation();
    setExportDoc({ isOpen: true, title, type });
  };

  if (!selectedKB) return null;

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">文档管理</h2>
            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">
              {state.globalSearchQuery ? `找到 ${filteredDocs.length} 篇` : `共 ${documents.length} 篇`}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">管理当前知识库中的所有文档、查看版本历史或进行清理</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#141414] transition-colors" />
            <input 
              className="bg-white border border-gray-100 text-sm rounded-xl pl-10 pr-10 py-2.5 w-64 focus:ring-4 focus:ring-gray-100 focus:border-gray-200 outline-none transition-all" 
              placeholder="搜索文档标题或作者..." 
              type="text"
              value={state.globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
            />
            {state.globalSearchQuery && (
              <button 
                onClick={() => setGlobalSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all"
                title="清除搜索"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setIsCreateDocModalOpen(true)}
            className="bg-[#141414] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-black/5 hover:bg-gray-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            新建文档
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-1/2">文档名称</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">最后更新</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">作者</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <motion.tr 
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          doc.isStarred ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-400'
                        }`}>
                          {doc.isStarred ? <Star className="w-5 h-5 fill-current" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <span className="font-semibold text-sm text-gray-900 group-hover:text-black transition-colors cursor-pointer" onClick={() => openEditor(doc.title)}>
                          {doc.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {doc.updatedAt}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-medium">{doc.author}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                        <ActionButton icon={Eye} onClick={(e) => openPreview(doc.title, e)} title="预览" />
                        <ActionButton icon={History} onClick={(e) => openHistory(doc.title, e)} title="历史" />
                        <ActionButton icon={Download} onClick={(e) => openExport(doc.title, doc.type, e)} title="导出" />
                        <div className="w-px h-4 bg-gray-100 mx-1"></div>
                        <ActionButton icon={Trash2} onClick={() => {}} title="删除" variant="danger" />
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <EmptyState 
                      icon={Search}
                      title={state.globalSearchQuery ? "未找到匹配的文档" : "暂无文档"}
                      description={state.globalSearchQuery ? `未找到与 "${state.globalSearchQuery}" 相关的文档，请尝试更换关键词。` : "当前知识库中还没有任何文档，点击上方按钮开始创建。"}
                      action={state.globalSearchQuery ? {
                        label: "清除搜索",
                        onClick: () => setGlobalSearchQuery(''),
                        icon: X
                      } : {
                        label: "新建文档",
                        onClick: () => setIsCreateDocModalOpen(true),
                        icon: Plus
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentPreviewModal 
        isOpen={previewDoc.isOpen} 
        onClose={() => setPreviewDoc({ ...previewDoc, isOpen: false })} 
        documentTitle={previewDoc.title} 
      />
      
      <ExportDocModal
        isOpen={exportDoc.isOpen}
        onClose={() => setExportDoc({ ...exportDoc, isOpen: false })}
        documentTitle={exportDoc.title}
        documentType={exportDoc.type}
      />
    </section>
  );
}

function ActionButton({ icon: Icon, onClick, title, variant = 'default' }: { icon: any; onClick: (e: any) => void; title: string; variant?: 'default' | 'danger' }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${
        variant === 'danger' 
          ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
          : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
      }`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
