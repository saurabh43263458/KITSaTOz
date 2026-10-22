Build a complete React.js e-commerce website for "KITSaTOz", a business selling 3D-printed kits and wooden DIY kits. Keep the design simple, clean, modern and fully responsive (mobile-first).

TECH STACK
- React.js (Vite), React Router v6, Tailwind CSS
- State: Context API or Zustand (auth, cart)
- Icons: Lucide React. Components: shadcn/ui or Headless UI
- Backend/auth: Firebase (Auth + Firestore + Storage) or Node/Express + MongoDB with JWT. Use Firebase unless I say otherwise.
- Email: EmailJS or Web3Forms. WhatsApp: wa.me click-to-chat link

USER FLOW
1. Any visitor (not logged in) can browse the home page, shop, product pages, and add items to the cart.
2. The cart is saved in localStorage so it survives refresh and login.
3. When the visitor clicks "Buy Now" or "Checkout" and is NOT logged in, redirect to /login and keep the intended destination. After login or registration, return them to checkout automatically with the cart intact.
4. A logged-in user completes the order form (Full Name, Phone/WhatsApp, Address, Pincode, Customization Notes).
5. On submit: save the order in the database, send a structured email to my Gmail, and open a pre-filled WhatsApp message with items, quantities, total and customer details. Show an order confirmation page. A sales agent then verifies and collects payment manually via UPI/payment link.

PAGES AND ROUTES
Public:
- / Home: hero banner, featured categories (3D Printed Kits, Wooden DIY Kits, Custom Prototypes), best-sellers, "How It Works" (Choose Kit   Enquire   Verified Delivery), footer
- /shop: product grid, category filter, search bar, price range slider, sort, badges (In Stock, Custom Option, Out of Stock)
- /product/:id: image gallery, description, specifications/bill of materials, dimensions, price, option selectors (material, color, DIY vs pre-assembled), quantity, "Add to Cart", "Buy Now", "Order via WhatsApp"
- /cart: items, quantity edit, remove, estimated total
- /login, /register: email + password, Google sign-in, form validation, show/hide password, forgot password
- /about and /contact: business info, support hours, email, WhatsApp link, contact form
Protected (login required):
- /checkout: order form + order summary
- /order-success: confirmation
- /profile and /my-orders: profile details, order history and status
Admin (role = admin only):
- /admin: dashboard with total orders, revenue estimate, low-stock alerts
- /admin/products: add, edit, delete products, change price, upload images, manage stock
- /admin/orders: view orders, change status (New   Verified   Paid   Shipped   Delivered)
- /admin/users: view registered customers

REQUIREMENTS
- ProtectedRoute and AdminRoute components
- Navbar with logo, search, cart icon with item count, login/profile menu
- Loading skeletons, empty states, toast notifications, 404 page
- Form validation (React Hook Form + Zod)
- Lazy-loaded routes and optimized images for fast mobile loading
- SEO basics (page titles, meta tags), accessible (alt text, keyboard navigation, contrast)
- Environment variables for API keys, WhatsApp number and email config

DESIGN
- Style: minimal, lots of white space, rounded cards, soft shadows, one primary accent color (wood-brown or orange) plus neutral grays. Clean sans-serif font (Inter or Poppins).
- Take inspiration from: Dribbble, Behance, Awwwards, Mobbin (e-commerce flows), Pinterest, Tailwind UI, shadcn/ui, and the Shopify theme store. Images from Unsplash or Pexels as placeholders.
- Consistent components: buttons, cards, inputs, badges, modals.

SKILLS TO APPLY
UI/UX design, responsive layout, authentication and route protection, state management, form handling, REST/Firebase integration, performance optimization, accessibility, SEO, clean folder structure (components, pages, hooks, context, services, utils).

DELIVERABLES
- Full folder structure
- Complete code for every file, step by step
- Seed data of 8 sample products across the 3 categories
- Setup instructions (install, env variables, Firebase config, run, deploy to Vercel or Netlify)
- Short notes on how to make myself an admin and how to change the WhatsApp number and email
