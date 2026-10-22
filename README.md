# 🛠️ KITSaTOz — 3D-Printed & Wooden DIY Kits E-Commerce Platform

A production-ready React.js e-commerce platform built for **KITSaTOz**, an artisan business specializing in high-precision 3D-printed kinetic kits, CNC laser-cut wooden DIY automata, and custom engineering rapid prototypes.

---

## 🌟 Key Features

- **Storefront & Catalog:**
  - Dynamic category filters (`3D Printed Kits`, `Wooden DIY Kits`, `Custom Prototypes`)
  - Live search bar, price range budget slider, in-stock badges, custom options badge
  - Interactive product details with multi-angle image gallery, detailed technical specifications, bill of materials (BOM), dimensions, and material/color/assembly selectors
  - Free shipping progress meter (orders over ₹1,999)
  - Persistent shopping cart backed by `localStorage` that survives page refreshes and authentication transitions
- **Seamless Checkout & WhatsApp Order Flow:**
  - Automatic redirect to `/login` with target destination preserved if a guest clicks "Buy Now" or "Checkout"
  - Order checkout with full name, WhatsApp number, shipping address, 6-digit PIN code, and custom maker notes (validated via Zod + React Hook Form)
  - Automatic order database persistence, email dispatch simulation/API, and instant pre-filled WhatsApp message generation via `wa.me` for manual UPI verification
  - Celebratory order confirmation page with confetti animation and direct WhatsApp recovery link
- **Customer Account & Tracking:**
  - User profile with editable shipping coordinates
  - Real-time order history with stage statuses (`New`, `Verified`, `Paid`, `Shipped`, `Delivered`)
- **Admin Management Portal (`/admin`):**
  - **Dashboard:** Total orders, estimated gross revenue, low-stock alerts (≤ 10 units), pending verifications
  - **Product Management:** Add new kits, modify prices, restock units (+5/-5 quick actions), adjust descriptions, delete items, or reset to original seed catalog
  - **Orders Pipeline:** View incoming enquiries, change status via interactive dropdown (`New` → `Verified` → `Paid` → `Shipped` → `Delivered`), and directly message customer on WhatsApp with 1-click
  - **Customer Roster:** View registered users, contact info, total orders placed, and lifetime spend
- **Architecture & Performance:**
  - Modern warm timber aesthetic with tailored color palette (`brand` terracotta & `wood` cedar), clean typography (Inter + Google Fonts), subtle micro-animations, and glassmorphism headers
  - Full route code-splitting via React `lazy` and `Suspense` for instant mobile load times
  - Works straight out of the box in **Local/Demo Mode** without requiring immediate API keys, while automatically syncing with **Firebase** whenever credentials are provided in `.env`

---

## 📁 Project Structure

