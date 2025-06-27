"use client"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, ChevronRight, Star, Share2 } from "lucide-react"
import ProductSpecifications from "@/components/product-specifications"
import ProductReviews from "@/components/product-reviews"
import ProductResources from "@/components/product-faq"
import RelatedProducts from "@/components/related-products"
import { useState, useRef } from "react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { productsData, ProductType } from "@/data/productsData"



// Format price in PKR with commas
const formatPrice = (price) => {
  return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export default function ProductClientSection({
  id,
  product,
}: {
  id: string
  product: any
}) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [selectedLabel, setSelectedLabel] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0].name : ""
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState(0) // <-- Add this line
  const resourcesRef = useRef(null) // <-- ADD THIS LINE

  const handleAddToCart = async () => {
    console.log("Add to Cart button clicked")
    console.log("User:", user)
    const success = await addToCart({ productId: product._id, quantity: 1, label: selectedLabel })
    console.log("Add to cart success:", success)
    if (success) router.push("/cart")
  }

  // Handle case where product doesn't exist
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild>
          <Link href="/store">Return to Store</Link>
        </Button>
      </div>
    )
  }
  const scrollToResources = () => {
    if (resourcesRef.current) {
      resourcesRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

const yourResourceArray = [];

if (product.youtubeVideo) {
  yourResourceArray.push({
    type: "youtube",
    title: product.youtubeVideo.title,
    videoId: product.youtubeVideo.videoId,
    description: product.youtubeVideo.description,
    duration: product.youtubeVideo.duration,
    views: product.youtubeVideo.views,
  });
}

if (product.blogs && product.blogs.length > 0) {
  product.blogs.forEach((blog) => {
    yourResourceArray.push({
      type: "blog",
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      author: blog.author,
      date: blog.date,
      readTime: blog.readTime,
      url: blog.url,
      image: blog.image,
    });
  });
}


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-[#1a5ca4]">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <Link href="/store" className="text-gray-500 hover:text-[#1a5ca4]">
          Store
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        {product.brandSlug && (
          <>
            <Link href={`/brand/${product.brandSlug}`} className="text-gray-500 hover:text-[#1a5ca4]">
              {product.brand}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </>
        )}
        <span className="text-[#1a5ca4]">{product.name}</span>
      </div>

      {/* Product Overview */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Product Images */}
        <div className="w-full lg:w-1/2 flex flex-row gap-4">
          {/* Thumbnails on the left */}
          <div className="flex flex-col gap-4">
            {product.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`border border-gray-200 rounded-lg overflow-hidden w-20 h-20 bg-gray-100 flex items-center justify-center cursor-pointer ${selectedImageIndex === index ? "ring-2 ring-[#1a5ca4]" : ""}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="text-gray-400 hidden w-full h-full items-center justify-center text-center p-2 text-xs">[{image}]</div>
              </div>
            ))}
          </div>

          {/* Main image on the right */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 flex-1">
            <div className="bg-gray-100 flex items-center justify-center" style={{ height: '24rem' }}>
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="max-h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="text-gray-400 hidden w-full h-full items-center justify-center text-center p-4">[{product.images[selectedImageIndex]}]</div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            {product.brandSlug && (
              <Link href={`/brand/${product.brandSlug}`} className="text-[#1a5ca4] hover:underline">
                By {product.brand}
              </Link>
            )}
          </div> */}

          <div className="mb-6">
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-[#1a5ca4]">{formatPrice(product.discountPrice)}</span>
                <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-[#1a5ca4]">{formatPrice(product.price)}</span>
            )}
          </div>
          {/* Stock Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">Availability:</span>
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`px-4 py-2 border rounded-md ${
                      selectedLabel === variant.name
                        ? "border-[#1a5ca4] bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedLabel(variant.name)}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 bg-[#1a5ca4] hover:bg-[#0e4a8a]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
            </Button>
          </div>

          

          {/* Shipping & Returns */}
          {/* <div className="p-4 bg-gray-50 rounded-lg mt-6 ">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Free Shipping:</span>
                <span>On orders over PKR 50,000</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Estimated Delivery:</span>
                <span>3-5 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Returns:</span>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-[#1a5ca4] font-medium">
          Looking for manuals, blogs, or video reviews?{" "}
          <button
            onClick={scrollToResources}
            className="underline hover:text-[#0e4a8a] transition-colors"
          >
            Click here to jump to Resources
          </button>{" "}
          or explore the tab below.
        </p>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="specifications" className="mb-12">
        <TabsList className="w-full justify-start border-b">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="faq">Resources</TabsTrigger>
        </TabsList>

        {/* Specifications Tab */}
        <TabsContent value="specifications" className="pt-6">
          <ProductSpecifications specifications={product.specifications} />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="pt-6">
          <ProductReviews rating={product.rating} reviewCount={product.reviewCount} />
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="pt-6">
          <div ref={resourcesRef}>
    <ProductResources resources={yourResourceArray} />
  </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <RelatedProducts productIds={product.relatedProducts || []} productsData={productsData} />
      </div>
    </div>
  )
}

export { productsData }