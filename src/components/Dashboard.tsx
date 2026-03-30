import React, { useMemo } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { HazardRecord } from '../types';

interface DashboardProps {
  records: HazardRecord[];
  onBack: () => void;
}

const COLORS = ['#1A1AFF', '#FF7043', '#7E57C2', '#FF4444', '#4CAF50'];

export default function Dashboard({ records, onBack }: DashboardProps) {
  // 1. Trend Analysis (Last 7 days)
  const trendData = useMemo(() => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const data: { name: string, count: number, timestamp: number }[] = [];
    
    // Get last 7 days
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      data.push({
        name: days[d.getDay()],
        count: 0,
        timestamp: d.getTime()
      });
    }

    records.forEach(record => {
      const recordDate = new Date(record.timestamp);
      recordDate.setHours(0, 0, 0, 0);
      const recordTime = recordDate.getTime();
      
      const dayData = data.find(d => d.timestamp === recordTime);
      if (dayData) {
        dayData.count += 1;
      }
    });

    return data;
  }, [records]);

  // 2. Hazard Level Distribution
  const hazardLevelData = useMemo(() => {
    const levels = ['一般隐患', '较大1级', '较大2级', '重大隐患'];
    const labelMap: Record<string, string> = {
      '一般隐患': '一般',
      '较大1级': '较大1级',
      '较大2级': '较大2级',
      '重大隐患': '重大'
    };
    const counts: Record<string, number> = {};
    levels.forEach(l => counts[l] = 0);
    
    records.forEach(record => {
      if (counts[record.hazardLevel] !== undefined) {
        counts[record.hazardLevel] += 1;
      }
    });

    return levels.map(l => ({ name: labelMap[l], value: counts[l] })).filter(d => d.value > 0);
  }, [records]);

  // 3. Violation Level Distribution
  const violationLevelData = useMemo(() => {
    const levels = ['一类', '二类', '三类'];
    const counts: Record<string, number> = {};
    levels.forEach(l => counts[l] = 0);
    
    records.forEach(record => {
      if (counts[record.violationLevel] !== undefined) {
        counts[record.violationLevel] += 1;
      }
    });

    return levels.map(l => ({ name: l, value: counts[l] })).filter(d => d.value > 0);
  }, [records]);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FE] overflow-y-auto">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#F8F9FE]/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">指标分析</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-4 space-y-4 pb-12">
        {/* Top Row: Two Pie Charts side-by-side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Hazard Level Distribution */}
          <section className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-1.5 mb-4">
              <PieChartIcon className="w-4 h-4 text-[#FF7043]" />
              <h2 className="font-bold text-xs text-gray-800">隐患占比分析</h2>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hazardLevelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {hazardLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                      fontSize: '10px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
              {hazardLevelData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-[9px] text-gray-500 truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Violation Level Distribution */}
          <section className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-1.5 mb-4">
              <PieChartIcon className="w-4 h-4 text-[#7E57C2]" />
              <h2 className="font-bold text-xs text-gray-800">违章占比分析</h2>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={violationLevelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {violationLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                      fontSize: '10px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
              {violationLevelData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}></div>
                  <span className="text-[9px] text-gray-500 truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Row: Trend Analysis */}
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1A1AFF]" />
              <h2 className="font-bold text-gray-800">上报趋势分析</h2>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400">
              <Calendar className="w-3 h-3" /> 本周
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#1A1AFF" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1A1AFF', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
