import { User } from "@/types/auth";
import { isDoctor, isPatient } from "./typeGuards";

export function getPatientProfile(user: User | null | undefined) {
  return isPatient(user) ? user.profile : null;
}

export function getDoctorProfile(user: User | null | undefined) {
    return isDoctor(user) ? user.profile : null;
  }