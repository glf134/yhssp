import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#3F51B5] to-[#1A237E] p-8 justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">安全随手拍</h1>
        <p className="text-blue-100/60">工业安全 智能守护</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/50" />
          <input 
            type="text" 
            placeholder="用户名"
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-blue-100/30 outline-none focus:bg-white/20 transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/50" />
          <input 
            type="password" 
            placeholder="密码"
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-blue-100/30 outline-none focus:bg-white/20 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-white text-[#1A237E] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          登录系统 <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="mt-12 text-center">
        <p className="text-blue-100/40 text-sm">© 2026 安全生产管理平台</p>
      </div>
    </div>
  );
}
