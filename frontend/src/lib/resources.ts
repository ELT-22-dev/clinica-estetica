import { apiFetch } from "./api";
import type {
  Appointment,
  AppointmentStatus,
  Client,
  DashboardSummary,
  Professional,
  Treatment,
  User,
} from "./types";

export function login(email: string, password: string) {
  return apiFetch<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe() {
  return apiFetch<User>("/api/auth/me");
}

export function fetchDashboardSummary() {
  return apiFetch<DashboardSummary>("/api/dashboard/summary");
}

export function fetchClients(search?: string) {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiFetch<Client[]>(`/api/clients${qs}`);
}

export function createClient(data: Partial<Client>) {
  return apiFetch<Client>("/api/clients", { method: "POST", body: JSON.stringify(data) });
}

export function updateClient(id: string, data: Partial<Client>) {
  return apiFetch<Client>(`/api/clients/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteClient(id: string) {
  return apiFetch<void>(`/api/clients/${id}`, { method: "DELETE" });
}

export function fetchProfessionals() {
  return apiFetch<Professional[]>("/api/professionals");
}

export function createProfessional(data: Partial<Professional>) {
  return apiFetch<Professional>("/api/professionals", { method: "POST", body: JSON.stringify(data) });
}

export function updateProfessional(id: string, data: Partial<Professional>) {
  return apiFetch<Professional>(`/api/professionals/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteProfessional(id: string) {
  return apiFetch<void>(`/api/professionals/${id}`, { method: "DELETE" });
}

export function fetchTreatments() {
  return apiFetch<Treatment[]>("/api/treatments");
}

export function createTreatment(data: Partial<Treatment>) {
  return apiFetch<Treatment>("/api/treatments", { method: "POST", body: JSON.stringify(data) });
}

export function updateTreatment(id: string, data: Partial<Treatment>) {
  return apiFetch<Treatment>(`/api/treatments/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteTreatment(id: string) {
  return apiFetch<void>(`/api/treatments/${id}`, { method: "DELETE" });
}

export function fetchAppointments(params?: { from?: string; to?: string; status?: AppointmentStatus }) {
  const search = new URLSearchParams();
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  if (params?.status) search.set("status", params.status);
  const qs = search.toString() ? `?${search.toString()}` : "";
  return apiFetch<Appointment[]>(`/api/appointments${qs}`);
}

export interface AppointmentInput {
  clientId: string;
  professionalId: string;
  treatmentId: string;
  startsAt: string;
  room?: string;
  notes?: string;
  status?: AppointmentStatus;
}

export function createAppointment(data: AppointmentInput) {
  return apiFetch<Appointment>("/api/appointments", { method: "POST", body: JSON.stringify(data) });
}

export function updateAppointment(id: string, data: Partial<AppointmentInput>) {
  return apiFetch<Appointment>(`/api/appointments/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteAppointment(id: string) {
  return apiFetch<void>(`/api/appointments/${id}`, { method: "DELETE" });
}
