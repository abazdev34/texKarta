
import { Link } from 'react-router-dom';
import './header.scss';
import TimerIcon from '@mui/icons-material/Timer';
import { GiTacos } from "react-icons/gi";
const Header = () => {

  

  return (

     
       <div className="header">
         <Link to="/texKarta"> <GiTacos />   Техкарта</Link>
         
            <Link to="/ovoshi">    <TimerIcon />Овощи жареные</Link>
            <Link to="/timer">    <TimerIcon />Фасолеваяпаста</Link>
            <Link to="/Sous">    <TimerIcon />Соус</Link>
         


       </div>
      
   
          
     
           
          

      
  );
};

export default Header;