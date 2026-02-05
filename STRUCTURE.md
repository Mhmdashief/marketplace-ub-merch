# 📁 Struktur Folder & Best Practices
## UB Merchandise E-Commerce Project

### 🎯 Overview
Proyek ini menggunakan Next.js 16 dengan App Router, TypeScript, dan Tailwind CSS untuk membangun website e-commerce merchandise Universitas Brawijaya yang elegan dan responsif.

---

## 📂 Struktur Folder

```
e-commerce_ub-merch/
├── app/
│   ├── about/                    # Halaman About Us
│   │   └── page.tsx
│   ├── news/                     # Halaman News
│   │   └── page.tsx
│   ├── services/                 # Halaman Services
│   │   └── page.tsx
│   ├── contact/                  # Halaman Contact
│   │   └── page.tsx
│   ├── merchandise/              # Halaman Merchandise
│   │   └── page.tsx
│   ├── components/               # Komponen reusable
│   │   ├── home/                # Komponen khusus Homepage
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── NewArrivals.tsx
│   │   │   ├── BestSellers.tsx
│   │   │   ├── ProductShowcase.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── index.ts        # Barrel export
│   │   ├── about/               # Komponen khusus About Us
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StorySection.tsx
│   │   │   └── ValuesSection.tsx
│   │   ├── news/                # Komponen khusus News
│   │   │   ├── NewsCard.tsx
│   │   │   └── NewsGrid.tsx
│   │   ├── services/            # Komponen khusus Services
│   │   │   ├── ServicesHero.tsx
│   │   │   └── ServiceCard.tsx
│   │   ├── contact/             # Komponen khusus Contact
│   │   │   └── ContactForm.tsx
│   │   ├── shared/              # Komponen shared/reusable
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductSkeleton.tsx
│   │   │   └── index.ts        # Barrel export
│   │   ├── Navbar.tsx           # Global navigation bar
│   │   └── Footer.tsx           # Global footer
│   ├── globals.css              # Global styles & CSS variables
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── public/
│   └── images/                  # Static assets
│       └── reusable/
│           ├── Logo Ub Merch.png
│           ├── shopee.png
│           └── tokopedia.png
├── package.json
└── tsconfig.json
```

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--ub-navy: #003366        /* Primary brand color */
--ub-dark-navy: #001a33   /* Darker navy for gradients */
--ub-gold: #D4AF37        /* Accent gold color */
--ub-light-gold: #F4E4C1  /* Light gold for gradients */

/* Neutral Colors */
--gray-50 to --gray-900   /* Gray scale for UI elements */
--black: #000000
--white: #ffffff
```

### Typography
- **Font Family**: Inter (var(--font-inter))
- **Heading Sizes**: 
  - H1: 5xl - 7xl (48px - 72px)
  - H2: 4xl - 5xl (36px - 48px)
  - H3: 2xl - 3xl (24px - 30px)
- **Body**: Base - lg (16px - 18px)

### Spacing & Layout
- **Max Width Container**: `max-w-7xl` (1280px)
- **Padding**: `px-4 sm:px-6 lg:px-8` (responsive)
- **Section Spacing**: `py-16` or `py-24`

---

## 🏗️ Component Architecture

### **Best Practices**

#### 1. **Component Organization**
```tsx
// ✅ GOOD - Organized by feature
app/components/about/HeroSection.tsx
app/components/news/NewsCard.tsx

// ❌ BAD - All in one folder
app/components/AboutHero.tsx
app/components/NewsCard.tsx
```

#### 2. **Component Structure**
```tsx
'use client'; // Client component jika ada interaktivitas

import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

interface ComponentProps {
    title: string;
    description: string;
}

export default function Component({ title, description }: ComponentProps) {
    return (
        <section className="py-24 bg-white">
            {/* Component content */}
        </section>
    );
}
```

#### 3. **Naming Conventions**
- **Components**: PascalCase (e.g., `HeroSection.tsx`)
- **Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)
- **CSS Classes**: kebab-case di Tailwind
- **Variables**: camelCase

#### 4. **Barrel Exports (index.ts)**
Gunakan barrel exports untuk mempermudah imports:

```tsx
// app/components/home/index.ts
export { default as Hero } from './Hero';
export { default as FeaturedProducts } from './FeaturedProducts';
export { default as NewArrivals } from './NewArrivals';

// Usage in page.tsx
import { Hero, FeaturedProducts, NewArrivals } from './components/home';

