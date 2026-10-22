import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useCartStore } from '../../store/cartStore';
import { toast } from '../../store/toastStore';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) {
      toast.error('Out of Stock', 'This kit is currently in production backorder.');
      return;
    }

    addItem(product, {
      quantity: 1,
      selectedMaterial: product.materials?.[0] || 'Standard',
      selectedColor: product.colors?.[0] || 'Standard',
      selectedAssembly: product.assemblyOptions?.[0] || 'DIY Kit'
    });

    toast.success('Added to Cart', `${product.name} has been added.`);
  };

  const badgeVariant = () => {
    if (product.badge === 'Best Seller') return 'brand';
    if (product.badge === 'Trending') return 'purple';
    if (product.badge === 'Staff Pick') return 'wood';
    if (product.badge === 'Custom Option') return 'warning';
    return 'default';
  };

  return (
    <div className="group bg-white rounded-2xl border border-wood-200/80 hover:border-brand-400 overflow-hidden shadow-xs hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image wrapper */}
        <div className="relative aspect-square overflow-hidden bg-wood-100">
          <Link to={`/product/${product.id}`}>
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Badges on top */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {product.badge && (
              <Badge variant={badgeVariant()}>{product.badge}</Badge>
            )}
            {!product.inStock && (
              <Badge variant="danger">Out of Stock</Badge>
            )}
            {product.isCustomOption && !product.badge?.includes('Custom') && (
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
              <span className="text-slate-400">({product.reviewCount || 12})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block group-hover:text-brand-600 transition-colors">
            <h3 className="font-bold text-base text-slate-900 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {/* Footer / Price & Add */}
      <div className="px-5 pb-5 pt-3 border-t border-wood-100 flex items-center justify-between">
        <div>
          <span className="text-lg font-black text-slate-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through ml-2">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={!product.inStock}
          className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold transition-all ${
            product.inStock
              ? 'bg-wood-100 hover:bg-brand-600 text-slate-800 hover:text-white shadow-xs'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          title={product.inStock ? 'Add to Cart' : 'Currently Unavailable'}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
