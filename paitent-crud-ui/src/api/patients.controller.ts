import { http } from "./http";

export type Gender = "M" | "F";

export type Patient = {
  id: number;
  first_name: string;
  middle_name?: string | null;
  last_name?: string | null;
  gender: Gender;
  age: number;
  created_at?: string;
  updated_at?: string;
};

export type PatientCreate = Omit<Patient, "id">;
export type PatientUpdate = Partial<PatientCreate>;

export const PatientsController = {
  list: () => http<Patient[]>("/patients/"),

  retrieve: (id: number) => http<Patient>(`/patients/${id}/`),

  create: (payload: PatientCreate) =>
    http<Patient>("/patients/", { method: "POST", body: payload }),

  update: (id: number, payload: PatientCreate) =>
    http<Patient>(`/patients/${id}/`, { method: "PUT", body: payload }),

  patch: (id: number, payload: PatientUpdate) =>
    http<Patient>(`/patients/${id}/`, { method: "PATCH", body: payload }),

  remove: (id: number) => http<void>(`/patients/${id}/`, { method: "DELETE" }),
};