import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Components
import { ProtectedRoute } from "@/components/auth";

// Pages - Public
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Admin Layout and Pages
import { AdminLayout } from "./components/layout/AdminLayout";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import CreateEventPage from "./pages/admin/CreateEventPage";
import EditEventPage from "./pages/admin/EditEventPage";
import AdminSalesPage from "./pages/admin/AdminSalesPage";
import AdminRevenuePage from "./pages/admin/AdminRevenuePage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminTicketTypesPage from "./pages/admin/AdminTicketTypesPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// User Layout and Pages
import { UserLayout } from "./components/layout/UserLayout";
import UserTicketsPage from "./pages/account/UserTicketsPage";
import UserPaymentsPage from "./pages/account/UserPaymentsPage";
import UserRefundsPage from "./pages/account/UserRefundsPage";
import UserNotificationsPage from "./pages/account/UserNotificationsPage";
import UserProfilePage from "./pages/account/UserProfilePage";
import UserSettingsPage from "./pages/account/UserSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - Buyer/User */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTicketsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - User Account */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="tickets" element={<UserTicketsPage />} />
            <Route path="payments" element={<UserPaymentsPage />} />
            <Route path="refunds" element={<UserRefundsPage />} />
            <Route path="notifications" element={<UserNotificationsPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="settings" element={<UserSettingsPage />} />
          </Route>

          {/* Protected Routes - Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole={["admin", "organizer"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="events/create" element={<CreateEventPage />} />
            <Route path="events/:id/edit" element={<EditEventPage />} />
            <Route path="tickets/types" element={<AdminTicketTypesPage />} />
            <Route path="tickets/pricing" element={<AdminTicketTypesPage />} />
            <Route path="sales" element={<AdminSalesPage />} />
            <Route path="revenue" element={<AdminRevenuePage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;