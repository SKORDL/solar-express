"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu, X, ChevronDown, ChevronRight, MapPin } from "lucide-react"
import { Sun, Battery, Zap, Home, Wrench, ShieldCheck, House } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PriceTicker from "./price-ticker"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

// Updated category structure with Pakistani brands
const categoryData = [
	
	{
		name: "Solar Panels",
		icon: Sun,
		color: "bg-blue-100",
		iconColor: "text-[#1a5ca4]",
		route: "/store?category=solar-panels",
		brands: [
			{
				name: "Jinko Solar", //{ name: "Sorotec", slug: "sorotec", logo: "growatt-logo" },
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
		],
	},
	{
		name: "Inverters",
		icon: Zap,
		color: "bg-amber-100",
		iconColor: "text-amber-600",
		route: "/store?category=inverters",
		brands: [
			{
				name: "Fox ESS",
				subcategories: ["Hybrid Inverters", "Battery Solutions", "Single Phase", "Three Phase"],
				url: "/brand/fox-ess",
			},
			{
				name: "Sorotec",
				subcategories: ["Primo Series", "Symo Series", "Hybrid Solutions"],
				url: "/brand/sorotec",
			},
			{
				name: "Luxpower",
				subcategories: ["Hybrid Inverters", "Off-Grid Inverters", "Grid-Tie Inverters", "Commercial Solutions"],
				url: "/brand/luxpower",
			},
			{
				name: "Growatt",
				subcategories: ["String Inverters", "Hybrid Inverters", "Microinverters", "Commercial Inverters"],
				url: "/brand/growatt",
			},
		],
	},
	{
		name: "Batteries",
		icon: Battery,
		color: "bg-green-100",
		iconColor: "text-green-600",
		route: "/store?category=batteries",
		brands: [
			{
				name: "Tesla",
				subcategories: ["Powerwall", "Powerpack", "Accessories", "Gateway Systems"],
				url: "/brand/tesla",
			},
			{
				name: "AGS Batteries",
				subcategories: ["Lithium Series", "Lead Acid", "Deep Cycle", "Solar Batteries"],
				url: "/brand/ags-batteries",
			},
			{
				name: "Exide",
				subcategories: ["Solar Specific", "Tubular Batteries", "Industrial Series", "Home Systems"],
				url: "/brand/exide",
			},
		],
	},
	{
		name: "Tools",
		icon: Wrench,
		color: "bg-red-100",
		iconColor: "text-red-600",
		route: "/store?category=tools",
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
				name: "Pak Solar",
				subcategories: ["Rooftop Frames", "Ground Mounting", "Carport Systems", "Custom Solutions"],
				url: "/brand/pak-solar",
			},
		],
	},
	{
		name: "Complete Systems",
		icon: Home,
		color: "bg-purple-100",
		iconColor: "text-purple-600",
		route: "/store?category=complete-systems",
		brands: [
			{
				name: "Solar Packages",
				subcategories: ["3kW Systems", "5kW Systems", "10kW Systems", "Commercial Systems"],
				url: "/complete-systems",
			},
			{
				name: "Off-Grid Solutions",
				subcategories: ["Residential", "Commercial", "Industrial", "Agricultural"],
				url: "/off-grid-solutions",
			},
			{
				name: "Hybrid Systems",
				subcategories: ["With Battery", "Without Battery", "Grid-Assisted", "Backup Solutions"],
				url: "/hybrid-systems",
			},
		],
	},
	{
		name: "Accessories",
		icon: ShieldCheck,
		color: "bg-teal-100",
		iconColor: "text-teal-600",
		route: "/store?category=accessories",
		brands: [
			{
				name: "Victron Energy",
				subcategories: ["Monitoring Systems", "Charge Controllers", "Inverter Chargers", "System Integration"],
				url: "/brand/victron-energy",
			},
			{
				name: "MTECH",
				subcategories: ["Connectors", "Cables", "Junction Boxes", "Fuses & Breakers"],
				url: "/brand/mtech",
			},
			{
				name: "PEL Solar",
				subcategories: ["Meters", "DC Disconnects", "Combiner Boxes", "AC/DC Cables"],
				url: "/brand/pel-solar",
			},
		],
	},
]

// Main navigation items
const navItems = [
	{ name: "Home", href: "/" },
	{ name: "Solar Panels", href: "/store?category=solar-panels" },
	{ name: "Inverters", href: "/store?category=inverters" },
	{ name: "Batteries", href: "/store?category=batteries" },
	{ name: "Complete Systems", href: "/store?category=complete-systems" },
	{ name: "Insurance", href: "/insurance" },
	{ name: "Installment Plans", href: "/installments" },
	{ name: "Blogs", href: "/blogs" },
	{ name: "Contact", href: "/contact" },
]

