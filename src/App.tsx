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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'home' | 'history' | 'result' | 'profile'>('home');
  const [records, setRecords] = useState<HazardRecord[]>([]);
  const [currentResult, setCurrentResult] = useState<HazardRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [correctionData, setCorrectionData] = useState<Partial<HazardResult>>({});

  useEffect(() => {
    const saved = localStorage.getItem('hazard_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load records", e);
      }
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
        riskLevel: '低',
        description: '',
        suggestion: '',
        regulations: '',
        references: []
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('home');
  };

  const handleReport = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, reported: true } : r));
    if (currentResult && currentResult.id === id) {
      setCurrentResult({ ...currentResult, reported: true });
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
        {view === 'result' && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <Analysis 
              record={currentResult}
              loading={loading}
              onBack={() => setView('home')}
              onCorrection={handleCorrection}
              onReport={handleReport}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

