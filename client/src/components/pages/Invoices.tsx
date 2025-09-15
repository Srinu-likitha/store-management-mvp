import { useQuery } from "@tanstack/react-query"
import api from "../../lib/axios/axios";
import { API_ROUTES } from "../../lib/api";
import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaSearch,
  FaFileInvoiceDollar,
  FaBuilding,
  FaHashtag,
  FaCalendarAlt,
  FaTag,
  FaMoneyBillWave,
  FaFileExcel,
  FaReceipt,
  FaTruck,
  FaBarcode,
  FaPhone,
  FaPaperclip,
  FaBox
} from "react-icons/fa";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type MaterialCategory =
  "CIVIL"
  | "PLUMBING"
  | "ELECTRICAL"
  | "INTERIOR"
  | "EXTERIOR"
  | "OTHER"

interface MaterialInvoice {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  dateOfReceipt: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  deliveryChallanNumber: string;
  vehicleNumber: string;
  materialCategory: MaterialCategory;
  hnsCode: string;
  uom: string;
  vendorContactNumber: string;
  poNumber: string;
  poDate: string;
  purposeOfMaterial: string;
  invoiceAttachment: string;
  mrnNumber: string;
  ginNumber: string;
  InvoiceMaterialItem: InvoiceMaterialItem;
}

interface InvoiceMaterialItem {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  hnsCode: string;
  category: MaterialCategory;
  description: string
  quantity: number
  ratePerUnit: number
  cost: number
  materialInvoiceId: string;
}[];

interface MaterialInvoicesQueryResponse extends Response {
  data: MaterialInvoice[];
}

export default function Invoice() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const marterilaInvoicesQuery = useQuery({
    queryKey: ['material-invoices'],
    queryFn: async () => {
      const res = await api.get<MaterialInvoicesQueryResponse>(API_ROUTES.MATERIAL_INVOICES.LIST_MATERIAL_INVOICES);
      return res.data;
    }
  })

  if (marterilaInvoicesQuery.isSuccess) console.log(marterilaInvoicesQuery.data);

  const handleExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleDownloadExcel = () => {
    // Placeholder for Excel download logic
    alert("Excel download not implemented");
  };

  const invoices = marterilaInvoicesQuery.data?.data || [];
  const filteredInvoices = invoices.filter(inv =>
    inv.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryColor = (category: MaterialCategory) => {
    const colors = {
      CIVIL: "bg-blue-100 text-blue-800",
      PLUMBING: "bg-purple-100 text-purple-800",
      ELECTRICAL: "bg-yellow-100 text-yellow-800",
      INTERIOR: "bg-pink-100 text-pink-800",
      EXTERIOR: "bg-green-100 text-green-800",
      OTHER: "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors.OTHER;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex items-center">
          <FaFileInvoiceDollar className="text-white text-2xl mr-3" />
          <h1 className="text-xl font-semibold text-white">Material Invoices</h1>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by vendor or invoice number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/add-invoice")}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <Plus className="text-lg" />
                <span>Add Invoice</span>
              </button>
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <FaFileExcel className="text-lg" />
                <span>Export to Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
                <th className="py-3 px-4 text-center w-12"></th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1">
                    <FaBuilding className="text-gray-500" />
                    <span>Vendor</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1">
                    <FaHashtag className="text-gray-500" />
                    <span>Invoice #</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>Date</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1">
                    <FaTag className="text-gray-500" />
                    <span>Category</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <FaMoneyBillWave className="text-gray-500" />
                    <span>Amount</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(inv => {
                  const totalAmount = Array.isArray(inv.InvoiceMaterialItem)
                    ? inv.InvoiceMaterialItem.reduce((sum, item) => sum + (item.cost || 0), 0)
                    : 0;

                  return (
                    <React.Fragment key={inv.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleExpand(inv.id)}
                            className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                          >
                            {expandedRows.includes(inv.id) ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{inv.vendorName}</td>
                        <td className="px-4 py-3 text-gray-700">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 text-gray-700">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(inv.materialCategory)}`}>
                            {inv.materialCategory}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {formatCurrency(totalAmount)}
                        </td>
                      </tr>
                      {expandedRows.includes(inv.id) && (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 bg-gray-50">
                            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaReceipt className="text-indigo-500" />
                                Invoice Details
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Vendor Information</h4>
                                  <div>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaBuilding className="text-indigo-400" />
                                      <span className="font-medium">Vendor:</span> {inv.vendorName}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                      <FaPhone className="text-indigo-400" />
                                      <span className="font-medium">Contact:</span> {inv.vendorContactNumber || 'N/A'}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Invoice Information</h4>
                                  <div>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaHashtag className="text-indigo-400" />
                                      <span className="font-medium">Invoice #:</span> {inv.invoiceNumber}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                      <FaCalendarAlt className="text-indigo-400" />
                                      <span className="font-medium">Date:</span> {new Date(inv.invoiceDate).toLocaleDateString()}
                                    </p>
                                    {inv.invoiceAttachment && (
                                      <p className="text-sm text-indigo-600 flex items-center gap-2 mt-1">
                                        <FaPaperclip className="text-indigo-400" />
                                        <span className="font-medium">Attachment:</span>
                                        <a href={inv.invoiceAttachment} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-800">
                                          View document
                                        </a>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Delivery Information</h4>
                                  <div>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaTruck className="text-indigo-400" />
                                      <span className="font-medium">Vehicle #:</span> {inv.vehicleNumber || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                      <FaBarcode className="text-indigo-400" />
                                      <span className="font-medium">Challan #:</span> {inv.deliveryChallanNumber || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                      <FaCalendarAlt className="text-indigo-400" />
                                      <span className="font-medium">Receipt Date:</span> {new Date(inv.dateOfReceipt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Purchase Order</h4>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">PO Number:</span> {inv.poNumber || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      <span className="font-medium">PO Date:</span> {inv.poDate ? new Date(inv.poDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">References</h4>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">MRN Number:</span> {inv.mrnNumber || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      <span className="font-medium">GIN Number:</span> {inv.ginNumber || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      <span className="font-medium">HNS Code:</span> {inv.hnsCode || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      <span className="font-medium">UOM:</span> {inv.uom || 'N/A'}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Material Details</h4>
                                  <div>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Category:</span>
                                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(inv.materialCategory)}`}>
                                        {inv.materialCategory}
                                      </span>
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      <span className="font-medium">Purpose:</span> {inv.purposeOfMaterial || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <FaBox className="text-indigo-400" />
                                  Material Items
                                </h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate/Unit</th>
                                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {Array.isArray(inv.InvoiceMaterialItem) && inv.InvoiceMaterialItem.map(item => (
                                        <tr key={item.id}>
                                          <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                                          <td className="px-4 py-2 text-sm">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                              {item.category}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity} {inv.uom}</td>
                                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.ratePerUnit)}</td>
                                          <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.cost)}</td>
                                        </tr>
                                      ))}
                                      <tr className="bg-gray-50">
                                        <td colSpan={4} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total</td>
                                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(totalAmount)}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400 py-8">
                      <FaFileInvoiceDollar className="text-4xl mb-3" />
                      <p className="text-lg">No invoices found</p>
                      <p className="text-sm mt-1">Try adjusting your search query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}