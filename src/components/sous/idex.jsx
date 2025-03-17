import { useState, useEffect } from 'react';
import './sous.scss';
import beepSound from '../../assets/vse.mp3'; // Звук для таймера
import finishSound from '../../assets/finish.mp3'; // Звук, когда блюдо готово

const SousTimer = () => {
    const [timeLeft, setTimeLeft] = useState(31 * 60); // Начальное время установлено на 41 минуту
    const [isRunning, setIsRunning] = useState(false);
    const [activeStep, setActiveStep] = useState(null);
    const [isSoundEnabled, setSoundEnabled] = useState(true);

    const beep = new Audio(beepSound); // Импортированный звуковой файл
    const finishBeep = new Audio(finishSound); // Звук, когда блюдо готово

    const steps = [
        { time: 30.93, action: 'Добавьте 10.5 литров молока', type: 'oil' },
				{ time:30.93, action: 'Добавьте 1мл г аннато', type: 'oil' },
        { time: 30.93, action: 'Добавьте 200 г натрия цитрата', type: 'oil' },
        { time: 30.93, action: 'Добавьте 130 г копченой паприки', type: 'oil' },
        { time: 30.93, action: 'Добавьте 260 г соли', type: 'oil' },
      
        { time: 30.93, action: 'Добавьте 400 г масла', type: 'oil' },
        { time: 30.93, action: 'Добавьте 660 г томатной пасты', type: 'paste' },
        { time:30, action: 'Приготовьте пасту (3500 г) на плите', type: 'paste' },
        { time: 10, action: 'Добавьте 2200 г сыра моцарелла', type: 'water' },
        { time: 8, action: 'Добавьте 2200 г сыра моцарелла', type: 'salt' },
        { time: 6, action: 'Добавьте 2100 г сыра моцарелла', type: 'sriracha' },
        { time: 5, action: 'Добавьте 300 г уксуса и 400 г халапеньо и сок халапеньо 400г' , type: 'beans' },
        { time: 0, action: 'Блюдо готово!', type: 'done' }
    ];

    useEffect(() => {
        let interval = null;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (isSoundEnabled) {
                finishBeep.play();
            }
            setIsRunning(false); // Остановить таймер
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    useEffect(() => {
        const minutes = timeLeft / 60;
        const step = steps.find(s => s.time === Math.floor(minutes * 100) / 100);

        if (step) {
            setActiveStep(step.type);
            if (isSoundEnabled) {
                playBeep();
            }
            setTimeout(() => {
                setActiveStep(null);
            }, 15000); // Очистить активный шаг через 15 секунд
        }
    }, [timeLeft, isSoundEnabled]);

    const playBeep = () => {
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
            console.error('Ошибка воспроизведения звука:', err);
        }
    };



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
                        setTimeLeft(41 * 60);
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
                            className={`timer__step
                                ${isCompleted ? 'timer__step--completed' : ''}
                                ${isActive ? 'timer__step--active' : ''}
                                ${timeLeft === 0 ? 'timer__step--finished' : ''}`}
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

export default SousTimer;