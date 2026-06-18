import React, { useState } from 'react';

interface Prize {
  id: number;
  name: string;
  color: string;
  textColor?: string;
}

interface WheelProps {
  prizes: Prize[];
  onFinished: (prize: Prize) => void;
}

const Wheel: React.FC<WheelProps> = ({ prizes, onFinished }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isFakeout, setIsFakeout] = useState(false);
  const segmentAngle = 360 / prizes.length;
  const spinDurationMs = 6800;
  const fakeStopPauseMs = 260;
  const fakeoutDurationMs = 220;
  const pawAngleOffsetDeg = -30;

  const normalizeAngle = (angle: number) => {
    return ((angle % 360) + 360) % 360;
  };

  const getPrizeCenterAngle = (index: number) => {
    return index * segmentAngle + segmentAngle / 2;
  };

  const getForwardRotationTarget = (currentRotation: number, targetAngle: number, extraSpins: number) => {
    const currentAngle = normalizeAngle(currentRotation);
    const delta = normalizeAngle(targetAngle - currentAngle);

    return currentRotation + extraSpins * 360 + delta;
  };

  const getShortestAngleDelta = (fromAngle: number, toAngle: number) => {
    let diff = normalizeAngle(toAngle - fromAngle);
    if (diff > 180) {
      diff -= 360;
    }
    return diff;
  };

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setIsFakeout(false);

    const noPrizeIndex = prizes.findIndex(p => p.name === '未中奖');
    const availablePrizeIndexes = prizes
      .map((_, index) => index)
      .filter(index => index !== noPrizeIndex);
    const realPrizeIndex = availablePrizeIndexes[Math.floor(Math.random() * availablePrizeIndexes.length)];

    const extraSpins = 3 + Math.floor(Math.random() * 2);
    const fakeStopAngle = getPrizeCenterAngle(noPrizeIndex);
    const realStopAngle = getPrizeCenterAngle(realPrizeIndex);

    const targetFakeRotation = getForwardRotationTarget(rotation, fakeStopAngle, extraSpins);
    const jumpDiff = getShortestAngleDelta(normalizeAngle(targetFakeRotation), realStopAngle);
    const targetRealRotation = targetFakeRotation + jumpDiff;

    setRotation(targetFakeRotation);

    setTimeout(() => {
      setIsFakeout(true);
      setRotation(targetRealRotation);
    }, spinDurationMs + fakeStopPauseMs);

    setTimeout(() => {
      setIsSpinning(false);
      setIsFakeout(false);
      onFinished(prizes[realPrizeIndex]);
    }, spinDurationMs + fakeStopPauseMs + fakeoutDurationMs);
  };

  const radius = 180;
  const centerX = 200;
  const centerY = 200;

  const getCoordinatesForAngle = (angle: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  return (
    <div className="relative w-80 h-80 sm:w-[400px] sm:h-[400px] mx-auto flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-2xl animate-pulse" />
      
      {/* Wheel SVG (Static) */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-2xl"
      >
        <g>
          {prizes.map((prize, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            const start = getCoordinatesForAngle(startAngle);
            const end = getCoordinatesForAngle(endAngle);
            const largeArcFlag = segmentAngle > 180 ? 1 : 0;
            
            const textAngle = startAngle + segmentAngle / 2;
            const textRadius = radius * 0.65;
            const textX = centerX + textRadius * Math.cos(((textAngle - 90) * Math.PI) / 180);
            const textY = centerY + textRadius * Math.sin(((textAngle - 90) * Math.PI) / 180);

            return (
              <g key={prize.id}>
                <path
                  d={`M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`}
                  fill={prize.color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  fill={prize.textColor || "white"}
                  fontSize="16"
                  fontWeight="900"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  className="select-none"
                  style={{ textShadow: prize.textColor ? 'none' : '0px 2px 4px rgba(0,0,0,0.4)' }}
                >
                  {prize.name}
                </text>
              </g>
            );
          })}
        </g>
        
        {/* Outer Ring */}
        <circle cx={centerX} cy={centerY} r={radius + 5} fill="none" stroke="#FF69B4" strokeWidth="10" />
        
        {[...Array(12)].map((_, i) => (
          <circle
            key={i}
            cx={centerX + (radius + 5) * Math.cos((i * 30 * Math.PI) / 180)}
            cy={centerY + (radius + 5) * Math.sin((i * 30 * Math.PI) / 180)}
            r="4"
            fill="#FFF"
          />
        ))}
      </svg>

      {/* Orbiting Pointer Container */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none ${isFakeout ? 'transition-transform duration-[120ms]' : 'transition-transform duration-[6800ms]'}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionTimingFunction: isFakeout ? 'cubic-bezier(0.55, 0, 1, 0.45)' : 'cubic-bezier(0.15, 0, 0.15, 1)',
        }}
      >
        <div
          className={`absolute top-8 left-1/2 flex flex-col items-center ${isFakeout ? 'transition-transform duration-[120ms]' : 'transition-transform duration-[6800ms]'}`}
          style={{
            transform: `translateX(-50%) rotate(${-rotation + pawAngleOffsetDeg}deg)`,
            transitionTimingFunction: isFakeout ? 'cubic-bezier(0.55, 0, 1, 0.45)' : 'cubic-bezier(0.15, 0, 0.15, 1)',
          }}
        >
          <div className="relative group">
            <svg
              width="70"
              height="80"
              viewBox="0 0 120 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="filter drop-shadow-[0_10px_20px_rgba(255,105,180,0.5)]"
            >
              <path
                d="M35 140 C35 100, 20 80, 30 50 C35 35, 85 35, 90 50 C100 80, 85 100, 85 140 Z"
                fill="#FFFFFF"
              />

              <path
                d="M60 85 C75 85, 90 70, 80 55 C70 45, 60 55, 60 55 C60 55, 50 45, 40 55 C30 70, 45 85, 60 85 Z"
                fill="#FF82AB"
              />

              <ellipse cx="35" cy="35" rx="10" ry="14" transform="rotate(-25 35 35)" fill="#FF82AB" />
              <ellipse cx="50" cy="22" rx="10" ry="15" transform="rotate(-10 50 22)" fill="#FF82AB" />
              <ellipse cx="70" cy="22" rx="10" ry="15" transform="rotate(10 70 22)" fill="#FF82AB" />
              <ellipse cx="85" cy="35" rx="10" ry="14" transform="rotate(25 85 35)" fill="#FF82AB" />

              <path
                d="M60 115 L50 100 L70 100 Z"
                fill="#FF69B4"
                className={isSpinning ? 'animate-bounce' : ''}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Center Button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-500 border-4 border-white text-white font-black text-lg sm:text-xl shadow-inner active:scale-95 transition-all duration-200 flex items-center justify-center
          ${isSpinning ? 'opacity-80 cursor-not-allowed' : 'hover:bg-pink-400 hover:scale-105 active:bg-pink-600 shadow-[0_0_20px_rgba(255,105,180,0.6)]'}`}
      >
        <span className={isSpinning ? 'animate-pulse' : ''}>
          {isSpinning ? '喵~' : '抽奖'}
        </span>
      </button>
    </div>
  );
};

export default Wheel;
