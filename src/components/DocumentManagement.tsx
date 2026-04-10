import { FileText, Clock, Star, Eye, History, Trash2, Plus, Search, Download } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import DocumentPreviewModal from './DocumentPreviewModal';
import VersionHistoryModal from './VersionHistoryModal';
import ExportDocModal from './ExportDocModal';

export default function DocumentManagement() {
  const { state, openEditor, setIsCreateDocModalOpen } = useApp();
  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: '' });
  const [historyDoc, setHistoryDoc] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: '' });
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
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openPreview = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewDoc({ isOpen: true, title });
  };

  const openHistory = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistoryDoc({ isOpen: true, title });
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
            <h2 className="text-lg font-bold font-headline text-on-surface">文档管理</h2>
            <span className="bg-primary-container/10 text-primary-container text-xs font-bold px-2.5 py-0.5 rounded-full transition-all">
              {searchQuery ? `找到 ${filteredDocs.length} 篇` : `共 ${documents.length} 篇`}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant/60 mt-1">管理当前知识库中的所有文档、查看版本历史或进行清理</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-4 h-4" />
            <input 
              className="bg-surface-container-lowest border border-outline-variant/20 text-sm rounded-full pl-9 pr-4 py-2 w-64 focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container/50 outline-none transition-all" 
              placeholder="搜索文档标题或作者..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsCreateDocModalOpen(true)}
            className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-md shadow-primary/10 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            新建文档
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/5 bg-surface-container-lowest/50">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider w-1/2">文档名称</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">最后更新</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">作者</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <motion.tr 
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          doc.isStarred ? 'bg-secondary/10 text-secondary' : 'bg-surface-container text-on-surface-variant/40'
                        }`}>
                          {doc.isStarred ? <Star className="w-4 h-4 fill-current" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <span className="font-semibold text-sm text-on-surface group-hover:text-primary-container transition-colors cursor-pointer" onClick={() => openEditor(doc.title)}>
                          {doc.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
                        <Clock className="w-3.5 h-3.5" />
                        {doc.updatedAt}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface-variant">{doc.author}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => openPreview(doc.title, e)}
                          className="p-2 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 rounded-lg transition-colors"
                          title="预览文档"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => openHistory(doc.title, e)}
                          className="p-2 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors"
                          title="版本历史"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => openExport(doc.title, doc.type, e)}
                          className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                          title="导出文档"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-outline-variant/20 mx-1"></div>
                        <button 
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                          title="删除文档"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="inline-flex w-16 h-16 rounded-2xl bg-surface-container items-center justify-center text-on-surface-variant/40 mb-4">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-on-surface mb-1">未找到匹配的文档</h3>
                    <p className="text-xs text-on-surface-variant/60">请尝试更换搜索关键词</p>
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
      
      <VersionHistoryModal
        isOpen={historyDoc.isOpen}
        onClose={() => setHistoryDoc({ ...historyDoc, isOpen: false })}
        documentTitle={historyDoc.title}
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
