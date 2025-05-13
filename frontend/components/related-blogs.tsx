import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"

export default function RelatedBlogs({ blogs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          href={blog.url}
          className="group border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-all"
        >
          <div className="relative h-48 bg-gray-100">
            <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
              <Calendar className="h-4 w-4" />
              <span>{blog.date}</span>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-[#1a5ca4] transition-colors">{blog.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{blog.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
