import { Send, Phone } from "lucide-react"

interface MenuFooterProps {
  cafeName: string
  tagline?: string
}

export function MenuFooter({ cafeName, tagline }: MenuFooterProps) {
  return (
    <footer className="mt-auto border-t bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{cafeName}</p>
          {tagline && <p className="text-xs">{tagline}</p>}
        </div>

        <div className="flex items-center justify-center gap-6 pt-2">
          <a
            href="https://t.me/YohannisWorku"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Send className="size-4" />
            <span className="text-xs font-medium">@YohannisWorku</span>
          </a>
          <a
            href="tel:+251900000000"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="size-4" />
            <span className="text-xs font-medium">+251 900 000 000</span>
          </a>
        </div>

        <p className="text-xs pt-2 border-t border-border">
          Built by Lomi-Teams
        </p>
      </div>
    </footer>
  )
}
