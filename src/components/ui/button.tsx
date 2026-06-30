import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
        destructive: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
        outline: "border-2 border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-slate-100",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "hover:bg-slate-100",
        link: "text-blue-600 underline-offset-4 hover:underline",
        glass: "bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30",
        sos: "bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50 animate-pulse hover:scale-110",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
