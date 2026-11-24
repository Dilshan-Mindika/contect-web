# CONTEC Design & Build — Web Platform & Enterprise ERP

Official web application and internal team management platform for **CONTEC Design & Build**, Kandy’s premier architectural design, structural engineering, and construction firm.

---

## 🏗️ About CONTEC

**CONTEC Design & Build** is a CIDA Grade CS2 certified building contractor based in Kandy, Sri Lanka. Specializing in luxury hillside residences, commercial buildings, retaining wall engineering, and comprehensive property renovations, CONTEC combines chartered architectural vision with guaranteed fixed-price construction.

- **Headquarters**: No. 167, George E. De Silva Mawatha, Kandy, Sri Lanka, 20000
- **Direct Contact / WhatsApp**: +94 77 781 2141
- **Official Email**: conteckandy@gmail.com
- **Core Guarantees**: CIDA CS2 Certified • 100% Guaranteed Fixed BOQ • 25-Year Structural Warranty • 1-Year Free Maintenance

---

## 🌟 Key Platform Features

### 1. Public Web Experience
- **Home Experience (`/`)**:
  - High-impact architectural hero with interactive 3D model viewer.
  - Project highlights, core service offerings, and trust credentials.
  - Client testimonial highlights and rapid consultation request banner.
- **About Our Studio (`/about`)**:
  - Firm history, mission, and design philosophy.
  - Chartered architects and senior structural engineering team profiles.
  - Detailed overview of CIDA CS2 standards, NBRO landslide safety approvals, and 25-year structural warranties.
- **Services & Capabilities (`/services`)**:
  - **Architectural Design & 3D Plans**: Conceptual layouts, 3D renderings, and council approvals.
  - **Turnkey House Construction**: Complete end-to-end building with guaranteed fixed pricing.
  - **Complete Home Renovation**: Upgrades, structural repairs, and modern extensions.
  - **Roof Waterproofing & Structural Repairs**: Long-lasting leak repair, foundation damp-proofing, and maintenance.
  - **Solar Power & Retaining Walls**: Rooftop solar installations and reinforced concrete hillside retaining walls.
- **Project Portfolio (`/projects`)**:
  - Filterable gallery featuring hillside villas in Digana, lakefront homes, commercial buildings, and renovations.
  - Detailed architectural specifications, floor areas, and high-resolution galleries.
- **Contact & Consultation Hub (`/contact`)**:
  - **Quick Action Channels**: Instant WhatsApp Priority (+94 77 781 2141), Kandy Office line, official email, and visiting hours.
  - **Interactive Project Inquiry Form**: Simple selection for project type, land topography (hillside, flat, lakefront, demolition), custom luxury dark-glass dropdowns for budget (LKR) and timeline, and project requirements.
  - **Head Office & Studio Card**: Address details, visiting hours, and an embedded dark-mode Google Map with directions.
  - **Verified Client Feedback Showcase**: Auto-rotating client review carousel that changes dynamically every 4.5 seconds with pause-on-hover, previous/next controls, and pagination indicators.
  - **Discovery Timeline**: 4-step clear process from consultation to key handover.
  - **FAQ Section**: Practical answers on BOQs, hillside building, council approvals, and warranties.
- **Legal Policies**:
  - Privacy Policy (`/privacy`)
  - Terms of Service (`/terms`)
  - Refund & Payment Terms (`/refund`)

---

### 2. Internal Staff ERP Suite (`/erp`)
An all-in-one team management portal designed for CONTEC staff, site engineers, quantity surveyors, and project managers:

- **Staff Sign In (`/erp/login`)**:
  - Clean, user-friendly login interface free of unnecessary technical jargon.
  - **Show / Hide Password** toggle for ease of use.
  - Secure authentication with zero hardcoded credentials displayed.
  - Quick link back to the main public website.
