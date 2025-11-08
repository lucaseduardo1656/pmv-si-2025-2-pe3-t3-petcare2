"use client";

import { Card } from "@/components/ui/card";
import React from "react";
import { ReservationStatus } from "utils/models";
import {
  seedDemoData,
  ReservationRepo,
  PetRepo,
  HotelRepo,
  TutorRepo,
} from "utils/localstorage";

// Função utilitária para converter status em rótulos legíveis
function statusLabel(status: ReservationStatus): string {
  const labels = {
    PENDING: "Pendente",
    APPROVED: "Aprovada",
    REJECTED: "Rejeitada",
    CHECKED_IN: "Hospedado",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
  };
  return labels[status] ?? status;
}

export default function Dashboard() {
  const [reservas, setReservas] = React.useState<any[]>([]);
  const [hotel, setHotel] = React.useState<any>(null);

  React.useEffect(() => {
    // Gerar dados de exemplo na primeira execução
    seedDemoData();

    const hotels = HotelRepo.list();
    const hotelSelecionado = hotels[0]; // seleciona o primeiro hotel
    setHotel(hotelSelecionado);

    // Busca todas as reservas desse hotel
    const allReservas = ReservationRepo.list().filter(
      (r) => r.hotelId === hotelSelecionado.id,
    );

    // Enriquecer com dados de pet e tutor
    const fullData = allReservas.map((reserva) => {
      const pet = PetRepo.get(reserva.petId);
      const tutor = TutorRepo.get(reserva.tutorId);
      return {
        ...reserva,
        petName: pet?.name ?? "—",
        tutorName: tutor?.name ?? "—",
      };
    });

    setReservas(fullData);
  }, []);

  return (
    <div className="p-8">
      <Card>
        <h1 className="text-xl font-semibold mb-4">
          Reservas — {hotel ? hotel.name : "Carregando..."}
        </h1>

        {reservas.length === 0 ? (
          <p className="text-gray-600">Nenhuma reserva encontrada.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  Pet
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  Tutor
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  Check-in
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  Check-out
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  Status
                </th>
                <th className="border border-gray-200 px-3 py-2 text-left">
                  Observações
                </th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">
                    {r.petName}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {r.tutorName}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {r.checkinDate}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {r.checkoutDate}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : r.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : r.status === "CHECKED_IN"
                              ? "bg-blue-100 text-blue-700"
                              : r.status === "COMPLETED"
                                ? "bg-gray-200 text-gray-800"
                                : "bg-red-100 text-red-700"
                      }`}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {r.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
