"use client"

import Link from "next/link"
import { Heart, Plus } from "lucide-react"
import Image from "next/image"

export default function FeaturedBrandProducts() {
  const products = [
    {
      id: "jinko-400w-panel",
      name: "JinkoSolar ProSeries 400W Mono Solar Panel with Half-Cell Technology",
      price: 125000,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "jinko-370w-panel",
      name: "JinkoSolar Original 370W Mono Solar Panel with Optimized Cell Design",
      price: 95000,
      image: "/placeholder.svg?height=180&width=180",
    },
    {
      id: "jinko-450w-panel",
      name: "JinkoSolar ProSeries 450W XL Mono Solar Panel with Bifacial Technology",
      price: 150000,
      image: "/placeholder.svg?height=180&width=180",
    },
  ]

  // Format price in PKR with commas
  const formatPrice = (price) => {
    return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  return (
    <div className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Power up!</h2>
          <p className="text-gray-600">Panels, inverters & much more.</p>
        </div>
        <Link href="/store" className="text-[#1a5ca4] hover:underline font-medium">
          View all
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Products (65% width) */}
        <div className="lg:w-[65%] grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <button className="absolute top-2 right-2 z-10 text-gray-500 hover:text-red-500 bg-white rounded-full p-1">
                <Heart size={20} />
              </button>
              <Link href={`/product/${product.id}`} className="block group">
                <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={180}
                    height={180}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mb-2">
                  <div className="text-lg font-bold">{formatPrice(product.price)}</div>
                  <h3 className="text-sm line-clamp-2 group-hover:text-[#1a5ca4] transition-colors">{product.name}</h3>
                </div>
              </Link>
              <Link
                href={`/cart/add/${product.id}`}
                className="mt-2 flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full hover:bg-gray-100"
              >
                <Plus size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Right side - Brand promotion (35% width) */}
        <Link
          href="/brand/jinko"
          className="lg:w-[35%] bg-gray-100 rounded-lg overflow-hidden relative group hover:shadow-lg transition-all"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-2 text-sm font-semibold text-[#1a5ca4]">Get it fast</div>
            <h2 className="text-3xl font-bold text-[#1a5ca4] mb-4">
              Solar <br />
              Panels
            </h2>
            <button className="bg-white text-black hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium">
              Shop now
            </button>

            <div className="mt-auto flex justify-center">
              <div className="h-48 flex items-end justify-center">
                <Image
                  src="/placeholder.svg?height=180&width=180"
                  alt="JinkoSolar Panel"
                  width={180}
                  height={180}
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
