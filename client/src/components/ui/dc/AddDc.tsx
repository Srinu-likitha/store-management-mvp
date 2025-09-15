import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DcEntrySchema, type DcEntryInput } from "../../../types/zod"
import api from "../../../lib/axios/axios"
import { API_ROUTES } from "../../../lib/api"
import type { ErrorRes } from "../../../types"
import { 
  FaCalendarAlt, 
  FaBuilding, 
  FaHashtag, 
  FaTruck, 
  FaBox, 
  FaRuler, 
  FaCube, 
  FaClipboardList, 
  FaPaperclip, 
  FaBarcode,
  FaPlusCircle,
  FaSpinner
} from "react-icons/fa"

export default function AddDc() {

  const createMaterialDcMuation = useMutation({
    mutationFn: async (data: DcEntryInput) => {
      const res = await api.post(API_ROUTES.MATERIAL_DCS.CREATE_MATERIAL_DC, data);
      return res.data;
    },
    onSuccess: () => {
      alert("DC Entry added successfully");
    },
    onError: (error: ErrorRes) => {
      alert(error.response?.data?.message || "Something went wrong");
    }
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DcEntryInput>({
    resolver: zodResolver(DcEntrySchema),
    defaultValues: {
      dateOfReceipt: "",
      vendorName: "",
      dcNumber: "",
      vehicleNumber: "",
      materialDescription: "",
      uom: "",
      receivedQuantity: undefined,
      purposeOfMaterial: "",
      dcAttachment: "",
      bmrnNumber: ""
    }
  });

  const onSubmit = (data: DcEntryInput) => {
    createMaterialDcMuation.mutate(data, {
      onSuccess: () => {
        reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-b from-cyan-900 to-cyan-800 px-6 py-4">
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              <FaPlusCircle className="text-white text-xl" />
              Add New Delivery Challan
            </h1>
            <p className="text-cyan-100 text-sm mt-1">Fill in the details below to create a new DC entry</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Receipt */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaCalendarAlt className="text-cyan-500" />
                  Date of Receipt
                </label>
                <input 
                  type="date" 
                  {...register("dateOfReceipt")}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.dateOfReceipt ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dateOfReceipt && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.dateOfReceipt.message as string}
                  </p>
                )}
              </div>

              {/* Vendor Name */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaBuilding className="text-cyan-500" />
                  Vendor Name
                </label>
                <input 
                  {...register("vendorName")}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.vendorName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter vendor name"
                />
                {errors.vendorName && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.vendorName.message as string}
                  </p>
                )}
              </div>

              {/* DC Number */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaHashtag className="text-cyan-500" />
                  DC Number
                </label>
                <input 
                  {...register("dcNumber")}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.dcNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter DC number"
                />
                {errors.dcNumber && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.dcNumber.message as string}
                  </p>
                )}
              </div>

              {/* Vehicle Number */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaTruck className="text-cyan-500" />
                  Vehicle Number
                </label>
                <input 
                  {...register("vehicleNumber")}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.vehicleNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter vehicle number"
                />
                {errors.vehicleNumber && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.vehicleNumber.message as string}
                  </p>
                )}
              </div>

              {/* Material Description */}
              <div className="space-y-2 md:col-span-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaBox className="text-cyan-500" />
                  Material Description
                </label>
                <textarea 
                  {...register("materialDescription")}
                  rows={3}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.materialDescription ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe the material received"
                />
                {errors.materialDescription && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.materialDescription.message as string}
                  </p>
                )}
              </div>

              {/* UOM */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaRuler className="text-cyan-500" />
                  Unit of Measure
                </label>
                <select 
                  {...register("uom")}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.uom ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select UOM</option>
                  <option value="PCS">Pieces (PCS)</option>
                  <option value="KG">Kilograms (KG)</option>
                  <option value="M">Meters (M)</option>
                  <option value="SQFT">Square Feet (SQFT)</option>
                  <option value="L">Liters (L)</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.uom && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.uom.message as string}
                  </p>
                )}
              </div>

              {/* Received Quantity */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaCube className="text-cyan-500" />
                  Received Quantity
                </label>
                <input 
                  type="number" 
                  step="any" 
                  {...register("receivedQuantity", { valueAsNumber: true })}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.receivedQuantity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter quantity"
                />
                {errors.receivedQuantity && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.receivedQuantity.message as string}
                  </p>
                )}
              </div>

              {/* Purpose of Material */}
              <div className="space-y-2 md:col-span-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaClipboardList className="text-cyan-500" />
                  Purpose of Material
                </label>
                <textarea 
                  {...register("purposeOfMaterial")}
                  rows={2}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.purposeOfMaterial ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe the purpose of this material"
                />
                {errors.purposeOfMaterial && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.purposeOfMaterial.message as string}
                  </p>
                )}
              </div>

              {/* DC Attachment */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaPaperclip className="text-cyan-500" />
                  DC Attachment URL
                </label>
                <input 
                  {...register("dcAttachment")}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.dcAttachment ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Paste attachment URL"
                />
                {errors.dcAttachment && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.dcAttachment.message as string}
                  </p>
                )}
              </div>

              {/* BMRN Number */}
              <div className="space-y-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaBarcode className="text-cyan-500" />
                  BMRN Number
                </label>
                <input 
                  {...register("bmrnNumber")}
                  className={` w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.bmrnNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter BMRN number"
                />
                {errors.bmrnNumber && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    {errors.bmrnNumber.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={createMaterialDcMuation.isPending}
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={createMaterialDcMuation.isPending}
                className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-cyan-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMaterialDcMuation.isPending ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaPlusCircle />
                    Create DC Entry
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}