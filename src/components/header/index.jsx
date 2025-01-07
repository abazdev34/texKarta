import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TexKarta from '../texKarta/taxKarta'
import './header.scss'
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Инвентаризация</h1>
        <nav className="menu">
					<ul>
						<li><Link to="/">Главная</Link></li>
						<li><Link to="/texKarta">Техкарта</Link></li>
						<li><Link to="/ovoshi">Овоши</Link></li>
					</ul>
				</nav>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>

			{isMenuOpen && (
				<nav className="menu">
					<ul>
						<li><Link to="/">Главная</Link></li>
						<li><Link to="/texKarta">Техкарта</Link></li>
						<li><Link to="/ovoshi">Овоши</Link></li>
					</ul>
				</nav>
			)}
     
    </header>
  );
};

export default Header;