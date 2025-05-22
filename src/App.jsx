

import { Route, Routes } from 'react-router-dom'
import TexKarta from './components/texKarta/taxKarta'
import './style/App.scss'
import Header from './components/header'
import Timer_ovoshi from './components/ovoshi/index.jsx'
import Timer from './components/fPasta/fTaimer.jsx'
import SousTimer from './components/sous/idex.jsx'

import TexCard from './components/texKarta/texCard.jsx'

function App() {
  return (
 <div className="div">
  <Header/>
  <Routes>

    <Route path="/texKarta" element={<TexKarta />} />
    <Route path="/ovoshi" element={<Timer_ovoshi/>} />
    <Route path="/timer" element={<Timer/>} />
    <Route path="/Sous" element={<SousTimer />} />
    <Route path="/texCard" element={<TexCard />} />
    
   
    

  </Routes>


 </div>
  )}
export default App