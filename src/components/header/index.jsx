
import { Link } from 'react-router-dom';
import './header.scss';
import TimerIcon from '@mui/icons-material/Timer';
const Header = () => {

  

  return (

     
       <div className="header">
         <Link to="/texKarta">    Техкарта</Link>
         
            <Link to="/ovoshi">    <TimerIcon />Овощи Жареные</Link>
            <Link to="/timer">    <TimerIcon />фасолеваяпаста</Link>


       </div>
      
   
          
     
           
          

      
  );
};

export default Header;