
import { Link } from 'react-router-dom';
import './header.scss';

const Header = () => {

  

  return (

     
       <div className="header">
         <Link to="/texKarta">Техкарта</Link>
            <Link to="/ovoshi">Овоши</Link>
            <Link to="/timer">фасольвойпаста</Link>

       </div>
      
   
          
     
           
          

      
  );
};

export default Header;