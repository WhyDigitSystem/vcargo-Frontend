import { useEffect, useRef, useState } from "react";
import InputField from "../UI/InputField";
import { Plus, Trash2, Pencil, Eye, Download, Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { vendorAPI } from "../../api/vendorAPI";
import { chargeTypeAPI } from "../../api/chargeTypeAPI";
import { useSelector } from "react-redux";
import { tripAPI } from "../../api/tripAPI";

const InvoiceDetails = ({
    invoiceForm,
    updateInvoiceForm,
    additionalCharges,
    addNewChargeRow,
    removeChargeRow,
    updateChargeField,
    vendorSearch,
    setVendorSearch,
    showVendorDropdown,
    setShowVendorDropdown,
    vendorList,
    setVendorList,
    loading,
    setLoading,
    handleVendorSelect,
    onNavigateToVendor,
    handleInvoiceFileChange,
    tripList,
    setTripList,
    errors = {},
    editingId
}) => {
    const vendorRef = useRef(null);
    const navigate = useNavigate();
    const [chargeTypes, setChargeTypes] = useState([]);
    const [page] = useState(1);
    const [count] = useState(10);
     
    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    // State for invoice file viewer
    const [selectedInvoiceFile, setSelectedInvoiceFile] = useState(null);
    const [showInvoiceFileModal, setShowInvoiceFileModal] = useState(false);

    useEffect(() => {
        getVendorName();
        getChargeTypes();
        getTrips();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (vendorRef.current && !vendorRef.current.contains(event.target)) {
                setShowVendorDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredVendor = vendorList.filter((v) =>
        v.organization?.toLowerCase().includes(vendorSearch.toLowerCase())
    );

    const handleCreateNewVendor = () => {
        navigate("/vendor");
    };

    const getVendorName = async () => {
        try {
            setLoading(true);
            const response = await vendorAPI.getVendorName({ orgId });
            console.log('Vendor API Response:', response);

            const data = response?.paramObjectsMap?.vendorVO || [];

            if (Array.isArray(data)) {
                setVendorList(data);
            } else {
                setVendorList([]);
            }
        } catch (error) {
            console.error("Error fetching Vendor:", error);
            setVendorList([]);
        } finally {
            setLoading(false);
        }
    };

    const getChargeTypes = async () => {
        try {
            const response = await chargeTypeAPI.getChargeTypeDetails({
                page,
                count,
                search: "",
                orgId
            });

            const data = response?.paramObjectsMap?.chargeTypeVO?.data || [];
            setChargeTypes(data);
        } catch (error) {
            console.error("Error loading charge types:", error);
            setChargeTypes([]);
        }
    };

    const getTrips = async () => {
        try {
            const res = await tripAPI.getAllTrips({
                page: 1,
                count: 100,
                search: "",
                orgId
            });

            const data = res?.paramObjectsMap?.tripsVO?.data || [];
            setTripList(data);
        } catch (err) {
            console.error("Error fetching trips for Additional Charges:", err);
            setTripList([]);
        }
    };

    // Handle invoice file upload
    const onInvoiceFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    alert('File size exceeds 10MB limit');
                    e.target.value = '';
                    return;
                }

                // Validate file type
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Only PDF, JPEG, and PNG files are allowed');
                    e.target.value = '';
                    return;
                }

                handleInvoiceFileChange(file);
            } catch (error) {
                alert(error.message);
                e.target.value = '';
            }
        }
    };

    // Handle viewing invoice file - FIXED LOGIC
    const handleViewInvoiceFile = () => {
        // Check for new file OR existing file when editing
        const hasFile = invoiceForm.invoiceFile ||
            (editingId && invoiceForm.invoiceFileName);

        if (!hasFile) {
            console.log("No file to view");
            return;
        }

        if (invoiceForm.invoiceFile) {
            // For new files
            const fileUrl = URL.createObjectURL(invoiceForm.invoiceFile);
            setSelectedInvoiceFile({
                name: invoiceForm.invoiceFile.name,
                url: fileUrl,
                type: invoiceForm.invoiceFile.type,
                isExisting: false
            });
        } else if (editingId && invoiceForm.invoiceFileName) {
            // For existing files (when editing)
            setSelectedInvoiceFile({
                name: invoiceForm.invoiceFileName,
                url: null,
                type: 'existing',
                isExisting: true,
                filePath: invoiceForm.invoiceFilePath
            });
        }
        setShowInvoiceFileModal(true);
    };

    // Handle downloading invoice file - FIXED LOGIC
    const handleDownloadInvoiceFile = () => {
        // Check for new file OR existing file when editing
        const hasFile = invoiceForm.invoiceFile ||
            (editingId && invoiceForm.invoiceFileName);

        if (!hasFile) {
            console.log("No file to download");
            return;
        }

        if (invoiceForm.invoiceFile) {
            const url = URL.createObjectURL(invoiceForm.invoiceFile);
            const a = document.createElement('a');
            a.href = url;
            a.download = invoiceForm.invoiceFile.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (editingId && invoiceForm.invoiceFileName) {
            // Implement download for existing files
            console.log(`Downloading ${invoiceForm.invoiceFileName}`);
            // You'll need to implement API call to download the file
            // For now, we'll just show a message
            alert(`Download functionality for existing file: ${invoiceForm.invoiceFileName}\nImplement API call to download from server.`);
        }
    };

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            if (selectedInvoiceFile?.url) {
                URL.revokeObjectURL(selectedInvoiceFile.url);
            }
        };
    }, [selectedInvoiceFile]);

    // Calculate total additional charges
    const totalAdditionalCharges = additionalCharges.reduce((sum, charge) =>
        sum + (parseFloat(charge.amount) || 0), 0
    );

    // Update total in parent form
    useEffect(() => {
        updateInvoiceForm('totalAdditionalCharges', totalAdditionalCharges.toFixed(2));
    }, [totalAdditionalCharges]);

    const TDS_OPTIONS = [
        { label: "No TDS - 0%", value: "no-tds", percent: 0 },
        { label: "Section 193 - 10%", value: "193", percent: 10 },
        { label: "Section 194 - 10%", value: "194", percent: 10 },
        { label: "Section 194A - 10%", value: "194A", percent: 10 },
        { label: "Section 194B - 30%", value: "194B", percent: 30 },
        { label: "Section 194BB - 30%", value: "194BB", percent: 30 },
        { label: "Section 194C: HUF/Individuals - 1%", value: "194C_I", percent: 1 },
        { label: "Section 194C: Others - 2%", value: "194C_O", percent: 2 },
        { label: "Section 194D - 10%", value: "194D", percent: 10 },
        { label: "Section 194DA - 5%", value: "194DA", percent: 5 },
        { label: "Section 194EE - 10%", value: "194EE", percent: 10 },
        { label: "Section 194F - 20%", value: "194F", percent: 20 },
        { label: "Section 194G - 5%", value: "194G", percent: 5 },
        { label: "Section 194H - 5%", value: "194H", percent: 5 },
        { label: "Section 194-I: Plant & Machinery - 2%", value: "194I_PM", percent: 2 },
        { label: "Section 194-I: Others - 10%", value: "194I_O", percent: 10 },
        { label: "Section 194-IA - 1%", value: "194IA", percent: 1 },
        { label: "Section 194-IB - 5%", value: "194IB", percent: 5 },
        { label: "Section 194-IC - 10%", value: "194IC", percent: 10 },
        { label: "Section 194J - 10%", value: "194J", percent: 10 },
    ];

    // Check if we should show eye icon - FIXED CONDITION
    const shouldShowEyeIcon = invoiceForm.invoiceFile ||
        (editingId && invoiceForm.invoiceFileName);

    // Check if we should show download icon - FIXED CONDITION
    const shouldShowDownloadIcon = invoiceForm.invoiceFile ||
        (editingId && invoiceForm.invoiceFileName);

    // Check if we should show remove icon (only for new files)
    const shouldShowRemoveIcon = invoiceForm.invoiceFile;

    return (
        <div className="mt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Vendor Selection */}
                <div className="relative" ref={vendorRef}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Vendor <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={vendorSearch || invoiceForm.vendor}
                        onChange={(e) => {
                            setVendorSearch(e.target.value);
                            setShowVendorDropdown(true);
                        }}
                        onFocus={() => setShowVendorDropdown(true)}
                        placeholder="Search Vendor..."
                        className="w-full px-3 h-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.vendor && <p className="text-xs text-red-500 mt-1">{errors.vendor}</p>}

                    {showVendorDropdown && (
                        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                            <div className="max-h-52 overflow-y-auto p-2">
                                {filteredVendor.length > 0 ? (
                                    filteredVendor.map((ven, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleVendorSelect(ven)}
                                            className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                            <p className="font-medium text-gray-700 dark:text-gray-200">
                                                {ven.organization}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 px-3 py-2">
                                        No Vendor found
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleCreateNewVendor}
                                className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-b-xl text-sm"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Vendor
                            </button>
                        </div>
                    )}
                </div>

                {/* Created At */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Created At
                    </label>
                    <input
                        type="datetime-local"
                        value={invoiceForm.createdAt}
                        onChange={(e) => updateInvoiceForm('createdAt', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled
                    />
                </div>

                {/* Invoice Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Invoice Type
                    </label>
                    <select
                        value={invoiceForm.invoiceType}
                        onChange={(e) => updateInvoiceForm('invoiceType', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="">Select Type</option>
                        <option value="Manual">Manual</option>
                        <option value="Digital">Digital</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </div>

                {/* Invoice File Upload with Eye Icon - FIXED */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Invoice File
                    </label>
                    <div className="flex items-center gap-2">
                        <label className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm cursor-pointer">
                            <input
                                type="file"
                                onChange={onInvoiceFileChange}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <div className="flex items-center gap-2">
                                <Paperclip size={16} />
                                <span>
                                    {invoiceForm.invoiceFile ? invoiceForm.invoiceFile.name :
                                        invoiceForm.invoiceFileName || 'Attach'}
                                </span>
                            </div>
                        </label>

                        {/* View/Download buttons for existing or uploaded files - FIXED CONDITIONS */}
                        <div className="flex items-center gap-1">
                            {/* Eye Icon for Viewing */}
                            {shouldShowEyeIcon && (
                                <button
                                    onClick={handleViewInvoiceFile}
                                    className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                    title="View Invoice File"
                                >
                                    <Eye size={18} className="text-blue-600 dark:text-blue-400" />
                                </button>
                            )}

                            {/* Download Icon */}
                            {shouldShowDownloadIcon && (
                                <button
                                    onClick={handleDownloadInvoiceFile}
                                    className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                                    title="Download Invoice File"
                                >
                                    <Download size={18} className="text-green-600 dark:text-green-400" />
                                </button>
                            )}

                            {/* Remove/Delete Icon (only for new files) */}
                            {shouldShowRemoveIcon && (
                                <button
                                    onClick={() => {
                                        updateInvoiceForm('invoiceFile', null);
                                        updateInvoiceForm('invoiceFileName', '');
                                    }}
                                    className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                    title="Remove file"
                                >
                                    <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Show file info */}
                    {(invoiceForm.invoiceFile || invoiceForm.invoiceFileName) && (
                        <div className="mt-2 space-y-1">
                            {invoiceForm.invoiceFile ? (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <span>New file: {invoiceForm.invoiceFile.name}</span>
                                    <span>• {(invoiceForm.invoiceFile.size / 1024).toFixed(2)} KB</span>
                                </p>
                            ) : editingId && invoiceForm.invoiceFileName ? (
                                <p className="text-xs text-blue-600 flex items-center gap-1">
                                    <span>✓ Existing file: {invoiceForm.invoiceFileName}</span>
                                    {invoiceForm.invoiceFilePath && (
                                        <span className="text-gray-500">(Server path)</span>
                                    )}
                                </p>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Charges Section */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Additional Charges
                </h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
                            <tr>
                                <th className="px-3 py-3 w-12">No.</th>
                                <th className="px-3 py-3">Purpose <span className="text-red-500">*</span></th>
                                <th className="px-3 py-3">Amount <span className="text-red-500">*</span></th>
                                <th className="px-3 py-3">Remark</th>
                                <th className="px-3 py-3">Trip</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3 text-center w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {additionalCharges.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No additional charges added
                                    </td>
                                </tr>
                            ) : (
                                additionalCharges.map((charge, index) => (
                                    <tr
                                        key={charge.id}
                                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <td className="px-3 py-2">{index + 1}</td>
                                        <td className="px-3 py-2">
                                            <select
                                                value={charge.purpose}
                                                onChange={(e) => updateChargeField(charge.id, "purpose", e.target.value)}
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Charge Type</option>
                                                {chargeTypes.map((item) => (
                                                    <option key={item.id} value={item.chargeType}>
                                                        {item.chargeType}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                value={charge.amount}
                                                onChange={(e) => updateChargeField(charge.id, "amount", e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                value={charge.remark}
                                                onChange={(e) => updateChargeField(charge.id, "remark", e.target.value)}
                                                placeholder="Enter remark"
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <select
                                                value={charge.trip}
                                                onChange={(e) => updateChargeField(charge.id, "trip", e.target.value)}
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white"
                                            >
                                                <option value="">Select Trip</option>

                                                {tripList?.map((trip) => (
                                                    <option key={trip.id} value={trip.id}>
                                                        Trip-{trip.id} {trip.lrNumber ? `(${trip.lrNumber})` : ""} {trip.vehicleNumber ? `- ${trip.vehicleNumber}` : ""}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={`text-xs px-2 py-1 rounded ${charge.status === 'Approved'
                                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                                }`}>
                                                {charge.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button
                                                    onClick={() => updateChargeField(charge.id, "status",
                                                        charge.status === 'Draft' ? 'Approved' : 'Draft'
                                                    )}
                                                    className="p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                                    title="Toggle status"
                                                >
                                                    <Pencil size={16} className="text-blue-600" />
                                                </button>
                                                {additionalCharges.length > 0 && (
                                                    <button
                                                        onClick={() => removeChargeRow(charge.id)}
                                                        className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                                    >
                                                        <Trash2 size={16} className="text-red-600" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={addNewChargeRow}
                    className="mt-4 flex items-center space-x-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
                >
                    <Plus size={16} />
                    <span>Add Row</span>
                </button>
            </div>

            {/* Amount Section */}
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Amount
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Trip Cost
                            </label>
                            <InputField
                                type="number"
                                placeholder="0.00"
                                value={invoiceForm.tripCost}
                                onChange={(e) => updateInvoiceForm('tripCost', e.target.value)}
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sub Total
                            </label>
                            <InputField
                                type="number"
                                placeholder="0.00"
                                value={invoiceForm.subTotal}
                                onChange={(e) => updateInvoiceForm('subTotal', e.target.value)}
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                TDS
                            </label>
                            <select
                                value={invoiceForm.tds}
                                onChange={(e) => updateInvoiceForm("tds", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Select TDS</option>
                                {TDS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.percent}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Total Additional Charges
                            </label>
                            <InputField
                                type="number"
                                placeholder="0.00"
                                value={totalAdditionalCharges.toFixed(2)}
                                readOnly
                                className="bg-gray-100 dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Total Amount <span className="text-red-500">*</span>
                            </label>
                            <InputField
                                type="number"
                                placeholder="0.00"
                                value={invoiceForm.totalAmount}
                                onChange={(e) => updateInvoiceForm('totalAmount', e.target.value)}
                                step="0.01"
                            />
                            {errors.totalAmount && <p className="text-xs text-red-500 mt-1">{errors.totalAmount}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                Payable Amount
                            </label>
                            <InputField
                                type="number"
                                placeholder="0.00"
                                value={invoiceForm.payableAmount}
                                onChange={(e) => updateInvoiceForm('payableAmount', e.target.value)}
                                step="0.01"
                                className="text-blue-600 dark:text-blue-400 font-semibold"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Details Section */}
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Invoice Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Invoice Number
                            </label>
                            <InputField
                                value={invoiceForm.invoiceNumber}
                                onChange={(e) => updateInvoiceForm('invoiceNumber', e.target.value)}
                                placeholder="Enter invoice number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Invoice Date <span className="text-red-500">*</span>
                            </label>
                            <InputField
                                type="date"
                                value={invoiceForm.invoiceDate}
                                onChange={(e) => updateInvoiceForm('invoiceDate', e.target.value)}
                            />
                            {errors.invoiceDate && <p className="text-xs text-red-500 mt-1">{errors.invoiceDate}</p>}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Due Date <span className="text-red-500">*</span>
                            </label>
                            <InputField
                                type="date"
                                value={invoiceForm.dueDate}
                                onChange={(e) => updateInvoiceForm('dueDate', e.target.value)}
                            />
                            {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                value={invoiceForm.description}
                                onChange={(e) => updateInvoiceForm('description', e.target.value)}
                                placeholder="Enter description"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice File Modal */}
            {showInvoiceFileModal && selectedInvoiceFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Invoice File: {selectedInvoiceFile.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowInvoiceFileModal(false);
                                    if (selectedInvoiceFile.url) {
                                        URL.revokeObjectURL(selectedInvoiceFile.url);
                                    }
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 overflow-auto max-h-[70vh]">
                            {selectedInvoiceFile.url ? (
                                selectedInvoiceFile.type.startsWith('image/') ? (
                                    <img
                                        src={selectedInvoiceFile.url}
                                        alt="Invoice File"
                                        className="max-w-full max-h-full mx-auto"
                                    />
                                ) : selectedInvoiceFile.type === 'application/pdf' ? (
                                    <iframe
                                        src={selectedInvoiceFile.url}
                                        title="Invoice PDF"
                                        className="w-full h-[500px] border-0"
                                    />
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="mb-4">
                                            <Paperclip size={48} className="text-gray-400 mx-auto" />
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Preview not available for this file type
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            File: {selectedInvoiceFile.name}
                                        </p>
                                        <button
                                            onClick={handleDownloadInvoiceFile}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Download File
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="text-center p-8">
                                    <p className="text-gray-500 mb-2">Existing invoice file on server</p>
                                    <p className="text-sm text-gray-600 mb-4">{selectedInvoiceFile.name}</p>
                                    {selectedInvoiceFile.filePath && (
                                        <p className="text-xs text-gray-500 mb-4">
                                            Path: {selectedInvoiceFile.filePath}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => {
                                            // Implement download from server
                                            alert(`Download functionality for existing file: ${selectedInvoiceFile.name}\nImplement API call to download from server.`);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Download from Server
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceDetails;