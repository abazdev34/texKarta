import { useState, useEffect } from 'react';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [isSoundEnabled, setSoundEnabled] = useState(true);
  const [repetitions, setRepetitions] = useState(0); // Количество повторений
  const [currentRepetition, setCurrentRepetition] = useState(1); // Текущее повторение
  const [isCompleted, setIsCompleted] = useState(false); // Завершено ли все

  // Звуки (используем стандартные звуки браузера)
  const playBeep = () => {
    if (isSoundEnabled) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const playFinishSound = () => {
    if (isSoundEnabled) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.15;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const steps = [
    { time: 14.93, action: 'Подготовить индукционную плиту на 3500 градусов', type: 'plate' },
    { time: 14.83, action: 'Добавить масло (150г)', type: 'oil' },
    { time: 14, action: 'Добавить лук (250г)', type: 'onion' },
    { time: 13, action: 'Добавить болгарский перец (400г)', type: 'pepper' },
    { time: 10, action: 'Добавить помидоры (500г)', type: 'tomato' },
    { time: 8.3, action: 'Переключить индукционную плиту на 2000 градусов', type: 'fry' },
    { time: 8, action: 'Добавить томатную пасту (200г)', type: 'paste' },
    { time: 6, action: 'Добавить воду (400г)', type: 'water' },
    { time: 5, action: 'Добавить соль (20г)', type: 'salt' },
    { time: 4, action: 'Добавить соус Шрирача (120г)', type: 'sriracha' },
    { time: 3, action: 'Добавить фасоль (2500г)', type: 'beans' },
    { time: 0, action: 'Блюдо готово!', type: 'done' }
  ];

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Один цикл завершен
      if (currentRepetition < repetitions) {
        // Переход к следующему повторению
        setCurrentRepetition(prev => prev + 1);
        setTimeLeft(15 * 60);
        playBeep();
      } else {
        // Все завершено
        setIsRunning(false);
        setIsCompleted(true);
        playFinishSound();
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentRepetition, repetitions]);

  useEffect(() => {
    const minutes = timeLeft / 60;
    const step = steps.find(s => s.time === Math.floor(minutes * 100) / 100);

    if (step && isRunning) {
      setActiveStep(step.type);
      playBeep();
      
      setTimeout(() => {
        setActiveStep(null);
      }, 15000);
    }
  }, [timeLeft, isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(15 * 60);
    setActiveStep(null);
    setCurrentRepetition(1);
    setIsCompleted(false);
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Таймер приготовления</h1>
        <div style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: timeLeft < 300 ? '#ff4444' : '#333',
          marginBottom: '10px'
        }}>
          {formatTime(timeLeft)}
        </div>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>
          {currentRepetition} / {repetitions} повторений
        </div>
        {isCompleted && (
          <div style={{ 
            fontSize: '1.5rem', 
            color: '#22c55e', 
            fontWeight: 'bold',
            marginTop: '10px'
          }}>
            🎉 Все готово! 🎉
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '1.1rem' }}>
          Количество повторений:
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={repetitions}
          onChange={(e) => setRepetitions(parseInt(e.target.value) || 1)}
          disabled={isRunning}
          style={{
            width: '80px',
            padding: '8px',
            fontSize: '1rem',
            border: '2px solid #ddd',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
        <button
          onClick={startTimer}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            fontSize: '1.1rem',
            backgroundColor: isRunning ? '#ccc' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          Начать
        </button>
        <button
          onClick={resetTimer}
          style={{
            padding: '12px 24px',
            fontSize: '1.1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Сбросить
        </button>
        <button
          onClick={() => setSoundEnabled(!isSoundEnabled)}
          style={{
            padding: '12px 24px',
            fontSize: '1.1rem',
            backgroundColor: isSoundEnabled ? '#3b82f6' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isSoundEnabled ? '🔊' : '🔈'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Этапы приготовления:</h3>
        {steps.map((step, index) => {
          const minutes = timeLeft / 60;
          const isStepCompleted = minutes < step.time;
          const isActive = step.type === activeStep;

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                margin: '5px 0',
                backgroundColor: isActive ? '#fff3cd' : isStepCompleted ? '#d4edda' : '#f8f9fa',
                border: `2px solid ${isActive ? '#ffc107' : isStepCompleted ? '#28a745' : '#e9ecef'}`,
                borderRadius: '8px',
                color: isStepCompleted ? '#155724' : '#495057'
              }}
            >
              <div style={{ 
                minWidth: '80px', 
                fontWeight: 'bold',
                color: isStepCompleted ? '#28a745' : '#6c757d'
              }}>
                {isStepCompleted ? '✓' : `${step.time} мин`}
              </div>
              <div style={{ fontSize: '1rem' }}>
                {step.action}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timer;