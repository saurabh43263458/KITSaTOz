import React from 'react';
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
  Truck
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { ProductCard } from '../components/product/ProductCard';
import { CATEGORIES } from '../data/initialProducts';
import { getWhatsAppNumber } from '../services/whatsappService';

export const Home = () => {
  const { products } = useProductStore();
  const bestSellers = products.filter(p => p.badge === 'Best Seller' || p.rating >= 4.9).slice(0, 4);

  const getCategoryIcon = (iconName) => {
    switch(iconName) {
      case 'Printer': return <Printer className="w-6 h-6" />;
      case 'Trees': return <Trees className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      default: return <Wrench className="w-6 h-6" />;
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
                Immerse yourself in mechanical kinematics. From hypnotic triple-axis tourbillons to laser-cut marble coasters and custom CAD prototypes—everything you need to build tactile marvels.
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

                <a
                  href={`https://wa.me/${getWhatsAppNumber()}?text=Hello%20KITSaTOz!%20I%20would%20like%20to%20discuss%20a%20custom%20kit%20or%20prototype.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-wood-100 border border-wood-300 text-slate-800 font-semibold text-sm shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Custom Prototyping</span>
                </a>
              </div>

              {/* Social Proof Stats */}
              <div className="pt-8 border-t border-wood-200 grid grid-cols-3 gap-6">
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

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-300/30 to-wood-300/30 rounded-3xl blur-2xl transform rotate-3 -z-10"></div>
                
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-soft-lg bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                    alt="Precision 3D Printed Automaton Kit"
                    className="w-full h-80 sm:h-96 object-cover object-center"
                  />
                  <div className="p-6 bg-gradient-to-t from-wood-950 via-wood-950/90 to-transparent text-white absolute bottom-0 inset-x-0">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 bg-brand-950/80 px-2 py-0.5 rounded">
                      Featured Creation
                    </span>
                    <h3 className="text-xl font-bold mt-1">Precision Tourbillon Desk Automaton</h3>
                    <p className="text-xs text-wood-300 mt-1">38 Interlocking 3D prints, stainless steel hairspring & bearings.</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-black text-brand-300">₹3,499</span>
                      <Link
                        to="/product/prod-1"
                        className="text-xs font-semibold text-white underline hover:text-brand-300"
                      >
                        View Kit Specs →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating micro card */}
                <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-wood-200 shadow-soft items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">No Glue Required</p>
                    <p className="text-[11px] text-slate-500">Snap-fit snap-lock joints</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Categories */}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl overflow-hidden border border-wood-200/80 bg-white hover:border-brand-500 transition-all duration-300 hover:shadow-soft-lg flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden bg-wood-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-xs">
                  {cat.count}+ Models
                </div>
              </div>

              <div className="p-6">
                <div className="w-12 h-12 -mt-12 mb-3 rounded-2xl bg-white border border-wood-200 shadow-sm flex items-center justify-center text-brand-600 relative z-10 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  {getCategoryIcon(cat.icon)}
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {cat.tagline}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
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
            <div className="p-8 rounded-3xl bg-wood-50 border border-wood-200/60 relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center mb-6 shadow-soft">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Choose Your Kit</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select between 3D-printed precision assemblies, laser wooden automata, or request custom CAD prototype modifications with material preferences.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-700">
                <CheckCircle2 className="w-4 h-4" /> DIY or Pre-Assembled options
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-wood-50 border border-wood-200/60 relative">
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

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-wood-50 border border-wood-200/60 relative">
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
              <a
                href={`https://wa.me/${getWhatsAppNumber()}?text=Hi%20KITSaTOz!%20I%20have%20a%20custom%20CAD%20file%20and%20want%20a%20quote.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Send File via WhatsApp
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                Request Quotation Form
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
