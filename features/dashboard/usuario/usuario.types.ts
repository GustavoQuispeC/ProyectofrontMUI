export interface RegistrarUsuario {
  roleId: string;
  password: string;
}

export interface ActualizarUsuarioPayload {
  roleIds: string[];
  isActive: boolean;
}

export interface ListarUsuarios {
  id?: number;
  usuarioId?: number;
  userId?: string;
  numeroDocumento: string;
  email: string;
  isActive: boolean;
  roles: string[];
  nombreEmpleado: null | string;
}
