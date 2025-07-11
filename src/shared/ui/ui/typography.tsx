import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-5xl font-black tracking-tight text-balance lg:text-6xl",
      h2: "scroll-m-20 border-b pb-3 text-4xl font-bold tracking-tight first:mt-0 lg:text-5xl",
      h3: "scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl",
      h4: "scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl",
      h5: "scroll-m-20 text-xl font-bold tracking-tight lg:text-2xl",
      h6: "scroll-m-20 text-lg font-bold tracking-tight lg:text-xl",
      p: "text-lg leading-8 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-4 pl-6 italic text-lg",
      code: "bg-muted relative rounded px-[0.4rem] py-[0.3rem] font-mono text-base font-bold",
      lead: "text-muted-foreground text-2xl leading-8",
      large: "text-xl font-bold",
      small: "text-base font-semibold leading-none",
      muted: "text-muted-foreground text-base",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Comp = as || getDefaultElement(variant)
    return (
      <Comp
        className={cn(typographyVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Typography.displayName = "Typography"

function getDefaultElement(variant?: string | null): React.ElementType {
  switch (variant) {
    case "h1":
      return "h1"
    case "h2":
      return "h2"
    case "h3":
      return "h3"
    case "h4":
      return "h4"
    case "h5":
      return "h5"
    case "h6":
      return "h6"
    case "blockquote":
      return "blockquote"
    case "code":
      return "code"
    case "lead":
    case "large":
    case "small":
    case "muted":
    case "p":
    default:
      return "p"
  }
}

// Convenience components for common typography elements
const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h1" as="h1" className={className} ref={ref} {...props} />
  )
)
H1.displayName = "H1"

const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h2" as="h2" className={className} ref={ref} {...props} />
  )
)
H2.displayName = "H2"

const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h3" as="h3" className={className} ref={ref} {...props} />
  )
)
H3.displayName = "H3"

const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h4" as="h4" className={className} ref={ref} {...props} />
  )
)
H4.displayName = "H4"

const H5 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h5" as="h5" className={className} ref={ref} {...props} />
  )
)
H5.displayName = "H5"

const H6 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h6" as="h6" className={className} ref={ref} {...props} />
  )
)
H6.displayName = "H6"

const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="p" as="p" className={className} ref={ref} {...props} />
  )
)
P.displayName = "P"

const Blockquote = React.forwardRef<HTMLQuoteElement, React.BlockquoteHTMLAttributes<HTMLQuoteElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="blockquote" as="blockquote" className={className} ref={ref} {...props} />
  )
)
Blockquote.displayName = "Blockquote"

const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="code" as="code" className={className} ref={ref} {...props} />
  )
)
Code.displayName = "Code"

const Lead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="lead" as="p" className={className} ref={ref} {...props} />
  )
)
Lead.displayName = "Lead"

const Large = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="large" as="div" className={className} ref={ref} {...props} />
  )
)
Large.displayName = "Large"

const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="small" as="small" className={className} ref={ref} {...props} />
  )
)
Small.displayName = "Small"

const Muted = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="muted" as="p" className={className} ref={ref} {...props} />
  )
)
Muted.displayName = "Muted"

export {
  Typography,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Blockquote,
  Code,
  Lead,
  Large,
  Small,
  Muted,
} 