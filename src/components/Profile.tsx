import React from 'react';
import { ArrowLeft, LogOut, User, Shield, MapPin, Trash2, Camera, FileText, CheckCircle2 } from 'lucide-react';
import { HazardRecord } from '../types';

interface ProfileProps {
  records: HazardRecord[];
  onBack: () => void;
  onLogout: () => void;
  onDeleteRecord: (id: string) => void;
  onSelectRecord: (record: HazardRecord) => void;
}

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/80 backdrop-blur-md rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 overflow-hidden ${className}`}>
    {children}
  </div>
);

export default function Profile({ records, onBack, onLogout, onDeleteRecord, onSelectRecord }: ProfileProps) {
  const [filter, setFilter] = React.useState<'all' | 'reported' | 'unreported'>('all');

  const filteredRecords = records.filter(record => {
    if (filter === 'reported') return record.reported;
    if (filter === 'unreported') return !record.reported;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#E8EAF6] to-white overflow-hidden">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-white/60 rounded-full active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">个人中心</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto space-y-6 pb-20">
        {/* User Info Card */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-md">
              <img 
                src="https://picsum.photos/seed/user/200/200" 
                alt="User Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">张安全</h2>
              <p className="text-sm text-gray-400">高级安全管理员</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                <Shield className="w-3 h-3" /> 认证员工
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" /> 所属部门
              </div>
              <div className="text-gray-700 font-medium">生产安全部</div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <User className="w-4 h-4" /> 员工编号
              </div>
              <div className="text-gray-700 font-medium">SA-20260317</div>
            </div>
          </div>
        </GlassCard>

        {/* My Records Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-gray-800">我的隐患记录 ({filteredRecords.length})</h3>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 px-2">
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

          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div 
                key={record.id} 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-white/40 group"
              >
                <div 
                  className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center cursor-pointer"
                  onClick={() => onSelectRecord(record)}
                >
                  {record.type === 'image' ? <Camera className="w-6 h-6 text-gray-400" /> : <FileText className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectRecord(record)}>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-800 truncate text-sm">{record.name}</h4>
                    {record.reported && (
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-500 text-[8px] font-bold rounded-md flex items-center gap-0.5">
                        <CheckCircle2 className="w-2 h-2" /> 已报
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">{new Date(record.timestamp).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => onDeleteRecord(record.id)}
                  className="p-2 text-gray-300 hover:text-red-500 active:scale-95 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {records.length === 0 && (
              <div className="py-12 text-center text-gray-400 bg-white/40 rounded-3xl border border-dashed border-gray-200">
                <p className="text-sm">暂无记录</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full py-4 bg-white text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm border border-red-50 active:scale-95 transition-all mt-8"
        >
          <LogOut className="w-5 h-5" /> 退出登录
        </button>
      </main>
    </div>
  );
}
