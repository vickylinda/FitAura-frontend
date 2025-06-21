import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RecoverPassword from './pages/RecoverPassword'
import ResetPassword from './pages/ResetPassword'
import TrainerProfile from './pages/TrainerProfile';
import MyTrainings from './pages/MyTrainings';
import Services from './pages/Services';
import LoginModal from "@/pages/LoginModal";
import MyAccount from './pages/MyAccount'
import {useAuthModal} from "@/context/AuthModalContext";
import BookingSection from './components/Booking'
import TrainerPortal from './pages/TrainerPortal'
import CreateService from './pages/CreateService'
import Booking from './pages/Booking'


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
      <Route path="/trainer/:trainerId" element={<TrainerProfile />} />
      <Route path="/mytrainings" element={<MyTrainings/>} />
      <Route path="/trainings" element={<Services/>} />
      <Route path="/my-account" element ={<MyAccount/>} />
      <Route path="/booktraining" element={<BookingSection pricePerClass={15} trainerName={''} trainerRating={0} trainerAvatar={''}/>} />
      <Route path="trainersportal" element={<TrainerPortal />} />
      <Route path="create-service" element={<CreateService/>} />
      <Route path="booking/:serviceId" element={<Booking/>} />

    </Routes>
    <LoginModal isOpen={isOpen} onClose={closeModal} />

    </>
  )
}
export default App;