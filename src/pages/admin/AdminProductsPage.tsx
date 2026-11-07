import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  X,
  Calendar,
  AlertTriangle,
  Upload,
  Sparkles,
  Tag,
  DollarSign,
  Layers,
  Building,
  Image as ImageIcon,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { calculateEffectivePrice, formatCurrency } from '../../utils/pricing';

const PRODUCT_CATEGORIES = [
  { id: 'Grocery', nameBn: 'মুদি বাজার (Grocery)' },
  { id: 'Honey', nameBn: 'খাঁটি মধু (Honey)' },
  { id: 'Jaggery', nameBn: 'পাটালি ও গুড় (Jaggery)' },
  { id: 'Rice', nameBn: 'চাল ও খাদ্যশস্য (Rice)' },
  { id: 'Spices', nameBn: 'খাঁটি মসলা (Spices)' },
  { id: 'Dairy Products', nameBn: 'দুধ ও দুগ্ধজাত (Dairy Products)' },
  { id: 'Daily Necessities', nameBn: 'নিত্যপ্রয়োজনীয় (Daily Necessities)' },
  { id: 'Household Products', nameBn: 'গৃহস্থালি সামগ্রী (Household Products)' },
  { id: 'Food Products', nameBn: 'খাদ্যপণ্য ও স্ন্যাকস (Food Products)' },
  { id: 'Other Categories', nameBn: 'অন্যান্য ক্যাটাগরি (Other Categories)' },
];

