import { CafeMenu } from '@/components/menu/cafe-menu'

export default function MenuPage({ cafeSlug }: { cafeSlug: string }) {
    return <CafeMenu cafeSlug={cafeSlug} />
}