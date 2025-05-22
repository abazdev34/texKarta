import { useState } from 'react';
import { ingredientsData, pracs } from './data.js'; // Import your data
import './texkarta.scss'; // Import SCSS file

const TexCard = () => {
  const [selectedDish, setSelectedDish] = useState('');
  const [result, setResult] = useState(null);
  const [totalWeight, setTotalWeight] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [buttonClass, setButtonClass] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState(new Set());
  const [showProducts, setShowProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  const quickSelectDishes = [
    { name: 'КурицаМаринат', category: 'main-dish' },
    { name: 'ФаршМаринат', category: 'main-dish' },
    { name: 'ПикоДеГайо', category: 'main-dish' },
    { name: 'Фасолеваяпаста', category: 'sauce' },
    { name: 'Гуакамоле', category: 'sauce' },
    { name: 'СоусЧипотле', category: 'sauce' },
    { name: 'СоусТако', category: 'sauce' },
    { name: 'СоусСырныйTL', category: 'main-dish' },
    { name: 'ОвошиЖаренные', category: 'main-dish' },
    { name: 'СпециДляКурицы', category: 'side' }, 
    { name: 'СпециДляФарши', category: 'side' },
    { name: 'ДляСоусаЧипотле', category: 'side' },
      { name: 'фасалВаренный', category: 'side' },
  ];

  const handleDishSelect = (dish) => {
    setSelectedDish(dish);
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
    }, 0);
  };

  const calculateTotalCost = () => {
    if (!result) return 0;
    return Object.entries(result).reduce((total, [ingredient, weight]) => {
      const price = pracs[ingredient] || 0; // Get price from pracs
      return total + price * weight; // Calculate total cost
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

  const totalCost = calculateTotalCost(); // Calculate total cost

  // Toggle product list visibility
  const toggleProductList = () => {
    setShowProducts((prev) => !prev);
  };

  // Add new product
  const addProduct = () => {
    if (newProduct.name && newProduct.price) {
      pracs[newProduct.name] = parseFloat(newProduct.price);
      setNewProduct({ name: '', price: '' });
    }
  };

  // Remove product
  const removeProduct = (productName) => {
    delete pracs[productName];
  };

  // Start editing a product
  const startEditingProduct = (productName) => {
    setEditingProduct(productName);
    setNewProduct({ name: productName, price: pracs[productName] });
  };

  // Save edited product
  const saveEditedProduct = () => {
    if (editingProduct && newProduct.price) {
      pracs[editingProduct] = parseFloat(newProduct.price);
      setEditingProduct(null);
      setNewProduct({ name: '', price: '' });
    }
  };

  return (
    <div className='ingredient-calculator'>
      <h1>Техкарта заготовок</h1>
      <div className='quick-select'>
        {quickSelectDishes.map(({ name, category }) => (
          <button
            key={name}
            onClick={() => handleDishSelect(name)}
            className={`dish-category ${category} ${selectedDish === name ? 'active' : ''}`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className='input-container'>
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

      {result && (
        <div className='result-container'>
          <h2>Результат:</h2>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Ингредиент</th>
                  <th>Масса (кг)</th>
                  <th>Цена (за кг)</th>
                  <th>Общая цена</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result).map(([key, value]) => (
                  <tr
                    key={key}
                    onClick={() => toggleIngredientSelection(key)}
                    style={{
                      backgroundColor: selectedIngredients.has(key) ? 'red' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <td>{key}</td>
                    <td>{value.toFixed(5)}</td>
                    <td>{pracs[key] ? `${pracs[key]} ` : 'N/A'}</td>
                    <td>{(pracs[key] * value).toFixed(2)} р</td> {/* Calculate total price */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='total-cost'>
            <h3>Общая стоимость: {totalCost.toFixed(2)} рубиль</h3>
          </div>
        </div>
      )}

      {/* Button to show/hide product list */}
      <button onClick={toggleProductList} className='show-products-button'>
        {showProducts ? 'Скрыть продукты' : 'Показать продукты'}
      </button>

      {showProducts && (
        <div className='product-list'>
          <h2>Список продуктов:</h2>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Название продукта</th>
                  <th>Цена </th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(pracs).map(([productName, price]) => (
                  <tr key={productName}>
                    <td>{productName}</td>
                    <td>{price}</td>
                    <td>
                      <button onClick={() => startEditingProduct(productName)}>Изменить</button>
                      <button onClick={() => removeProduct(productName)}>Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='add-product'>
            <h3>Добавить новый продукт:</h3>
            <input
              type='text'
              placeholder='Название продукта'
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type='number'
              placeholder='Цена'
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <button onClick={addProduct}>Добавить</button>
          </div>
          {editingProduct && (
            <div className='edit-product'>
              <h3>Изменить продукт:</h3>
              <input
                type='text'
                value={newProduct.name}
                readOnly
              />
              <input
                type='number'
                placeholder='Новая цена'
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <button onClick={saveEditedProduct}>Сохранить</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TexCard;