import type { AppointmentStatus } from "@/lib/types";

const styles: Record<AppointmentStatus, string> = {
  PENDING: "bg-[#F8F1E2] text-gold-dark",
  CONFIRMED: "bg-[#EDF7F0] text-[#1B7A45]",
  CANCELED: "bg-[#FBEDEB] text-[#B04A40]",
  COMPLETED: "bg-[#EAF1FB] text-[#2E5FA3]",
  NO_SHOW: "bg-[#FBEDEB] text-[#B04A40]",
};

const labels: Record<AppointmentStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado",
  COMPLETED: "Concluído",
  NO_SHOW: "Não compareceu",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>
  );
}
