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
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllAddedMessage, setShowAllAddedMessage] = useState(false); // New state for completion message
  const [showDishList, setShowDishList] = useState(true); // New state to control dish list visibility

  const quickSelectDishes = [
    { name: 'КурицаМаринат', category: 'main-dish' },
    { name: 'ФаршМаринат', category: 'main-dish' },
    { name: 'ПикоДеГайо', category: 'main-dish' },
    { name: 'Фасолевая паста', category: 'sauce' },
    { name: 'Гуакамоле', category: 'sauce' },
    { name: 'СоусЧипотле', category: 'sauce' },
    { name: 'СоусТако', category: 'sauce' },
    { name: 'СоусСырныйTL', category: 'main-dish' },
    { name: 'ОвощиЖареные', category: 'main-dish' },
    { name: 'СпецииДляКурицы', category: 'side' }, 
    { name: 'СпецииДляФарша', category: 'side' },
    { name: 'ДляСоусаЧипотле', category: 'side' },
    { name: 'ФасольВареная', category: 'side' },
    { name: 'ЧикенСлайдер', category: 'side' },
  ];

  const handleDishSelect = (dish) => {
    setSelectedDish(dish);
    setShowDishList(false); // Hide dish list after selection
    setSelectedIngredients(new Set()); // Clear selected ingredients when new dish is selected
    setShowAllAddedMessage(false); // Reset completion message
    setResult(null); // Clear previous results
  };

  const handleBackToMenu = () => {
    setShowDishList(true); // Show dish list again
    setSelectedDish('');
    setResult(null);
    setSelectedIngredients(new Set());
    setMultiplier(1);
    setShowAllAddedMessage(false); // Reset completion message
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
    setSelectedIngredients(new Set()); // Clear selected ingredients on new calculation
    setShowAllAddedMessage(false); // Reset completion message
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

  // Filter products based on search term
  const filteredProducts = Object.entries(pracs).filter(([productName]) =>
    productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='ingredient-calculator'>
      <div className="header-section">
        <h1>Техническая карта заготовок</h1>
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
                      backgroundColor: selectedIngredients.has(key) ? '#f0f0f0' : 'transparent',
                      boxShadow: selectedIngredients.has(key) ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
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
            <h3>Общая стоимость: {totalCost.toFixed(2)} рублей</h3>
          </div>
        </div>
      )}

      {/* Button to show/hide product list */}
      {!showDishList && (
        <button onClick={toggleProductList} className='show-products-button'>
          {showProducts ? 'Скрыть продукты' : 'Показать продукты'}
        </button>
      )}

      {showProducts && (
        <div className='product-list'>
          <h2>Список продуктов:</h2>
          <input
            type='text'
            placeholder='Поиск продукта'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
          />
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Название продукта</th>
                  <th>Цена</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(([productName, price]) => (
                  <tr key={productName}>
                    <td className='product-name'>{productName}</td>
                    <td className='product-price'>{price}</td>
                    <td>
                      <div className='action-buttons'>
                        <button className='edit-button' onClick={() => startEditingProduct(productName)}>Изменить</button>
                        <button className='delete-button' onClick={() => removeProduct(productName)}>Удалить</button>
                      </div>
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

      <style jsx>{`
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .back-button {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .back-button:hover {
          background: #5a6268;
        }
        
        .selected-dish-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f9fa;
          padding: 10px 15px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        
        .dish-name {
          font-weight: bold;
          color: #495057;
        }
        
        .clear-button {
          background: #dc3545;
          color: white;
          border: none;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .clear-button:hover {
          background: #c82333;
        }
        
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

export default TexCard;