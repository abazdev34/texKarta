import { useState } from 'react';
import { ingredientsData } from './index.jsx';
import './texkarta.scss'; // Import SCSS file

const TexKarta = () => {
    const [selectedDish, setSelectedDish] = useState('');
    const [result, setResult] = useState(null);
    const [totalWeight, setTotalWeight] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [isCalculating, setIsCalculating] = useState(false);
    const [customPrices, setCustomPrices] = useState({});
    const [buttonClass, setButtonClass] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState(new Set());
    const [showDishList, setShowDishList] = useState(true); // New state to control dish list visibility
    const [showAllAddedMessage, setShowAllAddedMessage] = useState(false); // New state for completion message

    const quickSelectDishes = [
        { name: 'КурицаМаринад', category: 'main-dish' },
        { name: 'специКурица', category: 'main-dish' },
        { name: 'фаршМариновый', category: 'main-dish' },
        { name: 'специФарш', category: 'main-dish' },
        { name: 'пико', category: 'side' },
        { name: 'овошиЖарыных', category: 'side' },
        { name: 'рисЗапровка', category: 'side' },
        { name: 'соусТако', category: 'sauce' },
        { name: 'соусЧипотило', category: 'sauce' },
        { name: 'Маринад', category: 'sauce' },
        { name: 'фасолеваяпаста', category: 'sauce' },
        { name: 'фасалВаренный', category: 'sauce' },
        { name: 'Гуакамоле', category: 'sauce' },
        { name: 'соусСырный', category: 'sauce' },
    ];

    const handleDishSelect = (dish) => {
        setSelectedDish(dish);
        setShowDishList(false); // Hide dish list after selection
        setResult(null); // Clear previous results
        setSelectedIngredients(new Set()); // Clear selected ingredients
        setShowAllAddedMessage(false); // Reset completion message
    };

    const handleBackToMenu = () => {
        setShowDishList(true); // Show dish list again
        setSelectedDish('');
        setResult(null);
        setSelectedIngredients(new Set());
        setMultiplier(1);
        setShowAllAddedMessage(false); // Reset completion message
    };

    const handlePriceChange = (ingredient, price) => {
        setCustomPrices((prev) => ({ ...prev, [ingredient]: price }));
    };

    const calculateIngredients = () => {
        setIsCalculating(true);
        setButtonClass('button-animate');
        const ingredients = ingredientsData[selectedDish];

        if (!ingredients) {
            alert('Блюдо не выбрано.');
            setIsCalculating(false);
            setButtonClass('');
            return;
        }

        const calculatedIngredients = {};
        let total = 0;

        for (const key in ingredients) {
            const weight = ingredients[key] * multiplier;
            calculatedIngredients[key] = weight;
            total += weight;
        }

        setResult(calculatedIngredients);
        setTotalWeight(total);
        setTimeout(() => {
            setIsCalculating(false);
            setButtonClass('');
        }, 300);
    };

    const calculateTotalCost = () => {
        if (!result) return 0;
        return Object.entries(result).reduce((total, [ingredient, weight]) => {
            const price = customPrices[ingredient] || 0;
            return total + price * weight;
        }, 0);
    };

    const toggleIngredientSelection = (ingredient) => {
        setSelectedIngredients((prev) => {
            const newSelection = new Set(prev);
            if (newSelection.has(ingredient)) {
                newSelection.delete(ingredient);
            } else {
                newSelection.add(ingredient);
            }
            
            // Check if all ingredients are selected after this change
            const totalIngredients = result ? Object.keys(result).length : 0;
            const selectedCount = newSelection.has(ingredient) ? newSelection.size : newSelection.size;
            
            if (selectedCount === totalIngredients && totalIngredients > 0) {
                setShowAllAddedMessage(true);
                // Hide message after 3 seconds
                setTimeout(() => {
                    setShowAllAddedMessage(false);
                }, 3000);
            }
            
            return newSelection;
        });
    };

    return (
        <div className='ingredient-calculator'>
            <div className="header-section">
                <h1>Техкарта заготовок</h1>
                {!showDishList && (
                    <button className="back-button" onClick={handleBackToMenu}>
                        ← Назад к меню
                    </button>
                )}
            </div>

            {/* Completion message */}
            {showAllAddedMessage && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '20px 40px',
                    borderRadius: '10px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    animation: 'fadeInOut 3s ease-in-out'
                }}>
                    Все ингредиенты добавлены!
                </div>
            )}

            {showDishList && (
                <div className='quick-select'>
                    {quickSelectDishes.map(({ name, category }) => (
                        <button
                            key={name}
                            onClick={() => handleDishSelect(name)}
                            className={`dish-category ${category}`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}

            {!showDishList && selectedDish && (
                <div className='input-container'>
                    <div className="selected-dish-display">
                        <span className="dish-name">{selectedDish}</span>
                        <button 
                            className="clear-button" 
                            onClick={handleBackToMenu}
                            title="Очистить выбор"
                        >
                            ×
                        </button>
                    </div>
                    <input
                        type='number'
                        placeholder='Коэффициент'
                        value={multiplier}
                        onChange={(e) => setMultiplier(e.target.value)}
                    />
                    <button
                        onClick={calculateIngredients}
                        className={`${isCalculating ? 'calculating' : ''} ${buttonClass}`}
                    >
                        Рассчитать
                    </button>
                </div>
            )}

            {result && !showDishList && (
                <div className='result-container'>
                    <h2>Результат для: {selectedDish}</h2>
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Ингредиент</th>
                                    <th>Масса (кг)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(result).map(([key, value]) => (
                                    <tr
                                        key={key}
                                        onClick={() => toggleIngredientSelection(key)}
                                        style={{
                                            backgroundColor: selectedIngredients.has(key) ? '#f0f0f0' : 'transparent',
                                            boxShadow: selectedIngredients.has(key) ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <td>{key}</td>
                                        <td>{value.toFixed(5)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h3>Общий вес: {totalWeight.toFixed(3)} кг</h3>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `}</style>
        </div>
    );
};

export default TexKarta;