export interface PublicProject {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  area: string;
  solarCapacity: string;
  energyRating: string;
  image: string;
  images?: string[];
  tagline: string;
  description: string;
  highlights: string[];
  // Advanced & Optional Construction Fields
  status?: 'COMPLETED' | 'UNDER_CONSTRUCTION' | 'DESIGN_PHASE';
  featured?: boolean;
  contractValue?: string;
  structuralWarranty?: string;
  leadArchitect?: string;
  foundationType?: string;
  clientPrivacy?: 'CONFIDENTIAL' | 'PUBLIC';
  clientName?: string;
  concreteGrade?: string;
  targetSector?: string;
  durationMonths?: string;
  approvalsObtained?: string;
  smartSystems?: string;
}

export interface PublicService {
  id: string;
  badge: string;
  title: string;
  desc: string;
  image: string;
  images?: string[];
  features: string[];
  // Advanced & Optional Construction Fields
  startingPrice?: string;
  timeline?: string;
  cidaStandard?: string;
  warranty?: string;
  featured?: boolean;
  targetSector?: string;
  approvalsIncluded?: string;
  boqBasis?: string;
  deliverables?: string;
}

export const DEFAULT_PROJECTS: PublicProject[] = [
  {
    id: "hanthana-sanctuary",
    title: "Hanthana Hillside Sanctuary",
    category: "Hillside",
    location: "Hanthana Mountain Range, Kandy",
    year: "2025",
    area: "6,400 sq ft",
    solarCapacity: "42 kW Rooftop Solar System",
    energyRating: "Eco-Friendly Living",
    image: "/images/project-alpine.jpg",
    tagline: "Modern hillside home designed with scenic mountain valley views.",
    description: "Built with reinforced rock-anchored foundations, panoramic glass windows overlooking the Kandy mountain valley, and natural breeze ventilation.",
    highlights: [
      "Infinity pool & wide scenic viewing deck",
      "Integrated solar power & rainwater storage",
      "Local Kumbuk timber & durable concrete",
    ],
    status: "COMPLETED",
    featured: true,
    contractValue: "LKR 165M",
    structuralWarranty: "25-Year Foundation Warranty",
    leadArchitect: "Chartered Structural Engineering Team",
  },
  {
    id: "anniewatte-villa",
    title: "Anniewatte Modern Residence",
    category: "Residential",
    location: "Anniewatte, Kandy",
    year: "2025",
    area: "5,800 sq ft",
    solarCapacity: "38 kW Smart Solar Array",
    energyRating: "Sustainable Luxury",
    image: "/images/project-coastal.jpg",
    tagline: "Contemporary multi-level luxury villa with peaceful courtyards.",
    description: "Designed for bright open-plan living with indoor water features, custom teak carpentry, and energy-efficient double-glazed glass.",
    highlights: [
      "Indoor garden courtyard & koi pond",
      "Natural airflow & smart lighting controls",
      "Full turnkey interior design & execution",
    ],
    status: "COMPLETED",
    featured: true,
    contractValue: "LKR 145M",
    structuralWarranty: "25-Year Foundation Warranty",
    leadArchitect: "Principal Architectural & BIM Lead",
  },
  {
    id: "victoria-estate",
    title: "Victoria Lakefront Retreat",
    category: "Hillside",
    location: "Digana / Victoria Golf Resort, Kandy",
    year: "2024",
    area: "4,800 sq ft",
    solarCapacity: "28 kW Solar Microgrid",
    energyRating: "Solar Powered",
    image: "/images/project-forest.jpg",
    tagline: "Lakefront resort home framing panoramic lake and golf course views.",
    description: "Constructed with natural stone retaining walls, reinforced steel framing, and open-air rooftop entertaining terraces.",
    highlights: [
      "Hillside multi-tier terraced design",
      "Battery backup storage & water filtration",
      "Durable natural timber and stone finishes",
    ],
    status: "COMPLETED",
    featured: false,
    contractValue: "LKR 120M",
    structuralWarranty: "25-Year Foundation Warranty",
    leadArchitect: "Hillside Geotechnical Specialist",
  },
  {
    id: "commercial-kandy",
    title: "Kandy Commercial & Medical Suites",
    category: "Commercial",
    location: "George E. De Silva Mawatha, Kandy",
    year: "2024",
    area: "12,500 sq ft",
    solarCapacity: "65 kW Rooftop Solar Setup",
    energyRating: "High Energy Efficiency",
    image: "/images/project-penthouse.jpg",
    tagline: "Modern 5-storey commercial complex with reinforced concrete framing.",
    description: "Turnkey multi-storey commercial facility featuring passenger elevators, basement parking, and high-performance sound-insulated glass facades.",
    highlights: [
      "Turnkey structural, electrical & fire safety execution",
      "Modern curtain wall glass exterior",
      "Comprehensive facility management",
    ],
    status: "COMPLETED",
    featured: false,
    contractValue: "LKR 310M",
    structuralWarranty: "30-Year Commercial Structure Warranty",
    leadArchitect: "Chartered Civil & MEP Engineers",
  },
];

