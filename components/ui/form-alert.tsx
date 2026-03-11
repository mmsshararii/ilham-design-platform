import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, Info, TriangleAlert as AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormAlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: string;
  className?: string;
}

export function FormAlert({ type = 'error', message, className }: FormAlertProps) {
  const config = {
    error: {
      icon: AlertCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-500',
      iconBg: 'bg-red-500/20',
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-500',
      iconBg: 'bg-green-500/20',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-500/20',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-500',
      iconBg: 'bg-blue-500/20',
    },
  };

  const style = config[type];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border animate-in slide-in-from-top-2 duration-300',
        style.bg,
        style.border,
        className
      )}
      role="alert"
    >
      <div className={cn('rounded-full p-1', style.iconBg)}>
        <Icon className={cn('h-4 w-4', style.text)} />
      </div>
      <p className={cn('text-sm flex-1 leading-relaxed', style.text)}>{message}</p>
    </div>
  );
}
