import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RecoverPassword from './pages/RecoverPassword'
import ResetPassword from './pages/ResetPassword'
import AllServicesDraft from "./pages/AllServicesDraft";
import Header from './components/Header';
import TrainerProfile from './pages/TrainerProfile';

function App() {
  return (
    <>
      <Header /> 
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password-recovery" element={<RecoverPassword />} />
      <Route path="/password-reset" element={<ResetPassword />} />
      <Route path="/all-services-draft" element={<AllServicesDraft/>} />
      <Route path="/trainer-profile" element={<TrainerProfile/>} />

    </Routes>
    </>
  )
}
export default App;