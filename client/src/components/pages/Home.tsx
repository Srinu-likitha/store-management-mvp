import { useQuery } from "@tanstack/react-query";
import api from "../../lib/axios/axios";
import { API_ROUTES } from "../../lib/api";
import type { DcEntryQueryResponse } from "./Dc";
import type { MaterialInvoicesQueryResponse } from "./Invoices";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

// Define color palettes
const CATEGORY_COLORS: Record<string, string> = {
  CIVIL: "#3b82f6",
  PLUMBING: "#ef4444",
  ELECTRICAL: "#0282a6",
  INTERIOR: "#10b981",
  EXTERIOR: "#8b5cf6",
  OTHER: "#64748b",
  COMPLEMENTARY_TO_TEAL: "#f46a3e"
};

const MATERIAL_CATEGORIES = ["CIVIL", "PLUMBING", "ELECTRICAL", "INTERIOR", "EXTERIOR", "OTHER"];

export default function Home() {
  const dcQuery = useQuery({
    queryKey: ['dc-entries'],
    queryFn: async () => {
      const res = await api.get<DcEntryQueryResponse>(API_ROUTES.MATERIAL_DCS.LIST_MATERIAL_DCS);
      return res.data;
    }
  });

  const materialInvoicesQuery = useQuery({
    queryKey: ['material-invoices'],
    queryFn: async () => {
      const res = await api.get<MaterialInvoicesQueryResponse>(API_ROUTES.MATERIAL_INVOICES.LIST_MATERIAL_INVOICES);
      return res.data;
    }
  });

  // Process data for charts
  const categorySpendingData = MATERIAL_CATEGORIES.map(category => {
    const categoryInvoices = materialInvoicesQuery.data?.data?.filter(
      invoice => invoice.materialCategory === category
    ) || [];

    // Sum costs from InvoiceMaterialItem array for each invoice
    const totalCost = categoryInvoices.reduce((sum, invoice) => {
      if (Array.isArray(invoice.InvoiceMaterialItem)) {
        return sum + invoice.InvoiceMaterialItem
          .filter(item => item.category === category)
          .reduce((itemSum, item) => itemSum + (item.cost || 0), 0);
      } else if (invoice.InvoiceMaterialItem && invoice.InvoiceMaterialItem.category === category) {
        // fallback for single object (if ever)
        return sum + (invoice.InvoiceMaterialItem.cost || 0);
      }
      return sum;
    }, 0);

    return {
      name: category,
      value: totalCost,
      color: CATEGORY_COLORS[category]
    };
  });

  // Calculate total spending for category percentage labels
  const totalCategorySpending = categorySpendingData.reduce((sum, cat) => sum + cat.value, 0);

  console.log("Category Spending Data:", categorySpendingData);

  // Monthly spending data
  const monthlySpending = materialInvoicesQuery.data?.data?.reduce((acc, invoice) => {
    const month = new Date(invoice.invoiceDate).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += invoice.InvoiceMaterialItem?.cost || 0;
    return acc;
  }, {} as Record<string, number>);

  const monthlySpendingData = Object.entries(monthlySpending || {}).map(([month, value]) => ({
    month,
    value
  }));

  // Vendor analysis
  const vendorData = materialInvoicesQuery.data?.data?.reduce((acc, invoice) => {
    if (!acc[invoice.vendorName]) {
      acc[invoice.vendorName] = {
        count: 0,
        total: 0
      };
    }
    acc[invoice.vendorName].count += 1;
    acc[invoice.vendorName].total += invoice.InvoiceMaterialItem?.cost || 0;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  const vendorChartData = Object.entries(vendorData || {}).map(([vendor, data]) => ({
    name: vendor,
    invoices: data.count,
    total: data.total
  })).sort((a, b) => b.total - a.total).slice(0, 5);

  // DC Approval status
  const dcApprovalData = dcQuery.data?.data?.reduce((acc, dc) => {
    if (dc.approved) {
      acc.approved += 1;
    } else {
      acc.pending += 1;
    }
    return acc;
  }, { approved: 0, pending: 0 });

  const dcStatusData = [
    { name: 'Approved', value: dcApprovalData?.approved || 0, color: '#10b981' },
    { name: 'Pending', value: dcApprovalData?.pending || 0, color: '#0282a6' }
  ];

  // Recent activity
  const recentInvoices = materialInvoicesQuery.data?.data
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) || [];

  const recentDCs = dcQuery.data?.data
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) || [];

  // Loading state
  if (dcQuery.isLoading || materialInvoicesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (dcQuery.isError || materialInvoicesQuery.isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold">Error loading data</h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Invoices</h3>
          <p className="text-3xl font-bold text-blue-600">{materialInvoicesQuery.data?.data?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total DC Entries</h3>
          <p className="text-3xl font-bold text-green-600">{dcQuery.data?.data?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Spending</h3>
          <p className="text-3xl font-bold text-purple-600">
            ₹{materialInvoicesQuery.data?.data?.reduce((sum, invoice) => sum + (invoice.InvoiceMaterialItem?.cost || 0), 0).toLocaleString('en-IN') || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Approval Rate</h3>
          <p className="text-3xl font-bold text-orange-600">
            {dcApprovalData ? `${((dcApprovalData.approved / (dcApprovalData.approved + dcApprovalData.pending)) * 100).toFixed(1)}%` : '0%'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Spending by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Spending by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySpendingData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => {
                    const val = typeof value === 'number' ? value : 0;
                    const percent = totalCategorySpending > 0 ? ((val / totalCategorySpending) * 100).toFixed(1) : '0';
                    return `${name}: ${percent}%`;
                  }}
                >
                  {categorySpendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spending']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Spending Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Spending Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spending']} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Vendors by Spending</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spending']} />
                <Legend />
                <Bar dataKey="total" fill="#8b5cf6" name="Total Spending" />
                <Bar dataKey="invoices" fill="#0282a6" name="Number of Invoices" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DC Approval Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">DC Approval Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dcStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${(value ?? 0 * 100)}%`}
                >
                  {dcStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Invoices</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.vendorName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">₹{invoice.InvoiceMaterialItem?.cost?.toLocaleString('en-IN') || 0}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent DC Entries */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent DC Entries</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DC #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDCs.map((dc) => (
                  <tr key={dc.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dc.vendorName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{dc.dcNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{dc.receivedQuantity} {dc.uom}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dc.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {dc.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}