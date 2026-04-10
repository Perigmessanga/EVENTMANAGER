/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "@/lib/api-client";
import type { AdminOrder, PaginatedResponse, AdminSales, AdvancedSales,  AdminTicketType} from "@/types/admin";
import { post, put, del } from "@/lib/api-client";

// ===============================
// 🎟️ ADMIN TICKET TYPES
// ===============================


export const getAdminTicketTypes = (params: string = "") =>
  get<PaginatedResponse<AdminTicketType>>(
    `/events/admin/ticket-types/${params}`
  );

export const createTicketType = (data: any) =>
  post(`/events/admin/ticket-types/`, data);

export const updateTicketType = (id: number, data: any) =>
  put(`/events/admin/ticket-types/${id}/`, data);

export const deleteTicketType = (id: number) =>
  del(`/events/admin/ticket-types/${id}/`);

export const getAdminOrders = (params: string) =>
  get<PaginatedResponse<AdminOrder>>(`/admin/orders/${params}`);



export const getAdvancedSales = (params: string) =>
  get<AdvancedSales>(`/events/admin/sales/${params}`);

export const getAdminSales = () =>
  get<AdminSales>("/events/admin/sales/"); // <-- mettre /events/admin/sales