export const AdminProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, showToast } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // New Product Form State
  const initialNewProduct: Omit<Product, 'id'> = {
    name: '',
    nameBn: '',
    category: 'Grocery',
    categoryBn: 'মুদি বাজার',
    regularPrice: 150,
    discountPercentage: 0,
    discountStartDate: '',
    discountEndDate: '',
    expiryDate: '2027-12-31',
    description: '',
    descriptionBn: '',
    stock: 50,
    rating: 5.0,
    reviewCount: 0,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    images: [],
    unit: '১ কেজি প্যাকেট',
    supplierName: 'Haat Bazar Verified Source',
    isAvailable: true,
    isPopular: false,
    isFlashSale: false,
    isNewArrival: true,
    isRecommended: false,
    specifications: {},
  };

  const [newProductForm, setNewProductForm] = useState(initialNewProduct);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Filtered Products List
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameBn.includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.nameBn.trim() || newProductForm.regularPrice <= 0) {
      showToast('পণ্যের সঠিক নাম ও মূল্য প্রদান করুন');
      return;
    }

    const newProd: Product = {
      ...newProductForm,
      id: `hb-prod-${Date.now()}`,
      categoryBn:
        PRODUCT_CATEGORIES.find((c) => c.id === newProductForm.category)?.nameBn.split(' (')[0] ||
        newProductForm.category,
      images:
        newProductForm.images && newProductForm.images.length > 0
          ? newProductForm.images
          : [newProductForm.image],
    };

    addProduct(newProd);
    setIsAddModalOpen(false);
    setNewProductForm(initialNewProduct);
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  const handleAddImageToForm = (isEdit: boolean) => {
    if (!imageUrlInput.trim()) return;
    if (isEdit && editingProduct) {
      const curImages = editingProduct.images || [editingProduct.image];
      setEditingProduct({
        ...editingProduct,
        images: [...curImages, imageUrlInput.trim()],
      });
    } else {
      const curImages = newProductForm.images || [];
      setNewProductForm({
        ...newProductForm,
        images: [...curImages, imageUrlInput.trim()],
      });
    }
    setImageUrlInput('');
    showToast('ছবি যুক্ত হয়েছে');
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER & ACTION BAR */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#17231B] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#006B35]" />
            <span>পণ্য ব্যবস্থাপনা ও ক্যাটালগ (Product Management)</span>
          </h1>
          <p className="text-xs text-[#64748B]">
            পণ্য যোগ, মূল্য, ডিসকাউন্ট সময়সীমা, এক্সপায়ারি ডেট ও স্টক নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-[#006B35] hover:bg-[#005229] text-white text-xs font-bold rounded-2xl shadow-xs transition-transform hover:scale-102 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যুক্ত করুন (+ Add Product)</span>
        </button>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER */}
      <div className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden bg-gray-50/50"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto p-2 rounded-xl border border-gray-300 bg-white font-bold text-gray-700 focus:border-[#006B35] outline-hidden"
          >
            <option value="all">সকল ক্যাটাগরি (All Categories - {products.length})</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameBn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. PRODUCTS DATA TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-xs font-bold text-gray-500">
            মোট তালিকাভুক্ত পণ্য: <strong>{filteredProducts.length}</strong> টি
          </span>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
            কাস্টমার প্যানেলে সরাসরি সিঙ্ক্রোনাইজড
          </span>
        </div>

        <div className="divide-y divide-gray-100 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-[11px] font-bold uppercase">
                <th className="py-3">পণ্য</th>
                <th className="py-3">ক্যাটাগরি</th>
                <th className="py-3">নিয়মিত মূল্য</th>
                <th className="py-3">ছাড় (%)</th>
                <th className="py-3">কার্যকর মূল্য</th>
                <th className="py-3">স্টক</th>
                <th className="py-3">মেয়াদ (Expiry)</th>
                <th className="py-3">স্ট্যাটাস</th>
                <th className="py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((prod) => {
                const priceCalc = calculateEffectivePrice(
                  prod.regularPrice,
                  prod.discountPercentage,
                  prod.discountStartDate,
                  prod.discountEndDate
                );

                return (
                  <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 flex items-center gap-2.5 max-w-xs">
                      <img
                        src={prod.image}
                        alt=""
                        className="w-10 h-10 object-contain rounded-xl bg-gray-50 p-1 border border-gray-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{prod.nameBn}</p>
                        <p className="text-[10px] text-gray-400 truncate">{prod.name}</p>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-gray-700">{prod.category}</td>
                    <td className="py-3 font-semibold text-gray-600">৳{prod.regularPrice}</td>
                    <td className="py-3">
                      {prod.discountPercentage > 0 ? (
                        <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          {prod.discountPercentage}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-400">০%</span>
                      )}
                    </td>
                    <td className="py-3 font-bold text-[#006B35] font-mono text-sm">
                      ৳{priceCalc.effectivePrice}
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          prod.stock > 10
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {prod.stock} টি
                      </span>
                    </td>
                    <td className="py-3 font-mono text-gray-600">{prod.expiryDate}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.isAvailable !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {prod.isAvailable !== false ? 'ইন স্টক' : 'স্টক আউট'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006B35] rounded-lg transition-colors cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(prod.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
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
      </div>

      {/* 4. ADD NEW PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <form
            onSubmit={handleCreateProduct}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#006B35]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">নতুন পণ্য তালিকাভুক্তি</h3>
                  <p className="text-xs text-gray-500">সকল তথ্য নির্ভুলভাবে ইনপুট দিন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">বাংলা নাম (Bangla Name) *</label>
                <input
                  type="text"
                  value={newProductForm.nameBn}
                  onChange={(e) => setNewProductForm({ ...newProductForm, nameBn: e.target.value })}
                  placeholder="যেমন: সুন্দরবনের খাঁটি মধু"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ইংরেজি নাম (English Name) *</label>
                <input
                  type="text"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="e.g. Pure Honey"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ক্যাটাগরি *</label>
                <select
                  value={newProductForm.category}
                  onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden bg-white"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameBn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">সাপ্লায়ার / ব্র্যান্ড কোম্পানি</label>
                <input
                  type="text"
                  value={newProductForm.supplierName || ''}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, supplierName: e.target.value })
                  }
                  placeholder="যেমন: সুন্দরবন মধুহাব"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">নিয়মিত মূল্য (৳) *</label>
                <input
                  type="number"
                  min="1"
                  value={newProductForm.regularPrice}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, regularPrice: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ডিসকাউন্ট শতকরা (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProductForm.discountPercentage}
                  onChange={(e) =>
                    setNewProductForm({
                      ...newProductForm,
                      discountPercentage: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ছাড় শুরুর তারিখ</label>
                <input
                  type="date"
                  value={newProductForm.discountStartDate?.substring(0, 10) || ''}
                  onChange={(e) =>
                    setNewProductForm({
                      ...newProductForm,
                      discountStartDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : '',
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ছাড় শেষের তারিখ</label>
                <input
                  type="date"
                  value={newProductForm.discountEndDate?.substring(0, 10) || ''}
                  onChange={(e) =>
                    setNewProductForm({
                      ...newProductForm,
                      discountEndDate: e.target.value ? new Date(e.target.value).toISOString() : '',
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">স্টক পরিমাণ *</label>
                <input
                  type="number"
                  min="0"
                  value={newProductForm.stock}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">প্যাকেজিং ইউনিট</label>
                <input
                  type="text"
                  value={newProductForm.unit}
                  onChange={(e) => setNewProductForm({ ...newProductForm, unit: e.target.value })}
                  placeholder="যেমন: ১ কেজি বয়াম"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-gray-700">মেয়াদোত্তীর্ণের তারিখ (Expiry Date) *</label>
                <input
                  type="date"
                  value={newProductForm.expiryDate}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, expiryDate: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden font-mono"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-gray-700">মূল ছবির লিংক (Primary Image URL)</label>
                <input
                  type="url"
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden"
                  required
                />
              </div>

              {/* Multi-image Uploader simulator */}
              <div className="space-y-1 sm:col-span-2 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <label className="font-bold text-gray-700 block">
                  একাধিক অতিরিক্ত ছবি যোগ করুন (Multiple Product Images)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="অতিরিক্ত ছবির URL দিন..."
                    className="flex-1 p-2 rounded-xl border border-gray-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImageToForm(false)}
                    className="px-3 py-2 bg-[#006B35] text-white rounded-xl font-bold cursor-pointer"
                  >
                    যোগ করুন
                  </button>
                </div>
                {newProductForm.images && newProductForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {newProductForm.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg border border-gray-300"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Feature Toggles */}
              <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={newProductForm.isFlashSale}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, isFlashSale: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#006B35]"
                  />
                  <span>ফ্ল্যাশ সেল (Flash Sale)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={newProductForm.isPopular}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, isPopular: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#006B35]"
                  />
                  <span>জনপ্রিয় পণ্য (Popular)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={newProductForm.isAvailable}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, isAvailable: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#006B35]"
                  />
                  <span>উপলব্ধ (Available in Stock)</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#006B35] hover:bg-[#005229] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                পণ্য সংরক্ষণ ও প্রকাশ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <form
            onSubmit={handleSaveEditedProduct}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                পণ্য সম্পাদনা: {editingProduct.nameBn}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">বাংলা নাম *</label>
                <input
                  type="text"
                  value={editingProduct.nameBn}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, nameBn: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#006B35]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ক্যাটাগরি</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-white"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameBn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">নিয়মিত মূল্য (৳) *</label>
                <input
                  type="number"
                  value={editingProduct.regularPrice}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      regularPrice: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ডিসকাউন্ট (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingProduct.discountPercentage}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      discountPercentage: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ছাড় শুরুর তারিখ</label>
                <input
                  type="date"
                  value={editingProduct.discountStartDate?.substring(0, 10) || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      discountStartDate: e.target.value ? new Date(e.target.value).toISOString() : '',
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ছাড় শেষের তারিখ</label>
                <input
                  type="date"
                  value={editingProduct.discountEndDate?.substring(0, 10) || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      discountEndDate: e.target.value ? new Date(e.target.value).toISOString() : '',
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">স্টক পরিমাণ *</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">মেয়াদোত্তীর্ণের তারিখ *</label>
                <input
                  type="date"
                  value={editingProduct.expiryDate}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, expiryDate: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-gray-700">মূল ছবির URL</label>
                <input
                  type="url"
                  value={editingProduct.image}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, image: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#006B35] hover:bg-[#005229] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                পরিবর্তন সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION DIALOG */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-bold text-base text-gray-900">পণ্য অপসারণ নিশ্চিতকরণ</h3>
            </div>
            <p className="text-xs text-gray-600">
              আপনি কি নিশ্চিত যে এই পণ্যটি ডাটাবেস ও গ্রাহক প্যানেল থেকে মুছে ফেলতে চান?
            </p>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="w-1/2 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
