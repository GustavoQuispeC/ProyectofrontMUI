import { z } from "zod";

export const UsuarioSchema = z.object({
  empleadoId: z.string().min(1, "Seleccione un empleado"),
  nombreCompleto: z.string().min(1, "Seleccione un empleado"),
  rolId: z.string().min(1, "Seleccione un rol"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial"),
});

export type UsuarioForm = z.infer<typeof UsuarioSchema>;

export const ActualizarUsuarioSchema = z.object({
  empleadoId: z.string().min(1, "Seleccione un empleado"),
  nombreCompleto: z.string().min(1, "Seleccione un empleado"),
  isActive: z.boolean(),
  rolId: z.string().min(1, "Seleccione un rol"),
});

export type ActualizarUsuarioForm = z.infer<typeof ActualizarUsuarioSchema>;
