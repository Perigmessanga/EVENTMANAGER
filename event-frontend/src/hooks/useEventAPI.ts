import { useState } from 'react';
import { post, get, put, patch, del } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

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

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  capacity: number;
  ticket_price: number;
  status: string;
  image?: string;
  organizer: {
    id: number;
    username: string;
    email: string;
  };
  tickets_available?: number;
  tickets_sold?: number;
  created_at: string;
  updated_at: string;
}

export const useEventAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getAll = async (filters?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, String(value));
        });
      }
      const url = `${ENDPOINTS.events.list}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const events = await get<Event[]>(url);
      return events || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des événements';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getMyEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const events = await get<Event[]>(`${ENDPOINTS.events.list}my-events/`);
      return events || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération de vos événements';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const event = await get<Event>(ENDPOINTS.events.detail(id.toString()));
      return event;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération de l\'événement';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (data: EventPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const url = `${ENDPOINTS.events.create}`;
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}${url}`, {
        method: 'POST',
        body: formData,
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'événement');
      }

      const event = await response.json();
      toast({
        title: 'Succès',
        description: 'Événement créé avec succès',
      });
      return event;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de l\'événement';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: number, data: Partial<EventPayload>) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const url = `${ENDPOINTS.events.update(id.toString())}`;
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}${url}`, {
        method: 'PATCH',
        body: formData,
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'événement');
      }

      const event = await response.json();
      toast({
        title: 'Succès',
        description: 'Événement mis à jour avec succès',
      });
      return event;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'événement';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const publish = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const event = await patch<Event>(
        ENDPOINTS.events.update(id.toString()),
        { status: 'published' }
      );
      toast({
        title: 'Succès',
        description: 'Événement publié avec succès',
      });
      return event;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la publication';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const unpublish = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const event = await patch<Event>(
        ENDPOINTS.events.update(id.toString()),
        { status: 'draft' }
      );
      toast({
        title: 'Succès',
        description: 'Événement dépublié avec succès',
      });
      return event;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la dépublication';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await del(ENDPOINTS.events.delete(id.toString()));
      toast({
        title: 'Succès',
        description: 'Événement supprimé avec succès',
      });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
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
