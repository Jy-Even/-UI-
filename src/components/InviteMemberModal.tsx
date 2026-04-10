import { X, Mail, Shield, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Role } from '../types';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: Role) => void;
}

export default function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('MEMBER');

  const handleInvite = () => {
    if (!email.trim()) return;
    onInvite(email, role);
    setEmail('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/10 backdrop-blur-[8px]"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface-container-lowest w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10"
          >
            <div className="px-8 py-6 flex items-center justify-between border-b border-outline-variant/5">
              <h2 className="text-xl font-headline font-bold text-on-surface">邀请新成员</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-container" />
                  电子邮箱
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container/20 outline-none transition-all" 
                  placeholder="例如：member@company.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <Shield className="w-4 h-4 text-tertiary" />
                  分配角色
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ADMIN', 'MEMBER', 'VIEWER'] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-lg text-[10px] font-bold transition-all border ${
                        role === r 
                          ? 'bg-primary-container text-white border-primary-container' 
                          : 'bg-white text-on-surface-variant border-outline-variant/20 hover:border-primary-container/40'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleInvite}
                  disabled={!email.trim()}
                  className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  发送邀请邮件
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
