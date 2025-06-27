"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Filter, ChevronDown  } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import InBrandAd from "@/components/inBrandAd"
import { useState, use } from "react"

// Sample brand data - in a real app, this would come from a database or API
const brandsData = {
  "jinko-solar": {
    name: "Jinko Solar",
    logo: "/jinko-logo.webp",
    banner: "/bann-4.png",
    mobileBanner: "/bann-4.png",
    description: "Jinko is one of the largest and most innovative solar module manufacturers in the world. With a strong global presence, Jinko Solar is known for its high-efficiency panels and commitment to quality and innovation.",
    established: 2006,
    headquarters: "Shanghai",
    warranty: "12-year product warranty, 25-year performance warranty",
    categories: ["Mono PERC Panels", "Bifacial Panels", "N-Type Panels", "Tiger Neo Series"],
    featuredProducts: [
      {
        id: "jinko-tiger-neo",
        name: "Jinko 550W Tiger Neo N-Type Solar Panel",
        price: 42500,
        discountPrice: 39999,
        image: "jinko-panel-1",
      },
      {
        id: "jinko-eagle-bifacial",
        name: "Jinko 535W Eagle Bifacial Solar Panel",
        price: 41000,
        discountPrice: null,
        image: "jinko-panel-2",
      },
      {
        id: "jinko-residential",
        name: "Jinko 410W All Black Residential Panel",
        price: 32000,
        discountPrice: 29999,
        image: "jinko-panel-3",
      },
      {
        id: "jinko-commercial",
        name: "Jinko 600W Tiger Pro Commercial Panel",
        price: 48000,
        discountPrice: null,
        image: "jinko-panel-4",
      },
    ],
  },
  "canadian-solar": {
    name: "Canadian Solar",
    logo: "canadian-logo",
    banner: "/bann-4.png",
    mobileBanner: "/bann-4.png",
    description: "Canadian Solar is one of the world's largest solar technology and renewable energy companies. They are a leading manufacturer of solar photovoltaic modules and provider of solar energy solutions with operations across the globe.",
    established: 2001,
    headquarters: "Ontario, Canada",
    warranty: "12-year product warranty, 25-year performance warranty",
    categories: ["HiKu Panels", "BiHiKu Panels", "All Black Panels", "Commercial Panels"],
    featuredProducts: [
      {
        id: "canadian-bihiku",
        name: "Canadian Solar 540W BiHiKu Bifacial Panel",
        price: 45000,
        discountPrice: 42500,
        image: "canadian-panel-1",
      },
      {
        id: "canadian-hiku",
        name: "Canadian Solar 450W HiKu Mono PERC Panel",
        price: 36000,
        discountPrice: null,
        image: "canadian-panel-2",
      },
      {
        id: "canadian-residential",
        name: "Canadian Solar 400W All Black Residential Panel",
        price: 30000,
        discountPrice: 28500,
        image: "canadian-panel-3",
      },
      {
        id: "canadian-commercial",
        name: "Canadian Solar 590W HiKu6 Commercial Panel",
        price: 47000,
        discountPrice: null,
        image: "canadian-panel-4",
      },
    ],
  },
  "longi-solar": {
    name: "Longi Solar",
    logo: "longi-logo",
    banner: "/bann-4.png",
    mobileBanner: "/bann-4.png",
    description: "LONGi Solar is the world's largest manufacturer of high-efficiency mono-crystalline solar cells and modules. The company focuses on technological innovation and has set multiple world records for cell efficiency.",
    established: 2000,
    headquarters: "Xi'an, China",
    warranty: "12-year product warranty, 25-year performance warranty",
    categories: ["Hi-MO 5 Series", "Hi-MO 6 Series", "Residential Panels", "Commercial Panels"],
    featuredProducts: [
      {
        id: "longi-himo5",
        name: "Longi 500W Hi-MO 5 Mono PERC Module",
        price: 39999,
        discountPrice: 37500,
        image: "longi-panel-1",
      },
      {
        id: "longi-himo6",
        name: "Longi 430W Hi-MO 6 Residential Panel",
        price: 34000,
        discountPrice: null,
        image: "longi-panel-2",
      },
      {
        id: "longi-residential",
        name: "Longi 415W All Black Residential Panel",
        price: 32500,
        discountPrice: 30000,
        image: "longi-panel-3",
      },
      {
        id: "longi-commercial",
        name: "Longi 570W Hi-MO 5m Commercial Panel",
        price: 46000,
        discountPrice: null,
        image: "longi-panel-4",
      },
    ],
  },
  "fox-ess": {
    name: "Fox ESS",
    logo: "/fox-logo.webp",
    banner: "/bann-7.png",
    mobileBanner: "/bann-6.png",
    description: "Fox ESS is a global leader in energy storage solutions, specializing in hybrid inverters, battery systems, and smart energy management. Their products are known for high efficiency and reliability in residential and commercial applications.",
    established: 2012,
    headquarters: "Jiangsu, China",
    warranty: "10-year product warranty",
    categories: ["Hybrid Inverters", "Battery Solutions", "Single Phase", "Three Phase"],
    featuredProducts: [
      {
        id: "fox-hybrid",
        name: "Fox ESS H1 5kW Hybrid Inverter",
        price: 180000,
        discountPrice: 170000,
        image: "fox-inverter-1",
      },
      {
        id: "fox-battery",
        name: "Fox ESS LV5200 5.12kWh Battery",
        price: 250000,
        discountPrice: 235000,
        image: "fox-battery-1",
      },
      {
        id: "fox-three-phase",
        name: "Fox ESS T30 30kW Three Phase Inverter",
        price: 450000,
        discountPrice: null,
        image: "fox-inverter-2",
      },
      {
        id: "fox-single-phase",
        name: "Fox ESS S6 6kW Single Phase Inverter",
        price: 190000,
        discountPrice: 180000,
        image: "fox-inverter-3",
      },
    ],
  },
  "sorotec": {
    name: "Sorotec",
    logo: "/sorotec-logo.png",
    banner: "/bann-3.png",
    mobileBanner: "/bann-3.png",
    description: "Sorotec is a global leader in smart energy solutions, specializing in residential and commercial solar inverters, storage systems, and smart energy management solutions. The company is known for its reliable and cost-effective products.",
    established: 2010,
    headquarters: "Shenzhen, China",
    warranty: "5-10 year standard warranty, extendable to 20 years",
    categories: ["String Inverters", "Hybrid Inverters", "Microinverters", "Commercial Inverters"],
    featuredProducts: [
      {
        id: "sorotec-hybrid",
        name: "Sorotec 5kW SPF 5000ES Hybrid Inverter",
        price: 185000,
        discountPrice: 175000,
        image: "/prod-1.jpg",
      },
      {
        id: "sorotec-string",
        name: "Sorotec 8kW MIN 8000TL-X String Inverter",
        price: 150000,
        discountPrice: null,
        image: "/prod-2.jpg",
      },
      {
        id: "sorotec-lvm",
        name: "Sorotec 3kW SPF 3000TL LVM-ES Inverter",
        price: 120000,
        discountPrice: 110000,
        image: "/prod-3.jpg",
      },
    ],
  },
  "luxpower": {
    name: "Luxpower",
    logo: "/luxpower-logo.png",
    banner: "/bann-3.png",
    mobileBanner: "/bann-3.png",
    description: "Luxpower is a leading manufacturer of solar inverters and energy storage solutions, offering a wide range of products for residential, commercial, and industrial applications with a focus on innovation and efficiency.",
    established: 2007,
    headquarters: "Shenzhen, China",
    warranty: "5-10 year product warranty",
    categories: ["Hybrid Inverters", "Off-Grid Inverters", "Grid-Tie Inverters", "Commercial Solutions"],
    featuredProducts: [
      {
        id: "lux-hybrid",
        name: "Luxpower LXP 6kW Hybrid Inverter",
        price: 195000,
        discountPrice: 185000,
        image: "lux-inverter-1",
      },
      {
        id: "lux-offgrid",
        name: "Luxpower SNA 5kW Off-Grid Inverter",
        price: 175000,
        discountPrice: 165000,
        image: "lux-inverter-2",
      },
      {
        id: "lux-gridtie",
        name: "Luxpower GCI 10kW Grid-Tie Inverter",
        price: 220000,
        discountPrice: null,
        image: "lux-inverter-3",
      },
      {
        id: "lux-commercial",
        name: "Luxpower CMT 20kW Commercial Inverter",
        price: 380000,
        discountPrice: 360000,
        image: "lux-inverter-4",
      },
    ],
  },
  "growatt": {
    name: "Growatt",
    logo: "/growatt-logo.png",
    banner: "/bann-3.png",
    mobileBanner: "/bann-3.png",
    description: "Growatt is a global leader in photovoltaic inverter technology and energy storage solutions, offering innovative products for residential, commercial, and utility-scale applications worldwide.",
    established: 2011,
    headquarters: "Shenzhen, China",
    warranty: "5-10 year product warranty",
    categories: ["String Inverters", "Hybrid Inverters", "Microinverters", "Commercial Inverters"],
    featuredProducts: [
      {
        id: "growatt-hybrid",
        name: "Growatt MIN 5000TL-XH Hybrid Inverter",
        price: 175000,
        discountPrice: 165000,
        image: "growatt-inverter-1",
      },
      {
        id: "growatt-string",
        name: "Growatt MOD 10kW String Inverter",
        price: 210000,
        discountPrice: null,
        image: "growatt-inverter-2",
      },
      {
        id: "growatt-micro",
        name: "Growatt MIC 1000TL-X Microinverter",
        price: 45000,
        discountPrice: 42000,
        image: "growatt-inverter-3",
      },
      {
        id: "growatt-commercial",
        name: "Growatt MAC 50kW Commercial Inverter",
        price: 850000,
        discountPrice: 800000,
        image: "growatt-inverter-4",
      },
    ],
  },
  "tesla": {
    name: "Tesla",
    logo: "/tesla-logo.png",
    banner: "/bann-5.webp",
    mobileBanner: "/bann-5.webp",
    description: "Tesla Energy is revolutionizing energy storage with its Powerwall and Powerpack systems, offering sleek, high-capacity lithium-ion battery solutions for homes and businesses.",
    established: 2003,
    headquarters: "Palo Alto, California",
    warranty: "10-year product warranty",
    categories: ["Powerwall", "Powerpack", "Accessories", "Gateway Systems"],
    featuredProducts: [
      {
        id: "tesla-powerwall",
        name: "Tesla Powerwall 2 13.5kWh Battery",
        price: 850000,
        discountPrice: 820000,
        image: "tesla-battery-1",
      },
      {
        id: "tesla-gateway",
        name: "Tesla Backup Gateway 2",
        price: 120000,
        discountPrice: null,
        image: "tesla-gateway-1",
      },
      {
        id: "tesla-powerpack",
        name: "Tesla Powerpack 210kWh System",
        price: 6500000,
        discountPrice: 6200000,
        image: "tesla-battery-2",
      },
      {
        id: "tesla-accessories",
        name: "Tesla Solar Inverter 7.6kW",
        price: 250000,
        discountPrice: 235000,
        image: "tesla-inverter-1",
      },
    ],
  },
  "ags-batteries": {
    name: "AGS Batteries",
    logo: "/ags-logo.png",
    banner: "/bann-5.webp",
    mobileBanner: "/bann-5.webp",
    description: "AGS Batteries specializes in high-performance energy storage solutions, offering a wide range of lithium and lead-acid batteries for solar, automotive, and industrial applications.",
    established: 1995,
    headquarters: "Texas, USA",
    warranty: "3-10 year product warranty depending on model",
    categories: ["Lithium Series", "Lead Acid", "Deep Cycle", "Solar Batteries"],
    featuredProducts: [
      {
        id: "ags-lithium",
        name: "AGS 5.12kWh Lithium Solar Battery",
        price: 220000,
        discountPrice: 210000,
        image: "ags-battery-1",
      },
      {
        id: "ags-deepcycle",
        name: "AGS 200Ah Deep Cycle AGM Battery",
        price: 85000,
        discountPrice: 80000,
        image: "ags-battery-2",
      },
      {
        id: "ags-solar",
        name: "AGS 100Ah Solar Gel Battery",
        price: 65000,
        discountPrice: null,
        image: "ags-battery-3",
      },
      {
        id: "ags-leadacid",
        name: "AGS 12V 150Ah Lead Acid Battery",
        price: 55000,
        discountPrice: 50000,
        image: "ags-battery-4",
      },
    ],
  },
  "exide": {
    name: "Exide",
    logo: "/exide-logo.png",
    banner: "/bann-5.webp",
    mobileBanner: "/bann-5.webp",
    description: "Exide Technologies is a global provider of stored electrical energy solutions, manufacturing and recycling lead-acid batteries for automotive and industrial markets with a strong focus on solar applications.",
    established: 1888,
    headquarters: "Georgia, USA",
    warranty: "2-5 year product warranty",
    categories: ["Solar Specific", "Tubular Batteries", "Industrial Series", "Home Systems"],
    featuredProducts: [
      {
        id: "exide-solar",
        name: "Exide Solar 150Ah Tubular Battery",
        price: 75000,
        discountPrice: 70000,
        image: "exide-battery-1",
      },
      {
        id: "exide-industrial",
        name: "Exide 200Ah Industrial Battery",
        price: 90000,
        discountPrice: null,
        image: "exide-battery-2",
      },
      {
        id: "exide-homesystem",
        name: "Exide Home Solar 200Ah Battery Bank",
        price: 180000,
        discountPrice: 170000,
        image: "exide-battery-3",
      },
      {
        id: "exide-tubular",
        name: "Exide 180Ah Tall Tubular Battery",
        price: 80000,
        discountPrice: 75000,
        image: "exide-battery-4",
      },
    ],
  },
  "k2-systems": {
    name: "K2 Systems",
    logo: "/k2-logo.png",
    banner: "/bann-5.webp",
    mobileBanner: "/bann-5.webp",
    description: "K2 Systems is a leading manufacturer of solar mounting systems, offering innovative and reliable solutions for rooftops, ground mounts, and specialized applications worldwide.",
    established: 2009,
    headquarters: "Stuttgart, Germany",
    warranty: "10-25 year product warranty",
    categories: ["Flat Roof Systems", "Pitched Roof Systems", "Ground Mount Systems", "Accessories"],
    featuredProducts: [
      {
        id: "k2-flatroof",
        name: "K2 Flat Roof Mounting System",
        price: 120000,
        discountPrice: 110000,
        image: "k2-mount-1",
      },
      {
        id: "k2-pitched",
        name: "K2 Pitched Roof Rail System",
        price: 85000,
        discountPrice: null,
        image: "k2-mount-2",
      },
      {
        id: "k2-ground",
        name: "K2 Ground Mount System (10kW)",
        price: 250000,
        discountPrice: 230000,
        image: "k2-mount-3",
      },
      {
        id: "k2-accessories",
        name: "K2 Universal Mounting Clamps",
        price: 15000,
        discountPrice: 12000,
        image: "k2-mount-4",
      },
    ],
  },
  "ironridge": {
    name: "IronRidge",
    logo: "/ironridge-logo.png",
    banner: "/ironridge-banner.jpg",
    mobileBanner: "/ironridge-banner-mobile.jpg",
    description: "IronRidge designs and manufactures solar racking systems that are engineered for durability, ease of installation, and maximum performance across residential and commercial applications.",
    established: 2007,
    headquarters: "California, USA",
    warranty: "10-25 year product warranty",
    categories: ["Roof Mount", "Ground Mount", "Components", "Accessories"],
    featuredProducts: [
      {
        id: "ironridge-roof",
        name: "IronRidge XR100 Roof Mount System",
        price: 95000,
        discountPrice: 90000,
        image: "ironridge-mount-1",
      },
      {
        id: "ironridge-ground",
        name: "IronRidge Ground Mount System (5kW)",
        price: 180000,
        discountPrice: 170000,
        image: "ironridge-mount-2",
      },
      {
        id: "ironridge-components",
        name: "IronRidge UFO Mid Clamp",
        price: 5000,
        discountPrice: null,
        image: "ironridge-mount-3",
      },
      {
        id: "ironridge-accessories",
        name: "IronRidge FlashFoot 2 Mount",
        price: 8000,
        discountPrice: 7500,
        image: "ironridge-mount-4",
      },
    ],
  },
  "pak-solar": {
    name: "Pak Solar",
    logo: "/pak-solar-logo.png",
    banner: "/pak-solar-banner.jpg",
    mobileBanner: "/pak-solar-banner-mobile.jpg",
    description: "Pak Solar provides high-quality solar mounting solutions for various applications, including rooftop, ground mount, and carport systems, with a focus on durability and cost-effectiveness.",
    established: 2012,
    headquarters: "Lahore, Pakistan",
    warranty: "5-10 year product warranty",
    categories: ["Rooftop Frames", "Ground Mounting", "Carport Systems", "Custom Solutions"],
    featuredProducts: [
      {
        id: "pak-rooftop",
        name: "Pak Solar Rooftop Mounting Frame (5kW)",
        price: 80000,
        discountPrice: 75000,
        image: "pak-mount-1",
      },
      {
        id: "pak-ground",
        name: "Pak Solar Ground Mount Structure (10kW)",
        price: 200000,
        discountPrice: 190000,
        image: "pak-mount-2",
      },
      {
        id: "pak-carport",
        name: "Pak Solar Carport System (2 cars)",
        price: 350000,
        discountPrice: null,
        image: "pak-mount-3",
      },
      {
        id: "pak-custom",
        name: "Pak Solar Custom Mounting Solution",
        price: 150000,
        discountPrice: 140000,
        image: "pak-mount-4",
      },
    ],
  },
  "solar-packages": {
    name: "Solar Packages",
    logo: "/solar-packages-logo.png",
    banner: "/solar-packages-banner.jpg",
    mobileBanner: "/solar-packages-banner-mobile.jpg",
    description: "Complete solar power systems designed for easy installation and optimal performance, offering all-in-one solutions for residential and commercial energy needs.",
    established: 2015,
    headquarters: "Global Solutions",
    warranty: "Varies by components",
    categories: ["3kW Systems", "5kW Systems", "10kW Systems", "Commercial Systems"],
    featuredProducts: [
      {
        id: "solar-3kw",
        name: "3kW Complete Solar System with Battery",
        price: 650000,
        discountPrice: 620000,
        image: "solar-system-1",
      },
      {
        id: "solar-5kw",
        name: "5kW Hybrid Solar System Package",
        price: 950000,
        discountPrice: null,
        image: "solar-system-2",
      },
      {
        id: "solar-10kw",
        name: "10kW Commercial Solar System",
        price: 1800000,
        discountPrice: 1750000,
        image: "solar-system-3",
      },
      {
        id: "solar-commercial",
        name: "20kW Commercial Solar Package",
        price: 3500000,
        discountPrice: 3400000,
        image: "solar-system-4",
      },
    ],
  },
  "off-grid-solutions": {
    name: "Off-Grid Solutions",
    logo: "/offgrid-logo.png",
    banner: "/offgrid-banner.jpg",
    mobileBanner: "/offgrid-banner-mobile.jpg",
    description: "Comprehensive off-grid solar power systems designed for complete energy independence, ideal for remote locations, rural electrification, and backup power applications.",
    established: 2010,
    headquarters: "Global Solutions",
    warranty: "Varies by components",
    categories: ["Residential", "Commercial", "Industrial", "Agricultural"],
    featuredProducts: [
      {
        id: "offgrid-residential",
        name: "5kW Off-Grid Residential System",
        price: 1200000,
        discountPrice: 1150000,
        image: "offgrid-system-1",
      },
      {
        id: "offgrid-commercial",
        name: "15kW Off-Grid Commercial System",
        price: 2500000,
        discountPrice: null,
        image: "offgrid-system-2",
      },
      {
        id: "offgrid-industrial",
        name: "30kW Industrial Off-Grid System",
        price: 4500000,
        discountPrice: 4300000,
        image: "offgrid-system-3",
      },
      {
        id: "offgrid-agricultural",
        name: "10kW Agricultural Solar Pumping System",
        price: 2200000,
        discountPrice: 2100000,
        image: "offgrid-system-4",
      },
    ],
  },
  "hybrid-systems": {
    name: "Hybrid Systems",
    logo: "/hybrid-logo.png",
    banner: "/hybrid-banner.jpg",
    mobileBanner: "/hybrid-banner-mobile.jpg",
    description: "Advanced hybrid solar systems that combine grid-tie and battery backup functionality, offering the benefits of both worlds for reliable, efficient power solutions.",
    established: 2012,
    headquarters: "Global Solutions",
    warranty: "Varies by components",
    categories: ["With Battery", "Without Battery", "Grid-Assisted", "Backup Solutions"],
    featuredProducts: [
      {
        id: "hybrid-battery",
        name: "5kW Hybrid System with 10kWh Battery",
        price: 1400000,
        discountPrice: 1350000,
        image: "hybrid-system-1",
      },
      {
        id: "hybrid-nobattery",
        name: "8kW Hybrid System (No Battery)",
        price: 900000,
        discountPrice: null,
        image: "hybrid-system-2",
      },
      {
        id: "hybrid-gridassist",
        name: "10kW Grid-Assisted Hybrid System",
        price: 1800000,
        discountPrice: 1750000,
        image: "hybrid-system-3",
      },
      {
        id: "hybrid-backup",
        name: "3kW Essential Backup Hybrid System",
        price: 850000,
        discountPrice: 800000,
        image: "hybrid-system-4",
      },
    ],
  },
  "victron-energy": {
    name: "Victron Energy",
    logo: "/victron-logo.png",
    banner: "/victron-banner.jpg",
    mobileBanner: "/victron-banner-mobile.jpg",
    description: "Victron Energy is a global leader in power conversion equipment, offering high-quality inverters, chargers, and monitoring systems for marine, automotive, and renewable energy applications.",
    established: 1975,
    headquarters: "Almere, Netherlands",
    warranty: "2-5 year product warranty",
    categories: ["Monitoring Systems", "Charge Controllers", "Inverter Chargers", "System Integration"],
    featuredProducts: [
      {
        id: "victron-monitoring",
        name: "Victron GX Touch 50 Monitoring System",
        price: 65000,
        discountPrice: 60000,
        image: "victron-accessory-1",
      },
      {
        id: "victron-chargecontroller",
        name: "Victron SmartSolar MPPT 250/100",
        price: 120000,
        discountPrice: null,
        image: "victron-accessory-2",
      },
      {
        id: "victron-invertercharger",
        name: "Victron MultiPlus-II 48/5000 Inverter Charger",
        price: 250000,
        discountPrice: 240000,
        image: "victron-accessory-3",
      },
      {
        id: "victron-integration",
        name: "Victron Cerbo GX System Controller",
        price: 80000,
        discountPrice: 75000,
        image: "victron-accessory-4",
      },
    ],
  },
  "mtech": {
    name: "MTECH",
    logo: "/mtech-logo.png",
    banner: "/mtech-banner.jpg",
    mobileBanner: "/mtech-banner-mobile.jpg",
    description: "MTECH specializes in high-quality solar accessories and components, including connectors, cables, and protection devices that ensure safe and efficient solar installations.",
    established: 2005,
    headquarters: "Guangdong, China",
    warranty: "1-3 year product warranty",
    categories: ["Connectors", "Cables", "Junction Boxes", "Fuses & Breakers"],
    featuredProducts: [
      {
        id: "mtech-connectors",
        name: "MTECH MC4 Connector Set (10 pairs)",
        price: 12000,
        discountPrice: 10000,
        image: "mtech-accessory-1",
      },
      {
        id: "mtech-cables",
        name: "MTECH 6mm² Solar Cable (100m)",
        price: 45000,
        discountPrice: null,
        image: "mtech-accessory-2",
      },
      {
        id: "mtech-junction",
        name: "MTECH 4-in-1 PV Junction Box",
        price: 15000,
        discountPrice: 14000,
        image: "mtech-accessory-3",
      },
      {
        id: "mtech-fuses",
        name: "MTECH 1000V DC Fuse Set (10 pieces)",
        price: 8000,
        discountPrice: 7500,
        image: "mtech-accessory-4",
      },
    ],
  },
  "pel-solar": {
    name: "PEL Solar",
    logo: "/pel-logo.png",
    banner: "/pel-banner.jpg",
    mobileBanner: "/pel-banner-mobile.jpg",
    description: "PEL Solar offers a comprehensive range of solar accessories and electrical components designed to enhance the safety and performance of photovoltaic systems.",
    established: 1998,
    headquarters: "Lahore, Pakistan",
    warranty: "1-2 year product warranty",
    categories: ["Meters", "DC Disconnects", "Combiner Boxes", "AC/DC Cables"],
    featuredProducts: [
      {
        id: "pel-meter",
        name: "PEL Solar Energy Meter",
        price: 25000,
        discountPrice: 23000,
        image: "pel-accessory-1",
      },
      {
        id: "pel-disconnect",
        name: "PEL 1000V DC Disconnect Switch",
        price: 15000,
        discountPrice: null,
        image: "pel-accessory-2",
      },
      {
        id: "pel-combiner",
        name: "PEL 6-string PV Combiner Box",
        price: 30000,
        discountPrice: 28000,
        image: "pel-accessory-3",
      },
      {
        id: "pel-cables",
        name: "PEL 10mm² Solar Cable (50m)",
        price: 35000,
        discountPrice: 32000,
        image: "pel-accessory-4",
      },
    ],
  }
};

