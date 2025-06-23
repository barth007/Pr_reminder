// lib/hooks/useToast.ts (Optional: React hook for toasts)
import { useState, useEffect } from 'react'
import { toast } from '@/lib/toast'

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts)
    return unsubscribe
  }, [])

  return {
    toasts,
    showToast: toast.show.bind(toast),
    removeToast: toast.remove.bind(toast),
  }
}