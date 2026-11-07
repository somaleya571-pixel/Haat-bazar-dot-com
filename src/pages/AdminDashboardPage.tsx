import React, { useState } from 'react';
import {
  ShieldCheck,
  Package,
  Users,
  Tag,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Truck,
  Edit2,
  Plus,
  Save,
  Search,
  DollarSign,
  TrendingUp,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Order } from '../types';
import { ORDER_TRACKING_STAGES, ORDER_TRACKING_STAGES_BN } from '../utils/order';
import { formatCurrency, calculateEffectivePrice } from '../utils/pricing';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    updateProduct,
    orders,
    updateOrderStatus,
    customer,
    navigateTo,
    language,
    showToast,
    theme,
    setTheme,
    officialContact,
    updateOfficialContact,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Official Contact Admin Form States (Synced with Customer Panel)
  const [adminHotline, setAdminHotline] = useState(officialContact.hotline);
  const [adminGmail, setAdminGmail] = useState(officialContact.gmail);
  const [adminEmail, setAdminEmail] = useState(officialContact.email);
  const [adminWhatsapp, setAdminWhatsapp] = useState(officialContact.whatsapp);
  const [adminSupportHours, setAdminSupportHours] = useState(officialContact.supportHours);
  const [adminOfficeAddress, setAdminOfficeAddress] = useState(officialContact.officeAddress);

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateOfficialContact({
      hotline: adminHotline,
      phone: adminHotline,
      gmail: adminGmail,
      email: adminEmail,
      whatsapp: adminWhatsapp,
      supportHours: adminSupportHours,
      officeAddress: adminOfficeAddress,
    });
  };

  // Handle product edit form submission
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  // Group customer info across orders (as required in Section 10)
  const customersSummary = [
    {
      id: 'CUST-001',
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: `${customer.addressDetails}, ${customer.village}, ${customer.thana}, ${customer.district}`,
      totalOrders: orders.length,
      lastOrderDate: orders[0]?.date || 'N/A',
      ordersList: orders,
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#003822] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Back to Customer Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Management Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              হাট বাজার অ্যাডমিন কন্ট্রোল প্যানেল
            </h1>
            <p className="text-xs text-emerald-200">
              পণ্য ব্যবস্থাপনা, স্বয়ংক্রিয় মূল্যছাড় ও গ্রাহক সেবা নিয়ন্ত্রণ
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          কাস্টমার ভিউতে ফিরুন
        </button>
      </div>

      {/* Admin KPI Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-semibold">মোট পণ্য সংখ্যা</span>
          <p className="text-xl font-black text-gray-900 mt-1">{products.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold">১২টি সক্রিয় স্টক</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-semibold">সর্বমোট অর্ডার</span>
          <p className="text-xl font-black text-gray-900 mt-1">{orders.length}</p>
          <span className="text-[10px] text-[#007A3D] font-bold">রিয়েল-টাইম সিঙ্ক</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-semibold">মোট রাজস্ব আয়</span>
          <p className="text-xl font-black text-[#007A3D] mt-1">
            ৳{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">যাচাইকৃত পেমেন্ট</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] text-gray-500 font-semibold">ডিসকাউন্ট সক্রিয়</span>
          <p className="text-xl font-black text-amber-600 mt-1">
            {products.filter((p) => p.discountPercentage > 0).length} টি পণ্য
          </p>
          <span className="text-[10px] text-amber-700 font-bold">স্বয়ংক্রিয় কার্যকর</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-[#007A3D] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>পণ্য ও মূল্যছাড় ব্যবস্থাপনা ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#007A3D] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>অর্ডার ও ট্র্যাকিং স্ট্যাটাস ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'customers'
              ? 'bg-[#007A3D] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>কাস্টমার সার্ভিস রেকর্ডস</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#007A3D] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>সেটিংস ও থিম মোড</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS, PRICES, EXPIRY & DISCOUNTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  পণ্য, মূল্য ও মেয়াদোত্তীর্ণের তারিখ নিয়ন্ত্রণ
                </h3>
                <p className="text-xs text-gray-500">
                  নিয়মিত মূল্য, ডিসকাউন্ট শুরু/শেষ তারিখ এবং এক্সপায়ারি ডেট নির্ধারণ করুন
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 text-[11px] font-bold uppercase">
                    <th className="py-2.5">পণ্য</th>
                    <th className="py-2.5">নিয়মিত মূল্য</th>
                    <th className="py-2.5">ছাড় (%)</th>
                    <th className="py-2.5">কার্যকর মূল্য</th>
                    <th className="py-2.5">মেয়াদ উত্তীর্ণের তারিখ</th>
                    <th className="py-2.5">স্টক</th>
                    <th className="py-2.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((prod) => {
                    const priceCalc = calculateEffectivePrice(
                      prod.regularPrice,
                      prod.discountPercentage,
                      prod.discountStartDate,
                      prod.discountEndDate
                    );

                    return (
                      <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 flex items-center gap-2.5">
                          <img
                            src={prod.image}
                            alt=""
                            className="w-9 h-9 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{prod.nameBn}</p>
                            <span className="text-[10px] text-gray-400">{prod.category}</span>
                          </div>
                        </td>
                        <td className="py-3 font-semibold text-gray-700">৳{prod.regularPrice}</td>
                        <td className="py-3">
                          {prod.discountPercentage > 0 ? (
                            <span className="bg-rose-100 text-[#e11d48] px-2 py-0.5 rounded font-bold">
                              {prod.discountPercentage}% ছাড়
                            </span>
                          ) : (
                            <span className="text-gray-400">০%</span>
                          )}
                        </td>
                        <td className="py-3 font-bold text-[#007A3D]">
                          ৳{priceCalc.effectivePrice}
                        </td>
                        <td className="py-3 font-mono text-gray-600">{prod.expiryDate}</td>
                        <td className="py-3 font-semibold text-gray-800">{prod.stock} টি</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#007A3D] rounded-lg font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>সম্পাদনা</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="font-bold text-sm text-gray-900">
                পণ্য সম্পাদনা: {editingProduct.nameBn}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 col-span-2">
                <label className="font-bold text-gray-700">বাংলা নাম</label>
                <input
                  type="text"
                  value={editingProduct.nameBn}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, nameBn: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">নিয়মিত মূল্য (৳)</label>
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
                <label className="font-bold text-gray-700">ডিসকাউন্ট শতকরা (%)</label>
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
                  value={
                    editingProduct.discountStartDate
                      ? editingProduct.discountStartDate.substring(0, 10)
                      : ''
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      discountStartDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ছাড় শেষের তারিখ</label>
                <input
                  type="date"
                  value={
                    editingProduct.discountEndDate
                      ? editingProduct.discountEndDate.substring(0, 10)
                      : ''
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      discountEndDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="font-bold text-gray-700">মেয়াদ উত্তীর্ণের তারিখ (Expiry)</label>
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

              <div className="space-y-1">
                <label className="font-bold text-gray-700">বর্তমান স্টক পরিমাণ</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">প্যাকেজিং ইউনিট</label>
                <input
                  type="text"
                  value={editingProduct.unit}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, unit: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-300"
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
                className="px-5 py-2 bg-[#007A3D] hover:bg-[#006030] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                সংরক্ষণ করুন (Save)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT & STATUS TRACKING */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                গ্রাহক অর্ডার লাইভ পর্যবেক্ষণ ও স্ট্যাটাস হালনাগাদ
              </h3>
              <p className="text-xs text-gray-500">
                অর্ডার পর্যায়ক্রম পরিবর্তন করলে গ্রাহকের ট্র্যাকার সাথে সাথে আপডেট হবে
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#007A3D]">{ord.id}</span>
                    <span className="text-gray-400 ml-2">({ord.date})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">বর্তমান স্ট্যাটাস পরিবর্তন:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className="p-1.5 rounded-lg border border-gray-300 bg-white font-bold text-emerald-800 focus:border-[#007A3D]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h5 className="font-bold text-gray-700 mb-1">গ্রাহকের ঠিকানা:</h5>
                    <p className="text-gray-600 font-semibold">{ord.customer.name} ({ord.customer.phone})</p>
                    <p className="text-gray-500">{ord.customer.addressDetails}, {ord.customer.village}</p>
                    <p className="text-gray-500">{ord.customer.thana}, {ord.customer.district}</p>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-700 mb-1">পেমেন্ট ও আইটেম:</h5>
                    <p className="text-gray-800 font-bold">
                      মোট প্রদেয়: ৳{ord.totalAmount} ({ord.paymentMethod} - {ord.paymentStatus})
                    </p>
                    {ord.trxId && (
                      <p className="text-xs text-emerald-700 font-mono font-bold">
                        TrxID: {ord.trxId} (Sender: {ord.bKashNumber})
                      </p>
                    )}
                    <p className="text-gray-500 mt-0.5">আইটেম সংখ্যা: {ord.items.length} টি</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER RECORDS (As specified in Section 10) */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-sm text-gray-900">
              অ্যাডমিন কাস্টমার সার্ভিস রেকর্ডস (Admin Customer Service Records)
            </h3>
            <p className="text-xs text-gray-500">
              গ্রাহক আইডি, যোগাযোগ তথ্য, ভৌগোলিক অবস্থান এবং সম্পূর্ণ অর্ডার ইতিহাস
            </p>
          </div>

          <div className="space-y-4">
            {customersSummary.map((cust) => (
              <div
                key={cust.id}
                className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      কাস্টমার আইডি: {cust.id}
                    </span>
                    <span className="font-bold text-sm text-gray-900">{cust.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-600">
                      মোট অর্ডার:{' '}
                      <strong className="text-[#007A3D]">{cust.totalOrders} টি</strong>
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">
                      সর্বশেষ অর্ডার: <strong>{cust.lastOrderDate}</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h5 className="font-bold text-gray-700 mb-0.5">যোগাযোগের বিবরণ:</h5>
                    <p>ফোন নম্বর: <strong className="font-mono text-gray-900">{cust.phone}</strong></p>
                    <p>জিমেইল: <strong className="text-gray-900">{cust.email}</strong></p>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-700 mb-0.5">ডেলিভারি ঠিকানা:</h5>
                    <p className="text-gray-700">{cust.address}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-100">
                  <h5 className="font-bold text-gray-700 mb-1.5">অর্ডার ইতিহাস:</h5>
                  <div className="flex flex-wrap gap-2">
                    {cust.ordersList.map((ord) => (
                      <span
                        key={ord.id}
                        className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-[11px] font-mono text-gray-800 shadow-2xs"
                      >
                        {ord.id} (৳{ord.totalAmount} - {ord.status})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & THEME CONTROL (Dark Mode and Bright Mode as requested) */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <Settings className="w-5 h-5 text-[#007A3D]" />
                <h3 className="font-bold text-base text-gray-900">
                  সিস্টেম ও ডিসপ্লে সেটিংস (System & Theme Settings)
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                hadbazar.com এর ডিসপ্লে কালার থিম ও সাধারণ সেটিংস পরিবর্তন করুন
              </p>
            </div>

            {/* Dark Mode vs Bright Mode Option */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <span>কালার থিম মোড (Color Theme Mode)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bright Mode Card */}
                <div
                  onClick={() => {
                    setTheme('light');
                    showToast('ব্রাইট মোড সক্রিয় করা হয়েছে');
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    theme === 'light'
                      ? 'border-[#007A3D] bg-emerald-50/50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-gray-900">ব্রাইট মোড (Bright Mode)</h5>
                      <p className="text-xs text-gray-500">স্বাভাবিক দিন ও আলোর জন্য ফ্রেশ সাদা ও সবুজ থিম</p>
                    </div>
                  </div>
                  {theme === 'light' && (
                    <span className="bg-[#007A3D] text-white text-xs px-2.5 py-1 rounded-full font-bold">
                      সক্রিয়
                    </span>
                  )}
                </div>

                {/* Dark Mode Card */}
                <div
                  onClick={() => {
                    setTheme('dark');
                    showToast('ডার্ক মোড সক্রিয় করা হয়েছে');
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    theme === 'dark'
                      ? 'border-emerald-500 bg-gray-900 text-white shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                      <Moon className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        ডার্ক মোড (Dark Mode)
                      </h5>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        রাতের বেলা চোখের আরাম ও ব্যাটারি সাশ্রয়কারী অন্ধকার থিম
                      </p>
                    </div>
                  </div>
                  {theme === 'dark' && (
                    <span className="bg-emerald-500 text-gray-950 text-xs px-2.5 py-1 rounded-full font-bold">
                      সক্রিয়
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Official Contact & Customer Support Settings (Directly Syncs to Customer Panel) */}
            <div className="pt-5 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">অফিশিয়াল যোগাযোগ ও সাপোর্ট নিয়ন্ত্রণ (Customer Panel Sync)</h4>
                  <p className="text-xs text-gray-500">এখানে পরিবর্তন করলে কাস্টমার প্রোফাইল, হেডার হটলাইন ও অফিস তথ্যে তাৎক্ষণিক আপডেট হবে</p>
                </div>
              </div>

              <form onSubmit={handleSaveContactSettings} className="space-y-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">অফিশিয়াল হটলাইন নম্বর</label>
                    <input
                      type="text"
                      value={adminHotline}
                      onChange={(e) => setAdminHotline(e.target.value)}
                      placeholder="+880 1700-123456"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] font-mono outline-hidden bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">অফিশিয়াল জিমেইল অ্যাড্রেস</label>
                    <input
                      type="email"
                      value={adminGmail}
                      onChange={(e) => setAdminGmail(e.target.value)}
                      placeholder="haatbazar.official@gmail.com"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] font-mono outline-hidden bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">কর্পোরেট ইমেইল</label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="official@hadbazar.com"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] font-mono outline-hidden bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">হোয়াটসঅ্যাপ সাপোর্ট নম্বর</label>
                    <input
                      type="text"
                      value={adminWhatsapp}
                      onChange={(e) => setAdminWhatsapp(e.target.value)}
                      placeholder="+880 1700-123456"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] font-mono outline-hidden bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">সাপোর্ট অপারেটিং সময়</label>
                    <input
                      type="text"
                      value={adminSupportHours}
                      onChange={(e) => setAdminSupportHours(e.target.value)}
                      placeholder="সকাল ৮:০০টা - রাত ১১:০০টা (প্রতিদিন)"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">প্রধান করপোরেট হেডকোয়ার্টার ঠিকানা</label>
                    <input
                      type="text"
                      value={adminOfficeAddress}
                      onChange={(e) => setAdminOfficeAddress(e.target.value)}
                      placeholder="বাড়ি #৪২, রোড #০৭, সেক্টর #৩, উত্তরা, ঢাকা"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#007A3D] outline-hidden bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#007A3D] hover:bg-[#006030] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>সংরক্ষণ ও কাস্টমার প্যানেলে সিঙ্ক করুন</span>
                  </button>
                </div>
              </form>
            </div>

            {/* General Information */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <h4 className="font-bold text-xs text-gray-700">ওয়েবসাইট কনফিগারেশন:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                  <span className="text-gray-500 text-[11px]">ওয়েবসাইট ডোমেইন:</span>
                  <p className="font-bold text-gray-900 font-mono mt-0.5">hadbazar.com</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                  <span className="text-gray-500 text-[11px]">হটলাইন সংযোগ:</span>
                  <p className="font-bold text-emerald-700 font-mono mt-0.5">{officialContact.hotline}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                  <span className="text-gray-500 text-[11px]">অফিশিয়াল জিমেইল:</span>
                  <p className="font-bold text-rose-600 font-mono mt-0.5">{officialContact.gmail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
