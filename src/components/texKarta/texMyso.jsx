import React, { useState, useEffect } from 'react';
import { ChevronLeft, Package, Truck, Calculator, Save, Plus, Minus, AlertCircle } from 'lucide-react';

// Ingredients data from your files
const ingredientsData = {
  КурицаМаринад: {
    масло: 0.02,
    СпециДляКурицы: 0.02,
    курица_филе: 1,
  },
  ПикоДеГайо: {
    лук: 0.138,
    ПерецКрасныйБолгарский: 0.277,
    помидор: 0.503,
    чеснокОчищиный: 0.0188,
    петурушка: 0.0188,
    кинза: 0.0188,
    халопеньно: 0.0628,
  },
  полировка: {
    мука: 1,
    специКурица: 0.3,
    сухарики: 0.3,
    кортофельКрахмал: 0.25,
  },
  ОвощиЖареные: {
    ПерецКрасныйБолгарский: 1.375,
    лук: 0.246,
    масло: 0.03,
    СпециДляКурицы: 0.013,
  },
  СоусТако: {
    майонез: 0.834,
    вода: 0.15249,
    чеснокмолотый: 0.00135,
    перецЧерный: 0.00135,
    оригана: 0.00179,
  },
  Гуакамоле: {
    авокадо: 1.5,
    ПерецКрасныйБолгарский: 0.025,
    халопеньноСвежий: 0.025,
    лук: 0.050,
    перецЧерный: 0.0017,
    соль: 0.010,
    Лимон: 0.017,
  },
  СпециДляКурицы: {
    чеснокмолотый: 0.082,
    кумин: 0.164,
    соль: 0.328,
    перецЧерный: 0.074,
    перецКрасныйЧили: 0.123,
    куриныйбулон: 0.164,
    оригана: 0.066,
  },
  ФаршМаринат: {
    фарш: 0.8399,
    СпециДляФарши: 0.025,
    томатыПаста: 0.084,
    лук: 0.055,
  },
};

