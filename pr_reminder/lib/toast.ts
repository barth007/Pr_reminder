// lib/utils/toast.ts (Optional: Simple toast notifications)
interface ToastOptions {
  title: string
  description?: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

class ToastManager {
  private toasts: Array<ToastOptions & { id: string }> = []
  private listeners: Array<(toasts: Array<ToastOptions & { id: string }>) => void> = []

  show(options: ToastOptions) {
    const id = Math.random().toString(36).substr(2, 9)
    const toast = { ...options, id }
    
    this.toasts.push(toast)
    this.notifyListeners()

    // Auto remove after duration
    setTimeout(() => {
      this.remove(id)
    }, options.duration || 5000)

    return id
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.notifyListeners()
  }

  subscribe(listener: (toasts: Array<ToastOptions & { id: string }>) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.toasts]))
  }
}

export const toast = new ToastManager()