"use client"

import { Store, MapPin, Phone, FileText } from "lucide-react"

const DUMMY_CAFE = {
  name: "Brew & Bean",
  slug: "brew-and-bean",
  description: "Artisan coffee & homemade pastries in the heart of the city.",
  address: "Bole Road, Addis Ababa",
  phone: "+251 911 234 567",
  admin: "Cafe Owner",
  logo: "",
}

export default function CafeSettingsPage() {
  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-xl font-bold">Cafe Settings</h1>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <Store className="size-8" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{DUMMY_CAFE.name}</p>
            <p className="text-xs text-muted-foreground">@{DUMMY_CAFE.slug}</p>
          </div>
          <button className="text-sm text-primary font-medium">Change</button>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FileText className="size-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm">{DUMMY_CAFE.description}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="size-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm">{DUMMY_CAFE.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="size-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm">{DUMMY_CAFE.phone}</p>
            </div>
          </div>
        </div>

        <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground">
          Edit Cafe Info
        </button>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-3">
        <h2 className="text-sm font-semibold">Danger Zone</h2>
        <p className="text-xs text-muted-foreground">
          Once you deactivate your cafe, all menu data will not be visible to customers.
        </p>
        <button className="rounded-lg border border-destructive text-destructive px-4 py-2 text-sm font-medium w-full hover:bg-destructive/5 transition-colors">
          Deactivate Cafe
        </button>
      </div>
    </div>
  )
}
