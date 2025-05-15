"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ShoppingCart, User, Menu, X, ChevronDown, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PriceTicker from "./price-ticker"
import Link from "next/link"

// Define the category structure with brands and sub-categories
const categoryData = [
  {
    name: "Solar Panels",
    brands: [
      {
        name: "Jinko Solar",
        subcategories: ["Mono PERC Panels", "Bifacial Panels", "N-Type Panels", "Tiger Neo Series"],
        url: "/brand/jinko-solar",
      },
      {
        name: "Canadian Solar",
        subcategories: ["HiKu Panels", "BiHiKu Panels", "All Black Panels", "Commercial Panels"],
        url: "/brand/canadian-solar",
      },
      {
        name: "Longi Solar",
        subcategories: ["Hi-MO 5 Series", "Hi-MO 6 Series", "Residential Panels", "Commercial Panels"],
        url: "/brand/longi-solar",
      },
      {
        name: "JA Solar",
        subcategories: ["MBB Half-Cell", "Bifacial Modules", "All Black Series", "Commercial Series"],
        url: "/brand/ja-solar",
      },
    ],
  },
  {
    name: "Inverters",
    brands: [
      {
        name: "Growatt",
        subcategories: ["String Inverters", "Hybrid Inverters", "Microinverters", "Commercial Inverters"],
        url: "/brand/growatt",
      },
      {
        name: "SMA",
        subcategories: ["Sunny Boy Series", "Sunny Tripower", "Sunny Island", "Monitoring Systems"],
        url: "/brand/sma",
      },
      {
        name: "Fronius",
        subcategories: ["Primo Series", "Symo Series", "Hybrid Solutions", "Commercial Solutions"],
        url: "/brand/fronius",
      },
      {
        name: "Huawei",
        subcategories: ["Residential Inverters", "Commercial Inverters", "Smart Energy Centers", "Monitoring"],
        url: "/brand/huawei",
      },
    ],
  },
  {
    name: "Batteries",
    brands: [
      {
        name: "Tesla",
        subcategories: ["Powerwall", "Powerpack", "Accessories", "Gateway Systems"],
        url: "/brand/tesla",
      },
      {
        name: "Pylontech",
        subcategories: ["US2000 Series", "US3000 Series", "Force L2 Series", "Commercial Solutions"],
        url: "/brand/pylontech",
      },
      {
        name: "LG Chem",
        subcategories: ["RESU Series", "RESU Prime", "Commercial Solutions", "Accessories"],
        url: "/brand/lg-chem",
      },
      {
        name: "BYD",
        subcategories: ["Battery-Box Premium", "HVS Series", "HVM Series", "Commercial Solutions"],
        url: "/brand/byd",
      },
    ],
  },
  {
    name: "Mounting Systems",
    brands: [
      {
        name: "K2 Systems",
        subcategories: ["Flat Roof Systems", "Pitched Roof Systems", "Ground Mount Systems", "Accessories"],
        url: "/brand/k2-systems",
      },
      {
        name: "IronRidge",
        subcategories: ["Roof Mount", "Ground Mount", "Components", "Accessories"],
        url: "/brand/ironridge",
      },
      {
        name: "Schletter",
        subcategories: ["Roof Systems", "Ground Systems", "Carport Systems", "Custom Solutions"],
        url: "/brand/schletter",
      },
    ],
  },
  {
    name: "Accessories",
    brands: [
      {
        name: "Victron Energy",
        subcategories: ["Monitoring Systems", "Charge Controllers", "Inverter Chargers", "System Integration"],
        url: "/brand/victron-energy",
      },
      {
        name: "Enphase",
        subcategories: ["Microinverters", "Batteries", "System Controllers", "Monitoring"],
        url: "/brand/enphase",
      },
      {
        name: "Tigo",
        subcategories: ["Optimizers", "Monitoring", "Safety Solutions", "Commercial Solutions"],
        url: "/brand/tigo",
      },
    ],
  },
]

