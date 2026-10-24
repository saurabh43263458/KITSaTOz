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

import { getProductBySlug } from '../services/products';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProductStore();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedAssembly, setSelectedAssembly] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'bom' | 'shipping'

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const firestoreProduct = await getProductBySlug(id);
        if (isMounted) {
          if (firestoreProduct) {
            setProduct(firestoreProduct);
          } else {
            setProduct(getProductById(id));
          }
        }
      } catch (e) {
        if (isMounted) setProduct(getProductById(id));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => { isMounted = false; };
  }, [id, getProductById]);

  // Initialize selected options when product loads
  useEffect(() => {
    if (product) {
      if (product.materials?.length) setSelectedMaterial(product.materials[0]);
      else if (product.specs?.Material) setSelectedMaterial(product.specs.Material);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      if (product.assemblyOptions?.length) setSelectedAssembly(product.assemblyOptions[0]);
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading Kit Details...</p>
      </div>
    );
  }

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

  const currentStock = product.stock !== undefined ? Number(product.stock) : (product.stockCount !== undefined ? Number(product.stockCount) : 10);
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;


  const handleImageError = (e) => {
    const src = e.target.src || '';
    if (src.includes('products%2F')) {
      const match = src.match(/products%2F([^?]+)/);
      if (match && match[1]) {
        e.target.src = '/products/' + decodeURIComponent(match[1]);
        return;
      }
    }
    e.target.src = '/products/robot-wheels-set-4.jpg';
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Out of Stock', 'This item is currently out of stock.');
      return;
    }

    addItem({
      ...product,
      inStock: !isOutOfStock,
      stockCount: currentStock
    }, {
      quantity,
      selectedMaterial: selectedMaterial || product.specs?.Material || 'Standard',
      selectedColor: selectedColor || 'Standard',
      selectedAssembly: selectedAssembly || 'Standard'
    });

    toast.success('Added to Cart', `${product.name} (Qty: ${quantity}) has been added.`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error('Out of Stock', 'This item is currently out of stock.');
      return;
    }

    addItem({
      ...product,
      inStock: !isOutOfStock,
      stockCount: currentStock
    }, {
      quantity,
      selectedMaterial: selectedMaterial || product.specs?.Material || 'Standard',
      selectedColor: selectedColor || 'Standard',
      selectedAssembly: selectedAssembly || 'Standard'
    });

    navigate('/checkout');
  };

  const whatsAppUrl = generateWhatsAppInquiryUrl(
    product, 
    `Selected: Material: ${selectedMaterial || 'Standard'}, Option: ${selectedAssembly || 'Standard'}`
  );


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-600 font-medium">Shop Kits</Link>
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
              src={product.images?.[selectedImage] || product.images?.[0] || '/products/robot-wheels-set-4.jpg'}
              alt={product.name}
              onError={handleImageError}
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
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
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
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="brand">{product.category}</Badge>
              {product.bestSeller && <Badge variant="brand">Best Seller</Badge>}
              {product.badge && !product.bestSeller && <Badge variant="wood">{product.badge}</Badge>}
              {isOutOfStock ? (
                <Badge variant="danger">Out of Stock</Badge>
              ) : isLowStock ? (
                <Badge variant="warning">Low Stock ({currentStock} left)</Badge>
              ) : (
                <Badge variant="success">In Stock ({currentStock} available)</Badge>
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
                  disabled={isOutOfStock}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm border transition-colors shadow-xs ${
                    !isOutOfStock
                      ? 'bg-wood-100 hover:bg-wood-200 text-slate-800 border-wood-300'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-wood-800" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm shadow-soft transition-all ${
                    !isOutOfStock
                      ? 'bg-brand-600 hover:bg-brand-700 text-white transform hover:-translate-y-0.5'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Unavailable' : 'Buy Now'}</span>
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
                  {(product.specs || product.specifications) ? (
                    Object.entries(product.specs || product.specifications).map(([key, val]) => (
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

      {/* Discover More Kits Banner */}
      <div className="mt-16 pt-8 border-t border-wood-200">
        <div className="bg-wood-50 rounded-3xl p-6 sm:p-8 border border-wood-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Discover More Maker Kits</h3>
            <p className="text-xs text-slate-600 mt-1">
              Explore our full collection of 3D-printed bionic spiders, kinetic automata, robotic wheel sets, and laser-cut wooden projects.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft transition-colors"
            >
              Browse All Shop Kits →
            </Link>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-wood-100 border border-wood-300 text-slate-800 font-semibold text-xs shadow-xs transition-colors"
            >
              More in {product.category}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};