- **Core ERP Modules**:
  - **Dashboard (`/erp`)**: Overview of active site operations, financial summaries, and real-time alerts.
  - **Projects (`/erp/projects`)**: Live construction tracker, milestones, site logs, and schedule tracking.
  - **CRM & Client Inquiries (`/erp/crm`)**: Manages incoming website inquiries, consultation requests, and client communications.
  - **Quotations & BOQ (`/erp/quotations`)**: Itemized Bills of Quantities creation and guaranteed fixed pricing management.
  - **Finance & Budgeting (`/erp/finance`, `/erp/budgeting`)**: Financial ledgers, client invoices, supplier payments, and cash flow tracking.
  - **Procurement & Inventory (`/erp/inventory`, `/erp/procurement`)**: Building materials inventory (steel, cement, sand) and purchase order tracking.
  - **Machinery & Equipment (`/erp/machinery`)**: Heavy equipment tracking, maintenance schedules, and machinery dispatch.
  - **Site Labour & Daily Logs (`/erp/site-labour`, `/erp/site-logs`)**: Daily workforce attendance, subcontractor hours, and site diaries.
  - **Safety Compliance (`/erp/safety`)**: Site safety inspections, PPE compliance checks, and hazard reports.
  - **Audit & Settings (`/erp/audit`, `/erp/company`, `/erp/hr`, `/erp/website`)**: Activity logs, staff permissions, and company configuration.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) 16 (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict mode) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with custom luxury dark theme |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Authentication** | [Jose](https://github.com/panva/jose) (HMAC-SHA256 JWT tokens & HttpOnly cookies) |
| **Fonts** | Geist Sans & Geist Mono |

---

## 🎨 Design Philosophy & UI Standards

1. **Brand Identity**:
   - **Primary Background**: Deep Navy / Charcoal (`#050811`, `#080e1c`)
   - **Brand Blue**: CONTEC Royal Blue (`#0038B8`)
   - **Accent Gold**: Warm Architectural Gold (`#FFB800`)
   - **Glassmorphism**: Subtle borders (`border-white/10`, `border-blue-500/20`) and frosted glass panels
2. **Clear & User-Friendly Language**:
   - Zero confusing engineering or software buzzwords.
   - Relatable, human-centered terminology for clients and staff alike.
3. **Official Social & Brand Icons**:
   - Vector SVG logos for WhatsApp, Facebook, Instagram, LinkedIn, and YouTube, styled to harmonize with the dark luxury palette.
4. **Responsive & Accessible**:
   - Pixel-perfect across desktop, tablet, and mobile devices.
   - Interactive dropdowns, keyboard-friendly navigation, and high-contrast text.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm, pnpm, or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/contect-web.git
cd contect-web
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
CONTEC_JWT_SECRET=your_secure_jwt_secret_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the website.
To access the internal staff portal, visit [http://localhost:3000/erp/login](http://localhost:3000/erp/login).

### 5. Build for production
```bash
npm run build
npm run start
```

---

## 📁 Project Directory Structure

```text
contect-web/
├── app/
│   ├── about/              # About Our Studio page
│   ├── api/
│   │   ├── contact/        # Client inquiry submission API
│   │   └── erp/            # ERP data & JWT auth endpoints
│   ├── contact/            # Contact & Project Inquiry page
│   ├── erp/                # ERP portal pages (Dashboard, Projects, CRM, Finance, etc.)
│   │   └── login/          # Staff sign-in page
│   ├── privacy/            # Privacy Policy
│   ├── projects/           # Portfolio showcase page
│   ├── refund/             # Refund & Payment Terms
│   ├── services/           # Services & Capabilities page
│   ├── terms/              # Terms of Service
│   ├── globals.css         # Global styles & luxury design utilities
│   ├── layout.tsx          # Root HTML layout & fonts
│   └── page.tsx            # Main homepage
├── components/
│   ├── Footer.tsx          # Master footer with official social icons & legal links
│   ├── Navbar.tsx          # Sticky navigation bar with consultation CTA
│   └── ...                 # Feature-specific interactive components
├── lib/
│   └── erp/                # ERP auth context, user roles & mock databases
├── public/
│   ├── branding/           # Official CONTEC logos and brand assets
│   └── ...                 # Public static images & graphics
├── README.md               # Project documentation
├── package.json            # Dependencies & build scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 📄 License & Ownership

© 2026 **CONTEC Design & Build (Kandy, Sri Lanka)**. All rights reserved.
Unauthorized copying, modification, or distribution of this software and its associated media is strictly prohibited.
