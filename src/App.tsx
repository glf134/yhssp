/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HazardResult, HazardRecord, HazardCategory } from './types';
import { identifyHazardFromImage, identifyHazardFromText } from './services/gemini';

// Import sub-components
import Login from './components/Login';
import Home from './components/Home';
import History from './components/History';
import Analysis from './components/Analysis';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'home' | 'history' | 'result' | 'profile' | 'dashboard'>('home');
  const [records, setRecords] = useState<HazardRecord[]>([]);
  const [currentResult, setCurrentResult] = useState<HazardRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [correctionData, setCorrectionData] = useState<Partial<HazardResult>>({});

  useEffect(() => {
    const saved = localStorage.getItem('hazard_records');
    let initialRecords: HazardRecord[] = [];
    if (saved) {
      try {
        initialRecords = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load records", e);
      }
    }

    // If no records or only the old single test record, load the full mock data
    if (initialRecords.length <= 1) {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      
      const mockRecords: HazardRecord[] = [
        {
          id: 'mock-1',
          timestamp: now,
          type: 'image',
          content: 'https://picsum.photos/seed/hazard1/400/300',
          name: '配电箱未接地',
          category: '设备设施类',
          hazardLevel: '一般隐患',
          violationLevel: '二类',
          checkType: '日常检查',
          description: '发现配电箱外壳未连接接地线，存在触电风险。',
          reported: true
        },
        {
          id: 'mock-2',
          timestamp: now - dayMs, // Yesterday
          type: 'image',
          content: 'https://picsum.photos/seed/hazard2/400/300',
          name: '高空作业未系安全带',
          category: '人员行为类',
          hazardLevel: '重大隐患',
          violationLevel: '一类',
          checkType: '专项检查',
          description: '施工人员在5米高处作业时未佩戴安全带。',
          reported: true
        },
        {
          id: 'mock-3',
          timestamp: now - 2 * dayMs,
          type: 'image',
          content: 'https://picsum.photos/seed/hazard3/400/300',
          name: '消防通道堆放杂物',
          category: '安全防护类',
          hazardLevel: '较大1级',
          violationLevel: '三类',
          checkType: '日常检查',
          description: '二楼北侧消防通道被废旧纸箱堵塞。',
          reported: false
        },
        {
          id: 'mock-4',
          timestamp: now - 3 * dayMs,
          type: 'image',
          content: 'https://picsum.photos/seed/hazard4/400/300',
          name: '电线绝缘皮破损',
          category: '设备设施类',
          hazardLevel: '较大2级',
          violationLevel: '二类',
          checkType: '日常检查',
          description: '临时用电线路有一处绝缘皮磨损严重，露出铜芯。',
          reported: true
        },
        {
          id: 'mock-5',
          timestamp: now - 4 * dayMs,
          type: 'image',
          content: 'https://picsum.photos/seed/hazard5/400/300',
          name: '易燃物靠近火源',
          category: '作业环境类',
          hazardLevel: '一般隐患',
          violationLevel: '三类',
          checkType: '日常检查',
          description: '焊接作业区附近堆放有大量易燃油漆桶。',
          reported: false
        },
        {
          id: 'mock-6',
          timestamp: now,
          type: 'image',
          content: 'https://picsum.photos/seed/hazard6/400/300',
          name: '未佩戴安全帽',
          category: '人员行为类',
          hazardLevel: '较大1级',
          violationLevel: '一类',
          checkType: '专项检查',
          description: '进入施工现场未按规定佩戴安全帽。',
          reported: true
        }
      ];
      setRecords(mockRecords);
    } else {
      setRecords(initialRecords);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hazard_records', JSON.stringify(records));
  }, [records]);

  const addRecord = (record: HazardRecord) => {
    setRecords(prev => [record, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    if (currentResult && currentResult.id === id) {
      setCurrentResult(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setView('result');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      // Set temporary record to show image immediately
      setCurrentResult({
        id: 'temp',
        timestamp: Date.now(),
        type: 'image',
        content: base64,
        name: '',
        category: '人员行为类',
        hazardLevel: '一般隐患',
        violationLevel: '三类',
        checkType: '日常检查',
        description: ''
      });

      try {
        const result = await identifyHazardFromImage(base64);
        const newRecord: HazardRecord = {
          ...result,
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: 'image',
          content: base64
        };
        setCurrentResult(newRecord);
        addRecord(newRecord);
      } catch (error) {
        console.error("AI Recognition failed", error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setView('result');
    try {
      const result = await identifyHazardFromText(text);
      const newRecord: HazardRecord = {
        ...result,
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: 'text',
        content: text
      };
      setCurrentResult(newRecord);
      addRecord(newRecord);
      setTextInput('');
    } catch (error) {
      console.error("AI Recognition failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCorrection = (data: any) => {
    if (!currentResult) return;
    const updatedRecord: HazardRecord = {
      ...currentResult,
      ...data,
    };
    setRecords(prev => prev.map(r => r.id === currentResult.id ? updatedRecord : r));
    setCurrentResult(updatedRecord);
  };

  const handleRating = (id: string, rating: 'like' | 'dislike' | null, feedback?: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, rating, feedback: feedback || r.feedback } : r));
    if (currentResult && currentResult.id === id) {
      setCurrentResult(prev => prev ? { ...prev, rating, feedback: feedback || prev.feedback } : null);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('home');
  };

  const handleReport = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, reported: true } : r));
    if (currentResult && currentResult.id === id) {
      setCurrentResult(prev => prev ? { ...prev, reported: true } : null);
    }
  };

  const handleNavigate = (nav: any) => {
    if (typeof nav === 'string') {
      setView(nav as any);
    } else if (nav.view === 'result') {
      setCurrentResult(nav.record);
      setView('result');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto h-screen bg-white shadow-2xl overflow-hidden font-sans relative">
        <Login onLogin={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen bg-white shadow-2xl overflow-hidden font-sans relative">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <Home 
              records={records}
              onNavigate={handleNavigate}
              onImageUpload={handleImageUpload}
              onTextSubmit={handleTextSubmit}
              textInput={textInput}
              setTextInput={setTextInput}
              setCorrectionData={setCorrectionData}
            />
          </motion.div>
        )}
        {view === 'history' && (
          <motion.div key="history" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="h-full">
            <History 
              records={records}
              onBack={() => setView('home')}
              onSelectRecord={(record) => { setCurrentResult(record); setView('result'); }}
            />
          </motion.div>
        )}
        {view === 'profile' && (
          <motion.div key="profile" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="h-full">
            <Profile 
              records={records}
              onBack={() => setView('home')}
              onLogout={handleLogout}
              onDeleteRecord={handleDeleteRecord}
              onSelectRecord={(record) => { setCurrentResult(record); setView('result'); }}
            />
          </motion.div>
        )}
        {view === 'dashboard' && (
          <motion.div key="dashboard" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="h-full">
            <Dashboard 
              records={records}
              onBack={() => setView('home')}
            />
          </motion.div>
        )}
        {view === 'result' && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <Analysis 
              record={currentResult}
              loading={loading}
              onBack={() => setView('home')}
              onCorrection={handleCorrection}
              onReport={handleReport}
              onRating={handleRating}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

