import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { toast } from '../store/toastStore';
import { generateWhatsAppInquiryUrl } from '../services/whatsappService';
import { Badge } from '../components/common/Badge';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  MessageCircle, 
  Check, 
  Wrench, 
  PackageCheck, 
  Truck, 
  ShieldCheck, 
  ArrowLeft,
  Ruler,
  Layers
} from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProductStore();
  const { addItem } = useCartStore();

  const product = getProductById(id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedAssembly, setSelectedAssembly] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'bom' | 'shipping'

  // Initialize selected options when product loads
  useEffect(() => {
    if (product) {
      if (product.materials?.length) setSelectedMaterial(product.materials[0]);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      if (product.assemblyOptions?.length) setSelectedAssembly(product.assemblyOptions[0]);
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The kit you are looking for does not exist or has been discontinued.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-full"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('Out of Stock', 'This item cannot be ordered at this time.');
      return;
    }

    addItem(product, {
      quantity,
      selectedMaterial,
      selectedColor,
      selectedAssembly
    });

    toast.success('Added to Cart', `${product.name} (Qty: ${quantity}) has been added.`);
  };

  const handleBuyNow = () => {
    if (!product.inStock) {
      toast.error('Out of Stock', 'This item cannot be ordered at this time.');
      return;
    }

    addItem(product, {
      quantity,
      selectedMaterial,
      selectedColor,
      selectedAssembly
    });

    // Directly proceed to checkout
    navigate('/checkout');
  };

  const whatsAppUrl = generateWhatsAppInquiryUrl(
    product, 
    `Selected: Material: ${selectedMaterial}, Color: ${selectedColor}, Option: ${selectedAssembly}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-wood-200 bg-white shadow-xs">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === index
                      ? 'border-brand-500 shadow-sm scale-95'
                      : 'border-wood-200 hover:border-wood-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3 rounded-2xl bg-white border border-wood-200 flex items-center gap-2.5 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Tolerance Guarantee</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-wood-200 flex items-center gap-2.5 text-xs text-slate-700">
              <Wrench className="w-4 h-4 text-wood-700 shrink-0" />
              <span>Hardware & Spare Screws</span>
            </div>
          </div>
        </div>

        {/* Right Column: Specs, Customizers & Purchase */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand">{product.category}</Badge>
              {product.badge && <Badge variant="wood">{product.badge}</Badge>}
              {product.inStock ? (
                <Badge variant="success">In Stock ({product.stockCount} available)</Badge>
              ) : (
                <Badge variant="danger">Backorder</Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating || '4.9'}</span>
              <span className="text-xs text-slate-400">({product.reviewCount || 12} Verified Maker Reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Inclusive of GST
              </span>
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {product.fullDescription}
            </p>
          </div>

          {/* Option Selectors */}
          <div className="space-y-4 pt-4 border-t border-wood-200">
            
            {/* Assembly Option */}
            {product.assemblyOptions?.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Assembly Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.assemblyOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedAssembly(opt)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-left transition-all flex items-center justify-between ${
                        selectedAssembly === opt
                          ? 'border-brand-500 bg-brand-50/70 text-brand-900 ring-1 ring-brand-500'
                          : 'border-wood-200 bg-white text-slate-700 hover:border-wood-400'
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedAssembly === opt && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material Selector */}
            {product.materials?.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Material Grade
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedMaterial === mat
                          ? 'border-brand-500 bg-brand-50 text-brand-900 ring-1 ring-brand-500'
                          : 'border-wood-200 bg-white text-slate-700 hover:border-wood-400'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Finish */}
            {product.colors?.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Color / Finish
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedColor === color
                          ? 'border-brand-500 bg-brand-50 text-brand-900 ring-1 ring-brand-500'
                          : 'border-wood-200 bg-white text-slate-700 hover:border-wood-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensions */}
            {product.dimensions && (
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-wood-100/70 p-2.5 rounded-xl">
                <Ruler className="w-4 h-4 text-wood-700" />
                <span>Dimensions: <strong>{product.dimensions}</strong></span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center border border-wood-300 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-wood-100 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-800 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-wood-100 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-wood-100 hover:bg-wood-200 text-slate-800 font-bold text-sm border border-wood-300 transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-wood-800" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-soft transition-all transform hover:-translate-y-0.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Order / Inquire via WhatsApp */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order or Inquire via WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Detailed Tabs: Specifications, Bill of Materials, Shipping */}
          <div className="pt-6 border-t border-wood-200">
            <div className="flex border-b border-wood-200">
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('bom')}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'bom'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Bill of Materials (BOM)
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Shipping & Support
              </button>
            </div>

            <div className="py-4 text-xs text-slate-600 leading-relaxed">
              {activeTab === 'specs' && (
                <div className="space-y-2">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1.5 border-b border-wood-100">
                        <span className="font-semibold text-slate-700">{key}:</span>
                        <span className="text-slate-900">{val}</span>
                      </div>
                    ))
                  ) : (
                    <p>Standard maker grade specifications apply.</p>
                  )}
                </div>
              )}

              {activeTab === 'bom' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800 mb-2">Included inside this kit package:</p>
                  <ul className="space-y-1.5">
                    {product.billOfMaterials?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-brand-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>• Dispatched within 24-48 hours via premium express couriers (Bluedart / Delhivery / DTDC).</p>
                  <p>• Carefully packed in custom high-density PE foam cutouts to avoid gear damage in transit.</p>
                  <p>• Includes lifetime WhatsApp maker assistance if you misplace any screw or need assembly tips.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
