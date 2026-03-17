import React from 'react';
import { ArrowLeft, Camera, Mic, FileText, CheckCircle2 } from 'lucide-react';
import { HazardRecord } from '../types';

interface HistoryProps {
  records: HazardRecord[];
  onBack: () => void;
  onSelectRecord: (record: HazardRecord) => void;
}

const GlassCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-white/80 backdrop-blur-md rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}
  >
    {children}
  </div>
);

export default function History({ records, onBack, onSelectRecord }: HistoryProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#E8EAF6] to-white">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-white/60 rounded-full active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">识别历史</h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 p-6 overflow-y-auto space-y-4">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p>暂无识别记录</p>
          </div>
        ) : (
          records.map((record) => (
            <div key={record.id}>
              <GlassCard 
                className="p-4 flex items-center gap-4 active:scale-[0.98] transition-all" 
                onClick={() => onSelectRecord(record)}
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden flex items-center justify-center">
                  {record.type === 'image' && record.content ? (
                    <img src={record.content} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : record.type === 'voice' ? (
                    <Mic className="w-8 h-8 text-gray-300" />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800 truncate">{record.name}</h3>
                    {record.reported && (
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-500 text-[8px] font-bold rounded-md flex items-center gap-0.5">
                        <CheckCircle2 className="w-2 h-2" /> 已上报
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{record.category}</p>
                  <p className="text-[10px] text-gray-300 mt-2">{new Date(record.timestamp).toLocaleString()}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  record.riskLevel === '高' ? 'text-red-500 bg-red-50' : 
                  record.riskLevel === '中' ? 'text-orange-500 bg-orange-50' : 
                  'text-blue-500 bg-blue-50'
                }`}>
                  {record.riskLevel}风险
                </div>
              </GlassCard>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
