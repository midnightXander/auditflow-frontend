# AuditFlow Frontend

Beautiful, modern Next.js frontend for the Website Auditor with professional UI built using shadcn/ui components.

## 🎨 Design Features

- **Brand Colors**: Ocean Blue (#0075FF) + Deep Purple (#8766FF) gradient theme
- **shadcn/ui Components**: Pre-built, accessible React components
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Responsive Design**: Mobile-first approach, works on all devices
- **Smooth Animations**: Framer Motion for delightful micro-interactions
- **Professional Typography**: Inter for UI, JetBrains Mono for code

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python backend running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Homepage with hero & audit form
│   ├── globals.css             # Global styles & Tailwind
│   └── audit/
│       └── [jobId]/
│           └── page.tsx        # Audit results page
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   └── tabs.tsx
│   └── audit/                  # Custom audit components
│       ├── CircularScore.tsx   # Circular score display
│       └── ScoreBar.tsx        # Linear score bars
├── lib/
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## 🎨 Design System

### Colors

```css
/* Primary (Blue) */
--primary-500: #0075FF  /* Main brand color */

/* Accent (Purple) */
--accent-500: #8766FF   /* Accent color */

/* Status Colors */
--success-500: #10B981  /* Good scores (90-100) */
--info-500: #06B6D4     /* Okay scores (70-89) */
--warning-500: #F59E0B  /* Needs work (50-69) */
--error-500: #EF4444    /* Poor scores (0-49) */
```

### Typography

- **Headings**: Inter (400-800 weight)
- **Body Text**: Inter (400-600 weight)
- **Code/URLs**: JetBrains Mono (400-600 weight)

### Components

**Buttons:**
- Primary: Gradient blue → dark blue
- Gradient: Gradient blue → purple (premium actions)
- Outline: Border with transparent bg
- Ghost: Transparent with hover state

**Cards:**
- White background
- Subtle shadow
- Hover: Elevated shadow + slight scale

**Scores:**
- Circular: Large score displays
- Linear: Category score bars with gradient fills

## 🔌 API Integration

The frontend connects to the Python FastAPI backend:

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### API Calls

**Start Audit:**
```typescript
POST /api/audit
Body: { url: "https://example.com" }
Response: { job_id: "uuid", status: "pending" }
```

**Get Results:**
```typescript
GET /api/audit/{job_id}
Response: {
  status: "completed",
  progress: 100,
  results: { /* audit data */ }
}
```

## 📱 Pages

### Homepage (`/`)

**Features:**
- Hero section with gradient background
- URL input form
- Feature cards
- "How It Works" section
- Responsive design

**Components Used:**
- Button (gradient variant for CTA)
- Input (URL field)
- Card (features)
- Icons from lucide-react

### Audit Results (`/audit/[jobId]`)

**Features:**
- Loading state with progress
- Overall score (circular display)
- Category scores (Lighthouse)
- Core Web Vitals
- Tabbed interface for detailed results
- Quick wins section
- Recommendations

**Tabs:**
1. **Overview** - Summary + quick wins
2. **Performance** - Optimization opportunities
3. **SEO** - Technical SEO + structured data
4. **Images** - Image optimization issues
5. **Content** - Content quality metrics
6. **Security** - Security headers + broken links

## 🎯 Key Components

### CircularScore

Animated circular progress with score:

```tsx
<CircularScore 
  score={85} 
  size="lg" 
  showLabel 
  animate 
/>
```

**Features:**
- Smooth count-up animation
- Color-coded by score (green/cyan/amber/red)
- Responsive sizing (sm/md/lg)
- Shows score label

### ScoreBar

Horizontal progress bar for categories:

```tsx
<ScoreBar 
  label="Performance" 
  score={92} 
  icon={<Zap />}
  showBadge 
/>
```

**Features:**
- Gradient progress fill
- Color-coded by score
- Optional badge indicator
- Icon support

## 🎨 Customization

### Change Brand Colors

Edit `tailwind.config.js`:

```javascript
primary: {
  500: '#0075FF',  // Change this
}
```

### Add New Components

```bash
# shadcn/ui CLI (if you want more components)
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

### Modify Animations

Edit `tailwind.config.js` → `extend` → `keyframes`

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment Variables in Vercel:**
- Add `NEXT_PUBLIC_API_URL` pointing to your production API

### Deploy to Other Platforms

**Netlify:**
```bash
npm run build
# Deploy the .next folder
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding Features

**1. New Audit Category Tab:**

Edit `app/audit/[jobId]/page.tsx`:

```tsx
<TabsTrigger value="mynew">My New Tab</TabsTrigger>

<TabsContent value="mynew">
  <Card>
    {/* Your content */}
  </Card>
</TabsContent>
```

**2. New UI Component:**

Create in `components/ui/`:

```tsx
import { cn } from "@/lib/utils"

export function MyComponent({ className, ...props }) {
  return <div className={cn("base-styles", className)} {...props} />
}
```

## 🎯 Performance

**Optimizations Applied:**
- Image optimization (Next.js Image)
- Code splitting (automatic with Next.js)
- Font optimization (next/font)
- CSS minification
- Tree shaking

**Lighthouse Scores (Target):**
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## 🐛 Troubleshooting

**"API connection failed"**
- Check that backend is running on correct port
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check CORS settings in backend

**"Styles not loading"**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**"Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Keep components small and focused
4. Add comments for complex logic
5. Test on mobile and desktop

## 📄 License

MIT License - same as parent project