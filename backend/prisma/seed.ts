import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function at(daysFromNow: number, hour: number, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  const passwordHash = await bcrypt.hash("esteticapro123", 10);
  await prisma.user.upsert({
    where: { email: "admin@esteticapro.com" },
    update: {},
    create: {
      name: "Dra. Sofia Martins",
      email: "admin@esteticapro.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const [sofia, carla, bruno] = await Promise.all([
    prisma.professional.upsert({
      where: { id: "00000000-0000-0000-0000-000000000001" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Dra. Sofia Martins",
        specialty: "Harmonização facial",
      },
    }),
    prisma.professional.upsert({
      where: { id: "00000000-0000-0000-0000-000000000002" },
      update: {},
      create: { id: "00000000-0000-0000-0000-000000000002", name: "Carla Nogueira", specialty: "Estética facial" },
    }),
    prisma.professional.upsert({
      where: { id: "00000000-0000-0000-0000-000000000003" },
      update: {},
      create: { id: "00000000-0000-0000-0000-000000000003", name: "Bruno Tavares", specialty: "Massoterapia" },
    }),
  ]);

  const treatmentsData = [
    { name: "Botox / Toxina botulínica", durationMinutes: 45, price: 890 },
    { name: "Preenchimento labial", durationMinutes: 60, price: 1200 },
    { name: "Limpeza de pele profunda", durationMinutes: 60, price: 220 },
    { name: "Microagulhamento", durationMinutes: 50, price: 380 },
    { name: "Peeling químico", durationMinutes: 40, price: 260 },
  ];

  const treatments = [];
  for (const t of treatmentsData) {
    let treatment = await prisma.treatment.findFirst({ where: { name: t.name } });
    if (!treatment) {
      treatment = await prisma.treatment.create({ data: t });
    }
    treatments.push(treatment);
  }

  const clientsData = [
    { name: "Ana Costa", phone: "(11) 98888-1111", email: "ana.costa@example.com" },
    { name: "Maria Oliveira", phone: "(11) 98888-2222", email: "maria.oliveira@example.com" },
    { name: "Juliana Reis", phone: "(11) 98888-3333", email: "juliana.reis@example.com" },
    { name: "Camila Souza", phone: "(11) 98888-4444", email: "camila.souza@example.com" },
    { name: "Patrícia Lima", phone: "(11) 98888-5555", email: "patricia.lima@example.com" },
    { name: "Renata Dias", phone: "(11) 98888-6666", email: "renata.dias@example.com" },
  ];

  const clients = [];
  for (const c of clientsData) {
    let client = await prisma.client.findFirst({ where: { email: c.email } });
    if (!client) {
      client = await prisma.client.create({ data: c });
    }
    clients.push(client);
  }

  const existingAppointments = await prisma.appointment.count();
  if (existingAppointments === 0) {
    const seedAppointments = [
      { client: clients[0], professional: sofia, treatment: treatments[1], when: at(0, 9), room: "Sala 2", status: "CONFIRMED" as const },
      { client: clients[1], professional: sofia, treatment: treatments[0], when: at(0, 10, 30), room: "Sala 1", status: "CONFIRMED" as const },
      { client: clients[2], professional: carla, treatment: treatments[2], when: at(0, 13), room: "Sala 3", status: "PENDING" as const },
      { client: clients[3], professional: carla, treatment: treatments[3], when: at(0, 15), room: "Sala 2", status: "PENDING" as const },
      { client: clients[4], professional: sofia, treatment: treatments[4], when: at(0, 17, 30), room: "Sala 1", status: "CONFIRMED" as const },
      { client: clients[5], professional: bruno, treatment: treatments[2], when: at(1, 9), room: "Sala 1", status: "PENDING" as const },
      { client: clients[0], professional: carla, treatment: treatments[3], when: at(1, 11), room: "Sala 2", status: "PENDING" as const },
      { client: clients[1], professional: sofia, treatment: treatments[1], when: at(-1, 9), room: "Sala 2", status: "COMPLETED" as const },
      { client: clients[2], professional: sofia, treatment: treatments[0], when: at(-1, 11), room: "Sala 1", status: "COMPLETED" as const },
      { client: clients[3], professional: carla, treatment: treatments[2], when: at(-2, 14), room: "Sala 3", status: "NO_SHOW" as const },
    ];

    for (const a of seedAppointments) {
      const endsAt = new Date(a.when.getTime() + a.treatment.durationMinutes * 60_000);
      await prisma.appointment.create({
        data: {
          clientId: a.client.id,
          professionalId: a.professional.id,
          treatmentId: a.treatment.id,
          startsAt: a.when,
          endsAt,
          room: a.room,
          status: a.status,
        },
      });
    }
  }

  console.log("Seed concluído. Login de teste: admin@esteticapro.com / esteticapro123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
