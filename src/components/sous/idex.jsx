import  { useState, useEffect } from 'react';
import './sous.scss';
import beepSound from '../../assets/vse.mp3'; // Таймер үчүн үн
import finishSound from '../../assets/finish.mp3'; // Блюдо даяр болгондо ойнолуучу үн

const SousTimer = () => {
	const [timeLeft, setTimeLeft] = useState(31 * 60);
	const [isRunning, setIsRunning] = useState(false);
	const [activeStep, setActiveStep] = useState(null);
	const [isSoundEnabled, setSoundEnabled] = useState(true);

	const beep = new Audio(beepSound); // Импорттолгон үн файлы
	const finishBeep = new Audio(finishSound); // Блюдо даяр болгондо ойнолуучу үн

	const steps = [
		{ time: 30.93, action: 'сначала дабовим молоко 10,500 литров', type: 'plate' },
		{ time: 30.83, action: 'Добавьте цитрат  натирий  (200г)', type: 'oil' },
		{ time: 30.70, action: 'Добавьте копченый паприка (130г)', type: 'onion' },
		{ time: 30.50, action: 'Добавьте соль (260г)', type: 'pepper' },
		{ time: 30, action: 'Добавьте Аннто (50г)', type: 'tomato' },
		{ time: 28.50, action: 'добавьте масло (400г)', type: 'fry' },
		{ time: 27, action: 'приготовти индогцтной плита (3500г) пастовую', type: 'paste' },
		{ time: 10, action: 'Добавьте сыр моцарелла (2200г)', type: 'water' },
		{ time: 8, action: 'Добавьте сыр моцарелла (2200г)', type: 'salt' },
		{ time: 6, action: 'Добавьте сыр моцарелла (2100г)', type: 'sriraСhasauce' },
		{ time: 5, action: 'Добавьте (уксус 300г хлапеньо 400г сок халапеньо 400г)  )', type: 'beans' },
		{ time: 0, action: 'Блюдо готово!', type: 'done' }
	];

	useEffect(() => {
		let interval = null;
		if (isRunning && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft(time => time - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			// Блюдо даяр болгондо башка үн ойнотуу
			if (isSoundEnabled) {
				finishBeep.play();
			}
			setIsRunning(false); // Таймерди токтотуу
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
						setTimeLeft(31 * 60);
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
								${timeLeft === 0 ? 'timer__step--finished' : ''} // Кызылга өзгөртүү
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

export default SousTimer;