const WarehouseSystem = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedDish, setSelectedDish] = useState('');
  const [targetWeight, setTargetWeight] = useState(10);
  const [calculation, setCalculation] = useState(null);
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : {};
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem('deliveries');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const dishes = Object.keys(ingredientsData);

  const calculateIngredients = () => {
    const recipe = ingredientsData[selectedDish];
    if (!recipe) return;

    const needed = {};
    const remaining = {};
    
    // Calculate needed ingredients
    Object.entries(recipe).forEach(([ingredient, ratio]) => {
      needed[ingredient] = (ratio * targetWeight).toFixed(3);
    });

    // Calculate remaining inventory after production
    Object.entries(needed).forEach(([ingredient, amount]) => {
      const currentStock = inventory[ingredient] || 0;
      const afterProduction = currentStock - parseFloat(amount);
      remaining[ingredient] = Math.max(0, afterProduction).toFixed(3);
    });

    setCalculation({
      dish: selectedDish,
      targetWeight,
      needed,
      remaining,
      timestamp: new Date().toLocaleString('ky-KG')
    });
  };

  const saveCalculation = () => {
    if (!calculation) return;

    // Update inventory
    const newInventory = { ...inventory };
    Object.entries(calculation.needed).forEach(([ingredient, amount]) => {
      const currentStock = newInventory[ingredient] || 0;
      newInventory[ingredient] = Math.max(0, currentStock - parseFloat(amount));
    });
    setInventory(newInventory);

    // Add to orders history
    const newOrder = {
      id: Date.now(),
      ...calculation,
      status: 'completed'
    };
    setOrders([newOrder, ...orders]);

    alert('Заготовка сакталды!');
    setCalculation(null);
  };

  const addDelivery = (ingredient, amount) => {
    const newInventory = { ...inventory };
    newInventory[ingredient] = (newInventory[ingredient] || 0) + parseFloat(amount);
    setInventory(newInventory);

    const newDelivery = {
      id: Date.now(),
      ingredient,
      amount: parseFloat(amount),
      timestamp: new Date().toLocaleString('ky-KG'),
      type: 'поставка'
    };
    setDeliveries([newDelivery, ...deliveries]);
  };

  const MenuView = () => (
    <div className="menu-container">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Склад Башкаруу Системасы</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => setCurrentView('production')}
          className="menu-card bg-blue-500 hover:bg-blue-600"
        >
          <Calculator className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Заготовка</h3>
          <p className="text-sm opacity-90">Техкарта боюнча эсептөө</p>
        </button>
        
        <button
          onClick={() => setCurrentView('delivery')}
          className="menu-card bg-green-500 hover:bg-green-600"
        >
          <Truck className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Поставка</h3>
          <p className="text-sm opacity-90">Жаңы товар кабыл алуу</p>
        </button>
        
        <button
          onClick={() => setCurrentView('inventory')}
          className="menu-card bg-purple-500 hover:bg-purple-600"
        >
          <Package className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Калдык</h3>
          <p className="text-sm opacity-90">Склад абалы</p>
        </button>
        
        <button
          onClick={() => setCurrentView('history')}
          className="menu-card bg-orange-500 hover:bg-orange-600"
        >
          <Save className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Тарых</h3>
          <p className="text-sm opacity-90">Заготовкалар тарыхы</p>
        </button>
      </div>
    </div>
  );

  const ProductionView = () => (
    <div className="production-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Заготовка эсептөө</h2>
        <button
          onClick={() => setCurrentView('menu')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <ChevronLeft className="w-4 h-4" />
          Артка
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тамак тандаңыз</label>
            <select
              value={selectedDish}
              onChange={(e) => setSelectedDish(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Тандаңыз...</option>
              {dishes.map(dish => (
                <option key={dish} value={dish}>{dish}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Салмак (кг)</label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={calculateIngredients}
              disabled={!selectedDish || !targetWeight}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              Эсептөө
            </button>
          </div>
        </div>
      </div>

      {calculation && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {calculation.dish} - {calculation.targetWeight} кг
            </h3>
            <button
              onClick={saveCalculation}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Save className="w-4 h-4" />
              Сактоо
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ингредиент</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Керек (кг)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Бар (кг)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Калат (кг)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Статус</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(calculation.needed).map(([ingredient, needed]) => {
                  const available = inventory[ingredient] || 0;
                  const remaining = calculation.remaining[ingredient];
                  const hasEnough = available >= parseFloat(needed);
                  
                  return (
                    <tr key={ingredient} className={hasEnough ? 'bg-green-50' : 'bg-red-50'}>
                      <td className="px-4 py-2 text-sm text-gray-900">{ingredient}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{needed}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{available.toFixed(3)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{remaining}</td>
                      <td className="px-4 py-2 text-sm">
                        {hasEnough ? (
                          <span className="text-green-600 font-medium">✓ Жетет</span>
                        ) : (
                          <span className="text-red-600 font-medium">✗ Жетпейт</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const DeliveryView = () => {
    const [newIngredient, setNewIngredient] = useState('');
    const [newAmount, setNewAmount] = useState('');

    const handleAddDelivery = () => {
      if (newIngredient && newAmount) {
        addDelivery(newIngredient, newAmount);
        setNewIngredient('');
        setNewAmount('');
      }
    };

    return (
      <div className="delivery-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Поставка</h2>
          <button
            onClick={() => setCurrentView('menu')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
            Артка
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Жаңы товар кошуу</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ингредиент</label>
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="курица_филе"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Салмак (кг)</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="100"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleAddDelivery}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Кошуу
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Поставка тарыхы</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Убакыт</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ингредиент</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Салмак (кг)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Түр</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.slice(0, 10).map(delivery => (
                  <tr key={delivery.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{delivery.timestamp}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{delivery.ingredient}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{delivery.amount}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {delivery.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const InventoryView = () => (
    <div className="inventory-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Склад калдыгы</h2>
        <button
          onClick={() => setCurrentView('menu')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <ChevronLeft className="w-4 h-4" />
          Артка
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ингредиент</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Калдык (кг)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Статус</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(inventory).map(([ingredient, amount]) => (
                <tr key={ingredient} className={amount < 5 ? 'bg-red-50' : 'bg-white'}>
                  <td className="px-4 py-2 text-sm text-gray-900">{ingredient}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{amount.toFixed(3)}</td>
                  <td className="px-4 py-2 text-sm">
                    {amount < 5 ? (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        Аз калган
                      </span>
                    ) : amount < 20 ? (
                      <span className="text-yellow-600">Орточо</span>
                    ) : (
                      <span className="text-green-600">Жакшы</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const HistoryView = () => (
    <div className="history-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Заготовка тарыхы</h2>
        <button
          onClick={() => setCurrentView('menu')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <ChevronLeft className="w-4 h-4" />
          Артка
        </button>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {order.dish} - {order.targetWeight} кг
              </h3>
              <span className="text-sm text-gray-500">{order.timestamp}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(order.needed).map(([ingredient, amount]) => (
                <div key={ingredient} className="text-sm">
                  <span className="font-medium text-gray-700">{ingredient}:</span>
                  <span className="ml-1 text-gray-600">{amount} кг</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'production': return <ProductionView />;
      case 'delivery': return <DeliveryView />;
      case 'inventory': return <InventoryView />;
      case 'history': return <HistoryView />;
      default: return <MenuView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {renderCurrentView()}
      </div>
      
      <style jsx>{`
        .menu-card {
          @apply text-white p-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-center;
        }
        
        .menu-container {
          @apply p-8;
        }
        
        .production-container,
        .delivery-container,
        .inventory-container,
        .history-container {
          @apply p-6;
        }
      `}</style>
    </div>
  );
};

export default WarehouseSystem;