export interface AdminOrder {
  id: number;
  user_email: string;
  event_title: string;
  ticket_name: string;
  quantity: number;
  total_price: string;
  status: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface RevenueByEvent {
  event__title: string;
  revenue: number;
  tickets: number;
}

export interface AdminSales {
  total_revenue: number;
  total_tickets: number;
  top_event: RevenueByEvent | null;
  growth_percentage: number;
  revenue_by_event: RevenueByEvent[];
}
export interface MonthlySale {
  month: string;
  revenue: number;
}

export interface TicketDistribution {
  ticket_type__name: string;
  total: number;
}

export interface TopEvent {
  event__title: string;
  revenue: number;
}

export interface AdvancedSales {
  total_revenue: number;
  total_tickets: number;
  average_cart: number;
  top_events: TopEvent[];
  monthly_sales: MonthlySale[];
  ticket_distribution: TicketDistribution[];
}
export interface AdminTicketType {
  id: number;
  event: number;
  event_title: string;
  name: string;
  price: string;
  quantity_total: number;
  quantity_sold: number;
  max_per_order: number;
}
