import { Route, Routes, useParams } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RecoverPassword from './pages/RecoverPassword'
import ResetPassword from './pages/ResetPassword'
import AllServicesDraft from "./pages/AllServicesDraft";
import TrainerProfile from './pages/TrainerProfile';
import MyTrainings from './pages/MyTrainings'
import Services from './pages/Services'
import BookingSection from './components/Booking'
import TrainerPortal from './pages/TrainerPortal'
import CreateService from './pages/CreateService'
import ModifyService from './pages/ModifyService'
import ServiceAction from './pages/ServiceAction'
import type { Accion } from './pages/ServiceAction';

function ServiceActionWrapper() {
  const { accion } = useParams();
  // Replace 'defaultAccion' with a valid Accion value from your type
  return <ServiceAction accion={(accion as Accion) ?? 'modificar'} />;
}

function App() {
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
      <Route path="/trainer-profile" element={<TrainerProfile/>} />
      <Route path="/mytrainings" element={<MyTrainings/>} />
      <Route path="/trainings" element={<Services/>} />
      <Route path="/booktraining" element={<BookingSection pricePerClass={15} trainerName={''} trainerRating={0} trainerAvatar={''}/>} />
      <Route path="trainersportal" element={<TrainerPortal />} />
      <Route path="create-service" element={<CreateService/>} />
      <Route path="modify-service" element={<ModifyService/>} />
      <Route path="select/:accion" element={<ServiceActionWrapper />} />
    </Routes>
    </>
  )
}
export default App;