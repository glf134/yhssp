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
  const [filter, setFilter] = React.useState<'all' | 'reported' | 'unreported'>('all');

  const filteredRecords = records.filter(record => {
    if (filter === 'reported') return record.reported;
    if (filter === 'unreported') return !record.reported;
    return true;
  });

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
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-2">
          {[
            { id: 'all', label: '全部' },
            { id: 'reported', label: '已报' },
            { id: 'unreported', label: '未报' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === tab.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-white/60 text-gray-400 hover:bg-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p>暂无识别记录</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
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
                  record.hazardLevel === '重大隐患' ? 'text-red-500 bg-red-50' : 
                  record.hazardLevel === '较大2级' ? 'text-orange-600 bg-orange-50' : 
                  record.hazardLevel === '较大1级' ? 'text-orange-400 bg-orange-50' : 
                  'text-blue-500 bg-blue-50'
                }`}>
                  {record.hazardLevel}
                </div>
              </GlassCard>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
