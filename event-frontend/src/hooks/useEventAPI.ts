/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// useEventAPI.ts (corrigé)
import { useState, useCallback} from 'react';
import { get, post, put, patch, del } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import type { Event } from '@/types';

export interface EventPayload {
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  capacity: number;
  ticket_price: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  image?: File | string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const useEventAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const normalizeEvents = (events: any[]): Event[] =>
    events.map(e => ({
      ...e,
      date: typeof e.date === 'number' ? new Date(e.date).toISOString() : e.date || '',
      isFeatured: !!e.isFeatured,
      isPublished: !!e.isPublished,
    }));

  const getAll = useCallback(
  async (filters?: Record<string, string>): Promise<Event[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = filters
        ? new URLSearchParams(
            Object.entries(filters).filter(([_, v]) => v != null) as [string, string][]
          ).toString()
        : '';

      const url = `${ENDPOINTS.events.list}${queryParams ? '?' + queryParams : ''}`;

      const response = await get<PaginatedResponse<Event>>(url);

      console.log("✅ Events reçus :", response);

      return normalizeEvents(response.results || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Erreur lors de la récupération des événements';

      setError(message);
      toast({ title: 'Erreur', description: message, variant: 'destructive' });

      return [];
    } finally {
      setIsLoading(false);
    }
  },
  [] // ✅ stable
);

  const getMyEvents = async (): Promise<Event[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await get<PaginatedResponse<Event>>(`${ENDPOINTS.events.list}my_events/`);
      return normalizeEvents(response.results || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération de vos événements';
      setError(message);
      toast({ title: 'Erreur', description: message, variant: 'destructive' });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getById = async (id: number): Promise<Event | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const event = await get<Event>(ENDPOINTS.events.detail(id.toString()));
      return normalizeEvents([event])[0];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la récupération de l'événement";
      setError(message);
      toast({ title: 'Erreur', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrUpdateFormData = (data: Partial<EventPayload>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  };

  const create = async (data: EventPayload): Promise<Event | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = createOrUpdateFormData(data);
      const token = localStorage.getItem('access_token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://api.awardsdan.com/api/v1'}${ENDPOINTS.events.create}`,
        {
          method: 'POST',
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error('Erreur lors de la création de l\'événement');
      const event: Event = await res.json();
      toast({ title: 'Succès', description: 'Événement créé avec succès' });
      return normalizeEvents([event])[0];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de l\'événement';
      setError(message);
      toast({ title: 'Erreur', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: number, data: Partial<EventPayload>): Promise<Event | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = createOrUpdateFormData(data);
      const token = localStorage.getItem('access_token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://api.awardsdan.com/api/v1'}${ENDPOINTS.events.update(id.toString())}`,
        { method: 'PATCH', body: formData, headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!res.ok) throw new Error('Erreur lors de la mise à jour de l\'événement');
      const event: Event = await res.json();
      toast({ title: 'Succès', description: 'Événement mis à jour avec succès' });
      return normalizeEvents([event])[0];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'événement';
      setError(message);
      toast({ title: 'Erreur', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const changeStatus = async (
    id: number,
    status: 'published' | 'draft' | 'cancelled' | 'completed',
    successMsg: string
  ): Promise<Event | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const event = await patch<Event>(ENDPOINTS.events.publish(id.toString()), { status });
      toast({ title: 'Succès', description: successMsg });
      return normalizeEvents([event])[0];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut';
      setError(message);
      toast({ title: 'Erreur', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const publish = (id: number) => changeStatus(id, 'published', 'Événement publié avec succès');
  const unpublish = (id: number) => changeStatus(id, 'draft', 'Événement dépublié avec succès');

  const deleteEvent = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await del(ENDPOINTS.events.delete(id.toString()));
      toast({ title: 'Succès', description: 'Événement supprimé avec succès' });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(message);
      toast({ title: 'Erreur', description: message, variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getAll,
    getMyEvents,
    getById,
    create,
    update,
    publish,
    unpublish,
    deleteEvent,
  };
};