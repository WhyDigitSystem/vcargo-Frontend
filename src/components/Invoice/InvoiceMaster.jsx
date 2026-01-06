import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import TabComponent from "../common/TabComponent";
import InvoiceDetails from "./InvoiceDetails";
import TripDetails from "./TripDetails";
import TripsDocs from "./TripsDocs";
import { useNavigate } from "react-router-dom";
import { vendorAPI } from "../../api/vendorAPI";
import { vendorInvoiceAPI } from "../../api/vendorInvoiceAPI";
import { toast } from "../../utils/toast";
import { useSelector } from "react-redux";

const InvoiceMaster = ({ setIsListView, editingId }) => {
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    // Main invoice form state
    const [invoiceForm, setInvoiceForm] = useState({
        vendor: '',
        vendorCode: '',
        vendorId: '', // Added for API
        invoiceType: '',
        createdAt: "",
        invoiceNumber: "",
        invoiceDate: "",
        dueDate: "",
        description: "",
        tripCost: "",
        subTotal: "",
        tds: "",
        totalAdditionalCharges: "",
        totalAmount: "",
        payableAmount: "",
        invoiceFile: null,
        invoiceFileName: "", // Track existing invoice file name
        invoiceFilePath: "", // Track existing invoice file path
        fromDate: "",
        toDate: "",
        orgId: 1001, // Default orgId, should come from context
        branch: "BENGALURU", // Default branch
        branchCode: "BLR" // Default branch code
    });

    // Additional charges state
    const [additionalCharges, setAdditionalCharges] = useState([]);
    const userName = JSON.parse(localStorage.getItem("user"))?.name || "";

    // Trip details state
    const [tripDetails, setTripDetails] = useState([
        {
            id: 1,
            trip: "",
            origin: "",
            destination: "",
            vehicle: "",
            status: "Pending"
        }
    ]);

    // Trips Docs state
    const [tripDocs, setTripDocs] = useState([
        {
            id: 1,
            doc: "Attach",
            docType: "",
            remark: "",
            trip: "",
            vehicleNumber: "",
            file: null,
            fileName: "", // Track existing file name
            filePath: "", // Track existing file path
            isExistingFile: false // Flag to identify existing files
        }
    ]);

    // Vendor search state
    const [vendorSearch, setVendorSearch] = useState("");
    const [showVendorDropdown, setShowVendorDropdown] = useState(false);
    const [vendorList, setVendorList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Trip lists state
    const [tripList, setTripList] = useState([]);
    const [vehicleList, setVehicleList] = useState([]);

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    // Validation errors
    const [errors, setErrors] = useState({});

    const tabs = [
        { label: "Details" },
        { label: "Trips Details" },
        { label: "Trips Docs" },
    ];

    // Set created date/time on component mount
    useEffect(() => {
        setInvoiceForm(prev => ({
            ...prev,
            createdAt: getCurrentDateTime()
        }));
    }, []);

    useEffect(() => {
        if (editingId) {
            getInvoiceById(editingId);
        }
    }, [editingId]);

    // Get current date/time for createdAt field
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Format date for API (YYYY-MM-DD)
    const formatDateForAPI = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr.includes('T')) {
            return dateStr.split('T')[0];
        }
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
    };

    // Form update handler
    const updateInvoiceForm = (field, value) => {
        setInvoiceForm(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Additional charges handlers
    const addNewChargeRow = () => {
        const newId = additionalCharges.length > 0
            ? Math.max(...additionalCharges.map(charge => charge.id)) + 1
            : 1;

        setAdditionalCharges([
            ...additionalCharges,
            {
                id: newId,
                purpose: "",
                amount: "",
                remark: "",
                trip: "",
                status: "Draft",
                file: null
            }
        ]);
    };

    const removeChargeRow = (id) => {
        setAdditionalCharges(charges => charges.filter(charge => charge.id !== id));
    };

    const updateChargeField = (id, field, value) => {
        setAdditionalCharges(charges =>
            charges.map(charge =>
                charge.id === id ? { ...charge, [field]: value } : charge
            )
        );
    };

    // Trip Details handlers
    const addTripRow = () => {
        const newId = tripDetails.length > 0
            ? Math.max(...tripDetails.map(row => row.id)) + 1
            : 1;

        setTripDetails([
            ...tripDetails,
            {
                id: newId,
                trip: "",
                origin: "",
                destination: "",
                vehicle: "",
                status: "Pending"
            }
        ]);
    };

    const removeTripRow = (id) => {
        if (tripDetails.length > 1) {
            setTripDetails(tripDetails.filter(row => row.id !== id));
        }
    };

    const updateTripDetail = (id, field, value) => {
        setTripDetails(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    // Trip Docs handlers
    const addDocRow = () => {
        const newId = tripDocs.length > 0
            ? Math.max(...tripDocs.map(row => row.id)) + 1
            : 1;

        setTripDocs([
            ...tripDocs,
            {
                id: newId,
                doc: "Attach",
                docType: "",
                remark: "",
                trip: "",
                vehicleNumber: "",
                file: null,
                fileName: "",
                filePath: "",
                isExistingFile: false
            }
        ]);
    };

    const removeDocRow = (id) => {
        if (tripDocs.length > 1) {
            setTripDocs(tripDocs.filter(row => row.id !== id));
        }
    };

    const updateDocField = (id, field, value) => {
        setTripDocs(docs =>
            docs.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const handleFileSelect = (id, file) => {
        setTripDocs(docs =>
            docs.map(row =>
                row.id === id
                    ? {
                        ...row,
                        file: file,
                        doc: file.name,
                        isExistingFile: false // Mark as new file
                    } : row
            )
        );
    };

    // Vendor handlers
    const handleVendorSelect = (vendor) => {
        updateInvoiceForm('vendor', vendor.organization);
        updateInvoiceForm('vendorCode', vendor.vendorCode);
        updateInvoiceForm('vendorId', vendor.vendorId);
        setVendorSearch("");
        setShowVendorDropdown(false);
    };

    const handleNavigateToVendor = () => {
        navigate('/vendor');
    };

    // Trip selection handler
    const handleTripSelect = (rowId, tripId) => {
        if (!tripId) {
            updateTripDetail(rowId, "trip", "");
            updateTripDetail(rowId, "origin", "");
            updateTripDetail(rowId, "destination", "");
            updateTripDetail(rowId, "vehicle", "");
            return;
        }

        const selectedTrip = tripList.find(t => t.id == tripId);

        if (selectedTrip) {
            updateTripDetail(rowId, "trip", selectedTrip.id);
            updateTripDetail(rowId, "origin", selectedTrip.origin || selectedTrip.orgin || "");
            updateTripDetail(rowId, "destination", selectedTrip.destination || "");
            updateTripDetail(rowId, "vehicle", selectedTrip.vehicleNumber || "");
        }
    };

    // Vehicle selection handler
    const handleVehicleSelect = (rowId, vehicleNumber) => {
        if (!vehicleNumber) {
            updateTripDetail(rowId, "vehicle", "");
            updateTripDetail(rowId, "trip", "");
            updateTripDetail(rowId, "origin", "");
            updateTripDetail(rowId, "destination", "");
            return;
        }

        updateTripDetail(rowId, "vehicle", vehicleNumber);

        const linkedTrip = tripList.find(t => t.vehicleNumber === vehicleNumber);
        if (linkedTrip) {
            updateTripDetail(rowId, "trip", linkedTrip.id);
            updateTripDetail(rowId, "origin", linkedTrip.origin || linkedTrip.orgin || "");
            updateTripDetail(rowId, "destination", linkedTrip.destination || "");
        }
    };

    // Handle invoice file upload in InvoiceDetails
    const handleInvoiceFileChange = (file) => {
        updateInvoiceForm('invoiceFile', file);
        updateInvoiceForm('invoiceFileName', file.name);
    };

    const getInvoiceById = async (id) => {
        try {
            const response = await vendorInvoiceAPI.getVendorInvoiceById(id);
            console.log("📥 API Response (Invoice):", response);

            const data = response?.paramObjectsMap?.vendorInvoiceVO;
            if (!data) {
                console.error("❌ No vendorInvoiceVO data found in response");
                return;
            }

            setInvoiceForm(prev => ({
                ...prev,
                vendor: data.vendor?.organization || "",
                vendorCode: data.vendor?.vendorCode || "",
                vendorId: data.vendor?.id || "",
                invoiceType: data.invoiceType || "",
                invoiceNumber: data.invoiceNumber || "",
                invoiceDate: data.invoiceDate || "",
                dueDate: data.dueDate || "",
                description: data.description || "",
                tripCost: String(data.tripCost || ""),
                subTotal: String(data.subTotal || ""),
                tds: data.tds || "",
                totalAdditionalCharges: String(data.totalAdditionalCharges || ""),
                totalAmount: String(data.totalAmount || ""),
                payableAmount: String(data.payableAmount || ""),
                fromDate: data.fromDate || "",
                toDate: data.toDate || "",
                branch: data.branch || "BENGALURU",
                branchCode: data.branchCode || "BLR",
                invoiceFileName: data.invoiceFileName || "", // Track existing invoice file
                invoiceFilePath: data.invoiceFilePath || "", // Track existing invoice file path
                hasExistingInvoiceFile: !!data.invoiceFileName // ADD THIS FLAG
            }));

            const charges = data.vendorInvoiceChargesVO || [];
            setAdditionalCharges(
                charges.length > 0
                    ? charges.map((c, index) => ({
                        id: c.id || index + 1,
                        purpose: c.purpose || "",
                        amount: String(c.amount || ""),
                        remark: c.remarks || "",
                        trip: c.trip || "",
                        status: c.status || "Draft",
                    }))
                    : [
                        {
                            id: 1,
                            purpose: "",
                            amount: "",
                            remark: "",
                            trip: "",
                            status: "Draft",
                        },
                    ]
            );

            const tripRows = data.vendorInvoiceTripsDetailsVO || [];
            setTripDetails(
                tripRows.length > 0
                    ? tripRows.map((t, index) => ({
                        id: t.id || index + 1,
                        trip: t.trips || "",
                        origin: t.origin || "",
                        destination: t.destination || "",
                        vehicle: t.vehicle || "",
                        status: t.status || "Pending"
                    }))
                    : [
                        {
                            id: 1,
                            trip: "",
                            origin: "",
                            destination: "",
                            vehicle: "",
                            status: "Pending"
                        },
                    ]
            );

            const docs = data.vendorInvoiceTripsDocumentVO || [];
            setTripDocs(
                docs.length > 0
                    ? docs.map((d, index) => ({
                        id: d.id || index + 1,
                        docId: d.id || null,
                        docType: d.docType || "",
                        remark: d.remarks || "",
                        trip: d.trip || "",
                        vehicleNumber: d.vehicleNumber || "",
                        doc: d.docType || "Document",
                        file: null,
                        fileName: d.fileName || "",
                        filePath: d.filePath || "",
                        isExistingFile: true,
                        hasExistingFile: !!d.fileName // ADD THIS FLAG
                    }))
                    : [
                        {
                            id: 1,
                            docId: null,
                            doc: "Attach",
                            docType: "",
                            remark: "",
                            trip: "",
                            vehicleNumber: "",
                            file: null,
                            fileName: "",
                            filePath: "",
                            isExistingFile: false,
                            hasExistingFile: false
                        }
                    ]
            );

            console.log("✅ Invoice data populated successfully");
            console.log("📄 Invoice file info:", {
                fileName: data.invoiceFileName,
                filePath: data.invoiceFilePath
            });
            console.log("📄 Trip docs:", docs);

        } catch (error) {
            console.error("❌ Error loading vendor invoice:", error);
            toast.error("Failed to load invoice details");
        }
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!invoiceForm.vendor) {
            newErrors.vendor = "Vendor is required";
        }
        if (!invoiceForm.invoiceDate) {
            newErrors.invoiceDate = "Invoice date is required";
        }
        if (!invoiceForm.dueDate) {
            newErrors.dueDate = "Due date is required";
        }
        if (!invoiceForm.totalAmount) {
            newErrors.totalAmount = "Total amount is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save handler with file upload
    const handleSave = async () => {
        if (!validateForm()) {
            toast.error("Please fill the required fields");
            return;
        }

        try {
            // Prepare charges DTO
            const vendorInvoiceChargesDTO = additionalCharges
                .filter(charge => charge.purpose && charge.amount)
                .map(charge => ({
                    id: charge.id > 1 ? charge.id : null, // Include ID for existing records
                    purpose: charge.purpose,
                    amount: parseFloat(charge.amount) || 0,
                    remarks: charge.remark || '',
                    status: charge.status || 'Draft',
                    trip: charge.trip || ''
                }));

            // Prepare trip details DTO
            const vendorInvoiceTripsDetailsDTO = tripDetails.map(trip => ({
                id: trip.id > 1 ? trip.id : null, // Include ID for existing records
                trips: trip.trip ? String(trip.trip) : "",
                origin: trip.origin || "",
                destination: trip.destination || "",
                vehicle: trip.vehicle || "",
                status: trip.status || "Pending"
            }));

            // Prepare trip documents DTO
            const vendorInvoiceTripsDocumentDTO = tripDocs
                .filter(doc => doc.docType || doc.file || doc.isExistingFile)
                .map(doc => ({
                    id: doc.docId || null, // Use preserved document ID
                    docType: doc.docType || '',
                    remarks: doc.remark || '',
                    trip: doc.trip || '',
                    vehicleNumber: doc.vehicleNumber || '',
                    fileName: doc.file ? doc.file.name : doc.fileName || '',
                    filePath: doc.filePath || ''
                }));

            // Calculate totals
            const totalAdditionalChargesValue = vendorInvoiceChargesDTO.reduce(
                (sum, charge) => sum + (charge.amount || 0), 0
            );

            const tripCost = parseFloat(invoiceForm.tripCost) || 0;
            const subTotal = parseFloat(invoiceForm.subTotal) || 0;

            let tdsPercentage = 0;
            if (invoiceForm.tds && invoiceForm.tds !== "no-tds") {
                tdsPercentage = parseFloat(invoiceForm.tds) || 0;
            }

            const tdsAmount = (subTotal * tdsPercentage) / 100;

            const totalAmount =
                parseFloat(invoiceForm.totalAmount) || (subTotal + totalAdditionalChargesValue);

            const payableAmount =
                parseFloat(invoiceForm.payableAmount) || (totalAmount - tdsAmount);

            // Prepare main payload
            const payload = {
                branch: invoiceForm.branch,
                branchCode: invoiceForm.branchCode,
                createdBy: userName,
                description: invoiceForm.description || "",
                dueDate: invoiceForm.dueDate,
                fromDate: invoiceForm.fromDate,
                invoiceDate: invoiceForm.invoiceDate,
                invoiceNumber: invoiceForm.invoiceNumber || "",
                invoiceType: invoiceForm.invoiceType || "Monthly",
                orgId: orgId,
                payableAmount,
                subTotal,
                tds: tdsPercentage > 0 ? `${tdsPercentage}%` : "0%",
                toDate: invoiceForm.toDate,
                totalAdditionalCharges: totalAdditionalChargesValue,
                totalAmount,
                tripCost,
                vendorId: parseInt(invoiceForm.vendorId),
                vendorInvoiceChargesDTO,
                vendorInvoiceTripsDetailsDTO,
                vendorInvoiceTripsDocumentDTO
            };

            if (editingId) {
                payload.id = parseInt(editingId);
            }

            // Prepare FormData for file uploads
            const formDataToSend = new FormData();

            // Add main invoice file if new file is selected
            if (invoiceForm.invoiceFile) {
                formDataToSend.append("invoiceFile", invoiceForm.invoiceFile);
            } else if (editingId && invoiceForm.invoiceFileName) {
                // If editing and invoice has existing file, send placeholder
                const existingInvoiceFileInfo = {
                    fileName: invoiceForm.invoiceFileName,
                    filePath: invoiceForm.invoiceFilePath,
                    isExisting: true
                };
                formDataToSend.append(
                    "existingInvoiceFile",
                    new Blob([JSON.stringify(existingInvoiceFileInfo)], { type: 'application/json' })
                );
            }

            // Add trip documents
            tripDocs.forEach((doc, index) => {
                if (doc.file) {
                    // New file uploaded
                    formDataToSend.append("tripDocuments", doc.file);
                } else if (doc.isExistingFile && doc.fileName) {
                    // Existing file from server
                    const existingDocInfo = {
                        fileName: doc.fileName,
                        filePath: doc.filePath,
                        isExisting: true,
                        index: index
                    };
                    formDataToSend.append(
                        `existingDoc_${index}`,
                        new Blob([JSON.stringify(existingDocInfo)], { type: 'application/json' })
                    );
                }
            });

            // Add the main payload as JSON
            formDataToSend.append(
                "vendorInvoiceDTO",
                new Blob([JSON.stringify(payload)], { type: "application/json" })
            );

            // Log FormData contents for debugging
            console.log("📤 Sending FormData payload:");
            for (let [key, value] of formDataToSend.entries()) {
                if (key === "vendorInvoiceDTO") {
                    console.log(key, JSON.parse(await value.text()));
                } else if (typeof value === 'object' && !(value instanceof File)) {
                    console.log(key, JSON.parse(await value.text()));
                } else {
                    console.log(key, value);
                }
            }

            // Make API call
            const response = await vendorInvoiceAPI.createUpdateVendorInvoice(formDataToSend);
            console.log("✅ API Response:", response);

            if (response?.status === true || response?.data?.status === true || response?.status === 200) {
                toast.success(editingId ? "Invoice updated successfully!" : "Invoice saved successfully!");
                setIsListView(true);
            } else {
                toast.error("Failed to save invoice");
                console.error("API save issue:", response);
            }

        } catch (error) {
            console.error("❌ SAVE ERROR:", error);
            toast.error(error?.response?.data?.message || "Something went wrong while saving invoice!");
        }
    };

    // Clear form
    const handleClearForm = () => {
        setInvoiceForm({
            vendor: '',
            vendorCode: '',
            vendorId: '',
            invoiceType: '',
            createdAt: getCurrentDateTime(),
            invoiceNumber: "",
            invoiceDate: "",
            dueDate: "",
            description: "",
            tripCost: "",
            subTotal: "",
            tds: "",
            totalAdditionalCharges: "",
            totalAmount: "",
            payableAmount: "",
            invoiceFile: null,
            invoiceFileName: "",
            invoiceFilePath: "",
            fromDate: "",
            toDate: "",
            orgId: 1001,
            branch: "BENGALURU",
            branchCode: "BLR"
        });
        setAdditionalCharges([]);
        setTripDetails([
            {
                id: 1,
                trip: "",
                origin: "",
                destination: "",
                vehicle: "",
                status: "Pending"
            }
        ]);
        setTripDocs([
            {
                id: 1,
                doc: "Attach",
                docType: "",
                remark: "",
                trip: "",
                vehicleNumber: "",
                file: null,
                fileName: "",
                filePath: "",
                isExistingFile: false
            }
        ]);
        setVendorSearch("");
        setTripList([]);
        setVehicleList([]);
        setErrors({});
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <InvoiceDetails
                        invoiceForm={invoiceForm}
                        updateInvoiceForm={updateInvoiceForm}
                        additionalCharges={additionalCharges}
                        addNewChargeRow={addNewChargeRow}
                        removeChargeRow={removeChargeRow}
                        updateChargeField={updateChargeField}
                        vendorSearch={vendorSearch}
                        setVendorSearch={setVendorSearch}
                        showVendorDropdown={showVendorDropdown}
                        setShowVendorDropdown={setShowVendorDropdown}
                        vendorList={vendorList}
                        setVendorList={setVendorList}
                        tripList={tripList}
                        setTripList={setTripList}
                        loading={loading}
                        setLoading={setLoading}
                        handleVendorSelect={handleVendorSelect}
                        onNavigateToVendor={handleNavigateToVendor}
                        handleInvoiceFileChange={handleInvoiceFileChange}
                        errors={errors}
                        editingId={editingId}
                    />
                );
            case 1:
                return (
                    <TripDetails
                        invoiceForm={invoiceForm}
                        updateInvoiceForm={updateInvoiceForm}
                        tripDetails={tripDetails}
                        tripList={tripList}
                        setTripList={setTripList}
                        vehicleList={vehicleList}
                        setVehicleList={setVehicleList}
                        loading={loading}
                        setLoading={setLoading}
                        addTripRow={addTripRow}
                        removeTripRow={removeTripRow}
                        updateTripDetail={updateTripDetail}
                        handleTripSelect={handleTripSelect}
                        handleVehicleSelect={handleVehicleSelect}
                    />
                );
            case 2:
                return (
                    <TripsDocs
                        tripDocs={tripDocs}
                        addDocRow={addDocRow}
                        removeDocRow={removeDocRow}
                        updateDocField={updateDocField}
                        handleFileSelect={handleFileSelect}
                        tripList={tripList}
                        editingId={editingId}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 shadow rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all">
            {/* 🔹 Header */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsListView(true)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        title="Back"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {editingId ? "Edit Vendor Invoice" : "New Vendor Invoice"}
                    </h2>
                    {!editingId && (
                        <span className="text-red-500 text-sm font-medium">• Not Saved</span>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleClearForm}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                        Clear Form
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {editingId ? "Update" : "Save"}
                    </button>
                </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 mb-0" />

            {/* 🔹 Tabs */}
            <TabComponent tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* 🔹 Tab Content */}
            <div className="mt-6">{renderTabContent()}</div>
        </div>
    );
};

export default InvoiceMaster;