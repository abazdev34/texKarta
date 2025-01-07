

import { Route, Routes } from 'react-router-dom'
import TexKarta from './components/texKarta/taxKarta'
import './style/App.scss'
import Header from './components/header'
import Timer_ovoshi from './components/ovoshi/index.jsx'

function App() {
  return (
 <div className="div">
  <Header/>
  <Routes>

    <Route path="/texKarta" element={<TexKarta />} />
    <Route path="/ovoshi" element={<Timer_ovoshi/>} />
  </Routes>


 </div>
  )}
export default App