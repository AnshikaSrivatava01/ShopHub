import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';

const SIZE_OPTIONS_BY_CATEGORY = {
  clothes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  footwear: ['6', '7', '8', '9', '10', '11'],
};

const KIDS_FOOTWEAR_SIZES = ['1', '2', '3', '4', '5'];

const categorySupportsSizes = (category) => ['clothing', 'clothes', 'footwear'].includes(String(category || '').trim().toLowerCase());

const getPredefinedSizes = (category, gender) => {
  const normalizedCategory = String(category || '').trim().toLowerCase();
  const normalizedGender = String(gender || '').trim().toLowerCase();

  if (normalizedCategory === 'footwear' && normalizedGender === 'kids') {
    return KIDS_FOOTWEAR_SIZES;
  }

  return SIZE_OPTIONS_BY_CATEGORY[normalizedCategory] || [];
};

const normalizeSizes = (sizes) => [...new Set((sizes || []).map((size) => String(size || '').trim()).filter(Boolean))];
const normalizeSizeQuantities = (sizeQuantities) => [...new Map(
  (sizeQuantities || [])
    .map((entry) => {
      const size = String(entry?.size || '').trim();
      const quantity = Math.max(0, Number(entry?.quantity) || 0);
      return size ? [size, { size, quantity }] : null;
    })
    .filter(Boolean)
).values()];
const getTotalSizeStock = (sizeQuantities) => normalizeSizeQuantities(sizeQuantities).reduce((sum, entry) => sum + entry.quantity, 0);

