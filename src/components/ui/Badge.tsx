import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/80 text-primary-foreground",
        secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
        destructive: "bg-destructive hover:bg-destructive/80 text-destructive-foreground",
        outline: "text-foreground bg-background hover:bg-accent border border-input",
        success: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-600",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-600",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-600",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
} 