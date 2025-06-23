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
import CreateService from './pages/CreateService'
import Booking from './pages/Booking'
import EditService from './pages/ModifyService';
import ChooseServiceToModify from './pages/ChooseServiceToModify'
import ChooseServiceToPublish from './pages/ChooseServiceToPublish'
import ChooseServiceToUnpublish from './pages/ChooseServiceToUnpublish'
import ChooseServiceToDelete from './pages/ChooseServiceToDelete'
import RateTraining from './pages/RateTraining'
import ManageClass from './pages/ManageClass'
import AttachmentsPage from './pages/AttachmentsPage'
function App() {
  const { isOpen, closeModal } = useAuthModal();  
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
      <Route path="create-service" element={<CreateService/>} />
      <Route path="booking/:serviceId" element={<Booking/>} />
      <Route path="/edit-service/:serviceId" element={<EditService />} />
      <Route path="/edit-service" element={<ChooseServiceToModify />} />
      <Route path="/publish-service" element={<ChooseServiceToPublish />} />
      <Route path="/unpublish-service" element={<ChooseServiceToUnpublish />} />
      <Route path="/delete-service" element={<ChooseServiceToDelete />} />
      <Route path="/training/:trainingId/rate" element={<RateTraining />} />
      <Route path="/manage-class/:serviceId" element={<ManageClass />} />
      <Route path="/training/:trainingId/attachments" element={<AttachmentsPage />} /> 


    </Routes>
    <LoginModal isOpen={isOpen} onClose={closeModal} />


    </>
  )
}
export default App;