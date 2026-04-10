import { X, FileText, FileSpreadsheet, Image, Download, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface ExportDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentType?: 'doc' | 'sheet' | 'board';
}

export default function ExportDocModal({ isOpen, onClose, documentTitle, documentType = 'doc' }: ExportDocModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const exportOptions = {
    doc: [
      { id: 'pdf', label: 'PDF 文档 (.pdf)', icon: FileText, color: 'text-error' },
      { id: 'word', label: 'Word 文档 (.docx)', icon: FileText, color: 'text-primary-container' },
      { id: 'md', label: 'Markdown (.md)', icon: FileJson, color: 'text-on-surface-variant' },
    ],
    sheet: [
      { id: 'xlsx', label: 'Excel 工作簿 (.xlsx)', icon: FileSpreadsheet, color: 'text-secondary' },
      { id: 'csv', label: 'CSV 文件 (.csv)', icon: FileText, color: 'text-on-surface-variant' },
      { id: 'pdf', label: 'PDF 文档 (.pdf)', icon: FileText, color: 'text-error' },
    ],
    board: [
      { id: 'png', label: '图片 (.png)', icon: Image, color: 'text-tertiary' },
      { id: 'pdf', label: 'PDF 文档 (.pdf)', icon: FileText, color: 'text-error' },
    ]
  };

  const options = exportOptions[documentType] || exportOptions.doc;

  const handleExport = () => {
    if (!selectedFormat) return;
    setIsExporting(true);
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface-container-lowest w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10"
          >
            <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/5">
              <h2 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
                <Download className="w-5 h-5 text-primary-container" />
                导出文档
              </h2>
              <button 
                onClick={onClose} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-on-surface-variant mb-2">正在导出：</p>
                <div className="font-bold text-on-surface bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 line-clamp-1">
                  {documentTitle}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-sm font-bold text-on-surface mb-3">选择导出格式</p>
                {options.map((option) => (
                  <label 
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedFormat === option.id 
                        ? 'border-primary-container bg-primary-container/5 shadow-sm' 
                        : 'border-outline-variant/20 hover:bg-surface-container-low'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="exportFormat" 
                      value={option.id}
                      checked={selectedFormat === option.id}
                      onChange={() => setSelectedFormat(option.id)}
                      className="w-4 h-4 text-primary-container focus:ring-primary-container"
                    />
                    <option.icon className={`w-5 h-5 ${option.color}`} />
                    <span className="text-sm font-medium text-on-surface">{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={onClose}
                  className="px-5 py-2 rounded-full text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleExport}
                  disabled={!selectedFormat || isExporting}
                  className="px-6 py-2 bg-primary-container text-white rounded-full text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      导出中...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      确认导出
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
