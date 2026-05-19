import { ROLES } from "./uth.constants";

export const permissions = {
  //Usuario
  registrarUsuarios: [ROLES.SUPER_ADMIN, ROLES.GERENTE, ROLES.ADMINISTRADOR],
  listarUsuarios: [ROLES.SUPER_ADMIN, ROLES.GERENTE, ROLES.SUPERVISOR],

  //Empleado
  registrarEmpleado: [ROLES.SUPER_ADMIN, ROLES.GERENTE, ROLES.ADMINISTRADOR],
  listarEmpleados: [ROLES.SUPER_ADMIN, ROLES.GERENTE, ROLES.SUPERVISOR],
  detalleEmpleado: [ROLES.SUPER_ADMIN, ROLES.GERENTE, ROLES.SUPERVISOR],
  eliminarEmpleado: [ROLES.SUPER_ADMIN, ROLES.GERENTE],
};