// Format price in PKR with commas
const formatPrice = (price) => {
  return `PKR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export default function BrandPage({ params }) {
  // Unwrap the params promise
  const unwrappedParams = use(params)
  const { brandSlug } = unwrappedParams
  
  const brand = brandsData[brandSlug]
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Handle case where brand doesn't exist
  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Brand Not Found</h1>
        <p className="mb-8">Sorry, we couldn't find the brand you're looking for.</p>
        <Button asChild>
          <Link href="/store">Return to Store</Link>
        </Button>
      </div>
    )
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
        <span className="text-[#1a5ca4]">{brand.name}</span>
      </div>

      {/* Brand Cover Photo/Banner - Two different banners for mobile and desktop */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 mb-6 overflow-hidden rounded-lg shadow-md">
        {/* Desktop banner - hidden on mobile */}
        <div className="absolute inset-0 hidden sm:block">
          <Image 
              src={brand.banner} 
              alt={`${brand.name} Banner`} 
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority
          />
        </div>
        
        {/* Mobile banner - hidden on desktop */}
        <div className="absolute inset-0 block sm:hidden">
          <Image 
              src={brand.mobileBanner || brand.banner} 
              alt={`${brand.name} Mobile Banner`} 
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority
          />
        </div>
        
        {/* Semi-transparent overlay for text readability */}
        <div className="absolute inset-0"></div>
      </div>

      {/* Brand Header - Optimized for mobile */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center mb-6 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Logo - Smaller on mobile */}
        <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gray-100 rounded-lg relative flex-shrink-0">
          <Image 
            src={brand.logo.startsWith('/') ? brand.logo : `/${brand.logo}.webp`}
            alt={`${brand.name} Logo`}
            layout="fill"
            objectFit="contain"
            className="p-2 sm:p-4"
          />
        </div>
        {/* Brand Info - Compact on mobile */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-[#1a5ca4]">{brand.name}</h1>
          {/* Description - Shorter on mobile */}
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-none">
            {brand.description}
          </p>
          {/* Info Grid - Stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="text-center sm:text-left">
              <span className="font-medium text-gray-700">Est:</span> {brand.established}
            </div>
            <div className="text-center sm:text-left">
              <span className="font-medium text-gray-700">HQ:</span> {brand.headquarters}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="featured" className="mb-12">
        <TabsList className="w-full justify-start border-b overflow-x-auto">
          <TabsTrigger value="featured" className="text-xs sm:text-sm">Featured</TabsTrigger>
          <TabsTrigger value="all" className="text-xs sm:text-sm">All Products</TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">About</TabsTrigger>
          <TabsTrigger value="support" className="text-xs sm:text-sm">Support</TabsTrigger>
        </TabsList>

        {/* Featured Products Tab */}
        <TabsContent value="featured" className="pt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Featured Products from {brand.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {brand.featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-colors">
                  <div className="h-32 sm:h-48 bg-gray-100 relative">
                    <Image 
                      src={product.image.startsWith('/') ? product.image : `/products/${product.image}.jpg`}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="p-2 sm:p-4">
                    <h3 className="font-medium mb-2 line-clamp-2 text-xs sm:text-sm h-8 sm:h-12">{product.name}</h3>
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      {product.discountPrice ? (
                        <>
                          <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.discountPrice)}</span>
                          <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <Button className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] text-xs sm:text-sm py-1 sm:py-2">Add to Cart</Button>
                  </div>
                </div>
              </Link>
            ))}
            
          </div>
          <InBrandAd/>
        </TabsContent>

        {/* All Products Tab */}
        <TabsContent value="all" className="pt-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile filter toggle button - only shown on mobile */}
            <div className="lg:hidden">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            

            {/* Categories sidebar - Hidden on mobile by default, shown when toggled */}
            {(showMobileFilters || window.innerWidth >= 1024) && (
              <div className="w-full lg:w-1/4">
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold mb-4 text-sm sm:text-base">Categories</h3>
                  <ul className="space-y-2">
                    {brand.categories.map((category, index) => (
                      <li key={index}>
                        <a href="#" className="text-gray-700 hover:text-[#1a5ca4] text-sm">
                          {category}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-bold mt-6 mb-4 text-sm sm:text-base">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="price1" className="mr-2" />
                      <label htmlFor="price1" className="text-sm">Under PKR 30,000</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price2" className="mr-2" />
                      <label htmlFor="price2" className="text-sm">PKR 30,000 - 40,000</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price3" className="mr-2" />
                      <label htmlFor="price3" className="text-sm">PKR 40,000 - 50,000</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price4" className="mr-2" />
                      <label htmlFor="price4" className="text-sm">Over PKR 50,000</label>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-[#1a5ca4] hover:bg-[#0e4a8a] text-sm">Apply Filters</Button>
                </div>
              </div>
            )}

            {/* Products grid */}
            <div className="w-full lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                <div>
                  <span className="text-gray-600 text-sm">Showing 1-8 of 24 products</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort by:</span>
                  <select className="border rounded p-1 text-sm">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {brand.featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1a5ca4] hover:shadow-md transition-colors">
                  <div className="h-32 sm:h-48 bg-gray-100 relative">
                    <Image 
                      src={product.image.startsWith('/') ? product.image : `/products/${product.image}.jpg`}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="p-2 sm:p-4">
                    <h3 className="font-medium mb-2 line-clamp-2 text-xs sm:text-sm h-8 sm:h-12">{product.name}</h3>
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      {product.discountPrice ? (
                        <>
                          <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.discountPrice)}</span>
                          <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-[#1a5ca4] font-bold text-xs sm:text-sm">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <Button className="w-full bg-[#1a5ca4] hover:bg-[#0e4a8a] text-xs sm:text-sm py-1 sm:py-2">Add to Cart</Button>
                  </div>
                </div>
              </Link>
            ))}
            
          </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="flex gap-1 sm:gap-2">
                  <Button variant="outline" size="sm" disabled className="text-xs sm:text-sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-[#1a5ca4] text-white text-xs sm:text-sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="pt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">About {brand.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">{brand.description}</p>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                With a strong commitment to quality and innovation, {brand.name} has established itself as a leading
                manufacturer in the solar industry since {brand.established}.
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                Headquartered in {brand.headquarters}, {brand.name} products are known for their reliability,
                efficiency, and excellent warranty terms, including {brand.warranty}.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg h-48 sm:h-64 relative">
              <Image 
                src={`/brands/${brandSlug}-story.jpg`}
                alt={`${brand.name} Story`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Why Choose {brand.name}?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">Quality Assurance</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  Rigorous testing and quality control processes ensure that all {brand.name} products meet the highest
                  standards of performance and durability.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">Innovation</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  Continuous investment in R&D keeps {brand.name} at the forefront of solar technology, delivering
                  cutting-edge solutions to customers worldwide.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">Global Presence</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  With operations in multiple countries, {brand.name} has a strong global network that ensures reliable
                  service and support wherever you are.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="pt-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{brand.name} Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Warranty Information</h3>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                {brand.name} products come with {brand.warranty}. Our warranty covers manufacturing defects and ensures
                that your solar products perform as expected.
              </p>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] text-sm sm:text-base">Download Warranty Document</Button>
            </div>
            <div className="p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Technical Support</h3>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                Need help with your {brand.name} products? Our technical support team is here to assist you with
                installation, troubleshooting, and maintenance.
              </p>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] text-sm sm:text-base">Contact Support</Button>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">How do I register my {brand.name} product?</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  You can register your product on the official {brand.name} website or through our customer service
                  portal. Registration is important to activate your warranty.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">What maintenance do {brand.name} products require?</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  Most {brand.name} products require minimal maintenance. Regular cleaning to remove dust and debris is
                  recommended to maintain optimal performance.
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2 text-sm sm:text-base">How can I verify if my {brand.name} product is genuine?</h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  All {brand.name} products come with unique serial numbers that can be verified through the official
                  website or by contacting authorized dealers like Solar Express.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}