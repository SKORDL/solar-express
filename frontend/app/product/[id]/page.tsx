import ProductClientSection from "./ProductClientSection"
import { productsData } from "@/data/productsData"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  const product = productsData[id]
  if (!product) {
    return <div>Product Not Found</div>
  }
  return <ProductClientSection id={id} product={product} />
}