const emptyForm = {
  name: '', description: '', category: 'Clothes',
  gender: 'Unisex',
  sizes: [],
  sizeQuantities: [],
  customSize: '',
  images: ['', '', ''],
  isAvailableForSale: true, salePrice: '',
  isAvailableForRent: false, rentPricePerDay: '', rentPricePerWeek: '', rentPricePerMonth: '',
  stock: '',
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getProducts({ limit: 100 }).then(res => setProducts(res.data.products)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.isAvailableForSale && !form.isAvailableForRent) {
      toast.error('Product must be available for sale or rent');
      return;
    }
    if (categorySupportsSizes(form.category) && normalizeSizeQuantities(form.sizeQuantities).length === 0) {
      toast.error('Add at least one size for clothing and footwear products');
      return;
    }
    const data = {
      ...form,
      sizes: categorySupportsSizes(form.category) ? normalizeSizes(form.sizes) : [],
      sizeQuantities: categorySupportsSizes(form.category) ? normalizeSizeQuantities(form.sizeQuantities) : [],
      salePrice: form.isAvailableForSale ? Number(form.salePrice) || 0 : 0,
      rentPricePerDay: form.isAvailableForRent ? Number(form.rentPricePerDay) || 0 : 0,
      rentPricePerWeek: form.isAvailableForRent ? Number(form.rentPricePerWeek) || 0 : 0,
      rentPricePerMonth: form.isAvailableForRent ? Number(form.rentPricePerMonth) || 0 : 0,
      stock: categorySupportsSizes(form.category) ? getTotalSizeStock(form.sizeQuantities) : Number(form.stock),
      images: form.images.filter(Boolean),
    };
    delete data.customSize;
    data.type = data.isAvailableForRent && !data.isAvailableForSale ? 'rent' : 'buy';
    data.price = data.isAvailableForSale ? data.salePrice : (data.rentPricePerDay || 0);
    try {
      if (editId) { await updateProduct(editId, data); toast.success('Product updated'); }
      else { await createProduct(data); toast.success('Product created'); }
      setShowForm(false); setEditId(null); setForm(emptyForm); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name, description: p.description, category: p.category,
      gender: p.gender || 'Unisex',
      sizes: p.sizes || [],
      sizeQuantities: normalizeSizeQuantities(p.sizeQuantities?.length ? p.sizeQuantities : (p.sizes || []).map((size) => ({ size, quantity: 0 }))),
      customSize: '',
      images: [p.images[0] || '', p.images[1] || '', p.images[2] || ''],
      isAvailableForSale: p.isAvailableForSale ?? true,
      salePrice: p.salePrice,
      isAvailableForRent: p.isAvailableForRent ?? false,
      rentPricePerDay: p.rentPricePerDay,
      rentPricePerWeek: p.rentPricePerWeek,
      rentPricePerMonth: p.rentPricePerMonth,
      stock: p.stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const toggleSize = (size) => {
    setForm((current) => {
      const sizes = current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size];
      const normalizedSizes = normalizeSizes(sizes);
      return {
        ...current,
        sizes: normalizedSizes,
        sizeQuantities: normalizedSizes.map((nextSize) => {
          const existing = current.sizeQuantities.find((entry) => entry.size === nextSize);
          return existing || { size: nextSize, quantity: 0 };
        }),
      };
    });
  };

  const addCustomSize = () => {
    const nextSize = String(form.customSize || '').trim();
    if (!nextSize) return;
    setForm((current) => ({
      ...current,
      sizes: normalizeSizes([...current.sizes, nextSize]),
      sizeQuantities: normalizeSizeQuantities([...current.sizeQuantities, { size: nextSize, quantity: 0 }]),
      customSize: '',
    }));
  };

  const removeSize = (size) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.filter((item) => item !== size),
      sizeQuantities: current.sizeQuantities.filter((entry) => entry.size !== size),
    }));
  };

  const updateSizeQuantity = (size, quantity) => {
    setForm((current) => ({
      ...current,
      sizeQuantities: current.sizeQuantities.map((entry) => (
        entry.size === size ? { ...entry, quantity: Math.max(0, Number(quantity) || 0) } : entry
      )),
    }));
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-surface-900">Manage Products</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
          <HiOutlinePlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-surface-100 rounded-lg"><HiOutlineX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {/* Name & Category */}
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Name</label><input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none" /></div>
                <div><label className="block text-sm font-medium mb-1">Category</label><select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"><option>Clothes</option><option>Accessories</option><option>Footwear</option><option>Bags</option><option>Beauty</option><option>Homeliving</option></select></div>
              </div>

              {/* Gender */}
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none">
                  <option>Unisex</option>
                  <option>Men</option>
                  <option>Women</option>
                  <option>Kids</option>
                </select>
              </div>

              {categorySupportsSizes(form.category) && (
                <div className="border border-surface-200 rounded-xl p-4 bg-surface-50/50">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium">Size</label>
                      <p className="text-xs text-surface-700/60 mt-1">Select sizes and assign stock for each size. Total stock will be calculated automatically.</p>
                    </div>
                    <span className="text-xs font-semibold text-red-500">Required</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {getPredefinedSizes(form.category, form.gender).map((size) => {
                      const isSelected = form.sizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-primary-600 border-primary-600 text-white'
                              : 'bg-white border-surface-200 text-surface-700 hover:border-primary-300 hover:text-primary-700'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      value={form.customSize}
                      onChange={(e) => setForm({ ...form, customSize: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomSize();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
                      placeholder="Enter a custom size like Free Size or 42"
                    />
                    <button
                      type="button"
                      onClick={addCustomSize}
                      className="px-4 py-2 rounded-xl border border-primary-200 text-primary-700 font-medium hover:bg-primary-50 transition-colors"
                    >
                      Add Custom Size
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {form.sizes.map((size) => (
                      <span key={size} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-surface-200 text-sm text-surface-800">
                        {size}
                        <button type="button" onClick={() => removeSize(size)} className="text-surface-500 hover:text-red-500">
                          <HiOutlineX className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {form.sizeQuantities.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {form.sizeQuantities.map((entry) => (
                        <div key={entry.size} className="flex items-center justify-between gap-4 rounded-xl bg-white border border-surface-200 px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-surface-800">{entry.size}</p>
                            <p className="text-xs text-surface-500">Available quantity for this size</p>
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={entry.quantity}
                            onChange={(e) => updateSizeQuantity(entry.size, e.target.value)}
                            className="w-28 px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
                          />
                        </div>
                      ))}
                      <div className="rounded-xl bg-primary-50 border border-primary-100 px-4 py-3">
                        <p className="text-sm font-semibold text-primary-700">Total stock: {getTotalSizeStock(form.sizeQuantities)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div><label className="block text-sm font-medium mb-1">Description</label><textarea required rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none" /></div>

              {/* Images */}
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Image 1 URL (Primary)</label><input required value={form.images[0]} onChange={(e) => setForm({...form, images: [e.target.value, form.images[1], form.images[2]]})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none" placeholder="https://..." /></div>
                <div><label className="block text-sm font-medium mb-1">Image 2 URL (Optional)</label><input value={form.images[1]} onChange={(e) => setForm({...form, images: [form.images[0], e.target.value, form.images[2]]})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none" placeholder="https://..." /></div>
                <div><label className="block text-sm font-medium mb-1">Image 3 URL (Optional)</label><input value={form.images[2]} onChange={(e) => setForm({...form, images: [form.images[0], form.images[1], e.target.value]})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none" placeholder="https://..." /></div>
              </div>

              {/* Availability Toggles */}
              <div className="border border-surface-200 rounded-xl p-4 bg-surface-50/50">
                <p className="text-sm font-bold text-surface-700 mb-3">Availability Type</p>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" checked={form.isAvailableForSale} onChange={(e) => setForm({...form, isAvailableForSale: e.target.checked})} className="sr-only peer" />
                      <div className="w-10 h-5 bg-surface-300 rounded-full peer-checked:bg-green-500 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                    </div>
                    <span className="text-sm font-semibold text-surface-700 group-hover:text-surface-900">Available for Sale</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" checked={form.isAvailableForRent} onChange={(e) => setForm({...form, isAvailableForRent: e.target.checked})} className="sr-only peer" />
                      <div className="w-10 h-5 bg-surface-300 rounded-full peer-checked:bg-blue-500 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                    </div>
                    <span className="text-sm font-semibold text-surface-700 group-hover:text-surface-900">Available for Rent</span>
                  </label>
                </div>
              </div>

              {/* Sale Price - shown only when sale is enabled */}
              {form.isAvailableForSale && (
                <div className="border border-green-200 rounded-xl p-4 bg-green-50/50">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-3">Sale Pricing</p>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">Sale Price (₹)</label>
                    <input type="number" required value={form.salePrice} onChange={(e) => setForm({...form, salePrice: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none" />
                  </div>
                </div>
              )}

              {/* Rent Prices - shown only when rent is enabled */}
              {form.isAvailableForRent && (
                <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/50">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Rental Pricing</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Per Day (₹)</label><input type="number" value={form.rentPricePerDay} onChange={(e) => setForm({...form, rentPricePerDay: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium mb-1">Per Week (₹)</label><input type="number" value={form.rentPricePerWeek} onChange={(e) => setForm({...form, rentPricePerWeek: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium mb-1">Per Month (₹)</label><input type="number" value={form.rentPricePerMonth} onChange={(e) => setForm({...form, rentPricePerMonth: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" /></div>
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  required
                  value={categorySupportsSizes(form.category) ? getTotalSizeStock(form.sizeQuantities) : form.stock}
                  onChange={(e) => !categorySupportsSizes(form.category) && setForm({...form, stock: e.target.value})}
                  readOnly={categorySupportsSizes(form.category)}
                  className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none read-only:bg-surface-50 read-only:text-surface-500"
                />
              </div>
              <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">{editId ? 'Update' : 'Create'} Product</button>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-md border border-surface-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-surface-50 border-b border-surface-100">
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Product</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Category</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Type</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Sale Price</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Rent/Day</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Stock</th>
              <th className="text-left py-3 px-4 font-medium text-surface-700/60">Actions</th>
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                  <td className="py-3 px-4"><div className="flex items-center gap-3"><img src={p.images?.[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-surface-100" /><span className="font-medium text-surface-800 truncate max-w-[200px]">{p.name}</span></div></td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {p.isAvailableForSale && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700">SALE</span>}
                      {p.isAvailableForRent && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">RENT</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">{p.isAvailableForSale ? formatPrice(p.salePrice) : '—'}</td>
                  <td className="py-3 px-4">{p.isAvailableForRent ? formatPrice(p.rentPricePerDay) : '—'}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.stock > 5 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>{p.stock}</span></td>
                  <td className="py-3 px-4"><div className="flex gap-1"><button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-primary-50 rounded-lg text-primary-600"><HiOutlinePencil className="w-4 h-4" /></button><button onClick={() => handleDelete(p._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><HiOutlineTrash className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && !loading && <p className="text-center py-8 text-surface-700/50">No products found. Add your first product!</p>}
      </div>
    </div>
  );
}
