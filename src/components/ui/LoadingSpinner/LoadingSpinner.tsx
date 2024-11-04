// src/components/ui/LoadingSpinner/LoadingSpinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <Loader2 className={cn('animate-spin', className)} />
);