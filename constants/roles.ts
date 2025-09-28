export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  USER: 'user',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_PATHS = {
  [ROLES.SUPER_ADMIN]: '/admin/dashboard',
  [ROLES.USER]: '/',
} as const;

export const isRoleValid = (role: string): role is Role => {
  return Object.values(ROLES).includes(role as Role);
};
