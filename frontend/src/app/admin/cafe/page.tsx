"use client"

import { useState } from "react"
import { Store, MapPin, Phone, FileText, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AdminModal } from "@/components/admin/admin-modal"
import { CafeForm } from "@/components/admin/cafe-form"
import { toast } from "sonner"

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
  const [cafeInfo, setCafeInfo] = useState(DUMMY_CAFE)
  const [editOpen, setEditOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleEditInfo = (data: { name: string; slug: string; description?: string; address?: string; phone?: string; logo?: string }) => {
    setCafeInfo({ ...cafeInfo, ...data })
    setEditOpen(false)
    toast.success("Cafe info updated")
  }

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    setPasswordError("")
    toast.success("Password updated successfully")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-xl font-bold">Cafe Settings</h1>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <Store className="size-8" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{cafeInfo.name}</p>
            <p className="text-xs text-muted-foreground">@{cafeInfo.slug}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FileText className="size-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm">{cafeInfo.description}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="size-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm">{cafeInfo.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="size-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm">{cafeInfo.phone}</p>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={() => setEditOpen(true)}>
          Edit Cafe Info
        </Button>
      </div>

      <AdminModal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Cafe Info"
        description="Update your cafe details"
      >
        <CafeForm
          defaultValues={{ name: cafeInfo.name, slug: cafeInfo.slug, description: cafeInfo.description, address: cafeInfo.address, phone: cafeInfo.phone }}
          onSubmit={handleEditInfo}
          onCancel={() => setEditOpen(false)}
        />
      </AdminModal>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Change Password</h2>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
        </div>

        <Button className="w-full" onClick={handlePasswordChange}>
          Update Password
        </Button>
      </div>
    </div>
  )
}