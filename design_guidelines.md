# AGC Web - Design Guidelines

## Design Approach
**System-Based Approach**: Drawing from Linear's modern professionalism and Stripe's clean clarity. This creates credibility and trust essential for a web development agency, with emphasis on readability, clear service presentation, and conversion-focused design.

## Core Design Principles
1. **Professional Authority**: Clean, confident layouts that demonstrate technical expertise
2. **Clarity First**: Services and pricing must be immediately understandable
3. **Trust Through Transparency**: Clear pricing, detailed service descriptions, easy contact
4. **Modern Sophistication**: Contemporary design that reflects current web standards

## Typography
- **Primary Font**: Inter (Google Fonts) - for UI, navigation, body text
- **Accent Font**: Space Grotesk (Google Fonts) - for headings and brand emphasis
- **Hierarchy**: 
  - Hero headings: text-5xl to text-7xl, font-bold
  - Section headings: text-3xl to text-4xl, font-bold
  - Service titles: text-xl to text-2xl, font-semibold
  - Body text: text-base to text-lg
  - Pricing: text-4xl for amounts, font-bold

## Layout System
**Spacing Units**: Tailwind 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section padding: py-16 to py-24 (desktop), py-12 (mobile)
- Card padding: p-6 to p-8
- Element gaps: gap-4, gap-6, gap-8

## Page Structure & Sections

### Header/Navigation
- Sticky navigation with AGC Web logo (left)
- Links: Servicii, Prețuri, Despre, Contact
- CTA button: "Solicită Ofertă" (right-aligned)
- Trust indicator: "100+ Proiecte Livrate" subtle badge

### Hero Section
**Layout**: Full-width with background gradient treatment, centered content
- Large hero image: Modern workspace/code editor aesthetic or abstract tech visualization
- Headline: "Soluții Web Profesionale Pentru Afacerea Ta" (text-6xl)
- Subheading: Service overview with AGC Web positioning
- Dual CTA: Primary "Vezi Servicii" + Secondary "Contactează-ne"
- Trust elements: Client logos or metrics row below CTAs

### Services Section
**Multi-Column Grid**: 3 columns desktop (lg:grid-cols-3), 2 tablet (md:grid-cols-2), 1 mobile
- Service cards with icons (from Heroicons), title, description, key features list
- Services: Magazine Online B2C, B2B, B2C/B2B Hybrid, Bloguri & Content Sites, E-commerce Custom, WooCommerce, Site-uri Prezentare, Dezvoltare Custom, Mentenanță Lunară
- Each card: Icon top, service name (text-xl), 2-3 sentence description, feature bullets, "Detalii" link

### Pricing Section
**Grid Layout**: 3-4 columns for pricing tiers (responsive collapse to single column mobile)
- Pricing cards: Package name, price range ("De la X lei"), feature list with checkmarks
- Categories: Site Prezentare, E-commerce Start, E-commerce Pro, Custom Development, Mentenanță (Bronze/Silver/Gold tiers)
- Visual distinction for recommended package (border accent, "Recomandat" badge)
- Footer note: "Prețurile sunt orientative și pot varia în funcție de cerințe"

### Process/Workflow Section
**Timeline/Steps Layout**: Horizontal step indicators (4-5 steps)
- Steps: Consultare → Planificare → Dezvoltare → Testing → Lansare → Mentenanță
- Each step: Number badge, title, brief description

### Contact Section
**2-Column Split**: Form (left 60%) + Info (right 40%)
- Form fields: Nume, Email, Telefon, Serviciu Dorit (dropdown), Mesaj (textarea)
- Contact info sidebar: Email, telefon, program disponibilitate
- Alternative: "Sună acum" button with phone number

### Footer
**Multi-Column**: Logo + Services quick links + Contact + Social
- AGC Web branding, copyright
- Quick links to all main sections
- Email, phone, social media icons
- Newsletter signup: "Primește sfaturi web development" (optional value-add)

## Component Library

### Cards
- Rounded corners (rounded-lg to rounded-xl)
- Subtle shadows (shadow-md, hover:shadow-lg)
- Border or background-based separation
- Consistent padding (p-6 to p-8)

### Buttons
- Primary: Solid, bold, rounded (rounded-md to rounded-lg)
- Secondary: Outlined or ghost variant
- Size variants: Regular (px-6 py-3) and Large (px-8 py-4) for CTAs

### Forms
- Input fields: Consistent height (h-12), rounded (rounded-md), clear labels above
- Focus states: Ring utility for accessibility
- Submit button: Full-width on mobile, right-aligned on desktop

### Icons
**Heroicons** (via CDN) for all UI icons
- Service icons: Code, shopping cart, blog, wrench (maintenance)
- Feature checkmarks, arrows, contact icons

## Images
**Hero Image**: Yes - prominent background or split-layout image
- Type: Modern tech workspace, abstract code visualization, or professional development setup
- Treatment: Subtle overlay for text readability

**Service Section**: Optional icon-based (no photos needed - keeps focus on text)

**About/Trust Section**: Team photo or office environment (authentic, professional)

## Animations
Minimal and purposeful only:
- Smooth scroll behavior for anchor navigation
- Subtle fade-in for sections on scroll (intersection observer)
- Card hover lift effects (translate-y minimal)
- NO distracting animations, NO parallax, NO complex scroll-driven effects

## Accessibility
- Semantic HTML throughout
- ARIA labels for icons and interactive elements
- Form validation with clear error messages
- Keyboard navigation support for all interactive elements
- Sufficient contrast ratios for all text