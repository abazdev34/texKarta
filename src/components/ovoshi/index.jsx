// src/components/timer/timer.jsx
import  { useState, useEffect } from 'react';
import mixSound from '../../assets/zvuk6.mp3';
import doneSound from '../../assets/zvuk6.mp3';
import './taimer.scss';

const Timer_ovoshi = () => {
  // Негизги состояниелер
  const [timeLeft, setTimeLeft] = useState(36 * 60); // 36 минута
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showFireworks, setShowFireworks] = useState(false);

  // Аудио объекттери
  const alertBeep = new Audio(mixSound);
  const doneBeep = new Audio(doneSound);

  // Аралык этаптар
  const steps = [
    { time: 18, action: 'Аралаштырыңыз Чынгыз!', type: 'mix' },
    { time: 5, action: 'Аралаштырыңыз Чынгыз!', type: 'mix' },
    { time: 0, action: 'Бүттү чыгарыныз Чынгыз!', type: 'done' }
  ];

  // Үн чыгаруу функциясы
  const playSound = (isDone = false) => {
    try {
      const sound = isDone ? doneBeep : alertBeep;
      sound.volume = volume;
      sound.play();
    } catch (error) {
      console.error('Үн чыгарууда ката:', error);
    }
  };

  // Таймердин иштөөсү
  useEffect(() => {
    let interval = null;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          // Этаптарды текшерүү
          const minutes = Math.floor((prevTime - 1) / 60);
          const seconds = (prevTime - 1) % 60;
          
          const currentStep = steps.find(s => s.time === minutes && seconds === 0);
          if (currentStep) {
            playSound(currentStep.type === 'done');
          }

          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setShowFireworks(true);
      playSound(true);
      setTimeout(() => setShowFireworks(false), 3000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  // Убакытты форматтоо
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Прогрессти эсептөө
  const getProgressPercentage = () => {
    const totalSeconds = 36 * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  // Таймерди башкаруу функциялары
  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(36 * 60);
    setShowFireworks(false);
  };

  return (
    <div className="timer-container">
      {/* Прогресс индикатору */}
      <div className="progress-info">
        {steps.find(s => s.time === Math.floor(timeLeft / 60))?.action || '\u00A0'}
      </div>

      {/* Таймер айланасы */}
      <div 
        className={`timer-circle ${isRunning ? 'running' : ''} ${timeLeft === 0 ? 'finished' : ''}`}
        style={{ '--progress': `${getProgressPercentage()}%` }}
      >
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      {/* Башкаруу баскычтары */}
      <div className="timer-controls">
        <button
          className="timer-button reset"
          onClick={handleReset}
        >
          Кайра баштоо
        </button>

        {!isRunning && !isPaused && timeLeft !== 36 * 60 && (
          <button
            className="timer-button continue"
            onClick={handleStart}
          >
            Улантуу
          </button>
        )}

        {!isRunning && timeLeft === 36 * 60 && (
          <button
            className="timer-button start"
            onClick={handleStart}
          >
            Баштоо
          </button>
        )}

        {isRunning && (
          <button
            className="timer-button pause"
            onClick={handlePause}
          >
            Тындыруу
          </button>
        )}
      </div>

      {/* Үндүн көлөмүн жөндөө */}
      <div className="volume-control">
        <span className="volume-icon">🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
        <span className="volume-icon">🔊</span>
      </div>

      {/* Фейерверк анимациясы */}
      {showFireworks && (
        <div className="fireworks">
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
        </div>
      )}
    </div>
  );
};

export default Timer_ovoshi;