import * as React from "react"
import { cn } from "@/lib/utils"

function Input2({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input"
      placeholder="Paste your article content here..."
      className={cn(
        "placeholder:text-muted-foreground min-h-[120px] w-full resize-none rounded-md border border-input bg-transparent px-3 pt-2 pb-2 text-base shadow-xs outline-none transition-[color,box-shadow]",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input2 }
