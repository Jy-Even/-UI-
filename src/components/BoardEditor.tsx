import { Presentation, MousePointer2, Square, Circle, Type, Image as ImageIcon, Minus, Share2, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function BoardEditor() {
  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] relative overflow-hidden">
      {/* Canvas Grid Background */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', 
        backgroundSize: '24px 24px' 
      }} />

      {/* Floating Toolbar */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-10">
        <BoardTool icon={MousePointer2} active />
        <div className="h-px bg-gray-100 mx-2 my-1" />
        <BoardTool icon={Square} />
        <BoardTool icon={Circle} />
        <BoardTool icon={Type} />
        <BoardTool icon={ImageIcon} />
        <BoardTool icon={Minus} />
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white rounded-2xl shadow-2xl border border-gray-100 px-6 py-3 z-10">
        <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
          <Presentation className="w-5 h-5" />
          互动白板
        </div>
        <div className="h-6 w-px bg-gray-100" />
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors"><Share2 className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors"><Download className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Mock Content */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-64 h-40 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col justify-between rotate-3">
            <div className="font-bold text-gray-900">头脑风暴: 2024 核心功能</div>
            <div className="flex -space-x-2">
              {[1, 2].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
              ))}
            </div>
          </div>
          <div className="absolute -top-20 -right-40 w-48 h-48 bg-blue-500/10 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">核心逻辑区</span>
          </div>
        </motion.div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-white rounded-2xl shadow-2xl border border-gray-100 px-4 py-2 z-10">
        <button className="text-sm font-bold text-gray-400 hover:text-gray-900">-</button>
        <span className="text-xs font-bold text-gray-900">100%</span>
        <button className="text-sm font-bold text-gray-400 hover:text-gray-900">+</button>
      </div>
    </div>
  );
}

function BoardTool({ icon: Icon, active = false }: { icon: any, active?: boolean }) {
  return (
    <button className={`p-3 rounded-xl transition-all ${active ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}>
      <Icon className="w-5 h-5" />
    </button>
  );
}
