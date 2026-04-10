import { FileText, Download, ShieldCheck, FileJson, FileCode } from 'lucide-react';
import { motion } from 'motion/react';

export default function DataExport() {
  const exportOptions = [
    { id: 'pdf', icon: FileText, title: 'PDF 文档', desc: '适合离线阅读和打印，保持排版一致性。', color: 'text-error' },
    { id: 'markdown', icon: FileCode, title: 'Markdown 源码', desc: '适合迁移到其他知识库或本地编辑器。', color: 'text-primary' },
    { id: 'json', icon: FileJson, title: 'JSON 数据', desc: '包含元数据的完整结构化数据，适合二次开发。', color: 'text-tertiary' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/5 shadow-sm">
        <h2 className="text-lg font-bold mb-2 text-on-surface">全量导出</h2>
        <p className="text-sm text-on-surface-variant/60 mb-8">您可以将整个知识库的内容导出为多种格式，以便备份或迁移。</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {exportOptions.map((option) => (
            <motion.div 
              key={option.id}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-surface-container-low border border-transparent hover:border-primary-container/20 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm ${option.color}`}>
                <option.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm mb-2">{option.title}</h3>
              <p className="text-[11px] text-on-surface-variant/60 leading-relaxed mb-6">{option.desc}</p>
              <button className="w-full py-2 rounded-lg bg-white border border-outline-variant/20 text-xs font-bold text-on-surface-variant hover:bg-primary-container hover:text-white hover:border-primary-container transition-all flex items-center justify-center gap-2">
                <Download className="w-3 h-3" />
                立即导出
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface mb-2">导出合规性说明</h2>
            <p className="text-sm text-on-surface-variant/60 leading-relaxed">
              所有导出操作都将被记录在安全审计日志中。导出的文档将根据您的权限配置自动包含水印（如果已开启）。请确保导出的数据符合公司的安全合规要求。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
