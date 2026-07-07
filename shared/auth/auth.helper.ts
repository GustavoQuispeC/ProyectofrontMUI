export const hasPermission = (rol: string | undefined | null, allowedRoles: string[]): boolean => {
  if (!rol || !allowedRoles) return false;
  return allowedRoles.includes(rol);
};
