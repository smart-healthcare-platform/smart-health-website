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
