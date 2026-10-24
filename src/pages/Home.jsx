import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Printer, 
  Trees, 
  Cpu, 
  CheckCircle2, 
  MessageCircle,
  Package,
  Wrench,
  Truck,
  Zap,
  Layers
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { CATEGORIES } from '../data/initialProducts';
import { getWhatsAppNumber } from '../services/whatsappService';

export const Home = () => {
  const { products, loading, error } = useProducts();
  const bestSellers = products.filter(p => p.bestSeller === true || p.badge === 'Best Seller' || p.badge === '3D Hot Item' || p.badge === 'Featured Masterpiece');

  const heroVenomImages = [
    { src: '/products/3d-printed-venom-figurine-front.jpg', label: 'Painted Front' },
    { src: '/products/3d-printed-venom-figurine-side.jpg', label: 'Side Profile' },
    { src: '/products/3d-printed-venom-figurine-raw.jpg', label: 'Raw 3D Print' }
  ];
  const [selectedHeroImage, setSelectedHeroImage] = useState(0);

  // Spotlight items specifically for 3D and mechanical kits (Venom first)
  const spotlightItems = products.filter(p => 
    p.id === '3d-printed-venom-symbiote-figurine' ||
    p.id === '3d-printed-kitsatoz-robotic-arm-frame' || 
    p.id === '3d-printed-lord-ganesha-figurine' || 
    p.id === '3d-printed-spider-emblem-wall-art' || 
    p.id === 'robot-smart-car-wheels-4pc' ||
    p.id === '3d-printed-high-traction-robot-wheels' ||
    p.category === '3D Printed Kits' ||
    (Array.isArray(p.categories) && p.categories.includes('3D Printed Kits'))
  ).slice(0, 4);

  const getCategoryIcon = (iconName) => {
    switch(iconName) {
      case 'Printer': return <Printer className="w-6 h-6" />;
      case 'Trees': return <Trees className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      case 'Wrench': return <Wrench className="w-6 h-6" />;
      default: return <Package className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" />
                <span>Next-Gen Maker Kits & Kinetic Automata</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15]">
                Precision <span className="text-brand-600 underline decoration-wood-300 decoration-wavy underline-offset-8">3D-Printed</span> & Artisan <span className="text-wood-700">Wooden DIY Kits</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Immerse yourself in mechanical kinematics. From articulated 3D bionic spiders and high-traction rover wheels to laser-cut wooden walking arachnids and clocks—everything you need to build tactile marvels.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-soft-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore All Kits</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop?category=3D+Printed+Kits"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-wood-100 border border-wood-300 text-slate-800 font-semibold text-sm shadow-xs transition-colors"
                >
                  <Zap className="w-4 h-4 text-brand-600" />
                  <span>Shop 3D Items & Spiders</span>
                </Link>

                <a
                  href={`https://wa.me/${getWhatsAppNumber()}?text=Hello%20KITSaTOz!%20I%20would%20like%20to%20discuss%20a%20custom%20kit%20or%20prototype.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-wood-100 hover:bg-wood-200 text-slate-700 font-medium text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Custom Prototyping</span>
                </a>
              </div>

              {/* Direct Kit Jump Links */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1">Direct Kit Links:</span>
                <Link to="/product/3d-printed-venom-symbiote-figurine" className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition-colors shadow-xs flex items-center gap-1">
                  🕷️ 3D Venom Figurine
                </Link>
                <Link to="/shop" className="px-3 py-1.5 rounded-full bg-white hover:bg-brand-50 border border-wood-200 text-slate-700 hover:text-brand-600 font-semibold transition-colors shadow-xs">
                  📦 All Shop Kits
                </Link>
                <Link to="/shop?category=3D+Printed+Kits" className="px-3 py-1.5 rounded-full bg-white hover:bg-brand-50 border border-wood-200 text-slate-700 hover:text-brand-600 font-semibold transition-colors shadow-xs">
                  🕷️ 3D Bionic Spider
                </Link>
                <Link to="/shop?category=Wooden+DIY+Kits" className="px-3 py-1.5 rounded-full bg-white hover:bg-brand-50 border border-wood-200 text-slate-700 hover:text-brand-600 font-semibold transition-colors shadow-xs">
                  🪵 Wooden Walking Spider
                </Link>
                <Link to="/shop?category=Robotics+%26+Components" className="px-3 py-1.5 rounded-full bg-white hover:bg-brand-50 border border-wood-200 text-slate-700 hover:text-brand-600 font-semibold transition-colors shadow-xs">
                  ⚙️ 3D Wheels & Motors
                </Link>
              </div>

              {/* Social Proof Stats */}
              <div className="pt-6 border-t border-wood-200 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-black text-slate-900">1,200+</p>
                  <p className="text-xs text-slate-500 font-medium">Kits Built Across India</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">0.12mm</p>
                  <p className="text-xs text-slate-500 font-medium">Laser & 3D Tolerances</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">4.9 / 5</p>
                  <p className="text-xs text-slate-500 font-medium">Maker Community Rating</p>
                </div>
              </div>

            </div>

            {/* Right Visual Composition - Featured Venom 3D Figurine with Interactive Views */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-rose-500/20 via-brand-500/20 to-wood-500/20 rounded-3xl blur-2xl transform rotate-2 -z-10"></div>
                
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-soft-xl bg-slate-950 group">
                  {/* Main Product Image */}
                  <Link to="/product/3d-printed-venom-symbiote-figurine" className="block relative overflow-hidden">
                    <img
                      src={heroVenomImages[selectedHeroImage].src}
                      alt={`3D Printed Venom Symbiote Figurine - ${heroVenomImages[selectedHeroImage].label}`}
                      className="w-full h-80 sm:h-[420px] object-cover object-top hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  </Link>

                  {/* Interactive Angles Selector */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-md z-20">
                    {heroVenomImages.map((img, idx) => (
                      <button
                        key={img.label}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedHeroImage(idx);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                          selectedHeroImage === idx
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>

                  {/* Product Details Overlay */}
                  <div className="p-6 text-white absolute bottom-0 inset-x-0 z-10 pointer-events-none">
                    <div className="flex items-center gap-2 mb-1 pointer-events-auto">
                      <span className="text-[10px] uppercase font-black tracking-widest text-rose-300 bg-rose-950/90 border border-rose-800/80 px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-rose-400" />
                        <span>🔥 Featured 3D Masterpiece</span>
                      </span>
                      <Link 
                        to="/shop?category=3D+Printed+Kits"
                        className="text-[10px] font-bold text-slate-300 hover:text-rose-300 underline"
                      >
                        3D Catalog →
                      </Link>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black mt-1 leading-snug drop-shadow-sm">
                      3D Printed Venom Symbiote Figurine
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      Ultra-detailed hand-finished kinetic symbiote sculpt on monolith stone pedestal. Hand-painted & DIY raw print editions.
                    </p>

                    <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-800/80 pointer-events-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-rose-400 font-mono">₹999</span>
                        <span className="text-xs text-slate-400 line-through">₹1,499</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded">33% OFF</span>
                      </div>
                      <Link
                        to="/product/3d-printed-venom-symbiote-figurine"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-soft transition-all transform hover:-translate-y-0.5"
                      >
                        <span>View Figurine</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating micro card */}
                <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-wood-200 shadow-soft-lg items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">0.08mm Layer Precision</p>
                    <p className="text-[11px] text-slate-500">High-Density Resin & Tough PLA+</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Categories (All 4 categories directly linked to Shop Kits) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
            Engineered For Makers
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Choose Your Craft Category
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Each kit is carefully designed with step-by-step blueprints, hardware components, and spare parts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl overflow-hidden border border-wood-200/80 bg-white hover:border-brand-500 transition-all duration-300 hover:shadow-soft-lg flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-wood-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-800 shadow-xs">
                  {cat.count}+ Models
                </div>
              </div>

              <div className="p-5">
                <div className="w-10 h-10 -mt-10 mb-2.5 rounded-xl bg-white border border-wood-200 shadow-sm flex items-center justify-center text-brand-600 relative z-10 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  {getCategoryIcon(cat.icon)}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {cat.tagline}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                  <span>Shop Category Kits</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3D & Mechanical Item Spotlight (Spider, Wheels, Wooden Spider, Ganesha) */}
      {spotlightItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-wood-100/90 to-brand-50/70 rounded-3xl p-6 sm:p-8 border border-wood-200/80">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-brand-600" /> New 3D & Mechanical Additions
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Articulated Spiders & Robotic Wheels
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Explore our latest high-detail 3D printed models, motorized crawler kits, and wheel sets.
                </p>
              </div>
              <Link
                to="/shop?category=3D+Printed+Kits"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-full shadow-sm transition-colors"
              >
                <span>Shop All 3D Kits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {spotlightItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
              Community Favorites
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Top Best-Selling Kits
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>View Full Catalog in Shop Kits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-wood-200/80 p-4 animate-pulse space-y-4">
                <div className="aspect-square bg-slate-200 rounded-xl w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section (Directly linked to Shop Kits) */}
      <section className="bg-white border-y border-wood-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
              Seamless Ordering & Support
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              How KITSaTOz Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From our maker workbench directly to your hands with verified personal touch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-wood-50 border border-wood-200/60 relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center mb-6 shadow-soft">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Choose Your Kit</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select between 3D-printed precision assemblies, laser wooden automata, articulated spiders, or robotic wheels with custom material preferences.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-700">
                  <CheckCircle2 className="w-4 h-4" /> DIY or Pre-Assembled options
                </div>
              </div>
              <div className="pt-6">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <span>Browse Shop Kits</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-wood-50 border border-wood-200/60 relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-wood-800 text-white font-black text-lg flex items-center justify-center mb-6 shadow-soft">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Order & Quick Verification</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Submit your order with delivery address. An automatic WhatsApp enquiry is generated so our technical sales agent can verify stock and assist you directly.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-wood-700">
                  <CheckCircle2 className="w-4 h-4" /> Seamless UPI or Payment link
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-wood-50 border border-wood-200/60 relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-6 shadow-soft">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Delivery & Support</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your kit is securely cushioned and dispatched with full tracking. Get immediate WhatsApp maker support if you ever get stuck during assembly!
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> Illustrated manual + Maker hotline
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Prototyping CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-wood-900 to-wood-950 p-8 sm:p-12 text-white relative overflow-hidden shadow-soft-lg">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
              Need a Custom Part or Educational Batch?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Have a 3D File (.STL / .STEP) or Custom Wooden Project?
            </h2>
            <p className="text-sm sm:text-base text-wood-300 leading-relaxed">
              We provide rapid 3D printing in Engineering Resins, Carbon Fiber PLA, PETG, and sub-millimeter laser cutting for student projects, research labs, and architectural models.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/shop?category=Custom+Prototypes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-colors"
              >
                <span>Browse Prototyping Kits</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${getWhatsAppNumber()}?text=Hi%20KITSaTOz!%20I%20have%20a%20custom%20CAD%20file%20and%20want%20a%20quote.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Send File via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
