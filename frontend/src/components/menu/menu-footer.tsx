import { Heart } from "lucide-react"

interface MenuFooterProps {
  cafeName: string
  tagline?: string
}

export function MenuFooter({ cafeName, tagline }: MenuFooterProps) {
  return (
    <footer className="mt-auto border-t bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
      <div className="max-w-lg mx-auto space-y-2">
        <p className="font-semibold text-foreground">{cafeName}</p>
        {tagline && <p className="text-xs">{tagline}</p>}
        <p className="text-xs flex items-center justify-center gap-1 pt-2">
          Built with <Heart className="size-3 text-destructive fill-destructive" /> by{" "}
          <a
            href="https://github.com/danieltsega"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary transition-colors"
          >
            Daniel Tsega
          </a>
        </p>
      </div>
    </footer>
  )
}
