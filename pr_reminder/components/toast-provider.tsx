
// components/toast-provider.tsx (Optional: Toast UI component)
import { useToast } from '@/lib/hooks/useToast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ToastProvider() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Alert 
          key={toast.id} 
          className={`max-w-sm shadow-lg border-l-4 ${
            toast.type === 'success' ? 'border-l-green-500 bg-green-50' :
            toast.type === 'error' ? 'border-l-red-500 bg-red-50' :
            'border-l-blue-500 bg-blue-50'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
            </div>
            <div className="ml-3 flex-1">
              <AlertTitle className="text-sm font-medium">
                {toast.title}
              </AlertTitle>
              {toast.description && (
                <AlertDescription className="text-sm mt-1">
                  {toast.description}
                </AlertDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeToast(toast.id)}
              className="ml-2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  )
}