// Department navigation items (for mobile)
const departmentNavItems = [
	{ name: "Insurance", href: "/insurance" },
	{ name: "Installment Plans", href: "/installments" },
	{ name: "Blogs", href: "/blogs" },
	{ name: "Contact", href: "/contact" },
]

export default function Header() {
	const { user, logout } = useAuth()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [activeCategory, setActiveCategory] = useState(null)
	const [activeBrand, setActiveBrand] = useState(null)
	const [activeMobileCategory, setActiveMobileCategory] = useState(null)
	const [expandedMobileCategory, setExpandedMobileCategory] = useState(null)
	const [searchTerm, setSearchTerm] = useState("")
	const menuRef = useRef(null)
	const mobileSidebarRef = useRef(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	const [dropdownOpen, setDropdownOpen] = useState(false)

	// Close menu when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsMenuOpen(false)
				setActiveCategory(null)
				setActiveBrand(null)
			}

			if (mobileSidebarRef.current && !mobileSidebarRef.current.contains(event.target) && isMobileMenuOpen) {
				setIsMobileMenuOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isMobileMenuOpen])

	// Close dropdown on outside click
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setDropdownOpen(false)
			}
		}
		if (dropdownOpen) document.addEventListener("mousedown", handleClick)
		return () => document.removeEventListener("mousedown", handleClick)
	}, [dropdownOpen])

	// Handle category hover
	const handleCategoryHover = (index) => {
		setActiveCategory(index)
		setActiveBrand(null)
	}

	// Handle brand hover
	const handleBrandHover = (index) => {
		setActiveBrand(index)
	}

	// Toggle mobile category
	const toggleMobileCategory = (index) => {
		setActiveMobileCategory(activeMobileCategory === index ? null : index)
	}

	// Toggle expanded mobile category
	const toggleExpandedMobileCategory = (index) => {
		setExpandedMobileCategory(expandedMobileCategory === index ? null : index)
	}

	// Navigate to brand page
	const navigateToBrand = (url) => {
		// In a real implementation, you would use router.push(url) or similar
		console.log(`Navigating to: ${url}`)
		setIsMenuOpen(false)
		setActiveCategory(null)
		setActiveBrand(null)
	}

	// Handle mobile navigation click - close sidebar after navigation
	const handleMobileNavClick = () => {
		// Add a small delay to allow page navigation to start
		setTimeout(() => {
			setIsMobileMenuOpen(false)
			setActiveMobileCategory(null)
			setExpandedMobileCategory(null)
		}, 100)
	}

	const handleSearch = (e) => {
		e.preventDefault()
		if (searchTerm.trim()) {
			router.push(`/store?search=${encodeURIComponent(searchTerm.trim())}`)
			setIsMobileMenuOpen(false)
			setActiveCategory(null)
			setActiveBrand(null)
			setSearchTerm("") // Clear input after search
		}
	}

	const handleLogout = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault()
			e.stopPropagation()
		}
		logout()
		setDropdownOpen(false)
		router.push("/auth")
	}

	return (
		<header className="sticky top-0 z-50 bg-white">
			{/* Top bar with ticker */}
			<div className="overflow-hidden">
				<PriceTicker />
			</div>

			{/* Main header */}
			<div className="bg-[#1a5ca4] py-3 md:px-14 lg:px-24">
				<div className="container mx-auto flex items-center justify-between">
					{/* Logo and location */}
					<div className="flex items-center gap-4 ">
						<Link href="/" className="flex items-center">
							<div className="w-16 h-8 md:w-22 md:h-11 rounded-full flex items-center justify-center">
								<img
									src="/logo-crop.PNG"
									alt="Solar Express Logo"
									className="w-auto h-auto object-cover"
								/>
							</div>
						</Link>

						<div className="hidden md:flex items-center gap-2 bg-[#0e4a8a] hover:bg-[#0a3d7a] rounded-full px-4 py-1 cursor-pointer">
							<MapPin className="h-5 w-5 text-white" />
							<div className="flex flex-col">
								<span className="text-xs text-white/80">I'm here</span>
								<span className="text-sm font-medium text-white">Islamabad</span>
							</div>
							<ChevronDown className="h-4 w-4 text-white/80" />
						</div>
					</div>

					{/* Search bar */}
					<div className="flex-1 max-w-lg mx-4">
						<form onSubmit={handleSearch}>
							<div className="relative">
								<Input
									type="text"
									placeholder="Search here"
									className="w-full py-2 pl-4 pr-10 rounded-full border-0 shadow-sm"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								<Button
									type="submit"
									className="absolute right-0 top-0 h-full bg-[#f26522] hover:bg-[#e55511] rounded-l-none rounded-r-full"
									size="icon"
								>
									<Search className="h-4 w-4" />
								</Button>
							</div>
						</form>
					</div>

					{/* Account and cart */}

					<div className="flex items-center gap-1 md:gap-4">
						<div className="relative" ref={dropdownRef}>
							{user ? (
								<button
									type="button"
									className="hidden md:flex flex-col items-end cursor-pointer bg-transparent border-none outline-none"
									onClick={() => setDropdownOpen((v) => !v)}
								>
									<span className="text-xs text-white/80">Hi, {user.name?.split(" ")[0]}</span>
									<div className="flex items-center">
										<span className="text-sm font-medium text-white">Account</span>
										<ChevronDown className="h-4 w-4 text-white/80 ml-1" />
									</div>
								</button>
							) : (
								<Link href="/auth" className="hidden md:flex flex-col items-end cursor-pointer">
									<span className="text-xs text-white/80">Sign In</span>
									<div className="flex items-center">
										<span className="text-sm font-medium text-white">Account</span>
										<ChevronDown className="h-4 w-4 text-white/80 ml-1" />
									</div>
								</Link>
							)}

							{/* Dropdown Menu */}
							{dropdownOpen && user && (
								<div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
									<Link
										href="/account"
										className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
										onClick={() => setDropdownOpen(false)}
									>
										Account
									</Link>
									<button
										className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
										onClick={handleLogout}
									>
										Logout
									</button>
								</div>
							)}
						</div>

						<Link href="/cart" className="relative">
							<div className="bg-[#f26522] rounded-full w-10 h-10 flex items-center justify-center">
								<ShoppingCart className="h-5 w-5 text-white" />
								<span className="absolute -top-1 -right-1 bg-[#0e4a8a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
									0
								</span>
							</div>
						</Link>

						{/* Mobile menu toggle */}
						<Button
							variant="ghost"
							size="mobileMenu" // Use the new mobileMenu size variant
							className="md:hidden text-white"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? <X /> : <Menu />}
						</Button>
					</div>
				</div>
			</div>

			{/* Navigation bar */}
			<div className="bg-[#0e4a8a] text-white py-1 px-4 hidden md:block border-t border-[#1a5ca4]/30">
				<div className="container md:px-14 lg:px-14 flex items-center">
					{/* Departments dropdown */}
					<div className="relative" ref={menuRef}>
						<Button
							variant="ghost"
							className="flex items-center gap-2 font-medium text-white"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<Menu className="h-8 w-8" />
							<span>Categories</span>
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
											className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
												activeCategory === index ? "bg-gray-100 font-medium text-[#1a5ca4]" : "text-gray-800"
											}`}
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
												className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
													activeBrand === index ? "bg-gray-50 font-medium text-[#1a5ca4]" : "text-gray-800"
												}`}
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

					{/* Main navigation - scrollable */}
					<nav className="flex ml-4 overflow-x-auto hide-scrollbar">
						{navItems.map((item, index) => (
							<Link key={index} href={item.href} className="px-3 py-2 text-sm hover:text-[#f26522] whitespace-nowrap">
								{item.name}
							</Link>
						))}
					</nav>
				</div>
			</div>

			{/* Mobile menu - animated sidebar */}
			<div
				ref={mobileSidebarRef}
				className={`md:hidden fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out overflow-y-auto w-4/5 ${
					isMobileMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"
				}`}
				style={{ maxWidth: "320px" }}
			>
				{/* Mobile header */}
				<div className="flex items-center justify-between p-4 bg-[#1a5ca4] text-white">
					<div className="flex items-center gap-2">
						<div className="w-12 h-6 rounded-full flex items-center justify-center">
							<img
								src="/logo-crop.PNG"
								alt="Solar Express Logo"
								className="w-full h-full object-cover"
							/>
						</div>
						<span className="text-xl font-bold ml-6"></span>
					</div>
					<Button variant="ghost" size="icon" className="text-white" onClick={() => setIsMobileMenuOpen(false)}>
						<X className="h-6 w-6" />
					</Button>
				</div>

				{/* User section */}
				<div className="p-4 border-b border-gray-200 bg-[#0e4a8a] text-white">
					<div className="flex items-center gap-3">
						<div className="bg-[#f26522] rounded-full w-10 h-10 flex items-center justify-center">
							<User className="h-5 w-5 text-white" />
						</div>
						<div className="flex-1">
							{user ? (
								<div>
									<span className="text-sm font-medium block">Hello, {user.name?.split(" ")[0] || "User"}</span>
									<span className="text-xs text-white/80 block">Manage your account</span>
									<button
										className="text-xs text-red-300 hover:text-red-200 mt-1 underline"
										onClick={(e) => {
											handleLogout(e)
											handleMobileNavClick()
										}}
									>
										Sign Out
									</button>
								</div>
							) : (
								<Link href="/auth" onClick={handleMobileNavClick}>
									<span className="text-sm font-medium block">Sign In / Register</span>
									<span className="text-xs text-white/80 block">Manage your account</span>
								</Link>
							)}
						</div>
					</div>
				</div>

				{/* Departments section - scrollable horizontally */}
				<div className="py-3 px-2 border-b border-gray-200 bg-gray-50">
					<h3 className="text-lg font-medium px-2 mb-2 text-[#1a5ca4]">Departments</h3>
					<div className="flex overflow-x-auto pb-2 hide-scrollbar">
						{categoryData.map((category, index) => (
							<Link
								key={index}
								href={category.route}
								className="flex-shrink-0 mr-2 w-24"
								onClick={handleMobileNavClick}
							>
								<div className="rounded-lg bg-white border border-gray-200 p-2 flex flex-col items-center justify-center h-24 shadow-sm hover:border-[#f26522] hover:shadow-md transition-all">
									<div className="h-12 w-12 rounded-full bg-[#1a5ca4]/10 flex items-center justify-center mb-1">
										<category.icon className={`h-8 w-8 ${category.iconColor}`} />
									</div>
									<span className="text-xs text-center font-medium">{category.name}</span>
								</div>
							</Link>
						))}
					</div>
				</div>

				{/* Category navigation (replaced navItems) */}
				<nav className="p-4">
					<h3 className="text-lg font-medium mb-3 text-[#1a5ca4]">Brands</h3>
					{categoryData.map((category, index) => (
						<div key={index} className="mb-2">
							<div
								className="flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer"
								onClick={() => toggleExpandedMobileCategory(index)}
							>
								<div className="flex items-center gap-3">
									<div className="h-8 w-8 rounded-full bg-[#1a5ca4]/10 flex items-center justify-center">
										<category.icon className={`h-5 w-5 ${category.iconColor}`} />
									</div>
									<span className="text-[#1a5ca4] font-medium">{category.name}</span>
								</div>
								<ChevronDown
									className={`h-4 w-4 text-gray-400 transition-transform ${expandedMobileCategory === index ? "rotate-180" : ""}`}
								/>
							</div>

							{/* Expanded category content */}
							{expandedMobileCategory === index && (
								<div className="pl-11 py-2 space-y-2">
									{/* Category main link */}
									<Link
										href={category.route}
										className="block p-2 text-sm text-[#f26522] font-medium hover:bg-gray-50 rounded"
										onClick={handleMobileNavClick}
									>
										View All {category.name}
									</Link>

									{/* Brand links */}
									{category.brands.map((brand, brandIndex) => (
										<Link
											key={brandIndex}
											href={brand.url}
											className="block p-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1a5ca4] rounded"
											onClick={handleMobileNavClick}
										>
											{brand.name}
										</Link>
									))}
								</div>
							)}
						</div>
					))}
				</nav>

				{/* Department navigation links (Insurance, Installments, etc.) */}
				<div className="p-4 border-t border-gray-200">
					<h3 className="text-lg font-medium mb-3 text-[#1a5ca4]">Services</h3>
					{departmentNavItems.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							className="flex items-center justify-between p-3 border-b border-gray-100"
							onClick={handleMobileNavClick}
						>
							<span className="text-[#1a5ca4]">{item.name}</span>
							<ChevronRight className="h-4 w-4 text-gray-400" />
						</Link>
					))}
				</div>
			</div>

			{/* Overlay when mobile menu is open */}
			{isMobileMenuOpen && (
				<div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
			)}

			{/* Add custom styles for hiding scrollbars but allowing scroll */}
			<style jsx global>{`
				.hide-scrollbar {
					-ms-overflow-style: none; /* IE and Edge */
					scrollbar-width: none; /* Firefox */
				}
				.hide-scrollbar::-webkit-scrollbar {
					display: none; /* Chrome, Safari and Opera */
				}
			`}</style>
		</header>
	)
}
