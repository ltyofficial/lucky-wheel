import React from 'react';
import { Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Prize {
  id: number;
  name: string;
  color: string;
}

interface ResultModalProps {
  prize: Prize | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ prize, onClose }) => {
  if (!prize) return null;

  const isWin = prize.name !== '谢谢参与';

  if (isWin) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ffd700', '#ffffff']
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-8 text-center">
          <div className={`mx-auto w-20 h-20 mb-6 rounded-full flex items-center justify-center ${isWin ? 'bg-pink-100' : 'bg-gray-100'}`}>
            <Trophy className={`w-10 h-10 ${isWin ? 'text-pink-500' : 'text-gray-400'}`} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isWin ? '喵！恭喜中奖！' : '很遗憾'}
          </h2>
          
          <p className="text-gray-600 mb-8">
            {isWin ? `您抽中了：${prize.name}` : '下次运气一定会更好哦！'}
          </p>

          <button
            onClick={onClose}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95
              ${isWin ? 'bg-gradient-to-r from-pink-500 to-rose-400 shadow-lg shadow-pink-200' : 'bg-gray-800'}`}
          >
            {isWin ? '领取奖励' : '再试一次'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
