import { motion, AnimatePresence } from 'motion/react';
import { Trash2, RotateCcw, Search, FileText, FolderHeart, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import EmptyState from './common/EmptyState';

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
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-gray-600" />
            </div>
            回收站
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            找回已删除的文档或知识库。项目将在放入回收站 30 天后自动永久删除。
          </p>
        </div>
        <button 
          onClick={handleEmptyTrash}
          disabled={deletedItems.length === 0}
          className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          清空回收站
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              className="bg-white border border-gray-100 text-sm rounded-xl pl-10 pr-4 py-2.5 w-72 focus:ring-4 focus:ring-gray-100 focus:border-gray-200 outline-none transition-all" 
              placeholder="搜索已删除的项目..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-400 font-medium">
            共 {filteredItems.length} 个项目
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/10">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-2/5">名称</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">所属位置</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">删除时间</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          item.type === 'kb' ? 'bg-indigo-50 text-indigo-500' : 'bg-gray-50 text-gray-400'
                        }`}>
                          {item.type === 'kb' ? <FolderHeart className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900 line-through opacity-50">{item.title}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">{item.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-medium">{item.kbName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-red-500 font-medium">{item.deletedAt}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleRestore(item.id)}
                          className="px-4 py-2 text-xs font-bold text-white bg-[#141414] hover:bg-gray-800 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-black/5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          恢复
                        </button>
                        <button 
                          onClick={() => handlePermanentDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
                  <td colSpan={4}>
                    <EmptyState 
                      icon={Trash2}
                      title="回收站为空"
                      description="没有找到任何已删除的项目。这里会暂时保存您最近 30 天内删除的内容。"
                    />
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
