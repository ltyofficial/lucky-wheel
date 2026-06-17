import React, { useState } from 'react';
import Wheel from './components/Wheel';
import ResultModal from './components/ResultModal';
import { Gift } from 'lucide-react';

const PRIZES = [
  { id: 1, name: '麦当劳', color: '#FFB6C1', textColor: '#D87093' }, // LightPink
  { id: 2, name: '肯德基', color: '#FFC0CB', textColor: '#D87093' }, // Pink
  { id: 3, name: '奶茶', color: '#FF69B4', textColor: '#FFFFFF' },   // HotPink
  { id: 4, name: '火锅', color: '#DB7093', textColor: '#FFFFFF' },   // PaleVioletRed
  { id: 5, name: '烧烤', color: '#F08080', textColor: '#FFFFFF' },   // LightCoral
  { id: 6, name: '未中奖', color: '#FFE4E1', textColor: '#A0522D' }, // MistyRose
];

function App() {
  const [result, setResult] = useState<{ id: number; name: string; color: string; textColor?: string } | null>(null);

  const handleFinished = (prize: { id: number; name: string; color: string; textColor?: string }) => {
    setResult(prize);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-200 rounded-full blur-3xl opacity-50" />
      
      <div className="z-10 text-center mb-16">
        <div className="flex items-center justify-center mb-4">
          <Gift className="w-8 h-8 text-pink-500 mr-2" />
          <h1 className="text-3xl sm:text-4xl font-black text-pink-600 tracking-tight drop-shadow-sm">
            宝贝猫咪大转盘
          </h1>
        </div>
        <p className="text-pink-400 font-medium">
          点击中间按钮，看看小猫爪会指向哪里吧！
        </p>
      </div>

      <div className="z-10">
        <Wheel prizes={PRIZES} onFinished={handleFinished} />
      </div>

      <div className="mt-16 text-center text-pink-300 text-sm z-10">
        <p>© 2026 宝贝猫咪大抽奖系统 · 免登录即刻参与</p>
      </div>

      <ResultModal prize={result} onClose={() => setResult(null)} />
    </div>
  );
}

export default App;
