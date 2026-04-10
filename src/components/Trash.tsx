import { motion } from 'motion/react';
import { Trash2, RotateCcw, Search, FileText, FolderHeart, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Trash() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [deletedItems, setDeletedItems] = useState([
    { id: 'd1', title: 'Q1 市场营销方案草稿', type: 'doc', deletedAt: '2小时前', kbName: '产品设计知识库', size: '24 KB' },
    { id: 'd2', title: '旧版 API 接口文档', type: 'doc', deletedAt: '昨天 14:20', kbName: '研发中心', size: '156 KB' },
    { id: 'd3', title: '2023 团建活动策划', type: 'doc', deletedAt: '3天前', kbName: 'HR 团队', size: '12 KB' },
    { id: 'k1', title: '废弃的测试知识库', type: 'kb', deletedAt: '5天前', kbName: '-', size: '1.2 MB' },
  ]);

  const filteredItems = deletedItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestore = (id: string) => {
    setDeletedItems(prev => prev.filter(item => item.id !== id));
  };

  const handlePermanentDelete = (id: string) => {
    setDeletedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleEmptyTrash = () => {
    setDeletedItems([]);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-4 flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-on-surface-variant" />
            回收站
          </h1>
          <p className="text-on-surface-variant/60 text-lg">
            找回已删除的文档或知识库。项目将在放入回收站 30 天后自动永久删除。
          </p>
        </div>
        <button 
          onClick={handleEmptyTrash}
          disabled={deletedItems.length === 0}
          className="px-6 py-2.5 bg-error-container/20 text-error font-bold rounded-xl hover:bg-error-container/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          清空回收站
        </button>
      </header>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-outline-variant/5 flex items-center justify-between bg-surface-container-lowest/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-4 h-4" />
            <input 
              className="bg-surface-container border border-outline-variant/10 text-sm rounded-full pl-9 pr-4 py-2 w-64 focus:ring-2 focus:ring-primary-container/20 outline-none transition-all" 
              placeholder="搜索已删除的项目..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-on-surface-variant/60 font-medium">
            共 {filteredItems.length} 个项目
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/5 bg-surface-container-lowest/50">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider w-2/5">名称</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">所属位置</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">删除时间</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.type === 'kb' ? 'bg-primary-container/10 text-primary-container' : 'bg-surface-container text-on-surface-variant/60'
                        }`}>
                          {item.type === 'kb' ? <FolderHeart className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-on-surface line-through opacity-70">{item.title}</div>
                          <div className="text-[10px] text-on-surface-variant/40 uppercase mt-0.5">{item.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface-variant/80">{item.kbName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-error/80">{item.deletedAt}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleRestore(item.id)}
                          className="px-3 py-1.5 text-xs font-bold text-primary-container bg-primary-container/10 hover:bg-primary-container/20 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          恢复
                        </button>
                        <button 
                          onClick={() => handlePermanentDelete(item.id)}
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                          title="彻底删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="inline-flex w-16 h-16 rounded-2xl bg-surface-container items-center justify-center text-on-surface-variant/40 mb-4">
                      <Trash2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-on-surface mb-1">回收站为空</h3>
                    <p className="text-xs text-on-surface-variant/60">没有找到任何已删除的项目</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
