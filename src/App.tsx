import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RecoverPassword from './pages/RecoverPassword'
import ResetPassword from './pages/ResetPassword'
import AllServicesDraft from "./pages/AllServicesDraft";
import TrainerProfile from './pages/TrainerProfile';
import MyTrainings from './pages/MyTrainings';
import Services from './pages/Services';
import LoginModal from "@/pages/LoginModal";
import {useAuthModal} from "@/context/AuthModalContext";


function App() {
  const { isOpen, closeModal } = useAuthModal();  //para poder ver el estado del modal
  return (
    <> 
    
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/password-recovery" element={<RecoverPassword />} />
      <Route path="/password-reset" element={<ResetPassword />} />
      <Route path="/all-services-draft" element={<AllServicesDraft/>} />
      <Route path="/trainer/:trainerId" element={<TrainerProfile />} />
      <Route path="/mytrainings" element={<MyTrainings/>} />
      <Route path="/trainings" element={<Services/>} />

    </Routes>
    <LoginModal isOpen={isOpen} onClose={closeModal} />

    </>
  )
}
export default App;