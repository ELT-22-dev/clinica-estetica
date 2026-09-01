export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED" | "NO_SHOW";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PROFESSIONAL";
}

export interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string | null;
  active: boolean;
}

export interface Treatment {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  treatmentId: string;
  room: string | null;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  notes: string | null;
  client: { id: string; name: string; phone: string | null };
  professional: { id: string; name: string };
  treatment: { id: string; name: string; durationMinutes: number; price: number };
}

export interface DashboardSummary {
  totalClients: number;
  appointmentsToday: number;
  revenueThisMonth: number;
  upcomingAppointments: Array<{
    id: string;
    startsAt: string;
    status: AppointmentStatus;
    client: { id: string; name: string };
    professional: { id: string; name: string };
    treatment: { id: string; name: string };
  }>;
}
