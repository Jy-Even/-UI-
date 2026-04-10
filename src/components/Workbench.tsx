import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import { FolderHeart, Clock, Star, Plus } from 'lucide-react';

export default function Workbench() {
  const { state, selectKB, setView } = useApp();

  const handleKBClick = (id: string) => {
    selectKB(id);
    setView('management');
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-4">工作台</h1>
        <p className="text-on-surface-variant/60 text-lg">欢迎回来，开始您的知识共创之旅。</p>
      </header>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-headline text-on-surface">我的知识库</h2>
          <button className="text-sm font-bold text-primary-container hover:underline">查看全部</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {state.knowledgeBases.map((kb) => (
            <motion.div
              key={kb.id}
              whileHover={{ y: -4 }}
              onClick={() => handleKBClick(kb.id)}
              className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary-container mb-4 group-hover:bg-primary-container group-hover:text-white transition-colors">
                <FolderHeart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary-container transition-colors">{kb.name}</h3>
              <p className="text-sm text-on-surface-variant/60 line-clamp-2 mb-4">{kb.description}</p>
              <div className="flex items-center justify-between text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-bold">
                <span>{kb.members.length} 位成员</span>
                <span>{kb.createdAt}</span>
              </div>
            </motion.div>
          ))}
          <motion.div
            whileHover={{ scale: 0.98 }}
            className="bg-surface-container-low rounded-2xl p-6 border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-on-surface-variant/40 hover:border-primary-container/40 hover:text-primary-container/60 transition-all cursor-pointer group"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-bold text-sm">创建新知识库</span>
          </motion.div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-tertiary" />
            最近编辑
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/5 flex items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant/40">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">2024 年度战略规划白皮书 v{i}.0</div>
                  <div className="text-xs text-on-surface-variant/40">更新于 {i} 小时前</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary" />
            收藏夹
          </h2>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/5 flex items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">产品设计规范 - 核心组件库</div>
                  <div className="text-xs text-on-surface-variant/40">收藏于 2024-03-1{i}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
