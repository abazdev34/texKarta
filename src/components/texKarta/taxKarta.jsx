import { useState } from 'react';
import { ingredientsData } from './index.jsx';

const TexKarta = () => {
    const [selectedDish, setSelectedDish] = useState('');
    const [result, setResult] = useState(null);
    const [totalWeight, setTotalWeight] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [isCalculating, setIsCalculating] = useState(false);
    const [customPrices, setCustomPrices] = useState({}); // State for custom prices

    const quickSelectDishes = [
			'ЧикенСлайдер',
        'курицаМ',
        'полировка',
        'специКурица',
        'курицаМаринад',
        'рисЗапровка',
        'фаршМариновый',
        'специФарш',
        'соусТако',
        'пико',
        'фасоловаяПаста',
        'фасалВаренный',
        'овошиЖарыных',
        'Гуакамоле'
    ];

    const handleDishSelect = (dish) => {
        setSelectedDish(dish);
    };

    const handlePriceChange = (ingredient, price) => {
        setCustomPrices(prev => ({ ...prev, [ingredient]: price }));
    };

    const calculateIngredients = () => {
        setIsCalculating(true);
        const ingredients = ingredientsData[selectedDish];

        if (!ingredients) {
            alert('Тамак тандалган жок.');
            setIsCalculating(false);
            return;
        }

        const calculatedIngredients = {};
        let total = 0;

        // Check if the selected dish is Guacamole
        if (selectedDish === 'Гуакамоле') {
            calculatedIngredients['авокадо'] = 200; // Set avocado to 200
            total += 200; // Update total weight
        }

        for (const key in ingredients) {
            const weight = ingredients[key] * multiplier;
            calculatedIngredients[key] = weight;
            total += weight;
        }

        setResult(calculatedIngredients);
        setTotalWeight(total);
        setTimeout(() => setIsCalculating(false), 300);
    };

    const calculateTotalCost = () => {
        if (!result) return 0;
        return Object.entries(result).reduce((total, [ingredient, weight]) => {
            const price = customPrices[ingredient] || 0; // Get custom price or default to 0
            return total + (price * weight);
        }, 0);
    };

    return (
        <div className='ingredient-calculator'>
            <h1>Техкарта заготовок</h1>
            <div className='quick-select'>
                {quickSelectDishes.map((dish) => (
                    <button
                        key={dish}
                        onClick={() => handleDishSelect(dish)}
                        className={selectedDish === dish ? 'active' : ''}
                    >
                        {dish}
                    </button>
                ))}
            </div>

            <div className='input-container'>
                <input
                    type='number'
                    placeholder='Кобоюткуч'
                    value={multiplier}
                    onChange={(e) => setMultiplier(e.target.value)}
                />
                <button
                    onClick={calculateIngredients}
                    className={isCalculating ? 'calculating' : ''}
                >
                    Эсептөө
                </button>
            </div>

            {result && (
                <div className='result-container'>
                    <h2>Результат:</h2>
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Ингредиент</th>
                                    <th>Масса (кг)</th>
                                    <th>Баасы (сом)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(result).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{value.toFixed(3)}</td>
                                        <td>
                                            <input
                                                type='number'
                                                placeholder='Баасы'
                                                onChange={(e) => handlePriceChange(key, parseFloat(e.target.value))}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h3>Жалпы салмак: {totalWeight.toFixed(3)} кг</h3>
                    <h3>Жалпы баа: {calculateTotalCost().toFixed(2)} сом</h3>
                </div>
            )}
        </div>
    );
};

export default TexKarta;