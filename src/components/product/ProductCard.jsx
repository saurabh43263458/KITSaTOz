import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useCartStore } from '../../store/cartStore';
import { toast } from '../../store/toastStore';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const currentStock = product.stock !== undefined ? Number(product.stock) : (product.stockCount !== undefined ? Number(product.stockCount) : 10);
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error('Out of Stock', 'This item is currently out of stock.');
      return;
    }

    addItem({
      ...product,
      inStock: !isOutOfStock,
      stockCount: currentStock
    }, {
      quantity: 1,
      selectedMaterial: product.specs?.Material || product.materials?.[0] || 'Standard',
      selectedColor: product.colors?.[0] || 'Standard',
      selectedAssembly: product.assemblyOptions?.[0] || 'Standard'
    });

    toast.success('Added to Cart', `${product.name} has been added.`);
  };

  const getProductImage = () => {
    const rawImg = product.images?.[0];
    if (!rawImg) return '/products/robot-wheels-set-4.jpg';
    return rawImg;
  };

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

  const productLink = `/product/${product.slug || product.id}`;

  return (
    <div className="group bg-white rounded-2xl border border-wood-200/80 hover:border-brand-400 overflow-hidden shadow-xs hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image wrapper */}
        <div className="relative aspect-square overflow-hidden bg-wood-100">
          <Link to={productLink}>
            <img
              src={getProductImage()}
              alt={product.name}
              onError={handleImageError}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Badges on top */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {product.bestSeller && (
              <Badge variant="brand">Best Seller</Badge>
            )}
            {product.badge && !product.bestSeller && (
              <Badge variant="purple">{product.badge}</Badge>
            )}
            {isOutOfStock ? (
              <Badge variant="danger">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="warning">Low Stock ({currentStock} left)</Badge>
            ) : null}
            {product.customizable && (
              <Badge variant="wood">Customizable</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-wood-600 mb-1.5 font-medium">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-slate-800">{product.rating || '4.9'}</span>
              <span className="text-slate-400">({product.reviewCount || 15})</span>
            </div>
          </div>

          <Link to={productLink} className="block group-hover:text-brand-600 transition-colors">
            <h3 className="font-bold text-base text-slate-900 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description || product.shortDescription}
          </p>
        </div>
      </div>

      {/* Footer / Price & Add */}
      <div className="px-5 pb-5 pt-3 border-t border-wood-100 flex items-center justify-between">
        <div>
          <span className="text-lg font-black text-slate-900">
            ₹{(product.price || 0).toLocaleString()}
          </span>
          {(product.comparePrice || product.originalPrice) && (product.comparePrice || product.originalPrice) > product.price && (
            <span className="text-xs text-slate-400 line-through ml-2">
              ₹{(product.comparePrice || product.originalPrice).toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold transition-all ${
            !isOutOfStock
              ? 'bg-wood-100 hover:bg-brand-600 text-slate-800 hover:text-white shadow-xs'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
          }`}
          title={!isOutOfStock ? 'Add to Cart' : 'Out of Stock'}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
        </button>
      </div>
    </div>
  );
};

