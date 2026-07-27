import { dummyMenu } from "@/lib/dummy-data"
import { MenuContent } from "@/components/menu/menu-content"

export default function MenuPage({ params }: { params: { cafeSlug: string } }) {
  return <MenuContent menu={dummyMenu} />
}