import React, { useState, useEffect } from 'react';

import beepSound from '../../assets/zvuk6.mp3'; // Файлдын туура жолун көрсөтүңүз

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [isSoundEnabled, setSoundEnabled] = useState(true);

  const beep = new Audio(beepSound); // Импорттолгон үн файлын колдонуу

  const steps = [
    { time: 14.83, action: 'Добавьте масло (150г)', type: 'oil' },
    { time: 14, action: 'Добавьте лук (200г)', type: 'onion' },
    { time: 13, action: 'Добавьте болгарский перец (400г)', type: 'pepper' },
    { time: 10, action: 'Добавьте помидоры (500г)', type: 'tomato' },
    { time:8, action: 'Добавьте томатную пасту (200г)', type: 'paste' },
    { time: 6, action: 'Добавьте воду (400г)', type: 'water' },
    { time: 5, action: 'Добавьте соль (20г)', type: 'salt' },
		{time: 4, action: 'Добавьте соусШрирача(20г)', type: 'sriraСhasauce'},
    { time: 3, action: 'Добавьте фасоль (2кг)', type: 'beans' },
    { time: 0, action: 'Блюдо готово!', type: 'done' }
  ];

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const minutes = timeLeft / 60;
    const step = steps.find(s => s.time === Math.floor(minutes * 100) / 100);
    
    if (step) {
      setActiveStep(step.type);
      if (isSoundEnabled) {
        try {
          beep.play();
          setTimeout(() => {
            beep.currentTime = 0;
            beep.play();
          }, 500);
          setTimeout(() => {
            beep.currentTime = 0;
            beep.play();
          }, 1000);
        } catch (err) {
          console.error('Sound play failed:', err);
        }
      }
      setTimeout(() => {
        setActiveStep(null);
      }, 15000);
    }
  }, [timeLeft, isSoundEnabled]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const increaseTime = () => {
    setTimeLeft(prevTime => prevTime + 60);
  };

  const decreaseTime = () => {
    setTimeLeft(prevTime => Math.max(prevTime - 60, 0));
  };

  return (
    <div className="timer">
      <div className="timer__header">
        <h1>Таймер приготовления</h1>
        <div className="timer__display">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="timer__controls">
        <button onClick={increaseTime}>+1 мин</button>
        <button onClick={decreaseTime}>-1 мин</button>
        <button
          className={`timer__button ${isRunning ? 'timer__button--disabled' : ''}`}
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
        >
          Начать
        </button>
        <button
          className="timer__button timer__button--reset"
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(15 * 60);
            setActiveStep(null);
          }}
        >
          Сбросить
        </button>
        <button
          className={`timer__button timer__button--sound ${!isSoundEnabled ? 'timer__button--sound-off' : ''}`}
          onClick={() => setSoundEnabled(!isSoundEnabled)}
        >
          {isSoundEnabled ? '🔊' : '🔈'}
        </button>
      </div>

      <div className="timer__steps">
        {steps.map((step, index) => {
          const minutes = timeLeft / 60;
          const isCompleted = minutes < step.time;
          const isActive = step.type === activeStep;

          return (
            <div
              key={index}
              className={`
                timer__step
                ${isCompleted ? 'timer__step--completed' : ''}
                ${isActive ? 'timer__step--active' : ''}
              `}
            >
              <div className="timer__step-time">{step.time} мин</div>
              <div className="timer__step-action">{step.action}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timer;