import { CURRENCY } from '@/config/api';

/**
 * Format currency for Côte d'Ivoire (XOF/FCFA)
 */
export function formatCurrency(amount: number, currency = CURRENCY.code): string {
  // XOF doesn't use decimals
  const formatted = new Intl.NumberFormat(CURRENCY.locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `${formatted} ${CURRENCY.symbol}`;
}

/**
 * Format date in French locale
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('fr-CI', options || defaultOptions);
}

/**
 * Format date for compact display
 */
export function formatDateCompact(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-CI', {
    day: '2-digit',
    month: 'short',
  });
}

/**
 * Format time
 */
export function formatTime(timeString: string): string {
  return timeString;
}

/**
 * Format date and time together
 */
export function formatDateTime(dateString: string, timeString: string): string {
  const date = formatDate(dateString, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });
  return `${date} à ${timeString}`;
}

/**
 * Format phone number for Côte d'Ivoire
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Handle Ivorian numbers
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  if (digits.length === 8) {
    return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }
  
  return phone;
}

/**
 * Validate Ivorian phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  // Ivorian mobile numbers: 10 digits starting with 0, or 8 digits
  return (digits.length === 10 && digits.startsWith('0')) || digits.length === 8;
}

/**
 * Get relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'Événement passé';
  }
  
  if (diffDays === 0) {
    return "Aujourd'hui";
  }
  
  if (diffDays === 1) {
    return 'Demain';
  }
  
  if (diffDays < 7) {
    return `Dans ${diffDays} jours`;
  }
  
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Dans ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  }
  
  const months = Math.floor(diffDays / 30);
  return `Dans ${months} mois`;
}

/**
 * Check if event is upcoming
 */
export function isUpcoming(dateString: string): boolean {
  return new Date(dateString) > new Date();
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
