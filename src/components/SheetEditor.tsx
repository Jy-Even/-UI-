import { Grid3X3, Plus, Download, Filter, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function SheetEditor() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold">
            <Grid3X3 className="w-4 h-4" />
            数据表格
          </div>
          <div className="h-6 w-px bg-gray-100" />
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500"><Download className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500"><Filter className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="在表格中搜索..." 
            className="pl-9 pr-4 py-1.5 bg-gray-50 border border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-gray-200 w-48 transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="w-12 border-b border-r border-gray-100 p-2"></th>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(col => (
                <th key={col} className="border-b border-r border-gray-100 p-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-[120px]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 20 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="group">
                <td className="border-b border-r border-gray-100 bg-gray-50/30 p-2 text-[10px] font-bold text-gray-400 text-center">
                  {rowIndex + 1}
                </td>
                {Array.from({ length: 7 }).map((_, colIndex) => (
                  <td key={colIndex} className="border-b border-r border-gray-100 p-2 group-hover:bg-blue-50/20 transition-colors">
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-none outline-none text-sm text-gray-700"
                      defaultValue=""
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4" colSpan={8}>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors">
                  <Plus className="w-4 h-4" />
                  添加新行
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
