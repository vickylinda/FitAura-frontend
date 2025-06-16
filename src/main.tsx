import { createRoot } from 'react-dom/client'
import { Provider } from "@/components/ui/provider"
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const clientId = "397376705718-n6q8v94hb24kr8on6ld7mmvdnmivv2kn.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Provider>
          <AuthProvider>
          <App />
          <Toaster />
          </AuthProvider>
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)
