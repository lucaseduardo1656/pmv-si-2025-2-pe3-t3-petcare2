"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ReservationRepo,
  PetRepo,
  TutorRepo,
  HotelRepo,
} from "utils/localstorage";
import {
  ReservationStatus,
  Pet,
  Tutor,
  Hotel,
  Reservation,
} from "utils/models";

type Props = {
  hotelId?: string;
  onCreated?: (reservation: Reservation) => void;
};

export default function AdicionarReserva({
  hotelId: initialHotelId,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);

  // padrão de classes para botões
  const BTN_STD = "text-xs px-3 py-1 rounded-md border hover:bg-white/50";
  const BTN_TOGGLE = "text-xs px-2 py-1 rounded border hover:bg-white/50";

  // form state
  const [petId, setPetId] = useState<string>("");
  const [tutorId, setTutorId] = useState<string>("");
  const [hotelId, setHotelId] = useState<string | undefined>(initialHotelId);
  const [checkinDate, setCheckinDate] = useState<string>("");
  const [checkoutDate, setCheckoutDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // inline create states
  const [creatingTutor, setCreatingTutor] = useState(false);
  const [creatingPet, setCreatingPet] = useState(false);

  const [newTutorName, setNewTutorName] = useState("");
  const [newTutorEmail, setNewTutorEmail] = useState("");
  const [newPetName, setNewPetName] = useState("");
  const [newPetSpecies, setNewPetSpecies] = useState("");

  // lists
  const [pets, setPets] = useState<Pet[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  // errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPets(PetRepo.list());
    setTutors(TutorRepo.list());
    setHotels(HotelRepo.list());
  }, []);

  useEffect(() => {
    // se o componente recebeu hotelId por prop, manter selecionado e não permitir alteração
    if (initialHotelId) setHotelId(initialHotelId);
  }, [initialHotelId]);

  function validate() {
    const e: Record<string, string> = {};
    if (!tutorId) e.tutorId = "Selecione um tutor ou crie um novo.";
    if (!petId) e.petId = "Selecione um pet ou cadastre um novo.";
    if (!hotelId) e.hotelId = "Selecione um hotel.";
    if (!checkinDate) e.checkinDate = "Informe a data de check-in.";
    if (!checkoutDate) e.checkoutDate = "Informe a data de check-out.";
    if (checkinDate && checkoutDate && checkinDate > checkoutDate)
      e.date = "A data de check-in não pode ser posterior ao check-out.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function resetForm() {
    setPetId("");
    setTutorId("");
    if (!initialHotelId) setHotelId(undefined);
    setCheckinDate("");
    setCheckoutDate("");
    setNotes("");
    setErrors({});
    setCreatingPet(false);
    setCreatingTutor(false);
    setNewPetName("");
    setNewPetSpecies("");
    setNewTutorName("");
    setNewTutorEmail("");
  }

  function handleCreateTutor() {
    const e: Record<string, string> = {};
    if (!newTutorName) e.newTutorName = "Nome do tutor é obrigatório.";
    if (!newTutorEmail) e.newTutorEmail = "Email do tutor é obrigatório.";
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      const created = TutorRepo.create({
        name: newTutorName,
        email: newTutorEmail,
        phone: null,
      });
      setTutors((s) => [...s, created]);
      setTutorId(created.id);
      setCreatingTutor(false);
      setNewTutorName("");
      setNewTutorEmail("");
    } catch (err) {
      setErrors({ submitTutor: "Não foi possível criar o tutor." });
      console.error(err);
    }
  }

  function handleCreatePet() {
    const e: Record<string, string> = {};
    if (!newPetName) e.newPetName = "Nome do pet é obrigatório.";
    if (!newPetSpecies) e.newPetSpecies = "Espécie do pet é obrigatória.";
    if (!tutorId)
      e.noTutor = "É necessário selecionar um tutor antes de cadastrar o pet.";
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      const created = PetRepo.create({
        name: newPetName,
        species: newPetSpecies,
        tutorId,
        age: null,
        obs: null,
      });
      setPets((s) => [...s, created]);
      setPetId(created.id);
      setCreatingPet(false);
      setNewPetName("");
      setNewPetSpecies("");
    } catch (err) {
      setErrors({ submitPet: "Não foi possível criar o pet." });
      console.error(err);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      petId,
      tutorId,
      hotelId,
      checkinDate,
      checkoutDate,
      status: ReservationStatus.PENDING,
      notes: notes || null,
      rejectionReason: null,
      updatedAt: null,
    } as any;

    try {
      const created = ReservationRepo.create(payload);
      // notifica o pai corretamente
      onCreated?.(created);
      resetForm();
      setOpen(false);
    } catch (err) {
      setErrors({ submit: "Falha ao criar reserva." });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild>
        {/* botão principal segue o mesmo estilo solicitado */}
        <button className={BTN_STD}>Nova Reserva</button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Adicionar nova reserva</DialogTitle>
          <DialogDescription>
            Aqui pode cadastrar reserva e, se necessário, criar tutor e pet sem
            sair do formulário.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tutor*</label>
            <div className="flex gap-2 items-center">
              <select
                value={tutorId}
                onChange={(ev) => setTutorId(ev.target.value)}
                className="mt-1 flex-1 block w-full rounded border px-2 py-2"
                required
              >
                <option value="">— selecione —</option>
                {tutors.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setCreatingTutor((s) => !s)}
                className={BTN_TOGGLE}
              >
                {creatingTutor ? "Cancelar" : "Novo Tutor"}
              </button>
            </div>

            {creatingTutor && (
              <div className="mt-2 space-y-2 p-3 border rounded">
                <input
                  placeholder="Nome"
                  value={newTutorName}
                  onChange={(ev) => setNewTutorName(ev.target.value)}
                  className="block w-full rounded border px-2 py-2"
                />
                <input
                  placeholder="Email"
                  value={newTutorEmail}
                  onChange={(ev) => setNewTutorEmail(ev.target.value)}
                  className="block w-full rounded border px-2 py-2"
                />
                {errors.newTutorName && (
                  <p className="text-sm text-red-600">{errors.newTutorName}</p>
                )}
                {errors.newTutorEmail && (
                  <p className="text-sm text-red-600">{errors.newTutorEmail}</p>
                )}
                {errors.submitTutor && (
                  <p className="text-sm text-red-600">{errors.submitTutor}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCreateTutor}
                    className={BTN_STD}
                  >
                    Criar Tutor
                  </button>
                </div>
              </div>
            )}

            {errors.tutorId && (
              <p className="text-sm text-red-600">{errors.tutorId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Pet*</label>
            <div className="flex gap-2 items-center">
              <select
                value={petId}
                onChange={(ev) => setPetId(ev.target.value)}
                className="mt-1 flex-1 block w-full rounded border px-2 py-2"
                required
              >
                <option value="">— selecione —</option>
                {pets
                  .filter((p) => (tutorId ? p.tutorId === tutorId : true))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} • {p.species}
                    </option>
                  ))}
              </select>

              <button
                type="button"
                onClick={() => setCreatingPet((s) => !s)}
                className={BTN_TOGGLE}
              >
                {creatingPet ? "Cancelar" : "Novo Pet"}
              </button>
            </div>

            {creatingPet && (
              <div className="mt-2 space-y-2 p-3 border rounded">
                <input
                  placeholder="Nome do pet"
                  value={newPetName}
                  onChange={(ev) => setNewPetName(ev.target.value)}
                  className="block w-full rounded border px-2 py-2"
                />
                <input
                  placeholder="Espécie"
                  value={newPetSpecies}
                  onChange={(ev) => setNewPetSpecies(ev.target.value)}
                  className="block w-full rounded border px-2 py-2"
                />
                {errors.newPetName && (
                  <p className="text-sm text-red-600">{errors.newPetName}</p>
                )}
                {errors.newPetSpecies && (
                  <p className="text-sm text-red-600">{errors.newPetSpecies}</p>
                )}
                {errors.noTutor && (
                  <p className="text-sm text-red-600">{errors.noTutor}</p>
                )}
                {errors.submitPet && (
                  <p className="text-sm text-red-600">{errors.submitPet}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCreatePet}
                    className={BTN_STD}
                  >
                    Criar Pet
                  </button>
                </div>
              </div>
            )}

            {errors.petId && (
              <p className="text-sm text-red-600">{errors.petId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Hotel*</label>
            {initialHotelId ? (
              <div className="mt-1 block w-full rounded border px-2 py-2 bg-gray-50">
                {hotels.find((h) => h.id === hotelId)?.name || hotelId}
              </div>
            ) : (
              <select
                value={hotelId ?? ""}
                onChange={(ev) => setHotelId(ev.target.value)}
                className="mt-1 block w-full rounded border px-2 py-2"
                required
              >
                <option value="">— selecione —</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} {h.capacity ? `• ${h.capacity} vagas` : ""}
                  </option>
                ))}
              </select>
            )}
            {errors.hotelId && (
              <p className="text-sm text-red-600">{errors.hotelId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">Check-in*</label>
              <input
                type="date"
                value={checkinDate}
                onChange={(ev) => setCheckinDate(ev.target.value)}
                className="mt-1 block w-full rounded border px-2 py-2"
                required
              />
              {errors.checkinDate && (
                <p className="text-sm text-red-600">{errors.checkinDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Check-out*</label>
              <input
                type="date"
                value={checkoutDate}
                onChange={(ev) => setCheckoutDate(ev.target.value)}
                className="mt-1 block w-full rounded border px-2 py-2"
                required
              />
              {errors.checkoutDate && (
                <p className="text-sm text-red-600">{errors.checkoutDate}</p>
              )}
            </div>
          </div>

          {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}

          <div>
            <label className="block text-sm font-medium">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(ev) => setNotes(ev.target.value)}
              className="mt-1 block w-full rounded border px-2 py-2"
              rows={3}
            />
          </div>

          {errors.submit && (
            <p className="text-sm text-red-600">{errors.submit}</p>
          )}

          <DialogFooter className="flex items-center justify-between">
            <div className="flex gap-2">
              <DialogClose asChild>
                <button type="button" className={BTN_STD}>
                  Cancelar
                </button>
              </DialogClose>
              <button type="submit" className={BTN_STD} disabled={submitting}>
                {submitting ? "Salvando..." : "Criar Reserva"}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
