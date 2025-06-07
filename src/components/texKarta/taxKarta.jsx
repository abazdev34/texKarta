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
    };

    const handleBackToMenu = () => {
        setShowDishList(true); // Show dish list again
        setSelectedDish('');
        setResult(null);
        setSelectedIngredients(new Set());
        setMultiplier(1);
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
                                            backgroundColor: selectedIngredients.has(key) ? 'red' : 'transparent',
                                            cursor: 'pointer'
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
        </div>
    );
};

export default TexKarta;