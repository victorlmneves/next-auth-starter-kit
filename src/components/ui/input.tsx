import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-foreground text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        type={type}
                        className={cn(
                            'border-input flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
                            'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
                            'placeholder:text-muted-foreground',
                            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            leftIcon && 'pl-9',
                            rightIcon && 'pr-9',
                            error && 'border-destructive focus-visible:ring-destructive',
                            className,
                        )}
                        ref={ref}
                        {...(error ? { 'aria-invalid': 'true' } : {})}
                        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {hint && !error && (
                    <p id={`${inputId}-hint`} className="text-muted-foreground text-xs">
                        {hint}
                    </p>
                )}
                {error && (
                    <p id={`${inputId}-error`} className="text-destructive text-xs" role="alert">
                        {error}
                    </p>
                )}
            </div>
        )
    },
)
Input.displayName = 'Input'

export { Input }
