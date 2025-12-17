/**
 * Exemple de composant Button personnalisé
 * Montre comment créer un wrapper avec des fonctionnalités supplémentaires
 */

import * as React from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface CustomButtonProps extends ButtonProps {
  /**
   * Affiche un indicateur de chargement
   */
  loading?: boolean
  /**
   * Ajoute un effet de glow
   */
  glow?: boolean
  /**
   * Couleur du glow (par défaut: bleu)
   */
  glowColor?: 'blue' | 'green' | 'purple' | 'red'
}

const glowColors = {
  blue: 'shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70',
  green: 'shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/70',
  purple: 'shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70',
  red: 'shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/70',
}

/**
 * Composant Button personnalisé avec fonctionnalités supplémentaires
 *
 * @example
 * ```tsx
 * <CustomButton loading={isSubmitting} glow="blue">
 *   Envoyer
 * </CustomButton>
 * ```
 */
export const CustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(
  (
    {
      className,
      children,
      loading = false,
      glow = false,
      glowColor = 'blue',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        className={cn(
          glow && glowColors[glowColor],
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    )
  }
)

CustomButton.displayName = 'CustomButton'

