
import { Link } from 'react-router-dom';
import './header.scss';
import TimerIcon from '@mui/icons-material/Timer';
const Header = () => {

  

  return (

     
       <div className="header">
         <Link to="/texKarta">    Техкарта</Link>
         
            <Link to="/ovoshi">    <TimerIcon />Овощи жареные</Link>
            <Link to="/timer">    <TimerIcon />Фасолеваяпаста</Link>


       </div>
      
   
          
     
           
          

      
  );
};

export default Header;