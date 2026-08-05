import { CafeMenu } from "@/components/menu/cafe-menu"

export default async function MenuPage({ params }: { params: Promise<{ cafeSlug: string }> }) {
  const { cafeSlug } = await params
  return <CafeMenu cafeSlug={cafeSlug} />
}