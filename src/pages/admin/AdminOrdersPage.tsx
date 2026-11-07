import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Truck,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  X,
  CreditCard,
  Package,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus } from '../../types';
import { formatCurrency } from '../../utils/pricing';

const ALL_ORDER_STATUSES: OrderStatus[] = [
  'New Order',
  'Pending',
  'Confirmed',
  'Processing',
  'Ready for Shipment',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Return Requested',
  'Refunded',
];

export const AdminOrdersPage: React.FC = () => {
  const {
    orders,
    couriers,
    updateOrderStatus,
    assignOrderCourier,
    updateOrderPaymentStatus,
    returns,
    updateReturnStatus,
    showToast,
  } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateSearch, setDateSearch] = useState('');

  // Assign courier state inside modal
  const [assigningCourierId, setAssigningCourierId] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesDate = !dateSearch || o.date.includes(dateSearch);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleCourierAssignSubmit = (orderId: string) => {
    if (!assigningCourierId) return;
    const courier = couriers.find((c) => c.id === assigningCourierId);
    if (courier) {
      assignOrderCourier(orderId, courier.id, courier.nameBn, trackingNumberInput.trim());
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          assignedCourierId: courier.id,
          assignedCourierName: courier.nameBn,
          courierTrackingCode: trackingNumberInput.trim() || selectedOrder.courierTrackingCode,
        });
      }
      setAssigningCourierId('');
      setTrackingNumberInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#17231B] flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#006B35]" />
            <span>অর্ডার ও ট্র্যাকিং ব্যবস্থাপনা (Order Management)</span>
          </h1>
          <p className="text-xs text-[#64748B]">
            ১০টি ধাপে অর্ডার ট্র্যাকিং, কুরিয়ার সার্ভিস নির্ধারণ ও লাইভ রিফান্ড প্রসেসিং
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-[#E8F7EC] text-[#006B35] px-3 py-1.5 rounded-full border border-emerald-200">
            সর্বমোট {orders.length} টি অর্ডার ডাটাবেসে সংরক্ষিত
          </span>
        </div>
      </div>

      {/* 2. SEARCH & ADVANCED FILTERS BAR */}
      <div className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search by Order ID or Phone */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="অর্ডার আইডি, গ্রাহকের নাম বা ফোন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 focus:border-[#006B35] outline-hidden bg-gray-50/50"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-gray-300 bg-white font-bold text-gray-700 focus:border-[#006B35]"
          >
            <option value="all">সকল স্ট্যাটাস (All Statuses)</option>
            {ALL_ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Date Filter Input */}
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-xl border border-gray-300">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
              placeholder="তারিখ খুঁজুন (যেমন: 2026-11)..."
              className="outline-hidden text-xs w-28 bg-transparent"
            />
            {dateSearch && (
              <button onClick={() => setDateSearch('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. ORDERS TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="divide-y divide-gray-100 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-[11px] font-bold uppercase">
                <th className="py-3">অর্ডার আইডি</th>
                <th className="py-3">তারিখ ও সময়</th>
                <th className="py-3">গ্রাহক ও এলাকা</th>
                <th className="py-3">নিযুক্ত কুরিয়ার</th>
                <th className="py-3">পেমেন্ট মেথড</th>
                <th className="py-3">মোট প্রদেয়</th>
                <th className="py-3">বর্তমান স্ট্যাটাস</th>
                <th className="py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#006B35]">{ord.id}</td>
                  <td className="py-3.5 text-gray-500 font-mono text-[11px]">{ord.date}</td>
                  <td className="py-3.5">
                    <p className="font-bold text-gray-900">{ord.customer.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {ord.customer.district}, {ord.customer.upazila} ({ord.customer.phone})
                    </p>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-semibold text-gray-800">
                        {ord.assignedCourierName || 'কুরিয়ার পেন্ডিং'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'Paid (Verified)'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.paymentMethod === 'Cash on Delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.paymentMethod}
                    </span>
                    {ord.trxId && (
                      <span className="block text-[9px] font-mono text-gray-400 mt-0.5">
                        Trx: {ord.trxId}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 font-bold text-gray-900 font-mono text-sm">
                    ৳{ord.totalAmount}
                  </td>
                  <td className="py-3.5">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="p-1 rounded-lg border border-gray-300 bg-white font-bold text-xs text-[#006B35] focus:border-[#006B35]"
                    >
                      {ALL_ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#006B35] font-bold rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ORDER DETAILS & COURIER ASSIGN MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-sm font-black text-[#006B35]">
                  {selectedOrder.id}
                </span>
                <span className="text-gray-400 ml-2">({selectedOrder.date})</span>
                <span className="ml-3 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  {selectedOrder.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#006B35]" />
                  <span>গ্রাহক পরিচিতি:</span>
                </h4>
                <p className="font-bold text-gray-900">{selectedOrder.customer.name}</p>
                <p className="text-gray-600 font-mono">{selectedOrder.customer.phone}</p>
                <p className="text-gray-600">{selectedOrder.customer.email}</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>ডেলিভারি ঠিকানা:</span>
                </h4>
                <p className="text-gray-800 font-medium">{selectedOrder.customer.addressDetails}</p>
                <p className="text-gray-600">গ্রাম: {selectedOrder.customer.village}</p>
                <p className="text-gray-600">
                  উপজেলা: {selectedOrder.customer.upazila}, জেলা: {selectedOrder.customer.district}
                </p>
              </div>
            </div>

            {/* Assign Courier Box */}
            <div className="p-4 rounded-2xl bg-[#E8F7EC]/70 border border-emerald-200 space-y-2.5">
              <h4 className="font-bold text-[#006B35] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#006B35]" />
                <span>কুরিয়ার সার্ভিস নির্ধারণ ও ট্র্যাকিং কোড এসাইন:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={assigningCourierId || selectedOrder.assignedCourierId || ''}
                  onChange={(e) => setAssigningCourierId(e.target.value)}
                  className="p-2 rounded-xl border border-gray-300 bg-white font-bold"
                >
                  <option value="">কুরিয়ার নির্বাচন করুন...</option>
                  {couriers
                    .filter((c) => c.isActive)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn}
                      </option>
                    ))}
                </select>

                <input
                  type="text"
                  value={trackingNumberInput || selectedOrder.courierTrackingCode || ''}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="কুরিয়ার ট্র্যাকিং / চালান নং..."
                  className="p-2 rounded-xl border border-gray-300 bg-white font-mono"
                />

                <button
                  type="button"
                  onClick={() => handleCourierAssignSubmit(selectedOrder.id)}
                  className="py-2 px-3 bg-[#006B35] hover:bg-[#005229] text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  কুরিয়ার সংরক্ষণ করুন
                </button>
              </div>
            </div>

            {/* Payment Verification & Action */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <span className="font-bold text-gray-700">পেমেন্ট মেথড: </span>
                <span className="font-bold text-gray-900">{selectedOrder.paymentMethod}</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="font-bold text-gray-700">বর্তমান অবস্থা: </span>
                <span className="font-bold text-emerald-700">{selectedOrder.paymentStatus}</span>
              </div>

              {selectedOrder.paymentStatus === 'Pending Verification' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateOrderPaymentStatus(selectedOrder.id, 'Paid (Verified)');
                      setSelectedOrder({ ...selectedOrder, paymentStatus: 'Paid (Verified)' });
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    পেমেন্ট ভেরিফাই করুন (Approve)
                  </button>
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'Cancelled', 'Payment rejected by admin');
                      setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer"
                  >
                    বাতিল (Reject)
                  </button>
                </div>
              )}
            </div>

            {/* Items Ordered List */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-800">অর্ডারকৃত পণ্য তালিকা:</h4>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl p-3 bg-white">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt=""
                        className="w-8 h-8 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{item.nameBn}</p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {item.quantity} x ৳{item.price}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 font-mono">
                      ৳{item.quantity * item.price}
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-gray-100 space-y-1 text-right">
                  <p className="text-gray-500">
                    উপমোট: <span className="font-bold text-gray-900 font-mono">৳{selectedOrder.subtotal}</span>
                  </p>
                  <p className="text-gray-500">
                    ডেলিভারি চার্জ:{' '}
                    <span className="font-bold text-gray-900 font-mono">
                      ৳{selectedOrder.deliveryCharge}
                    </span>
                  </p>
                  <p className="text-base font-black text-[#006B35]">
                    সর্বমোট: <span className="font-mono">৳{selectedOrder.totalAmount}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
