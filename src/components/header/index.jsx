import { Link } from 'react-router-dom';
import './header.scss';
import TimerIcon from '@mui/icons-material/Timer';
import { GiChickenOven, GiTacos } from "react-icons/gi";
import { useEffect, useState } from 'react';

const Header = () => {
  const [isLaptop, setIsLaptop] = useState(window.innerWidth >= 1024); // Ноутбук өлшемі

  useEffect(() => {
    const handleResize = () => {
      setIsLaptop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="header">
      <Link to="/texKarta"><GiTacos /> Техкарта</Link>
      <Link to="/ovoshi"><TimerIcon /> Овощи жареные</Link>
      <Link to="/timer"><TimerIcon /> Фасолевая паста</Link>
      <Link to="/Sous"><TimerIcon /> Соус</Link>
      {isLaptop && (
        <Link to="/Texmyso"><GiChickenOven /> Готовый продук</Link>
      )}
    </div>
  );
};

export default Header;