```
Customer/
├── public/
│   └── _redirects              # Netlify SPA routing rules
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AdminRoute.jsx       # Route protection for admin operators
│   │   │   ├── Badge.jsx            # Multi-variant badge pill
│   │   │   ├── Footer.jsx           # Storefront footer with trust props
│   │   │   ├── LoadingSkeleton.jsx  # Pulse skeleton loaders
│   │   │   ├── Navbar.jsx           # Sticky glassmorphism nav with cart counter & mobile drawer
│   │   │   ├── ProtectedRoute.jsx   # Route protection with login return state
│   │   │   └── ToastContainer.jsx   # Dynamic floating alert system
│   │   └── product/
│   │       └── ProductCard.jsx      # High-conversion product card with quick-add
│   ├── data/
│   │   └── initialProducts.js       # 8 curated seed kits across 3 core categories
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx   # KPI revenue, orders, low-stock warnings
│   │   │   ├── AdminLayout.jsx      # Admin sidebar and layout container
│   │   │   ├── AdminOrders.jsx      # Order pipeline with status switcher
│   │   │   ├── AdminProducts.jsx    # Add/edit/delete/stock management
│   │   │   └── AdminUsers.jsx       # Registered customer directory
│   │   ├── About.jsx                # Workshop story and craftsmanship values
│   │   ├── Cart.jsx                 # Shopping cart with quantity edit & free shipping bar
│   │   ├── Checkout.jsx             # Order form with Zod validation & WhatsApp handoff
│   │   ├── Contact.jsx              # Workshop contact desk, hours & inquiry form
│   │   ├── Home.jsx                 # Hero section, categories, best-sellers & how it works
│   │   ├── Login.jsx                # Authentication with 1-click demo accounts
│   │   ├── NotFound.jsx             # 404 blueprint not found page
│   │   ├── OrderSuccess.jsx         # Confetti celebration & order receipt
│   │   ├── ProductDetails.jsx       # Image gallery, BOM, specs & customization options
│   │   ├── Profile.jsx              # Profile management & customer order tracking
│   │   ├── Register.jsx             # Account registration
│   │   └── Shop.jsx                 # Catalog with price slider, search & filters
│   ├── services/
│   │   ├── emailService.js          # Order email dispatch (Web3Forms / EmailJS / Simulation)
│   │   ├── firebase.js              # Firebase auth & firestore client with graceful fallback
│   │   └── whatsappService.js       # Formatted wa.me order message generation
│   ├── store/
│   │   ├── authStore.js             # User session, role management & demo switcher
│   │   ├── cartStore.js             # Cart items state with localStorage persistence
│   │   ├── orderStore.js            # Customer orders with seed dataset
│   │   ├── productStore.js          # Product inventory with CRUD methods
│   │   ├── toastStore.js            # Sleek notification triggers
│   │   └── userStore.js             # Registered customer database
│   ├── App.jsx                      # Route configuration & lazy loading
│   ├── index.css                    # Tailwind directives & design system tokens
│   └── main.jsx                     # Application bootstrap
├── .env.example                     # Environment variables template
├── index.html                       # HTML entry point with meta tags & fonts
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind custom brand & wood color tokens
├── vercel.json                      # Vercel SPA URL rewrites
└── vite.config.js                   # Vite configuration
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The app will start at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

---

## ⚙️ Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for order routing (Country code + phone) | `919876543210` |
| `VITE_ADMIN_EMAIL` | Admin email address with automatic admin access privileges | `admin@kitsatoz.com` |
| `VITE_WEB3FORMS_KEY` | *(Optional)* Access key for Web3Forms email notifications | `your-web3forms-key` |
| `VITE_FIREBASE_API_KEY` | *(Optional)* Firebase Web API Key | `AIzaSy...` |
| `VITE_FIREBASE_PROJECT_ID` | *(Optional)* Firebase Project ID | `kitsatoz-ecommerce` |

> **Note:** If Firebase keys are omitted, the app automatically runs in **Full Local Simulation Mode** using `localStorage`! You can test every customer and admin feature immediately.

---

## 🛡️ How to Make Yourself an Admin

### Option 1: Using the Environment Variable
Set `VITE_ADMIN_EMAIL` in `.env` to your email:
```env
VITE_ADMIN_EMAIL=your.email@example.com
```
When you sign in with this email, the system automatically assigns you the `admin` role and grants access to `/admin`.

### Option 2: One-Click Demo Mode (Fastest for Testing)
1. On the `/login` screen, click the **"🛡️ Demo Admin"** button to auto-fill the admin credentials (`admin@kitsatoz.com` / `admin123456`) and sign in.
2. Alternatively, from `/profile` or the `/admin` unauthorized screen, click the **"Grant Admin Role"** button to toggle your active session between Customer and Admin instantly.

---

## 📱 How to Change the WhatsApp Number & Email

### To change the WhatsApp Number:
Update `VITE_WHATSAPP_NUMBER` in `.env`:
```env
VITE_WHATSAPP_NUMBER=919876543210
```
This number will automatically receive all formatted customer order details and direct inquiry links across the product pages, cart, and footer.

### To change the Admin Notification Email:
Update `VITE_ADMIN_EMAIL` in `.env`:
```env
VITE_ADMIN_EMAIL=orders@kitsatoz.com
```

---

## 📦 Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub or GitLab.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. The included [vercel.json](file:///c:/Users/sm427/OneDrive/Desktop/coding/Customer/vercel.json) handles client-side routing rewrites automatically.
4. In the Vercel project settings, add your Environment Variables (`VITE_WHATSAPP_NUMBER`, `VITE_ADMIN_EMAIL`, etc.).
5. Deploy!

### Deploy to Netlify
1. Connect your repository in [Netlify](https://www.netlify.com).
2. Set Build Command to `npm run build` and Publish Directory to `dist`.
3. The included `public/_redirects` file guarantees seamless routing for all direct subpaths (`/shop`, `/product/:id`, `/admin`, etc.).
4. Add your Environment Variables in Netlify **Site configuration > Environment variables**.
5. Deploy!
