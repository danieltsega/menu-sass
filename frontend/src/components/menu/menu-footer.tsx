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

        <div className="pt-2">
          <p className="font-semibold text-foreground">Want similar menu for your place?</p>
          <p className="text-xs">Let&apos;s know!</p>
        </div>

        <div className="flex flex-col items-center gap-3 pt-2">
          <a
            href="https://t.me/JoAhood"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Send className="size-4" />
            <span className="text-xs font-medium text-foreground hover:text-primary transition-colors">Yohannis Worku</span>
          </a>
          <a
            href="tel:+251912307517"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="size-4" />
            <span className="text-xs font-medium">+2519 12307517</span>
          </a>
        </div>

        <p className="text-xs pt-2 border-t border-border">
          Built by Lomi-Teams
        </p>
      </div>
    </footer>
  )
}
