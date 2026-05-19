export const hasPermission = (rol: string, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(rol);
};