// Main navigation items
const navItems = [
  { name: "Solar Panels", href: "/store?category=solar-panels" },
  { name: "Inverters", href: "/store?category=inverters" },
  { name: "Batteries", href: "/store?category=batteries" },
  { name: "Complete Systems", href: "/store?category=complete-systems" },
  { name: "Insurance", href: "/insurance" },
  { name: "Installment Plans", href: "/installment" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
        setActiveCategory(null)
        setActiveBrand(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle category hover
  const handleCategoryHover = (index) => {
    setActiveCategory(index)
    setActiveBrand(null)
  }

  // Handle brand hover
  const handleBrandHover = (index) => {
    setActiveBrand(index)
  }

  // Navigate to brand page
  const navigateToBrand = (url) => {
    // In a real implementation, you would use router.push(url) or similar
    console.log(`Navigating to: ${url}`)
    setIsMenuOpen(false)
    setActiveCategory(null)
    setActiveBrand(null)
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top bar with ticker */}
      <div className="overflow-hidden">
        <PriceTicker />
      </div>

      {/* Main header */}
      <div className="bg-[#1a5ca4] py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo and location */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                <img src="/solar-express-logo-09.png" alt="Solar Express Logo" className="w-full h-full object-cover" />
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2 bg-[#0e4a8a] hover:bg-[#0a3d7a] rounded-full px-4 py-2 cursor-pointer">
              <MapPin className="h-5 w-5 text-white" />
              <div className="flex flex-col">
                <span className="text-xs text-white/80">Delivery to</span>
                <span className="text-sm font-medium text-white">Lahore, Pakistan</span>
              </div>
              <ChevronDown className="h-4 w-4 text-white/80" />
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-3xl mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search solar panels, inverters, batteries and more..."
                className="w-full py-2 pl-4 pr-10 rounded-full border-0 shadow-sm"
              />
              <Button
                className="absolute right-0 top-0 h-full bg-[#f26522] hover:bg-[#e55511] rounded-l-none rounded-r-full"
                size="icon"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Account and cart */}
          <div className="flex items-center gap-1 md:gap-4">
            <div className="hidden md:flex flex-col items-end cursor-pointer">
              <span className="text-xs text-white/80">Sign In</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-white">Account</span>
                <ChevronDown className="h-4 w-4 text-white/80 ml-1" />
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end cursor-pointer">
              <span className="text-xs text-white/80">My Items</span>
              <span className="text-sm font-medium text-white">Wishlist</span>
            </div>

            <Link href="/cart" className="relative">
              <div className="bg-[#f26522] rounded-full w-10 h-10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
                <span className="absolute -top-1 -right-1 bg-[#0e4a8a] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </div>
              <span className="hidden md:block text-xs text-white mt-1">PKR 0.00</span>
            </Link>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="bg-[#0e4a8a] text-white py-1 px-4 hidden md:block border-t border-[#1a5ca4]/30">
        <div className="container mx-auto flex items-center">
          {/* Departments dropdown */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost"
              className="flex items-center gap-2 font-medium text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span>Departments</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Departments dropdown menu */}
            {isMenuOpen && (
              <div
                className="absolute left-0 top-full z-50 flex bg-white shadow-xl rounded-b-lg overflow-hidden"
                style={{ width: "800px", maxWidth: "calc(100vw - 40px)" }}
              >
                {/* Main categories column */}
                <div className="w-1/4 bg-gray-50 border-r border-gray-200">
                  {categoryData.map((category, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${activeCategory === index ? "bg-gray-100 font-medium text-[#1a5ca4]" : "text-gray-800"}`}
                      onMouseEnter={() => handleCategoryHover(index)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Brands column */}
                {activeCategory !== null && (
                  <div className="w-1/4 bg-white border-r border-gray-200">
                    {categoryData[activeCategory].brands.map((brand, index) => (
                      <div
                        key={index}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${activeBrand === index ? "bg-gray-50 font-medium text-[#1a5ca4]" : "text-gray-800"}`}
                        onMouseEnter={() => handleBrandHover(index)}
                        onClick={() => navigateToBrand(brand.url)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{brand.name}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subcategories column */}
                {activeCategory !== null && activeBrand !== null && (
                  <div className="w-2/4 bg-white p-4">
                    <h3 className="font-bold text-[#1a5ca4] mb-3">
                      {categoryData[activeCategory].brands[activeBrand].name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryData[activeCategory].brands[activeBrand].subcategories.map((subcat, index) => (
                        <a
                          key={index}
                          href="#"
                          className="px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-[#1a5ca4]"
                        >
                          {subcat}
                        </a>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <a
                        href={categoryData[activeCategory].brands[activeBrand].url}
                        className="text-[#f26522] font-medium hover:underline"
                      >
                        View all {categoryData[activeCategory].brands[activeBrand].name} products
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main navigation */}
          <nav className="flex ml-4">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href} className="px-3 py-2 text-sm hover:text-[#f26522] whitespace-nowrap">
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#1a5ca4]" />
              <div>
                <span className="text-sm font-medium">Sign In</span>
                <span className="text-xs text-gray-500 block">Account & Orders</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <div className="font-medium mb-2">Shop by Department</div>
              <div className="space-y-2">
                {categoryData.map((category, index) => (
                  <div key={index} className="border-b border-gray-100 pb-2">
                    <Link href="#" className="text-[#1a5ca4]">
                      {category.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Quick Links</div>
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-2">
                    <Link href={item.href} className="text-[#1a5ca4]">
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
