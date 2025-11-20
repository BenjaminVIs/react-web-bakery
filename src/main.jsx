import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Tu semilla de admins
import { seedAdmins } from './lib/seedAdmins.js'

// Listener de sesión para manejar JWT y usuario global
import { supabase } from "./lib/supabaseClient";
import { useAuthStore } from "./stores/useAuthStore";

// SE EJECUTA UNA VEZ PARA CAPTURAR SESIÓN Y PERSISTENCIA
supabase.auth.onAuthStateChange((event, session) => {
  const setUser = useAuthStore.getState().setUser;
  setUser(session?.user || null);
});

// Sembrar admins si no existen
seedAdmins();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
