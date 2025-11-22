/**
 * Store global de autenticación usando Zustand.
 *
 * ¿Para qué sirve la carpeta `stores/`?
 * - Centraliza estado global reutilizable entre componentes (auth, carrito, etc.).
 * - Evita prop drilling (pasar props profundamente) y duplicar lógica.
 * - Facilita pruebas unitarias aislando la lógica del UI.
 *
 * Este store maneja:
 * - `user`: objeto retornado por Supabase (o null si no hay sesión).
 * - `setUser(user)`: actualiza el usuario tras login / refresh.
 * - `logout()`: cierra sesión vía Supabase y limpia el estado.
 *
 * Persistencia:
 * - Se usa el middleware `persist` para guardar el estado en `localStorage` bajo la clave `auth-storage`.
 * - Al recargar la página, Zustand rehidrata automáticamente el valor.
 * - Si necesitas invalidar manualmente la sesión guardada (por cambios de roles), puedes llamar a `logout()`.
 *
 * Ejemplo de uso en un componente React:
 * ```jsx
 * import { useAuthStore } from '../stores/useAuthStore';
 *
 * function Perfil() {
 *   const user = useAuthStore(s => s.user);
 *   const logout = useAuthStore(s => s.logout);
 *   if (!user) return <button>Ingresar</button>;
 *   return (
 *     <div>
 *       <p>Hola {user.email}</p>
 *       <button onClick={logout}>Cerrar sesión</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * Nota: Supabase ya maneja tokens internamente; este store sólo conserva el objeto usuario
 * para simplificar acceso rápido (email, id, etc.). Para máxima seguridad, puedes escuchar
 * `onAuthStateChange` de Supabase y sincronizar aquí.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabaseClient";

/**
 * @typedef {Object|null} AuthUser
 * @property {string} id UUID del usuario (cuando existe)
 * @property {string} [email] Correo del usuario
 * (El resto de propiedades depende de Supabase y se pueden extender según necesidad)
 */

export const useAuthStore = create(
  persist(
    (set) => ({
      /** @type {AuthUser} Usuario autenticado actual */
      user: null,
      /** Perfil extendido (display_name, role, email). */
      profile: null,
      /**
       * Actualiza el usuario (se usa tras login, signup o refresco de sesión).
       * @param {AuthUser} user
       */
      setUser: (user) => set({ user }),
      /**
       * Setea el perfil extendido asociado al usuario (tabla user_profile + email).
       * @param {{display_name?:string, role?:string, email?:string}} profile
       */
      setProfile: (profile) => set({ profile }),
      /**
       * Cierra sesión en Supabase y limpia el estado local.
       */
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null });
      },
    }),
    {
      name: "auth-storage", // clave en localStorage
    }
  )
);
