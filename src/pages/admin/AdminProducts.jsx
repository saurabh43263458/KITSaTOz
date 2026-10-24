import React, { useState, useEffect, useRef } from 'react';
import { toast } from '../../store/toastStore';
import { 
  subscribeToProducts, 
  createProductInFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore 
} from '../../services/products';
import { isFirebaseConfigured } from '../../services/firebase';
import { compressImageFile, formatBytes } from '../../utils/imageCompressor';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X, 
  Check, 
  Image as ImageIcon,
  AlertCircle,
  Database,
  RefreshCw,
  Sparkles,
  Layers,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef(null);

  // Subscribe to live Firestore products
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts((liveProducts) => {
      setProducts(liveProducts || []);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Form State
  const initialForm = {
    name: '',
    category: '3D Printed Kits',
    price: 499,
    originalPrice: 699,
    stockCount: 20,
    badge: '3D Hot Item',
    isCustomOption: false,
    shortDescription: '',
    fullDescription: '',
    imageUrl: '/products/image2.jpeg',
    dimensions: '160mm x 150mm x 25mm',
    materials: 'High-Toughness PLA+, PETG',
    colors: 'Signal White, Matte Black, Vibrant Red',
    assemblyOptions: 'DIY Sprue Kit, Pre-Assembled Model'
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setCompressionStats(null);
    setShowManualUrl(false);
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    const currentStock = prod.stock !== undefined ? prod.stock : (prod.stockCount !== undefined ? prod.stockCount : 15);
    const primaryImg = prod.images?.[0] || prod.imageUrl || '';
    
    setFormData({
      name: prod.name || '',
      category: prod.category || '3D Printed Kits',
      price: prod.price || 0,
      originalPrice: prod.comparePrice || prod.originalPrice || '',
      stockCount: currentStock,
      badge: prod.badge || '',
      isCustomOption: Boolean(prod.customizable || prod.isCustomOption),
      shortDescription: prod.shortDescription || prod.description || '',
      fullDescription: prod.fullDescription || prod.description || '',
      imageUrl: primaryImg,
      dimensions: prod.specs?.Dimensions || prod.dimensions || '',
      materials: Array.isArray(prod.materials) ? prod.materials.join(', ') : (prod.specs?.Material || ''),
      colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : '',
      assemblyOptions: Array.isArray(prod.assemblyOptions) ? prod.assemblyOptions.join(', ') : ''
    });
    setCompressionStats(null);
    setShowManualUrl(!primaryImg.startsWith('data:'));
    setModalOpen(true);
  };

  // Image Upload with Automatic Compression & Resizing (<1MB)
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File Type', 'Please upload an image (JPG, PNG, WebP).');
      return;
    }

    setCompressing(true);
    setCompressionStats(null);

    try {
      // Auto-compress and resize image to guaranteed < 750KB (well below 1MB Firestore document limit)
      const result = await compressImageFile(file, {
        maxDimension: 1280,
        targetMaxBytes: 750 * 1024
      });

      setFormData((prev) => ({
        ...prev,
        imageUrl: result.dataUrl
      }));

      setCompressionStats({
        originalSize: result.originalSize,
        sizeBytes: result.sizeBytes,
        width: result.width,
        height: result.height,
        wasCompressed: result.wasCompressed
      });

      const savingsPercent = result.originalSize > result.sizeBytes 
        ? Math.round((1 - result.sizeBytes / result.originalSize) * 100) 
        : 0;

      toast.success(
        'Photo Ready for Cloud!',
        `Resized to ${result.width}x${result.height}px (${formatBytes(result.sizeBytes)}${savingsPercent > 0 ? `, saved ${savingsPercent}%` : ''}). Safely fits inside Firestore document.`
      );
    } catch (err) {
      console.error('Image compression error:', err);
      toast.error('Compression Failed', err.message || 'Could not process photo.');
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Validation Error', 'Kit name is required.');
      return;
    }

    setSaving(true);
    const cleanMaterials = formData.materials ? formData.materials.split(',').map(m => m.trim()).filter(Boolean) : [];
    const cleanColors = formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
    const cleanAssembly = formData.assemblyOptions ? formData.assemblyOptions.split(',').map(a => a.trim()).filter(Boolean) : [];

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      categories: [formData.category],
      price: Number(formData.price),
      comparePrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      stock: Number(formData.stockCount),
      stockCount: Number(formData.stockCount),
      badge: formData.badge.trim(),
      customizable: formData.isCustomOption,
      isCustomOption: formData.isCustomOption,
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      description: formData.fullDescription.trim() || formData.shortDescription.trim(),
      images: [formData.imageUrl.trim()],
      dimensions: formData.dimensions.trim(),
      materials: cleanMaterials,
      colors: cleanColors,
      assemblyOptions: cleanAssembly,
      specs: {
        Material: cleanMaterials.join(', ') || 'Engineering Polymer PLA',
        Dimensions: formData.dimensions.trim() || 'Custom Tolerances',
        Type: formData.category
      },
      published: true
    };

    try {
      if (editingProduct) {
        await updateProductInFirestore(editingProduct.id, payload);
        toast.success('Kit Updated in Firebase', `${formData.name} was successfully modified in Firestore.`);
      } else {
        await createProductInFirestore(payload);
        toast.success('Kit Added to Firebase', `${formData.name} is now live in Firestore.`);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving kit to Firestore:', err);
      toast.error('Firebase Error', 'Failed to save product in Firestore: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" from Firebase Firestore?`)) {
      try {
        await deleteProductFromFirestore(id);
        toast.warning('Product Deleted', `${name} was removed from Firebase Firestore.`);
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Delete Failed', 'Could not delete from Firestore: ' + err.message);
      }
    }
  };

  const handleStockAdjust = async (product, delta) => {
    const currentStock = product.stock !== undefined ? Number(product.stock) : (product.stockCount !== undefined ? Number(product.stockCount) : 0);
    const newStock = Math.max(0, currentStock + delta);
    
    try {
      await updateProductInFirestore(product.id, {
        stock: newStock,
        stockCount: newStock
      });
      toast.info('Stock Updated', `${product.name}: ${newStock} units remaining`);
    } catch (err) {
      toast.error('Update Failed', 'Failed to update stock in Firestore');
    }
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

  const filteredProducts = products.filter(p => 
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Firebase Firestore Backend</span>
            </span>
            <span className="text-xs text-slate-400">
              ({products.length} live backend items)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Product & Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time synchronization with Firestore database. Modify live pricing, specifications, and restock units.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-soft transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Kit to Firebase</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by kit title, category, or spec..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold justify-between sm:justify-end">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live synced: <strong className="text-white ml-1">{filteredProducts.length}</strong> items
          </span>
        </div>
      </div>

      {/* Products Table Container - Scrollable Table Area */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-400">Loading live products from Firebase Firestore...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No matching kits found</p>
            <p className="text-xs text-slate-500">Add a kit using the button above or clear search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900/95 backdrop-blur uppercase text-[11px] font-bold text-slate-400 tracking-wider sticky top-0 z-10 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Kit Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Count</th>
                  <th className="py-3.5 px-4">Badge</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map((p) => {
                  const currentStock = p.stock !== undefined ? Number(p.stock) : (p.stockCount !== undefined ? Number(p.stockCount) : 0);
                  const displayImg = p.images?.[0] || p.imageUrl || '/products/robot-wheels-set-4.jpg';
                  const is3D = (p.category || '').toLowerCase().includes('3d') || (Array.isArray(p.categories) && p.categories.some(c => c.toLowerCase().includes('3d')));

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/50 transition-colors group">
                      {/* Kit Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={displayImg}
                            alt={p.name}
                            onError={handleImageError}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-700/80 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0 max-w-sm">
                            <p className="font-bold text-white truncate text-xs flex items-center gap-1.5">
                              {p.name}
                              {is3D && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-brand-950 text-brand-300 border border-brand-800 font-medium">
                                  3D
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {p.shortDescription || p.description || 'Precision crafted mechanical kit.'}
                            </p>
                            <span className="font-mono text-[10px] text-slate-500">
                              ID: {p.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-[11px] inline-block">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-black text-white text-sm">
                            ₹{Number(p.price).toLocaleString()}
                          </span>
                          {(p.comparePrice || p.originalPrice) && (
                            <span className="text-[10px] text-slate-500 line-through">
                              ₹{Number(p.comparePrice || p.originalPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Count */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold px-2 py-1 rounded-lg text-xs min-w-[32px] text-center ${
                            currentStock <= 5 
                              ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                              : currentStock <= 15
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-900 text-slate-200 border border-slate-800'
                          }`}>
                            {currentStock}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => handleStockAdjust(p, 5)}
                              className="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold transition-colors"
                              title="Add 5 units in Firestore"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleStockAdjust(p, -5)}
                              className="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold transition-colors"
                              title="Deduct 5 units in Firestore"
                            >
                              -5
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Badge */}
                      <td className="py-3 px-4">
                        {p.badge ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-950 text-brand-300 border border-brand-800/80 shadow-xs">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Kit in Firestore"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-colors"
                            title="Delete Kit from Firestore"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 text-slate-200 my-8 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingProduct ? 'Edit Kit in Firebase Firestore' : 'Add New Kit to Firebase Firestore'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Directly written to cloud database</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Kit Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. 3D Printed Robotic Arm Frame"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="3D Printed Kits">3D Printed Kits</option>
                    <option value="Wooden DIY Kits">Wooden DIY Kits</option>
                    <option value="Robotics & Components">Robotics & Components</option>
                    <option value="Custom Prototypes">Custom Prototypes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. 699"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Photo Upload with Auto-Resizing & Compression (<1MB) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase">
                    Kit Photo (Auto-Resized &lt; 1MB for Cloud Document) *
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Stored in Firestore Doc
                  </span>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                {/* Upload Area / Live Preview */}
                {formData.imageUrl ? (
                  <div className="p-3.5 bg-slate-900 border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0 relative group">
                      <img
                        src={formData.imageUrl}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1.5 text-center sm:text-left">
                      <p className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ready to Store in Firestore Document</span>
                      </p>
                      
                      {compressionStats ? (
                        <p className="text-[11px] text-slate-400">
                          Original: <span className="text-slate-300">{formatBytes(compressionStats.originalSize)}</span> ➔ Resized: <span className="font-bold text-emerald-400">{formatBytes(compressionStats.sizeBytes)}</span> ({compressionStats.width}x{compressionStats.height}px)
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {formData.imageUrl.startsWith('data:') ? 'Embedded Base64 Photo (<1MB)' : formData.imageUrl}
                        </p>
                      )}

                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={compressing}
                          className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imageUrl: '' });
                            setCompressionStats(null);
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 font-semibold text-xs border border-slate-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-slate-700 hover:border-brand-500 bg-slate-900/60 hover:bg-slate-900 rounded-2xl cursor-pointer transition-colors text-center group"
                  >
                    {compressing ? (
                      <div className="flex flex-col items-center justify-center py-2">
                        <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mb-2" />
                        <p className="text-xs font-bold text-white">Compressing & Resizing Photo...</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Optimizing under 1MB for Firestore storage</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-2">
                        <div className="w-12 h-12 rounded-2xl bg-brand-950/80 border border-brand-800/60 text-brand-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                          Click to Upload Product Photo
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          PNG, JPG, WebP • Auto-resizes and compresses to &lt; 1MB safely
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Optional manual URL toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline font-medium"
                  >
                    {showManualUrl ? 'Hide manual URL / preset options' : 'Or enter image URL / use presets manually'}
                  </button>

                  {showManualUrl && (
                    <div className="mt-2 space-y-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, imageUrl: e.target.value });
                          setCompressionStats(null);
                        }}
                        placeholder="/products/image2.jpeg or https://..."
                        className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-400">
                        <span className="font-bold">Presets:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imageUrl: '/products/3d-printed-venom-figurine-front.jpg' });
                            setCompressionStats(null);
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                        >
                          Venom Figurine
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imageUrl: '/products/image2.jpeg' });
                            setCompressionStats(null);
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                        >
                          KITSaTOz Frame
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imageUrl: '/products/ganesh_image.jpeg' });
                            setCompressionStats(null);
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                        >
                          Ganesha Idol
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imageUrl: '/products/spider_3D.jpeg' });
                            setCompressionStats(null);
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                        >
                          Spider Plaque
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence summary of the kit mechanics"
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Full Description & Story
                </label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Comprehensive details on assembly, kinematics, and tolerances"
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Dimensions & Tolerances
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="e.g. 165mm x 155mm x 22mm"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Materials (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    placeholder="Matte PLA+, PETG"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. KITSaTOz Original, 3D Hot Item"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isCustom"
                    checked={formData.isCustomOption}
                    onChange={(e) => setFormData({ ...formData, isCustomOption: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="isCustom" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    Enable Custom CAD Modifications
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-soft transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Save to Firebase' : 'Publish to Firebase'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
