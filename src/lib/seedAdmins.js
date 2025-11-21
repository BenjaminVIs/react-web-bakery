import { supabase } from "./supabaseClient";

export async function seedAdmins() {
  const admins = [
    {
      email: "benja.admin@gmail.com",
      password: "benja123",
      name: "Benjamín Admin"
    },
    {
      email: "dario.admin@gmail.com",
      password: "dario123",
      name: "Darío Admin"
    }
  ];

  for (const admin of admins) {
    console.log(`Verificando admin: ${admin.email}`);

    try {
      // Intenta registrar (solo crea si no existe)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
      });

      if (signUpError) {
        // Si ya existe, intenta obtener el usuario logueándose
        if (signUpError.message.toLowerCase().includes('already registered') || 
            signUpError.message.toLowerCase().includes('already exists')) {
          console.log(`Admin ${admin.email} ya existe en auth ✔️`);
          
          // Verifica si tiene perfil
          const { data: profiles } = await supabase
            .from('user_profile')
            .select('user_id')
            .eq('display_name', admin.name)
            .limit(1);
          
          if (profiles && profiles.length > 0) {
            console.log(`Perfil de ${admin.email} ya existe ✔️`);
            continue;
          }
        } else {
          console.error(`Error creando auth para ${admin.email}:`, signUpError);
          continue;
        }
      } else if (signUpData?.user?.id) {
        console.log(`Auth creado para ${admin.email} ✔️`);
        
        // Crear perfil admin
        const { error: profileError } = await supabase
          .from('user_profile')
          .upsert({
            user_id: signUpData.user.id,
            display_name: admin.name,
            role: 'admin'
          }, { onConflict: 'user_id' });

        if (profileError) {
          console.error(`Error creando perfil para ${admin.email}:`, profileError);
        } else {
          console.log(`Perfil admin creado para ${admin.email} ✔️`);
        }
      }
    } catch (err) {
      console.error(`Error procesando ${admin.email}:`, err);
    }
  }
}
