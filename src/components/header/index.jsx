import { Link } from 'react-router-dom';
import './header.scss';
import TimerIcon from '@mui/icons-material/Timer';
import { GiChickenOven, GiTacos } from "react-icons/gi";
import { useEffect, useState } from 'react';

const Header = () => {
  const [isLaptop, setIsLaptop] = useState(window.innerWidth >= 324); // Ноутбук өлчөмү
  const [password, setPassword] = useState('');
  const [showProduct, setShowProduct] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLaptop(window.innerWidth >= 324);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '2331') { // Мұнда 'yourPassword' дегенди өз пароліңізбен ауыстырыңыз
      setShowProduct(true);
    } else {
      alert('Неправильный пароль');
    }
  };

  return (
    <div className="header">
      <Link to="/texKarta"><GiTacos /> Техкарта</Link>
      <Link to="/ovoshi"><TimerIcon /> Овощи жареные</Link>
      <Link to="/timer"><TimerIcon /> Фасолевая паста</Link>
      <Link to="/Sous"><TimerIcon /> Соус</Link>
        <Link to="/WarehouseSystem"><TimerIcon /> Склад</Link>
     
      {(isLaptop || showProduct) && (
        <>
          <form onSubmit={handlePasswordSubmit}>
            <input 
              type="password" 
              value={password} 
              onChange={handlePasswordChange} 
              placeholder="доступ только с пароля " 
            />
            <button type="submit">Открыть</button>
          </form>
          {showProduct && (
            <Link to="/TexCard" className="show-cost-button"> Стоимость</Link>
          )}
        </>
      )}
    </div>
  );
};

export default Header;