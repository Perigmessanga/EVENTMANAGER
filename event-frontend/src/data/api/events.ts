// src/data/api/events.ts
import axios from "axios";
import type { Event } from '@/types';
import { API_CONFIG } from "@/config/api";

/**
 * Récupère les détails publics d'un événement depuis le backend
 * @param eventId L'ID de l'événement
 * @returns Promise<Event>
 */
export const getEventPublicDetail = async (eventId: string | number): Promise<Event> => {
  try {
    const response = await axios.get(
      `${API_CONFIG.baseUrl}/events/${eventId}/public_detail/`
    );

    const data = response.data.event;

    if (!data) {
      throw new Error("Événement introuvable");
    }

    // Transformation robuste pour correspondre au type Event côté frontend
    const ticket_types = (data.ticketTypes || data.ticket_types || []).map((t: any) => ({
      ...t,
      id: String(t.id),                                          // ✅ Forcer en string
      name: t.name || 'Billet Standard',
      price: Number(t.price) || 0,
      // La priorité est le champ 'available' du backend, sinon calcul sur place
      available: Number(t.available ?? (Number(t.quantity_total) - Number(t.quantity_sold || 0)) ?? 0),
      max_per_order: Number(t.max_per_order ?? 10),
      description: t.description || ''
    }));

    return {
      ...data,
      location: data.location || 'Lieu non défini',
      ticketTypes: ticket_types,
      date: data.start_date || '',   
      endDate: data.end_date || '',
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement :", error);
    throw error;
  }
};