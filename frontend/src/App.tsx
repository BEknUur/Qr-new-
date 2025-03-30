
import ResetPasswordForm from './components/ResetPasswordForm';
import RegisterForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';

import HomePage from './components/HomePage';
import Cars from './components/Cars';
import MainDashboard from './components/MainDashboard';
import Locations from './components/Locations';
import About from './components/about';



function App() {
  return (
    <body>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginForm/>}/>
        <Route path='/register' element={<RegisterForm/>}/>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/reset-password' element={<ResetPasswordForm/>}/>
        <Route path='/main/*' element={<MainDashboard/>}/>
        <Route path='/cars/' element={<Cars/>}/>
        <Route path='/locations' element={<Locations/>}/>
        <Route path='/about' element={<About/>}/>
      
     
      </Routes>
      </BrowserRouter>
      
   
    
    </body>
  )
}

export default App
