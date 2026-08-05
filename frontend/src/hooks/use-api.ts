import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query"
import { api, getErrorMessage } from "@/lib/api"
import type {
  ApiResponse,
  ApiCafe,
  ApiCategory,
  ApiDish,
  ApiUser,
  ApiMenu,
} from "@/types/api"

const unwrap = async <T,>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> => {
  const { data } = await request
  return data.data
}

export const queryKeys = {
  cafes: ["cafes"] as const,
  cafe: (id: string) => ["cafes", id] as const,
  myCafe: ["cafes", "me"] as const,
  categories: (cafeId: string) => ["cafes", cafeId, "categories"] as const,
  dishes: (cafeId: string) => ["cafes", cafeId, "dishes"] as const,
  users: ["users"] as const,
  menu: (slug: string) => ["menu", slug] as const,
}

export function useCafes() {
  return useQuery({
    queryKey: queryKeys.cafes,
    queryFn: () => unwrap<ApiCafe[]>(api.get("/cafes")),
  })
}

export function useCafe(id: string) {
  return useQuery({
    queryKey: queryKeys.cafe(id),
    queryFn: () => unwrap<ApiCafe>(api.get(`/cafes/${id}`)),
    enabled: !!id,
  })
}

export function useMyCafe(enabled = true) {
  return useQuery({
    queryKey: queryKeys.myCafe,
    queryFn: () => unwrap<ApiCafe>(api.get("/cafes/me")),
    enabled,
    retry: false,
  })
}

export function useCategories(cafeId?: string) {
  return useQuery({
    queryKey: queryKeys.categories(cafeId ?? "none"),
    queryFn: () => unwrap<ApiCategory[]>(api.get(`/cafes/${cafeId}/categories`)),
    enabled: !!cafeId,
  })
}

export function useDishes(cafeId?: string) {
  return useQuery({
    queryKey: queryKeys.dishes(cafeId ?? "none"),
    queryFn: () => unwrap<ApiDish[]>(api.get(`/cafes/${cafeId}/dishes`)),
    enabled: !!cafeId,
  })
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => unwrap<ApiUser[]>(api.get("/users")),
  })
}

export function useMenu(cafeSlug: string) {
  return useQuery({
    queryKey: queryKeys.menu(cafeSlug),
    queryFn: () => unwrap<ApiMenu>(api.get(`/menu/${cafeSlug}`)),
    enabled: !!cafeSlug,
  })
}

export function useCreateCafe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ApiCafe>) => unwrap<ApiCafe>(api.post("/cafes", data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cafes }),
  })
}

export function useUpdateCafe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ApiCafe> }) =>
      unwrap<ApiCafe>(api.put(`/cafes/${id}`, data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cafes })
      qc.invalidateQueries({ queryKey: queryKeys.myCafe })
    },
  })
}

export function useUpdateMyCafe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ApiCafe>) => unwrap<ApiCafe>(api.put("/cafes/me", data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myCafe })
      qc.invalidateQueries({ queryKey: queryKeys.cafes })
    },
  })
}

export function useDeleteCafe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unwrap<null>(api.delete(`/cafes/${id}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cafes }),
  })
}

export function useCreateCategory(cafeId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ApiCategory>) => unwrap<ApiCategory>(api.post(`/cafes/${cafeId}/categories`, data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories(cafeId ?? "") }),
  })
}

export function useUpdateCategory(cafeId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ApiCategory> }) =>
      unwrap<ApiCategory>(api.put(`/cafes/${cafeId}/categories/${id}`, data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories(cafeId ?? "") }),
  })
}

export function useDeleteCategory(cafeId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unwrap<null>(api.delete(`/cafes/${cafeId}/categories/${id}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.categories(cafeId ?? "") }),
  })
}

export function useCreateDish(cafeId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ApiDish>) => unwrap<ApiDish>(api.post(`/cafes/${cafeId}/dishes`, data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.dishes(cafeId ?? "") }),
  })
}

export function useUpdateDish(cafeId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ApiDish> }) =>
      unwrap<ApiDish>(api.put(`/cafes/${cafeId}/dishes/${id}`, data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.dishes(cafeId ?? "") }),
  })
}

export function useDeleteDish(cafeId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unwrap<null>(api.delete(`/cafes/${cafeId}/dishes/${id}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.dishes(cafeId ?? "") }),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ApiUser> & { password: string }) => unwrap<ApiUser>(api.post("/users", data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ApiUser> & { password?: string } }) =>
      unwrap<ApiUser>(api.put(`/users/${id}`, data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => unwrap<null>(api.delete(`/users/${id}`)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users }),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      unwrap<ApiUser>(api.post("/auth/change-password", data)),
  })
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append("image", file)
      const { data } = await api.post<ApiResponse<{ url: string }>>("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return data.data
    },
  })
}

export { useQueryClient, getErrorMessage }
export type { UseQueryOptions }
