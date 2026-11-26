import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Shadcn color tokens are CSS variables, so tailwind-merge needs to know they
 * occupy the same groups as built-in colors (`bg-background` vs `bg-transparent`).
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'background',
        'foreground',
        'card',
        'card-foreground',
        'popover',
        'popover-foreground',
        'primary',
        'primary-foreground',
        'secondary',
        'secondary-foreground',
        'muted',
        'muted-foreground',
        'accent',
        'accent-foreground',
        'destructive',
        'border',
        'input',
        'ring',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
