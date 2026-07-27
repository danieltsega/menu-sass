import Link from "next/link"
import { dummyCafes } from "@/lib/dummy-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="max-w-lg mx-auto min-h-screen">
      <header className="bg-primary text-primary-foreground px-4 pb-8 pt-16">
        <h1 className="text-3xl font-bold tracking-tight">MenuSass</h1>
        <p className="text-primary-foreground/70 mt-2 text-sm">
          Browse menus from your favorite local spots
        </p>
      </header>

      <main className="px-4 py-6 space-y-3">
        {dummyCafes.map((cafe) => (
          <Card key={cafe.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link
                href={`/menu/${cafe.slug}`}
                className="flex items-center gap-4"
              >
                <div className="bg-muted rounded-lg p-3">
                  <Store className="size-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm">{cafe.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {cafe.description}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground shrink-0" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  )
}