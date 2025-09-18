import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import api from "../../../lib/axios/axios";
import { API_ROUTES } from "../../../lib/api";
import type { ErrorRes, Response } from "../../../types";
import { MaterialInvoiceSchema, type MaterialInvoiceInput } from "../../../types/zod";

export default function AddMaterialInvoice() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const defaultValues: MaterialInvoiceInput = {
    dateOfReceipt: today,
    vendorName: "",
    invoiceNumber: "",
    invoiceDate: today,
    deliveryChallanNumber: "",
    vehicleNumber: "",
    materialCategory: "CIVIL",
    hnsCode: "",
    uom: "",
    vendorContactNumber: "",
    poNumber: "",
    poDate: "",
    purposeOfMaterial: "",
    cgst: 0,
    sgst: 0,
    transportationCharges: 0,
    invoiceAttachment: undefined as unknown as FileList,
    remarks: "",
    InvoiceMaterialItem: [{
      category: "CIVIL",
      hnsCode: "",
      description: "",
      quantity: 0,
      ratePerUnit: 0,
      cost: 0,
    }],
  };

  const { register, control, handleSubmit, formState: { errors }, reset, watch } = useForm<MaterialInvoiceInput>({
    resolver: zodResolver(MaterialInvoiceSchema),
    defaultValues,
  });

  const materialInvoiceMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await api.post<Response>(
        API_ROUTES.MATERIAL_INVOICES.CREATE_MATERIAL_INVOICE,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      alert("Material Invoice created successfully");
      reset({ ...defaultValues, invoiceAttachment: undefined as unknown as FileList });
    },
    onError: (error: ErrorRes) => {
      alert(error.response?.data?.message || "Something went wrong");
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "InvoiceMaterialItem",
  });

  const watchedItems = watch("InvoiceMaterialItem");
  const cgst = watch("cgst");
  const sgst = watch("sgst");
  const transportationCharges = watch("transportationCharges");

  const totalMaterialCost = useMemo(() => {
    return watchedItems.reduce((sum, item) => {
      const quantity = Number(item?.quantity || 0);
      const ratePerUnit = Number(item?.ratePerUnit || 0);
      return sum + quantity * ratePerUnit;
    }, 0);
  }, [watchedItems]);

  const totalCost = useMemo(() => {
    return totalMaterialCost + Number(cgst || 0) + Number(sgst || 0) + Number(transportationCharges || 0);
  }, [totalMaterialCost, cgst, sgst, transportationCharges]);

  const calculateCost = (idx: number) => {
    const quantity = watchedItems[idx]?.quantity || 0;
    const ratePerUnit = watchedItems[idx]?.ratePerUnit || 0;
    return quantity * ratePerUnit;
  };

  const readFileAsBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: MaterialInvoiceInput) => {
    setIsSubmitting(true);
    const { invoiceAttachment, ...rest } = data;
    const attachment = invoiceAttachment?.item(0);

    if (!attachment) {
      alert("Invoice attachment is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const attachmentBase64 = await readFileAsBase64(attachment);

      const payload = {
        ...rest,
        InvoiceMaterialItem: rest.InvoiceMaterialItem.map((item) => ({
          ...item,
          cost: item.quantity * item.ratePerUnit,
        })),
        totalCost,
        invoiceAttachmentName: attachment.name,
        invoiceAttachmentType: attachment.type,
        invoiceAttachmentBase64: attachmentBase64,
      };

      await materialInvoiceMutation.mutateAsync(payload);
    } catch (error) {
      console.error(error);
      alert("Failed to process invoice attachment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white w-full h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between  border-gray-200 p-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Add Material Invoice</h1>
            <p className="text-gray-600">Fill in the details below to create a new material invoice</p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => reset({ ...defaultValues, invoiceAttachment: undefined as unknown as FileList })}
              className="px-6 py-2 border border-gray-300 rounded-md text-primary hover:bg-gray-100 font-medium"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-primary text-white rounded-md hover:bg-cyan-700 font-medium ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Submit Invoice'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="grid grid-rows-3 gap-6 col-span-3">
            {/* Invoice Details Card */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 row-span-1">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Invoice Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date of Receipt *</label>
                  <input
                    type="date"
                    {...register("dateOfReceipt")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dateOfReceipt ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.dateOfReceipt && <p className="text-red-500 text-xs mt-1">{errors.dateOfReceipt.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Vendor Name *</label>
                  <input
                    {...register("vendorName")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vendorName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter vendor name"
                  />
                  {errors.vendorName && <p className="text-red-500 text-xs mt-1">{errors.vendorName.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Invoice Number *</label>
                  <input
                    {...register("invoiceNumber")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Invoice #"
                  />
                  {errors.invoiceNumber && <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Invoice Date *</label>
                  <input
                    type="date"
                    {...register("invoiceDate")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.invoiceDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.invoiceDate && <p className="text-red-500 text-xs mt-1">{errors.invoiceDate.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Delivery Challan Number</label>
                  <input
                    {...register("deliveryChallanNumber")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deliveryChallanNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Challan #"
                  />
                  {errors.deliveryChallanNumber && <p className="text-red-500 text-xs mt-1">{errors.deliveryChallanNumber.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                  <input
                    {...register("vehicleNumber")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vehicleNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Vehicle #"
                  />
                  {errors.vehicleNumber && <p className="text-red-500 text-xs mt-1">{errors.vehicleNumber.message as string}</p>}
                </div>
              </div>
            </div>

            {/* Material Details Card */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 row-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Material Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Material Category *</label>
                  <select
                    {...register("materialCategory")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.materialCategory ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="CIVIL">CIVIL</option>
                    <option value="PLUMBING">PLUMBING</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="INTERIOR">INTERIOR</option>
                    <option value="EXTERIOR">EXTERIOR</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                  {errors.materialCategory && <p className="text-red-500 text-xs mt-1">{errors.materialCategory.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">HNS Code *</label>
                  <input
                    {...register("hnsCode")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.hnsCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="HNS code"
                  />
                  {errors.hnsCode && <p className="text-red-500 text-xs mt-1">{errors.hnsCode.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">UOM *</label>
                  <input
                    {...register("uom")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.uom ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Unit of measurement"
                  />
                  {errors.uom && <p className="text-red-500 text-xs mt-1">{errors.uom.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Vendor Contact Number</label>
                  <input
                    {...register("vendorContactNumber")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vendorContactNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Contact number"
                  />
                  {errors.vendorContactNumber && <p className="text-red-500 text-xs mt-1">{errors.vendorContactNumber.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">PO Number</label>
                  <input
                    {...register("poNumber")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.poNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Purchase order #"
                  />
                  {errors.poNumber && <p className="text-red-500 text-xs mt-1">{errors.poNumber.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">PO Date</label>
                  <input
                    type="date"
                    {...register("poDate")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.poDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.poDate && <p className="text-red-500 text-xs mt-1">{errors.poDate.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Purpose Of Material</label>
                  <input
                    {...register("purposeOfMaterial")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.purposeOfMaterial ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Purpose of material"
                  />
                  {errors.purposeOfMaterial && <p className="text-red-500 text-xs mt-1">{errors.purposeOfMaterial.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Invoice Attachment (PDF)*</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    {...register("invoiceAttachment")}
                    className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.invoiceAttachment ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.invoiceAttachment && <p className="text-red-500 text-xs mt-1">{errors.invoiceAttachment.message as string}</p>}
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Remarks</label>
                  <textarea
                    {...register("remarks")}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.remarks ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Additional notes or remarks"
                  />
                  {errors.remarks && <p className="text-red-500 text-xs mt-1">{errors.remarks.message as string}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items Card */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 col-span-2">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-lg font-semibold text-gray-700">Invoice Items</h2>
              <button
                type="button"
                onClick={() => append({ category: "CIVIL", hnsCode: "", description: "", quantity: 0, ratePerUnit: 0, cost: 0 })}
                className="flex items-center gap-2 justify-between px-4 py-2 bg-primary text-white rounded-md hover:bg-cyan-700 text-sm font-medium"
              >
                Add Item
                <Plus size={12} className="text-white" />
              </button>
            </div>

            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 bg-white rounded border border-gray-200">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Category</label>
                  <select
                    {...register(`InvoiceMaterialItem.${idx}.category` as const)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="CIVIL">CIVIL</option>
                    <option value="PLUMBING">PLUMBING</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="INTERIOR">INTERIOR</option>
                    <option value="EXTERIOR">EXTERIOR</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">HNS Code</label>
                  <input
                    {...register(`InvoiceMaterialItem.${idx}.hnsCode` as const)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="HNS code"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700">Description</label>
                  <input
                    {...register(`InvoiceMaterialItem.${idx}.description` as const)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    placeholder="Item description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`InvoiceMaterialItem.${idx}.quantity` as const, {
                      valueAsNumber: true,
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Rate/Unit</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`InvoiceMaterialItem.${idx}.ratePerUnit` as const, {
                      valueAsNumber: true,
                    })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calculateCost(idx)}
                    readOnly
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-gray-100"
                  />
                </div>

                <div className="flex items-end md:col-span-6">
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-xs font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-6 text-gray-500 bg-white rounded border border-dashed border-gray-300">
                No items added yet. Click "Add Item" to get started.
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">CGST</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("cgst", { valueAsNumber: true })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cgst ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="0.00"
                  />
                  {errors.cgst && <p className="text-red-500 text-xs mt-1">{errors.cgst.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">SGST</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("sgst", { valueAsNumber: true })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.sgst ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="0.00"
                  />
                  {errors.sgst && <p className="text-red-500 text-xs mt-1">{errors.sgst.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Transportation Charges</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("transportationCharges", { valueAsNumber: true })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.transportationCharges ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="0.00"
                  />
                  {errors.transportationCharges && <p className="text-red-500 text-xs mt-1">{errors.transportationCharges.message as string}</p>}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Total Material Cost</span>
                  <span className="font-medium">₹ {totalMaterialCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Additional Charges</span>
                  <span className="font-medium">₹ {(Number(cgst || 0) + Number(sgst || 0) + Number(transportationCharges || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-800 border-t border-dashed border-gray-300 pt-2">
                  <span>Total Cost</span>
                  <span>₹ {totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