// ✅ GOOD - Clean and organized
import { Hero, FeaturedProducts } from './components/home';

// ❌ BAD - Verbose and repetitive
import Hero from './components/home/Hero';
import FeaturedProducts from './components/home/FeaturedProducts';
```

---

## 🎭 Animation Guidelines

### Framer Motion Best Practices
```tsx
// Animate on scroll (viewport trigger)
<motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
>
    {/* Your content */}
</motion.div>

// Hover effects
<motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
>
    {/* Your content */}
</motion.div>
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
- **sm**: 640px (Mobile landscape)
- **md**: 768px (Tablet)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Large desktop)

### Responsive Patterns
```tsx
// Grid Layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* Cards */}
</div>

// Text Sizing
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
    Title
</h1>

// Padding
<div className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    {/* Content */}
</div>
```

---

## 🚀 Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image';

<Image
    src="/images/product.jpg"
    alt="Product description"
    width={400}
    height={400}
    className="object-cover"
    loading="lazy" // or "eager" for above-fold images
/>
```

### Code Splitting
- Gunakan dynamic imports untuk heavy components
```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
    loading: () => <Skeleton />,
});
```

---

## 🔍 SEO Best Practices

### Metadata di setiap halaman
```tsx
export const metadata: Metadata = {
    title: 'Page Title - UB Merchandise',
    description: 'Page description for SEO',
    keywords: 'keyword1, keyword2, keyword3',
};
```

### Semantic HTML
```tsx
<main>
    <section aria-label="Hero">
        <h1>Main Title</h1>
    </section>
    <section aria-label="Features">
        <h2>Section Title</h2>
    </section>
</main>
```

---

## 🎯 Page Structure

### Standard Page Layout
```tsx
export default function PageName() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <HeroSection />
            
            {/* Main Content */}
            <section className="py-24 bg-white">
                {/* Content */}
            </section>
            
            {/* Additional Sections */}
            <section className="py-24 bg-gray-50">
                {/* Content */}
            </section>
        </main>
    );
}
```

---

## 🎨 Design Principles

### 1. **Visual Hierarchy**
- Gunakan size, weight, dan color untuk membuat hierarchy yang jelas
- Headings harus stand out dari body text
- CTAs harus prominent dengan color dan spacing

### 2. **Whitespace**
- Berikan breathing room dengan spacing yang generous
- Gunakan `py-24` untuk section spacing
- Gunakan `gap-8` atau `gap-12` untuk grid items

### 3. **Color Usage**
- Primary: UB Navy untuk headings dan CTAs
- Accent: Gold untuk highlights dan hover states
- Neutral: Grays untuk body text dan borders

### 4. **Interactive States**
```tsx
// Hover states
className="transition-all duration-300 hover:scale-105 hover:shadow-xl"

// Focus states
className="focus:outline-none focus:ring-2 focus:ring-ub-navy/20"

// Active states
className="active:scale-95"
```

---

## 🛠️ Development Workflow

### 1. **Create New Page**
```bash
# Create page directory
mkdir app/page-name

# Create page file
touch app/page-name/page.tsx
```

### 2. **Create Components**
```bash
# Create component directory
mkdir app/components/page-name

# Create component files
touch app/components/page-name/ComponentName.tsx
```

### 3. **Testing**
```bash
# Run dev server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start
```

---

## 📚 Dependencies

### Core Dependencies
- **next**: 16.1.4 - React framework
- **react**: 19.2.3 - UI library
- **tailwindcss**: ^4 - Utility-first CSS
- **framer-motion**: Latest - Animation library
- **lucide-react**: ^0.562.0 - Icon library
- **react-icons**: ^5.5.0 - Additional icons

### Development
- **typescript**: ^5 - Type safety
- **eslint**: ^9 - Code linting

---

## ✅ Checklist untuk Halaman Baru

- [ ] Buat folder di `app/[page-name]/`
- [ ] Buat `page.tsx` dengan metadata SEO
- [ ] Buat komponen di `app/components/[page-name]/`
- [ ] Implementasi responsive design (mobile-first)
- [ ] Tambahkan animasi dengan Framer Motion
- [ ] Optimasi gambar dengan Next.js Image
- [ ] Test di berbagai breakpoints
- [ ] Validasi accessibility (a11y)
- [ ] Update navigation links jika perlu
- [ ] Test performance dengan Lighthouse

---

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

**Dibuat dengan ❤️ untuk UB Merchandise**
*Version 1.0 - January 2026*
