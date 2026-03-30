import React, { useRef } from 'react';
import { 
  Menu, 
  Sparkles, 
  User, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ChevronDown, 
  Camera,
  Upload,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { HazardRecord, HazardCategory } from '../types';

interface HomeProps {
  records: HazardRecord[];
  onNavigate: (view: any) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextSubmit: (text: string) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  setCorrectionData: (data: any) => void;
}

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    className={`bg-white/80 backdrop-blur-md rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

export default function Home({ 
  records, 
  onNavigate, 
  onImageUpload, 
  onTextSubmit,
  textInput,
  setTextInput,
  setCorrectionData
}: HomeProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleGuideClick = (cat: HazardCategory) => {
    setCorrectionData({ category: cat });
    cameraInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#E8EAF6] via-[#F3E5F5] to-white overflow-hidden">
      {/* Top Bar - Cleaned up */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('history')} className="p-2 bg-white/60 rounded-full active:scale-95 transition-all">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <span className="text-xl font-bold text-gray-800">隐患随手拍</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2 bg-white/60 rounded-full active:scale-95 transition-all text-gray-700"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="p-2 bg-white/60 rounded-full active:scale-95 transition-all flex items-center gap-1 text-xs font-bold text-gray-700"
          >
            <User className="w-5 h-5" /> 我的
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 pt-4 relative overflow-y-auto pb-32">
        {/* Greeting Section */}
        <div className="mb-8 relative">
          <div className="flex items-center gap-1 text-2xl font-bold text-[#3F51B5]">
            上午好~ <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-lg font-medium text-[#5C6BC0] mt-1">安全生产 警钟长鸣</p>
          
          <div className="absolute top-[-20px] right-0 w-32 h-32">
            <img 
              src="https://picsum.photos/seed/powerplant/200/200" 
              alt="Power Plant" 
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Guide Introduction Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-[#FF7043] rounded-full"></div>
            <h2 className="font-bold text-gray-800">引导介绍</h2>
          </div>
          <div className="space-y-3">
            {[
              { cat: '人员行为类', icon: <User className="w-6 h-6" />, color: 'bg-blue-50 text-blue-500', desc: '违章作业、未穿戴防护用品等' },
              { cat: '设备设施类', icon: <Cpu className="w-6 h-6" />, color: 'bg-purple-50 text-purple-500', desc: '设备老化、防护罩缺失、漏电等' },
              { cat: '作业环境类', icon: <AlertTriangle className="w-6 h-6" />, color: 'bg-orange-50 text-orange-500', desc: '照明不足、通风不良、地面湿滑等' },
              { cat: '安全防护类', icon: <CheckCircle2 className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-500', desc: '灭火器过期、消防通道堵塞等' },
              { cat: '管理制度类', icon: <FileText className="w-6 h-6" />, color: 'bg-pink-50 text-pink-500', desc: '制度不全、台账缺失、培训不到位等' }
            ].map((item) => (
              <div 
                key={item.cat} 
                className="bg-white rounded-[24px] p-4 flex items-center gap-4 shadow-sm border border-gray-50 active:scale-[0.98] transition-all cursor-pointer" 
                onClick={() => handleGuideClick(item.cat as HazardCategory)}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.cat}</h3>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[#7E57C2] rounded-full"></div>
              <h2 className="font-bold text-gray-800">我的隐患记录</h2>
            </div>
            <button 
              onClick={() => onNavigate('history')}
              className="flex items-center gap-1 text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full active:bg-gray-100 transition-colors"
            >
              全部数据 <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {records.slice(0, 3).map((record, i) => (
              <div key={record.id} className="p-4 bg-white rounded-2xl border border-gray-50 flex items-center gap-4 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  i === 0 ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'
                }`}>
                  {record.type === 'image' ? <Camera className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
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
                  <p className="text-xs text-gray-400 mt-0.5">{record.category}</p>
                </div>
                <button 
                  onClick={() => { onNavigate({ view: 'result', record }); }}
                  className="p-2 bg-gray-50 rounded-full"
                >
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            ))}
            {records.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <p>暂无记录，点击下方开始识别</p>
              </div>
            )}
          </div>
        </GlassCard>
      </main>

      {/* Bottom Action Bar - Redesigned to match screenshot */}
      <div className="sticky bottom-0 left-0 right-0 px-6 pb-4 pt-1 bg-white/90 backdrop-blur-lg border-t border-gray-100 flex items-center gap-6">
        <button 
          onClick={() => galleryInputRef.current?.click()}
          className="p-2 text-gray-900 active:scale-90 transition-all"
        >
          <Upload className="w-7 h-7" strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 flex items-center justify-center py-2.5 bg-[#1A1AFF] text-white rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          <Camera className="w-7 h-7" strokeWidth={1.5} />
        </button>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={galleryInputRef} 
        className="hidden" 
        onChange={onImageUpload}
      />
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={cameraInputRef} 
        className="hidden" 
        onChange={onImageUpload}
      />
    </div>
  );
}
