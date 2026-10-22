import React, { useState } from 'react';
import { useProductStore } from '../../store/productStore';
import { toast } from '../../store/toastStore';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RotateCcw, 
  X, 
  Check, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults } = useProductStore();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    category: '3D Printed Kits',
    price: 1999,
    originalPrice: 2499,
    stockCount: 15,
    badge: '',
    isCustomOption: false,
    shortDescription: '',
    fullDescription: '',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    dimensions: '200mm x 150mm x 100mm',
    materials: 'Matte PLA+, PETG',
    colors: 'Terracotta Orange, Matte Black, Slate Grey',
    assemblyOptions: 'DIY Kit (Assembly Required), Pre-Assembled Model'
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      stockCount: prod.stockCount,
      badge: prod.badge || '',
      isCustomOption: Boolean(prod.isCustomOption),
      shortDescription: prod.shortDescription || '',
      fullDescription: prod.fullDescription || '',
      imageUrl: prod.images?.[0] || '',
      dimensions: prod.dimensions || '',
      materials: prod.materials?.join(', ') || '',
      colors: prod.colors?.join(', ') || '',
      assemblyOptions: prod.assemblyOptions?.join(', ') || ''
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stockCount: Number(formData.stockCount),
      badge: formData.badge,
      isCustomOption: formData.isCustomOption,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      images: [formData.imageUrl],
      dimensions: formData.dimensions,
      materials: formData.materials.split(',').map(m => m.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      assemblyOptions: formData.assemblyOptions.split(',').map(a => a.trim()).filter(Boolean),
      inStock: Number(formData.stockCount) > 0
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      toast.success('Kit Updated', `${formData.name} was successfully modified.`);
    } else {
      addProduct(payload);
      toast.success('Kit Added', `${formData.name} was added to catalog.`);
    }

    setModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      deleteProduct(id);
      toast.warning('Product Deleted', `${name} was removed.`);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Product & Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update pricing, restock workshop inventory, and adjust specifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all products back to the original 8 seed products?')) {
                resetToDefaults();
                toast.info('Catalog Reset', 'Products restored to default seed catalog.');
              }
            }}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-soft transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Kit</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by kit title or category..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          Total: <strong className="text-white">{filteredProducts.length}</strong> kits
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold tracking-wider border-b border-slate-800">
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
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-white truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{p.shortDescription}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {p.category}
                  </td>

                  <td className="py-3.5 px-4 font-black text-white">
                    ₹{p.price.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        p.stockCount <= 10 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-200'
                      }`}>
                        {p.stockCount}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => updateProduct(p.id, { stockCount: p.stockCount + 5 })}
                          className="px-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold"
                          title="Add 5 units"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => updateProduct(p.id, { stockCount: Math.max(0, p.stockCount - 5) })}
                          className="px-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold"
                          title="Reduce 5 units"
                        >
                          -5
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {p.badge ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-950 text-brand-300 border border-brand-800">
                        {p.badge}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Kit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-colors"
                        title="Delete Kit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 text-slate-200 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? 'Edit Kit Specifications' : 'Add New Craft Kit'}
              </h3>
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
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="3D Printed Kits">3D Printed Kits</option>
                    <option value="Wooden DIY Kits">Wooden DIY Kits</option>
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
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Original Strike Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Image URL (Unsplash or direct asset) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
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
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Materials (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    placeholder="Matte PLA, PETG, Birch"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Colors / Finishes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Terracotta, Matte Black"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
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
                    placeholder="Best Seller, Trending, Staff Pick"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white"
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
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-soft"
                >
                  {editingProduct ? 'Save Updates' : 'Add Kit'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
