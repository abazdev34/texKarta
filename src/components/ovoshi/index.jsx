// src/components/timer/timer.jsx
import { useState, useEffect } from 'react';
import mixSound from '../../assets/zvuk6.mp3';
import doneSound from '../../assets/finish.mp3';
import './taimer.scss';

const Timer_ovoshi = () => {
  // Основные состояния
  const [timeLeft, setTimeLeft] = useState(36 * 60); // 36 минут
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showFireworks, setShowFireworks] = useState(false);
  const [currentAction, setCurrentAction] = useState(''); // Текущая активность

  // Аудио объекты
  const alertBeep = new Audio(mixSound);
  const doneBeep = new Audio(doneSound);

  // Этапы
  const steps = [
    { time: 18, action: 'Смешайте!', type: 'mix' },
    { time: 5, action: 'Смешайте еще раз!', type: 'mix' },
    { time: 0, action: 'Готово, подавайте!', type: 'done' }
  ];

  // Функция воспроизведения звука
  const playSound = (isDone = false) => {
    try {
      const sound = isDone ? doneBeep : alertBeep;
      sound.volume = volume;
      sound.play();
      if (!isDone) {
        setCurrentAction(steps.find(s => s.type === 'mix' && s.time === Math.floor(timeLeft / 60))?.action || ''); // Установить текущее действие
        setTimeout(() => setCurrentAction(''), 1000); // Скрыть действие через 1 секунду
      }
    } catch (error) {
      console.error('Ошибка воспроизведения звука:', error);
    }
  };

  // Работа таймера
  useEffect(() => {
    let interval = null;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          // Проверка этапов
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

  // Форматирование времени
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Получение процента прогресса
  const getProgressPercentage = () => {
    const totalSeconds = 36 * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  // Управляющие функции таймера
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
    setCurrentAction(''); // Сбросить текущее действие
  };

  return (
    <div className="timer-container">
      {/* Индикатор прогресса */}
      <div className="progress-info">
        {currentAction || '\\u00A0'}
      </div>

      {/* Круг таймера */}
      <div 
        className={`timer-circle ${isRunning ? 'running' : ''} ${timeLeft === 0 ? 'finished' : ''}`}
        style={{ '--progress': `${getProgressPercentage()}%` }}
      >
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      {/* Кнопки управления */}
      <div className="timer-controls">
        <button
          className="timer-button reset"
          onClick={handleReset}
        >
          Сбросить
        </button>

        {!isRunning && !isPaused && timeLeft !== 36 * 60 && (
          <button
            className="timer-button continue"
            onClick={handleStart}
          >
            Продолжить
          </button>
        )}

        {!isRunning && timeLeft === 36 * 60 && (
          <button
            className="timer-button start"
            onClick={handleStart}
          >
            Начать
          </button>
        )}

        {isRunning && (
          <button
            className="timer-button pause"
            onClick={handlePause}
          >
            Пауза
          </button>
        )}
      </div>

      {/* Регулировка громкости */}
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

      {/* Анимация фейерверка */}
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