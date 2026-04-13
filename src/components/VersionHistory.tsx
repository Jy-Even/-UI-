import { History, RotateCcw, CheckCircle2, Diff, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import * as diff from 'diff';

interface VersionHistoryProps {
  onBack: () => void;
  documentTitle: string;
}

export default function VersionHistory({ onBack, documentTitle }: VersionHistoryProps) {
  const [restoredVersion, setRestoredVersion] = useState<string | null>(null);
  const [comparingVersionId, setComparingVersionId] = useState<string | null>(null);

  const versions = useMemo(() => [
    { 
      id: 'v3', 
      version: 'v3.0', 
      date: '今天 14:30', 
      author: '林知非', 
      current: true, 
      changes: '更新了第三章节内容，补充了最新的市场数据分析。',
      content: '智识云库是一款领先的知识管理工具。\n\n第一章：基础介绍\n智识云库支持多人实时协作，提供毫秒级的同步体验。\n\n第二章：核心功能\n1. 实时协作\n2. 版本控制\n3. 智能目录\n\n第三章：市场分析\n根据2024年最新数据显示，企业对知识库的需求增长了45%，尤其是在远程办公环境下。'
    },
    { 
      id: 'v2', 
      version: 'v2.0', 
      date: '昨天 18:15', 
      author: '陈子珊', 
      current: false, 
      changes: '修订了排版和错别字，优化了整体段落结构。',
      content: '智识云库是一款领先的知识管理工具。\n\n第一章：基础介绍\n智识云库支持多人实时协作，提供秒级的同步体验。\n\n第二章：核心功能\n1. 实时协作\n2. 版本历史\n3. 自动目录\n\n第三章：市场分析\n初步调研显示，企业对协作工具的需求正在稳步上升。'
    },
    { 
      id: 'v1', 
      version: 'v1.0', 
      date: '2024-03-10 09:00', 
      author: '林知非', 
      current: false, 
      changes: '初始版本创建，包含基础大纲 and 第一章草稿。',
      content: '智识云库是一款知识管理工具。\n\n第一章：基础介绍\n智识云库支持多人协作。\n\n第二章：核心功能\n待补充\n\n第三章：市场分析\n待补充'
    },
  ], []);

  const handleRestore = (versionId: string) => {
    setRestoredVersion(versionId);
    setTimeout(() => {
      setRestoredVersion(null);
      onBack();
    }, 1500);
  };

  const currentVersion = versions.find(v => v.current);
  const comparingVersion = versions.find(v => v.id === comparingVersionId);

  const diffResult = useMemo(() => {
    if (!comparingVersion || !currentVersion) return null;
    return diff.diffLines(comparingVersion.content, currentVersion.content);
  }, [comparingVersion, currentVersion]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-[#F8F9FA]"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 shrink-0 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={comparingVersionId ? () => setComparingVersionId(null) : onBack}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 transition-colors border border-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <History className="w-4 h-4 text-[#141414]" />
                <h1 className="text-lg font-bold text-gray-900">
                  {comparingVersionId ? '版本差异对比' : '文档版本历史'}
                </h1>
              </div>
              <p className="text-xs text-gray-500 font-medium truncate max-w-[400px]">
                {comparingVersionId ? `正在对比 ${comparingVersion?.version} 与 当前版本` : documentTitle}
              </p>
            </div>
          </div>
          
          {comparingVersionId && (
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="w-3 h-3 bg-green-50 border border-green-200 rounded-sm"></div>
                  <span>新增内容</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="w-3 h-3 bg-red-50 border border-red-200 rounded-sm line-through"></div>
                  <span>删除内容</span>
                </div>
              </div>
              <div className="w-px h-6 bg-gray-100"></div>
              <button 
                onClick={() => handleRestore(comparingVersionId)}
                className="bg-[#141414] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/5"
              >
                恢复此版本
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {comparingVersionId ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-[32px] p-16 shadow-2xl shadow-black/[0.02] border border-gray-100 min-h-full font-sans text-lg leading-[1.8] whitespace-pre-wrap text-gray-800">
                {diffResult?.map((part, index) => (
                  <span 
                    key={index}
                    className={`${
                      part.added ? 'bg-green-50 text-green-800 border-b-2 border-green-400/30' :
                      part.removed ? 'bg-red-50 text-red-800 line-through opacity-50 border-b-2 border-red-400/30' :
                      ''
                    }`}
                  >
                    {part.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-4xl mx-auto">
              <div className="relative border-l-2 border-gray-100 ml-6 space-y-8 pb-8">
                {versions.map((v) => (
                  <div key={v.id} className="relative pl-10">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[11px] top-2.5 w-5 h-5 rounded-full border-4 border-[#F8F9FA] shadow-sm ${
                      v.current ? 'bg-[#141414]' : 'bg-gray-200'
                    }`}></div>
                    
                    <div className={`bg-white border rounded-2xl p-6 transition-all duration-500 ${
                      v.current ? 'border-[#141414]/10 shadow-lg shadow-black/[0.02] ring-1 ring-[#141414]/5' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-gray-900 text-xl tracking-tight">{v.version}</span>
                            {v.current && (
                              <span className="bg-[#141414] text-white text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded-full">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-3 font-medium">
                            <span className="text-gray-600">{v.date}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                            <span>BY <strong className="text-gray-900">{v.author}</strong></span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!v.current && (
                            <button 
                              onClick={() => setComparingVersionId(v.id)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all border border-gray-100"
                            >
                              <Diff className="w-3.5 h-3.5" />
                              对比差异
                            </button>
                          )}
                          {!v.current && (
                            <button 
                              onClick={() => handleRestore(v.id)}
                              disabled={restoredVersion !== null}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                restoredVersion === v.id 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-[#141414] text-white hover:bg-gray-800 shadow-md shadow-black/5'
                              }`}
                            >
                              {restoredVersion === v.id ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  已恢复
                                </>
                              ) : (
                                <>
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  恢复此版本
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                        <p className="font-black text-gray-300 text-[9px] uppercase tracking-widest mb-2">CHANGELOG</p>
                        <p className="text-gray-600 leading-relaxed text-sm font-medium">{v.changes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
