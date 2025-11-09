// Interfaces do nosso projeto basedo no que esta no documento.

export type UUID = string;

export enum ReservationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CHECKED_IN = "CHECKED_IN",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum Roles {
  Admin = "admin",
  Tutor = "tutor",
  Hotel = "hotel",
}

export interface User {
  id: UUID;
  name: string;
  password: string;
  phone: number;
  role: Roles;
}

export interface Tutor {
  id: UUID;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Pet {
  id: UUID;
  tutorId: UUID;
  name: string;
  species: string;
  age?: number | null;
  obs?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Hotel {
  id: UUID;
  name: string;
  address?: string | null;
  capacity?: number | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Reservation {
  id: UUID;
  petId: UUID;
  tutorId: UUID;
  hotelId: UUID;
  checkinDate: string; // YYYY-MM-DD
  checkoutDate: string; // YYYY-MM-DD
  status: ReservationStatus;
  notes?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface StayUpdate {
  id: UUID;
  reservationId: UUID;
  authorName?: string | null;
  text?: string | null;
  createdAt: string;
}
