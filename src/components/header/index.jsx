
import { Link } from 'react-router-dom';
import './header.scss';
import TimerIcon from '@mui/icons-material/Timer';
import { GiChickenOven } from "react-icons/gi";

import { GiTacos } from "react-icons/gi";
const Header = () => {

  

  return (

     
       <div className="header">
         <Link to="/texKarta"> <GiTacos />   Техкарта</Link>
         
            <Link to="/ovoshi">    <TimerIcon />Овощи жареные</Link>
            <Link to="/timer">    <TimerIcon />Фасолеваяпаста</Link>
            <Link to="/Sous">    <TimerIcon />Соус</Link>
            <Link to="/Texmyso">   <GiChickenOven />Готовый продук</Link>
         


       </div>
      
   
          
     
           
          

      
  );
};

export default Header;