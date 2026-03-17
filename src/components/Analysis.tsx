import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, ThumbsUp, ThumbsDown, CheckCircle2, AlertTriangle, BookOpen, FileText } from 'lucide-react';
import { HazardRecord, HazardCategory } from '../types';

interface AnalysisProps {
  record: HazardRecord | null;
  loading: boolean;
  onBack: () => void;
  onCorrection: (data: any) => void;
  onReport: (id: string) => void;
}

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-md rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 overflow-hidden ${className}`}>
    {children}
  </div>
);

export default function Analysis({ record, loading, onBack, onCorrection, onReport }: AnalysisProps) {
  const [streamedText, setStreamedText] = useState({
    name: '',
    suggestion: '',
    regulations: '',
    references: [] as string[]
  });
  const [correctionMode, setCorrectionMode] = useState(false);
  const [correctionData, setCorrectionData] = useState({ category: '' as HazardCategory, description: '' });

  useEffect(() => {
    if (record && !loading && record.id !== 'temp') {
      // Reset and start streaming
      setStreamedText({ name: '', suggestion: '', regulations: '', references: [] });
      
      let nameIdx = 0;
      let suggIdx = 0;
      let regIdx = 0;
      
      const name = record.name;
      const suggestion = record.suggestion;
      const regulations = record.regulations || '暂无相关章程引用';
      const references = record.references || [];

      const interval = setInterval(() => {
        setStreamedText(prev => {
          let nextName = prev.name;
          let nextSugg = prev.suggestion;
          let nextReg = prev.regulations;

          if (nameIdx < name.length) {
            nextName += name[nameIdx++];
          } else if (suggIdx < suggestion.length) {
            nextSugg += suggestion[suggIdx++];
          } else if (regIdx < regulations.length) {
            nextReg += regulations[regIdx++];
          } else {
            clearInterval(interval);
            return { ...prev, references };
          }

          return {
            ...prev,
            name: nextName,
            suggestion: nextSugg,
            regulations: nextReg
          };
        });
      }, 5); // Speed up to 5ms

      return () => clearInterval(interval);
    }
  }, [record, loading]);

  if (!record) return null;

  const riskColors = {
    '高': 'text-red-500 bg-red-50 border-red-100',
    '中': 'text-orange-500 bg-orange-50 border-orange-100',
    '低': 'text-blue-500 bg-blue-50 border-blue-100'
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#E8EAF6] to-white overflow-y-auto">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#E8EAF6]/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 bg-white/60 rounded-full"><ArrowLeft className="w-6 h-6 text-gray-700" /></button>
        <h1 className="text-lg font-bold text-gray-800">识别详情</h1>
        <button onClick={onBack} className="p-2 bg-white/60 rounded-full"><X className="w-6 h-6 text-gray-700" /></button>
      </header>

      <main className="flex-1 p-6 space-y-6 pb-12">
        {/* Image at top - Always visible if content exists */}
        {record.content && (
          <div className="rounded-[32px] overflow-hidden shadow-xl border-4 border-white relative">
            <img src={record.content} alt="Hazard" className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
            {loading && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white text-xs font-bold drop-shadow-md">AI 正在分析中...</span>
                </div>
              </div>
            )}
            {record.reported && (
              <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 已上报
              </div>
            )}
          </div>
        )}

        <GlassCard className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800 min-h-[1.5em]">
                {loading ? '正在识别隐患...' : (streamedText.name || '分析完成')}
              </h2>
              {!loading && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{record.category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${riskColors[record.riskLevel]}`}>
                    {record.riskLevel}风险
                  </span>
                </div>
              )}
            </div>
            {!loading && (
              <div className="flex gap-2">
                <button className="p-2 bg-gray-50 rounded-full text-gray-300 active:text-blue-500 transition-colors"><ThumbsUp className="w-5 h-5" /></button>
                <button onClick={() => setCorrectionMode(true)} className="p-2 bg-gray-50 rounded-full text-gray-300 active:text-red-500 transition-colors"><ThumbsDown className="w-5 h-5" /></button>
              </div>
            )}
          </div>

          {/* Hazards & Suggestions */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> 处置建议
              </div>
              <p className="text-gray-600 text-sm leading-relaxed min-h-[3em]">
                {loading ? '等待 AI 生成建议...' : streamedText.suggestion}
              </p>
            </div>

            {/* Regulations */}
            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                <BookOpen className="w-4 h-4" /> 违反规定章程
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                {loading ? '正在检索相关章程...' : streamedText.regulations}
              </p>
            </div>

            {/* References */}
            {(!loading || streamedText.references.length > 0) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-sm px-1">
                  <FileText className="w-4 h-4" /> 引用文档
                </div>
                <div className="flex flex-wrap gap-2">
                  {loading ? (
                    <div className="text-[10px] text-gray-300 italic px-1">正在匹配文档库...</div>
                  ) : (
                    streamedText.references.map((ref, idx) => (
                      <div key={idx} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] text-gray-500 shadow-sm flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        {ref}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        <button 
          onClick={() => {
            if (record.id) onReport(record.id);
            onBack();
          }}
          disabled={loading || record.reported}
          className={`w-full py-4 rounded-full font-bold shadow-lg active:scale-95 transition-all ${
            loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
            record.reported ? 'bg-emerald-500 text-white shadow-emerald-200' :
            'bg-blue-600 text-white shadow-blue-200'
          }`}
        >
          {loading ? '分析中...' : record.reported ? '已上报' : '确认并上报'}
        </button>
      </main>

      {/* Correction Modal */}
      <AnimatePresence>
        {correctionMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-md bg-white rounded-[32px] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">纠错反馈</h3>
                <button onClick={() => setCorrectionMode(false)}><X className="w-6 h-6 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block px-1">隐患类别</label>
                  <select 
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                    value={correctionData.category}
                    onChange={(e) => setCorrectionData(prev => ({ ...prev, category: e.target.value as HazardCategory }))}
                  >
                    <option value="">选择正确分类</option>
                    <option value="人员行为类">人员行为类</option>
                    <option value="设备设施类">设备设施类</option>
                    <option value="作业环境类">作业环境类</option>
                    <option value="安全防护类">安全防护类</option>
                    <option value="管理制度类">管理制度类</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block px-1">情况说明</label>
                  <textarea 
                    placeholder="请输入详细说明..."
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                    value={correctionData.description}
                    onChange={(e) => setCorrectionData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              <button 
                onClick={() => { onCorrection(correctionData); setCorrectionMode(false); }}
                className="w-full py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-200"
              >
                提交反馈
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
