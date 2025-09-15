import { useMutation, useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "../../lib/api"
import api from "../../lib/axios/axios"
import type { ErrorRes, Response } from "../../types";
import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaFileExcel,
  FaFileAlt,
  FaBuilding,
  FaTruck,
  FaHashtag,
  FaCalendarAlt,
  FaCube,
  FaCheckCircle,
  FaTimesCircle,
  FaPaperclip,
  FaBox
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import type { ApproveDcEntryInput } from "../../types/zod";
import { userStore } from "../../state/global";

export interface DcEntryQueryResponse extends Response {
  data: {
    id: string;
    dateOfReceipt: Date;
    vendorName: string;
    vehicleNumber: string;
    uom: string;
    purposeOfMaterial: string;
    approved: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    bmrnNumber: string;
    materialDescription: string;
    receivedQuantity: number;
    dcAttachment: string;
    dcNumber: string;
  }[]
}

export default function Dc() {
  const navigate = useNavigate();
  const role = userStore(state => state.role);
  const [search, setSearch] = useState("");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const dcQuery = useQuery({
    queryKey: ['dc-entries'],
    queryFn: async () => {
      const res = await api.get<DcEntryQueryResponse>(API_ROUTES.MATERIAL_DCS.LIST_MATERIAL_DCS);
      return res.data;
    }
  })

  const dcApprovalMutation = useMutation({
    mutationFn: async (data: ApproveDcEntryInput) => {
      const res = await api.post<Response>(API_ROUTES.MATERIAL_DCS.APPROVE_MATERIAL_DC, data);
      return res.data;
    },
    onSuccess: () => {
      dcQuery.refetch();
    },
    onError: (error: ErrorRes) => {
      alert(error.response.data.message);
    }
  })

  const handleExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleDownloadExcel = () => {
    // Placeholder for Excel download logic
    alert("Excel download not implemented");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const dcEntries = dcQuery.data?.data || [];
  const filteredEntries = dcEntries.filter(entry =>
    entry.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    entry.dcNumber.toLowerCase().includes(search.toLowerCase()) ||
    entry.vehicleNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-b from-cyan-900 to-cyan-800 px-6 py-4 flex items-center">
          <FaFileAlt className="text-white text-2xl mr-3" />
          <h1 className="text-xl font-semibold text-white">Delivery Challan Entries</h1>
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
                placeholder="Search by vendor, DC #, or vehicle..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 w-full"
              />
            </div>

            <div className="flex gap-4">
              {
                role == "STORE_INCHARGE" ? (
                  <button
                    onClick={() => navigate("/add-dc")}
                    className="flex items-center gap-2 bg-primary hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Plus className="text-lg" />
                    <span>Add Dc</span>
                  </button>
                ): null
              }
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 bg-primary hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
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
                    <span>DC Number</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1">
                    <FaTruck className="text-gray-500" />
                    <span>Vehicle</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>Receipt Date</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1">
                    <FaBox className="text-gray-500" />
                    <span>Quantity</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-gray-500" />
                    <span>Approval</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEntries.length > 0 ? (
                filteredEntries.map(entry => (
                  <React.Fragment key={entry.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleExpand(entry.id)}
                          className="text-cyan-600 hover:text-cyan-800 p-1 rounded-full hover:bg-cyan-50 transition-colors"
                        >
                          {expandedRows.includes(entry.id) ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{entry.vendorName}</td>
                      <td className="px-4 py-3 text-gray-700">{entry.dcNumber}</td>
                      <td className="px-4 py-3 text-gray-700">{entry.vehicleNumber || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(entry.dateOfReceipt)}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {entry.receivedQuantity} {entry.uom}
                      </td>
                      <td className="px-4 py-3">
                        {entry.approved ? (
                          <span className="inline-flex items-center px-6 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FaCheckCircle size={12} />
                          </span>
                        ) : (role == "ACCOUNTS_MANAGER") ? (
                          <button
                            className="px-2 py-0.5 rounded bg-cyan-600 text-white text-xs font-medium hover:bg-cyan-700 transition-colors"
                            onClick={() => dcApprovalMutation.mutate({ id: entry.id, approved: true })}
                            disabled={dcApprovalMutation.status === "pending"}
                          >
                            {dcApprovalMutation.status === "pending" ? 'Approving...' : 'Approve'}
                          </button>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 text-xs font-medium mt-1">Pending</span>
                        )}
                      </td>
                    </tr>
                    {expandedRows.includes(entry.id) && (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 bg-gray-50">
                          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <FaFileAlt className="text-cyan-500" />
                              Delivery Challan Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Vendor Information</h4>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaBuilding className="text-cyan-400" />
                                      <span className="font-medium">Vendor Name:</span> {entry.vendorName}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Delivery Information</h4>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaTruck className="text-cyan-400" />
                                      <span className="font-medium">Vehicle Number:</span> {entry.vehicleNumber || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaHashtag className="text-cyan-400" />
                                      <span className="font-medium">DC Number:</span> {entry.dcNumber}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaHashtag className="text-cyan-400" />
                                      <span className="font-medium">BMRN Number:</span> {entry.bmrnNumber || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Material Information</h4>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Description:</span> {entry.materialDescription}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Purpose:</span> {entry.purposeOfMaterial}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaCube className="text-cyan-400" />
                                      <span className="font-medium">Quantity:</span> {entry.receivedQuantity} {entry.uom}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Dates & Status</h4>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaCalendarAlt className="text-cyan-400" />
                                      <span className="font-medium">Receipt Date:</span> {formatDate(entry.dateOfReceipt)}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <FaCalendarAlt className="text-cyan-400" />
                                      <span className="font-medium">Created At:</span> {formatDate(entry.createdAt)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Status:</span>
                                      {entry.approved ? (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          <FaCheckCircle className="mr-1" /> Approved
                                        </span>
                                      ) : (
                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                          <FaTimesCircle className="mr-1" /> Pending Approval
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {entry.dcAttachment && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Attachments</h4>
                                    <p className="text-sm text-cyan-600 flex items-center gap-2">
                                      <FaPaperclip className="text-cyan-400" />
                                      <span className="font-medium">DC Attachment:</span>
                                      <a href={entry.dcAttachment} target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-800">
                                        View document
                                      </a>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400 py-8">
                      <FaFileAlt className="text-4xl mb-3" />
                      <p className="text-lg">No DC entries found</p>
                      <p className="text-sm mt-1">Try adjusting your search query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Loading State */}
        {dcQuery.isLoading && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading DC entries...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {dcQuery.isError && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md">
              <FaTimesCircle className="mr-2" />
              <span>Error loading DC entries. Please try again.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}