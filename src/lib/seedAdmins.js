import { supabase } from "./supabaseClient";

export async function seedAdmins() {
  const admins = [
    {
      email: "benja.admin@gmail.com",
      password: "benja123",
    },
  ];

  for (const admin of admins) {
    console.log(`Verificando admin: ${admin.email}`);

    // revisa si existe
    const { data: existingUser, error: checkError } =
      await supabase.auth.admin.listUsers();

    if (checkError) {
      console.error("Error al revisar usuarios:", checkError);
      continue;
    }

    const userExists = existingUser.users.some(
      (u) => u.email === admin.email
    );

    if (userExists) {
      console.log(`Admin ${admin.email} ya existe. ✔️`);
      continue;
    }

    // si no existe → lo crea
    const { data, error } = await supabase.auth.admin.createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true,
    });

    if (error) {
      console.error(`Error creando admin ${admin.email}:`, error);
    } else {
      console.log(`Admin creado: ${admin.email} ✔️`);
    }
  }
}
