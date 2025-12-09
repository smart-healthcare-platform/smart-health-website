import { User } from "@/types/auth/auth-type";


export function isDoctor(user: User | null | undefined): user is Extract<User, { role: "DOCTOR" }> {
  return user?.role === "DOCTOR";
}

export function isPatient(user: User | null | undefined): user is Extract<User, { role: "PATIENT" }> {
  return user?.role === "PATIENT";
}

export function isAdmin(user: User | null | undefined): user is Extract<User, { role: "ADMIN" }> {
  return user?.role === "ADMIN";
}

/**
 * Get Vietnamese display label for gender
 * Handles both uppercase (MALE/FEMALE) and lowercase (male/female) formats
 */
export function getGenderDisplay(gender: string | null | undefined): string {
  if (!gender) return "Khác";
  
  const normalized = gender.toLowerCase();
  
  if (normalized === "male") return "Nam";
  if (normalized === "female") return "Nữ";
  
  return "Khác";
}
