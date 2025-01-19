import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import './header.scss';

const Header = () => {
  return (
    <div className="header">

  
        <IconButton component={Link} to="/texKarta">
 
        Техкарта 
      </IconButton>
      
     
      
      <IconButton component={Link} to="/ovoshi">
        <TimerIcon />
       Овощей 
      </IconButton>
      
      <IconButton component={Link} to="/timer">
        <TimerIcon />
        фасолевойпаста
      </IconButton>
    </div>
  );
};

export default Header;