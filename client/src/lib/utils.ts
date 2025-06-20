import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    completed: 'status-completed',
    in_progress: 'status-in_progress',
    scheduled: 'status-scheduled',
    pending: 'status-pending',
    cancelled: 'status-cancelled',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
}

export function getProgramIcon(type: string): string {
  const iconMap: Record<string, string> = {
    CORE: 'bullseye',
    RIN: 'handshake',
    AGUKA: 'seedling',
    'i-ACC': 'rocket',
    MCF: 'chart-line',
  };
  return iconMap[type] || 'circle';
}

export function getProgramTypeClass(type: string): string {
  const typeMap: Record<string, string> = {
    CORE: 'core',
    RIN: 'rin',
    AGUKA: 'aguka',
    'i-ACC': 'iacc',
    MCF: 'mcf',
  };
  return typeMap[type] || 'core';
}
