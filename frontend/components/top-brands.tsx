import Link from "next/link"

export default function TopBrands() {
  const brands = [
    {
      name: "Jinko Solar",
      slug: "jinko-solar",
    },
    {
      name: "Canadian Solar",
      slug: "canadian-solar",
    },
    {
      name: "Longi Solar",
      slug: "longi-solar",
    },
    {
      name: "Growatt",
      slug: "growatt",
    },
    {
      name: "Tesla",
      slug: "tesla",
    },
    {
      name: "SMA",
      slug: "sma",
    },
  ]

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-[#1a5ca4] mb-4">Top Brands</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {brands.map((brand, index) => (
          <Link
            key={index}
            href={`/brand/${brand.slug}`}
            className="border border-gray-200 rounded-lg p-4 h-24 flex items-center justify-center hover:border-[#1a5ca4] hover:shadow-sm transition-all"
          >
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-10 mx-auto mb-2 flex items-center justify-center">
                <span className="text-gray-400 text-xs">[{brand.name} Logo]</span>
              </div>
              <span className="text-sm font-medium">{brand.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
