// Esse arquivo é uma abstração para usarmos localStorage de uma maneira simplificada em nosso projeto

import { saveJSON, parseJSON, nowISO, uuid } from "@/lib/utils";
import {
  Tutor,
  UUID,
  Hotel,
  Reservation,
  Pet,
  StayUpdate,
  ReservationStatus,
} from "./models";

/* ==========================================
   Repositórios simples (CRUD via localStorage)
   ========================================== */

const tutorsKey = "petcare:tutors";
const petsKey = "petcare:pets";
const hotelsKey = "petcare:hotels";
const reservationsKey = "petcare:reservations";
const updatesKey = "petcare:updates";

/* ---------------------
   Tutor Repository
   --------------------- */
export const TutorRepo = {
  list(): Tutor[] {
    return parseJSON<Tutor>(tutorsKey);
  },
  get(id: UUID): Tutor | undefined {
    return this.list().find((t) => t.id === id);
  },
  create(data: Omit<Tutor, "id" | "createdAt">): Tutor {
    const tutors = this.list();
    const tutor: Tutor = { ...data, id: uuid(), createdAt: nowISO() };
    tutors.push(tutor);
    saveJSON(tutorsKey, tutors);
    return tutor;
  },
  update(id: UUID, patch: Partial<Tutor>): Tutor | undefined {
    const tutors = this.list();
    const index = tutors.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    tutors[index] = { ...tutors[index], ...patch, updatedAt: nowISO() };
    saveJSON(tutorsKey, tutors);
    return tutors[index];
  },
  remove(id: UUID): boolean {
    const tutors = this.list();
    const next = tutors.filter((t) => t.id !== id);
    if (next.length === tutors.length) return false;
    saveJSON(tutorsKey, next);
    return true;
  },
};

/* ---------------------
   Pet Repository
   --------------------- */
export const PetRepo = {
  list(tutorId?: UUID): Pet[] {
    const pets = parseJSON<Pet>(petsKey);
    return tutorId ? pets.filter((p) => p.tutorId === tutorId) : pets;
  },
  get(id: UUID): Pet | undefined {
    return this.list().find((p) => p.id === id);
  },
  create(data: Omit<Pet, "id" | "createdAt">): Pet {
    const pets = this.list();
    const pet: Pet = { ...data, id: uuid(), createdAt: nowISO() };
    pets.push(pet);
    saveJSON(petsKey, pets);
    return pet;
  },
  update(id: UUID, patch: Partial<Pet>): Pet | undefined {
    const pets = this.list();
    const index = pets.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    pets[index] = { ...pets[index], ...patch, updatedAt: nowISO() };
    saveJSON(petsKey, pets);
    return pets[index];
  },
  remove(id: UUID): boolean {
    const pets = this.list();
    const next = pets.filter((p) => p.id !== id);
    if (next.length === pets.length) return false;
    saveJSON(petsKey, next);
    return true;
  },
};

/* ---------------------
   Hotel Repository
   --------------------- */
export const HotelRepo = {
  list(): Hotel[] {
    return parseJSON<Hotel>(hotelsKey);
  },
  get(id: UUID): Hotel | undefined {
    return this.list().find((h) => h.id === id);
  },
  create(data: Omit<Hotel, "id" | "createdAt">): Hotel {
    const hotels = this.list();
    const hotel: Hotel = { ...data, id: uuid(), createdAt: nowISO() };
    hotels.push(hotel);
    saveJSON(hotelsKey, hotels);
    return hotel;
  },
  update(id: UUID, patch: Partial<Hotel>): Hotel | undefined {
    const hotels = this.list();
    const index = hotels.findIndex((h) => h.id === id);
    if (index === -1) return undefined;
    hotels[index] = { ...hotels[index], ...patch, updatedAt: nowISO() };
    saveJSON(hotelsKey, hotels);
    return hotels[index];
  },
  remove(id: UUID): boolean {
    const hotels = this.list();
    const next = hotels.filter((h) => h.id !== id);
    if (next.length === hotels.length) return false;
    saveJSON(hotelsKey, next);
    return true;
  },
};

/* ---------------------
   Reservation Repository
   --------------------- */
export const ReservationRepo = {
  list(): Reservation[] {
    return parseJSON<Reservation>(reservationsKey);
  },
  get(id: UUID): Reservation | undefined {
    return this.list().find((r) => r.id === id);
  },
  create(data: Omit<Reservation, "id" | "createdAt" | "status">): Reservation {
    const reservations = this.list();
    const reservation: Reservation = {
      ...data,
      id: uuid(),
      status: ReservationStatus.PENDING,
      createdAt: nowISO(),
    };
    reservations.push(reservation);
    saveJSON(reservationsKey, reservations);
    return reservation;
  },
  update(id: UUID, patch: Partial<Reservation>): Reservation | undefined {
    const reservations = this.list();
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1) return undefined;
    reservations[index] = {
      ...reservations[index],
      ...patch,
      updatedAt: nowISO(),
    };
    saveJSON(reservationsKey, reservations);
    return reservations[index];
  },
  changeStatus(
    id: UUID,
    status: ReservationStatus,
    reason?: string,
  ): Reservation | undefined {
    const reservations = this.list();
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1) return undefined;
    reservations[index].status = status;
    if (reason) reservations[index].rejectionReason = reason;
    reservations[index].updatedAt = nowISO();
    saveJSON(reservationsKey, reservations);
    return reservations[index];
  },
  remove(id: UUID): boolean {
    const reservations = this.list();
    const next = reservations.filter((r) => r.id !== id);
    if (next.length === reservations.length) return false;
    saveJSON(reservationsKey, next);
    return true;
  },
};

/* ---------------------
   StayUpdate Repository
   --------------------- */
export const StayUpdateRepo = {
  list(reservationId?: UUID): StayUpdate[] {
    const updates = parseJSON<StayUpdate>(updatesKey);
    return reservationId
      ? updates.filter((u) => u.reservationId === reservationId)
      : updates;
  },
  create(data: Omit<StayUpdate, "id" | "createdAt">): StayUpdate {
    const updates = this.list();
    const update: StayUpdate = { ...data, id: uuid(), createdAt: nowISO() };
    updates.push(update);
    saveJSON(updatesKey, updates);
    return update;
  },
  remove(id: UUID): boolean {
    const updates = this.list();
    const next = updates.filter((u) => u.id !== id);
    if (next.length === updates.length) return false;
    saveJSON(updatesKey, next);
    return true;
  },
};

/* ==========================================
   Função opcional de inicialização de dados
   ========================================== */
export function seedDemoData(): void {
  localStorage.clear();

  const tutor = TutorRepo.create({
    name: "Ana Martins",
    email: "ana@example.com",
    phone: "31999990000",
  });

  const pet = PetRepo.create({
    tutorId: tutor.id,
    name: "Max",
    species: "Cachorro",
    age: 3,
    obs: "Muito dócil",
  });

  const hotel = HotelRepo.create({
    name: "Hotel PetCare BH",
    address: "Av. Central, 100 - Belo Horizonte",
    capacity: 5,
  });

  ReservationRepo.create({
    petId: pet.id,
    tutorId: tutor.id,
    hotelId: hotel.id,
    checkinDate: "2025-11-10",
    checkoutDate: "2025-11-12",
    notes: "Reserva de demonstração",
  });
}
