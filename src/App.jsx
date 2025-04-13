

import { Route, Routes } from 'react-router-dom'
import TexKarta from './components/texKarta/taxKarta'
import './style/App.scss'
import Header from './components/header'
import Timer_ovoshi from './components/ovoshi/index.jsx'
import Timer from './components/fPasta/fTaimer.jsx'
import SousTimer from './components/sous/idex.jsx'

function App() {
  return (
 <div className="div">
  <Header/>
  <Routes>

    <Route path="/texKarta" element={<TexKarta />} />
    <Route path="/ovoshi" element={<Timer_ovoshi/>} />
    <Route path="/timer" element={<Timer/>} />
    <Route path="/Sous" element={<SousTimer />} />
   
    

  </Routes>


 </div>
  )}
export default App