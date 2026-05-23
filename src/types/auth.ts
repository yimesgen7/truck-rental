export type UserRole = "USER" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
};
