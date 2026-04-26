import { cn, getStatusColor } from '@/lib/utils';

interface BadgeProps {
  label: string;
  status?: string;
  className?: string;
  variant?: 'default' | 'status';
}

export function Badge({ label, status, className, variant = 'default' }: BadgeProps) {
  const statusClass = status ? getStatusColor(status) : '';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-mono uppercase tracking-wider border',
        variant === 'status' && status
          ? statusClass
          : 'text-text-muted border-text-faint/40 bg-text-faint/10',
        className
      )}
    >
      {label}
    </span>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article' | 'li';
}

export function Card({ children, className, hover = true, as: Tag = 'div' }: CardProps) {
  return (
    <Tag className={cn('card-kpr', hover && 'hover:shadow-card-hover hover:-translate-y-0.5', className)}>
      {children}
    </Tag>
  );
}

interface SkeletonProps { className?: string; }

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse bg-bg-elevated rounded-card', className)} />;
}

export function AlbumCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex gap-4 p-5 border border-accent-dim/20 rounded-card">
      <Skeleton className="w-14 h-16 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function MerchCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({ eyebrow, title, subtitle, className, centered = false }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 lg:mb-16', centered && 'text-center', className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-display text-text-primary mb-4">{title}</h2>
      {subtitle && (
        <p className={cn('text-text-secondary text-lg leading-relaxed', centered && 'max-w-2xl mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
