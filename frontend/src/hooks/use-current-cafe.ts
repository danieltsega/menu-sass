import { useAuthStore } from "@/stores/auth-store"
import { useMyCafe } from "@/hooks/use-api"

export function useCurrentCafeId(): string | undefined {
  const user = useAuthStore((s) => s.user)
  const isCafeAdmin = user?.role === "cafe_admin"
  const { data } = useMyCafe(isCafeAdmin)
  return data?._id
}