export const DEFAULT_SERVICES: PublicService[] = [
  {
    id: "design-build",
    badge: "STAGE 01",
    title: "Architectural Design & 3D House Plans",
    desc: "Custom floor plans, photorealistic 3D views, land survey checks, and government municipal council approvals. We design living spaces tailored to Sri Lanka's tropical climate and hillside landscapes.",
    image: "/images/hero-main.jpg",
    features: [
      "Photorealistic 3D Exterior & Interior Designs",
      "Hillside Land & Slope Stability Planning",
      "Municipal Council & Government Approvals",
      "Natural Sunlight & Cross-Ventilation Planning",
    ],
    startingPrice: "Complimentary Initial Consultation",
    timeline: "2 to 4 Weeks Concept Delivery",
    cidaStandard: "Chartered Architectural Standards",
    warranty: "100% Planning Approval Support",
  },
  {
    id: "construction",
    badge: "STAGE 02",
    title: "Turnkey House & Commercial Construction",
    desc: "Complete building construction from foundation to final key handover. Built with certified structural engineering, high-strength steel reinforcement, premium grade concrete, and skilled craftsmanship.",
    image: "/images/craftsmanship-detail.jpg",
    features: [
      "Custom Hillside Villas & Luxury Residences",
      "Commercial & Multi-Storey Buildings",
      "Guaranteed Fixed-Price & Timely Handover",
      "25-Year Structural Warranty on Foundations & Frames",
    ],
    startingPrice: "Itemized Fixed BOQ Pricing",
    timeline: "7 to 12 Months Delivery",
    cidaStandard: "CIDA Grade CS2 Certified",
    warranty: "25-Year Structural Warranty",
  },
  {
    id: "renovation",
    badge: "STAGE 03",
    title: "Home Renovation, Remodeling & Extensions",
    desc: "Transforming existing properties into beautiful, functional spaces. We specialize in modern kitchens, designer bathrooms, structural wall changes, room extensions, and rooftop leisure terraces.",
    image: "/images/project-penthouse.jpg",
    features: [
      "Modern Kitchen & Luxury Bathroom Remodeling",
      "Room Additions & Upper-Floor Extensions",
      "Rooftop Terraces & Balconies",
      "Heritage Restorations & Modern Upgrades",
    ],
    startingPrice: "Transparent Scope of Work",
    timeline: "4 to 8 Weeks Fast-Track",
    cidaStandard: "Quality Assured Execution",
    warranty: "2-Year Craftsmanship Guarantee",
  },
  {
    id: "repairs",
    badge: "STAGE 04",
    title: "Roof Waterproofing & Structural Repairs",
    desc: "Professional property care to keep your building leak-free and in top condition. Our qualified team handles roof waterproofing, damp proofing, electrical and plumbing repairs, exterior painting, and routine maintenance.",
    image: "/images/material-preview.jpg",
    features: [
      "Annual Roof & Leakage Diagnostic Inspections",
      "Advanced Roof Waterproofing & Damp Proofing",
      "Full Electrical, Plumbing & Water Systems Repair",
      "Weatherproof Exterior Painting & Wall Protection",
    ],
    startingPrice: "Rapid Response & Site Inspection",
    timeline: "Immediate Inspection within 24h",
    cidaStandard: "Polymer Membrane Waterproofing",
    warranty: "10-Year Leak-Free Warranty",
  },
  {
    id: "sustainable",
    badge: "STAGE 05",
    title: "Solar Power Systems & Hillside Retaining Walls",
    desc: "Rooftop solar electricity with battery backup, rainwater harvesting systems, and strong reinforced retaining walls engineered for heavy monsoon rains and lasting safety.",
    image: "/images/project-forest.jpg",
    features: [
      "Rooftop Solar & Hybrid Battery Backup",
      "Reinforced Retaining Walls & Slope Anchoring",
      "Rainwater Harvesting & Water Filtration",
      "Natural Airflow & Energy-Efficient Living",
    ],
    startingPrice: "Custom Engineering Evaluation",
    timeline: "3 to 6 Weeks Installation",
    cidaStandard: "Geotechnical Slope Engineering",
    warranty: "25-Year Solar & Wall Integrity Guarantee",
  },
];

const PROJECTS_STORAGE_KEY = "contec_public_projects_v1";
const SERVICES_STORAGE_KEY = "contec_public_services_v1";

export function getPublicProjects(): PublicProject[] {
  if (typeof window === "undefined") return DEFAULT_PROJECTS;
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROJECTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function savePublicProjects(projects: PublicProject[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent("contec_projects_updated", { detail: projects }));
  } catch (err) {
    console.error("Failed to save public projects:", err);
  }
}

export function getPublicServices(): PublicService[] {
  if (typeof window === "undefined") return DEFAULT_SERVICES;
  try {
    const raw = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw) return DEFAULT_SERVICES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SERVICES;
  } catch {
    return DEFAULT_SERVICES;
  }
}

export function savePublicServices(services: PublicService[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
    window.dispatchEvent(new CustomEvent("contec_services_updated", { detail: services }));
  } catch (err) {
    console.error("Failed to save public services:", err);
  }
}
