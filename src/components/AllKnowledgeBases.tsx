import { FolderHeart, Plus, Search, ArrowLeft, MoreVertical, Users, Clock } from 'lucide-react';
import { useApp } from '../AppContext';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function AllKnowledgeBases() {
  const { state, setView, selectKB } = useApp();
  const [search, setSearch] = useState('');

  const filteredKBs = state.knowledgeBases.filter(kb => 
    kb.name.toLowerCase().includes(search.toLowerCase()) ||
    kb.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleKBClick = (id: string) => {
    selectKB(id);
    setView('management');
  };

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('workbench')}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors border border-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">全部知识库</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">管理和浏览您参与的所有知识库</p>
          </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
          <input 
            type="text" 
            placeholder="搜索知识库..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-300 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredKBs.map((kb) => (
          <motion.div
            key={kb.id}
            whileHover={{ y: -8 }}
            onClick={() => handleKBClick(kb.id)}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#141414] group-hover:text-white transition-all duration-500">
                <FolderHeart className="w-7 h-7" />
              </div>
              <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-black transition-colors">{kb.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-8 leading-relaxed font-medium min-h-[40px]">{kb.description}</p>
            
            <div className="flex items-center justify-between pt-8 border-t border-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Users className="w-3.5 h-3.5" />
                  {kb.members.length}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  {kb.createdAt}
                </div>
              </div>
              <div className="flex -space-x-2">
                {kb.members.slice(0, 3).map((m, i) => (
                  <img 
                    key={i} 
                    src={m.avatar} 
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm" 
                    alt={m.name}
                    referrerPolicy="no-referrer"
                  />
                ))}
                {kb.members.length > 3 && (
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    +{kb.members.length - 3}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredKBs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
            <Search className="w-10 h-10 opacity-20" />
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">未找到匹配的知识库</p>
          <p className="text-gray-500">尝试更换搜索关键词或创建一个新的知识库</p>
        </div>
      )}
    </div>
  );
}
