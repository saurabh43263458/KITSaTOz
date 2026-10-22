import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { ProductCard } from '../components/product/ProductCard';
import { CATEGORIES } from '../data/initialProducts';
import { Search, SlidersHorizontal, RotateCcw, Box, Check, Sparkles } from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProductStore();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [maxPrice, setMaxPrice] = useState(7000);
  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL search parameters change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(7000);
    setSortBy('featured');
    setOnlyInStock(false);
    setOnlyCustomizable(false);
    setSearchParams({});
  };

  // Filter & Sort calculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category match
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      // Max Price
      if (product.price > maxPrice) {
        return false;
      }
      // Stock
      if (onlyInStock && !product.inStock) {
        return false;
      }
      // Customizable
      if (onlyCustomizable && !product.isCustomOption) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // 'featured' retains natural sequence
    });
  }, [products, selectedCategory, searchQuery, maxPrice, sortBy, onlyInStock, onlyCustomizable]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title & Breadcrumb */}
      <div className="mb-8">
        <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
          Catalog & Maker Marketplace
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
          Explore Handcrafted Kits
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Browse our entire library of mechanical automata, laser-cut wooden projects, and custom kits.
        </p>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-wood-300 rounded-xl text-sm font-semibold text-slate-800 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Show Filters & Sort'}</span>
          </button>
        </div>

        {/* Filters Sidebar */}
        <div className={`space-y-6 lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-2xl border border-wood-200/80 p-6 shadow-xs space-y-6">
            
            {/* Header + Reset */}
            <div className="flex items-center justify-between pb-4 border-b border-wood-100">
              <span className="font-bold text-base text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search Box in Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Search Kits
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Tourbillon, Clock..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategoryChange('All')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'All'
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-wood-50'
                  }`}
                >
                  <span>All Kits</span>
                  <span className="text-[11px] text-slate-400">{products.length}</span>
                </button>

                {CATEGORIES.map((cat) => {
                  const count = products.filter(p => p.category === cat.name).length;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-50 text-brand-700 font-bold'
                          : 'text-slate-600 hover:bg-wood-50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] text-slate-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Max Budget
                </label>
                <span className="text-xs font-black text-slate-900">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1500"
                max="7000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹1,500</span>
                <span>₹7,000</span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2.5 pt-2 border-t border-wood-100">
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-wood-300"
                />
                <span>In Stock only</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyCustomizable}
                  onChange={(e) => setOnlyCustomizable(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-wood-300"
                />
                <span>Custom CAD / Prototyping</span>
              </label>
            </div>

          </div>
        </div>

        {/* Products Grid & Sorting Header */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort / Counter Bar */}
          <div className="bg-white rounded-2xl border border-wood-200/80 px-5 py-3.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-600">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> kits found
            </span>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-wood-50 border border-wood-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated (4.8+)</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-wood-200 p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-wood-100 text-wood-600 flex items-center justify-center mx-auto mb-4">
                <Box className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Kits Match Your Filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try widening your price budget or clearing category filters to find the right assembly kit.
              </p>
              <button
                onClick={handleResetFilters}
                className="py-2.5 px-6 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
