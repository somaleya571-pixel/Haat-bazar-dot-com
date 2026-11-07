import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  CreditCard, 
  FileSpreadsheet,
  Printer
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { orders, couriers, customersList } = useShop();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Computed metrics
  const totalGrossSales = orders
    .filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalDeliveryCharges = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.deliveryCharge || 0), 0);

  const codOrders = orders.filter(o => o.paymentMethod === 'Cash on Delivery');
  const bkashOrders = orders.filter(o => o.paymentMethod === 'bKash');
  const nagadOrders = orders.filter(o => o.paymentMethod === 'Nagad');

  const codRevenue = codOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const digitalRevenue = bkashOrders.concat(nagadOrders).reduce((sum, o) => sum + o.totalAmount, 0);

  // Grouped data mock generation based on real orders
  const reportRows = [
    { period: '2026-11 (Current)', ordersCount: orders.length, revenue: totalGrossSales, deliveryFee: totalDeliveryCharges, cod: codRevenue, digital: digitalRevenue },
    { period: '2026-10 (Last Month)', ordersCount: 42, revenue: 142500, deliveryFee: 3780, cod: 98000, digital: 44500 },
    { period: '2026-09', ordersCount: 38, revenue: 119800, deliveryFee: 3420, cod: 81200, digital: 38600 },
    { period: '2026-08', ordersCount: 31, revenue: 95400, deliveryFee: 2790, cod: 65000, digital: 30400 },
  ];

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['Period', 'Total Orders', 'Revenue (BDT)', 'Delivery Fees (BDT)', 'COD Collection (BDT)', 'Digital Payment (BDT)'];
    const rows = reportRows.map(r => [
      `"${r.period}"`,
      r.ordersCount,
      r.revenue,
      r.deliveryFee,
      r.cod,
      r.digital
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HaatBazar_SalesReport_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[#17231B] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#006B35]" />
            Reports & Analytics
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Download sales sheets, analyze courier fulfillment metrics, and monitor payments.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#006B35] font-semibold rounded-xl text-sm transition-colors border border-emerald-200"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#006B35] hover:bg-[#005228] text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 bg-emerald-50 text-[#006B35] rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#17231B]">৳{totalGrossSales.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last cycle
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Courier Freight Total</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#17231B]">৳{totalDeliveryCharges.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Across 7 partnered couriers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cash On Delivery</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#17231B]">৳{codRevenue.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">
            {Math.round((codRevenue / (totalGrossSales || 1)) * 100)}% of total orders
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Digital (bKash/Nagad)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#17231B]">৳{digitalRevenue.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">
            {Math.round((digitalRevenue / (totalGrossSales || 1)) * 100)}% prepayments
          </p>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-[#17231B] text-base">Historical Financial Statement</h2>
          <div className="flex gap-2 print:hidden">
            {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPeriod(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                  period === mode
                    ? 'bg-[#006B35] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-[#64748B] uppercase">
              <tr>
                <th className="py-3 px-4 font-semibold">Reporting Period</th>
                <th className="py-3 px-4 font-semibold">Orders Count</th>
                <th className="py-3 px-4 font-semibold">Gross Sales</th>
                <th className="py-3 px-4 font-semibold">Delivery Fees</th>
                <th className="py-3 px-4 font-semibold">COD Collected</th>
                <th className="py-3 px-4 font-semibold">Digital Prepayments</th>
                <th className="py-3 px-4 font-semibold text-right">Net Margin (~15%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-[#17231B]">{row.period}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{row.ordersCount} orders</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">৳{row.revenue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-600">৳{row.deliveryFee.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-amber-700 font-medium">৳{row.cod.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-purple-700 font-medium">৳{row.digital.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-black text-[#006B35]">
                    ৳{Math.round(row.revenue * 0.15).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier Share & Customer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-[#17231B] text-sm mb-4">Courier Volume Share</h3>
          <div className="space-y-3">
            {couriers.map((courier) => {
              const assignedCount = orders.filter(o => o.assignedCourierName === courier.name).length;
              const percent = orders.length > 0 ? Math.round((assignedCount / orders.length) * 100) : 0;
              return (
                <div key={courier.id}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${courier.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {courier.name}
                    </span>
                    <span>{assignedCount} orders ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006B35] rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-[#17231B] text-sm mb-4">Customer Acquisition & Density</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Total Registered Customers</span>
              <span className="text-lg font-black text-[#006B35]">{customersList?.length || 1}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Orders Per Customer Ratio</span>
              <span className="text-lg font-black text-[#17231B]">
                {(orders.length / ((customersList?.length) || 1)).toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-medium text-slate-700">Average Order Value (AOV)</span>
              <span className="text-lg font-black text-emerald-700">
                ৳{orders.length > 0 ? Math.round(totalGrossSales / orders.length).toLocaleString() : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
