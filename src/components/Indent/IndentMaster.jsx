import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import TabComponent from "../common/TabComponent";
import IndentDetailsTab from "./IndentDetails";
import IndentExtraInfoTab from "./IndentExtraInfo";
import VendorResponse from "./VendorResponse";
import TripLinked from "./TripsLinked";
import TripsDocs from "./TripsDocs";
import { indentAPI } from "../../api/indentAPI";
import { toast } from "../../utils/toast";
import { useSelector } from "react-redux";

const IndentMaster = ({ setIsListView, editingId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // detailsTab
    status: "Open",
    createdAt: "",
    customer: "",
    route: "",
    origin: "",
    destination: "",
    vechicleType: "",
    weight: "",
    addPitstop: false,
    numberOfVehicles: "",
    customerRate: "",
    vendorRateVehicles: "",
    extraInfo: "",
    availableVendor: "",
    placementDate: "",
    // extraTab
    orderType: "",
    dockerNo: "",
    tripType: "",
    materialType: "",
    overtimeHours: 0,
    originPoc: "",
    destinationPoc: "",
    orgId: null,
    vendorRank: 0
  });

  const [timelineRows, setTimelineRows] = useState([
    { id: 1, event: "", time: "", user: "" }
  ]);

  const [participantsRows, setParticipantsRows] = useState([
    { id: 1, vendor: "", vendorRate: "", rank: "", vendorResponse: "" }
  ]);

  const [pitstops, setPitstops] = useState([
    { id: 1, location: "", sequence: 1 }
  ]);

  const [vehicleDetailsRows, setVehicleDetailsRows] = useState([
    { id: 1, lrNumber: "", vehicleNumber: "", driverNumber: "", driverName: "" }
  ]);

  const [tripDetailsRows, setTripDetailsRows] = useState([
    { id: 1, trips: "", origin: "", destination: "", vechile: "", status: "" }
  ]);

  const [tripDocsDetailsRows, setTripDocsDetailsRows] = useState([
    { id: 1, docType: "", remarks: "", trip: "", vehicleNumber: "", file: null }
  ]);

  useEffect(() => {
    if (editingId) {
      getIndentById(editingId);
    }
  }, [editingId]);

  const tabs = [
    { label: "Details" },
    { label: "Extra Info" },
    { label: "Vendor Response" },
    { label: "Trips Linked" },
    { label: "Trips Docs" }
  ];

  const getIndentById = async (id) => {
    try {
      const response = await indentAPI.getIndentedById(id);
      console.log("📥 API Response:", response);

      const data = response?.paramObjectsMap?.indentsVO;
      if (!data) {
        console.error("No data found in response");
        return;
      }

      console.log("📝 Prefill Data:", data);

      // ---- Prefill basic formData ----
      setFormData((prev) => ({
        ...prev,
        status: data.status || "Open",
        customer: data.customer,
        route: data.route || "",
        origin: data.origin || "",
        destination: data.destination || "",
        vechicleType: data.vechicleType || "",
        weight: data.weight || "",
        addPitstop: data.pitStop || false,
        numberOfVehicles: data.numberOfVechicles || "",
        originPoc: data.originPoc || "",
        destinationPoc: data.destinationPoc || "",
        customerRate: data.customerRate || "",
        vendorRateVehicles: data.vendorRateVehicles || "",
        extraInfo: data.extraInfo || "",
        placementDate: data.placementDate || "",
        orderType: data.orderType || "",
        dockerNo: data.dockerNo || "",
        tripType: data.tripType || "",
        materialType: data.materialType || "",
        overtimeHours: data.overTimeHours || 0,
        vendorRank: data.vendorRank || 0,
        orgId: data.orgId || null,
      }));

      // ---- Timeline ----
      if (data.timeLineVO?.length > 0) {
        setTimelineRows(
          data.timeLineVO.map((t) => ({
            id: t.id,
            event: t.event,
            time: t.time,
            user: t.user,
          }))
        );
      } else {
        setTimelineRows([{ id: 1, event: "", time: "", user: "" }]);
      }

      // ---- Participants ----
      if (data.indentsParticipantsVO?.length > 0) {
        setParticipantsRows(
          data.indentsParticipantsVO.map((p) => ({
            id: p.id,
            vendor: p.vendor || "",
            vendorRate: p.vendorRate || "",
            rank: p.ranks || "",
            vendorResponse: p.vendorResponse || ""
          }))
        );
      } else {
        setParticipantsRows([{ id: 1, vendor: "", vendorRate: "", rank: "", vendorResponse: "" }]);
      }

      // ---- Pitstops ----
      if (data.indentsPitstopVO?.length > 0) {
        setPitstops(
          data.indentsPitstopVO.map((p, index) => ({
            id: p.id,
            location: p.pitstop || "",
            sequence: p.sequence || index + 1
          }))
        );
      } else {
        setPitstops([{ id: 1, location: "", sequence: 1 }]);
      }

      // ---- Vendor Response ----
      if (data.vendorResponseVO?.length > 0) {
        setVehicleDetailsRows(
          data.vendorResponseVO.map((v) => ({
            id: v.id,
            lrNumber: v.lrNumber,
            vehicleNumber: v.vehicleNumber,
            driverNumber: v.driverNumber,
            driverName: v.driverName
          }))
        );
      } else {
        setVehicleDetailsRows([{ id: 1, lrNumber: "", vehicleNumber: "", driverNumber: "", driverName: "" }]);
      }

      // ---- Trips Linked ----
      // ---- Trips Linked ----
      if (data.tripsLinkedVO?.length > 0) {
        setTripDetailsRows(
          data.tripsLinkedVO.map((t) => ({
            id: t.id || Date.now(), // Use existing ID or generate new one
            trip: t.trips || "", // Map trips to trip
            origin: t.origin || "",
            destination: t.destination || "",
            vehicle: t.vechile || "", // Map vechile to vehicle
            status: t.status || "Pending"
          }))
        );
      } else {
        setTripDetailsRows([{
          id: Date.now(),
          trip: "",
          origin: "",
          destination: "",
          vehicle: "",
          status: "Pending"
        }]);
      }

      // ---- Trips Documents ----
      if (data.tripsDocumentsVO?.length > 0) {
        const tripDocsWithFiles = await Promise.all(
          data.tripsDocumentsVO.map(async (d) => {
            let fileObject = null;

            if (d.contractAttachment) {
              // Check if it's base64 data
              if (d.contractAttachment.startsWith('/9j/') ||
                d.contractAttachment.startsWith('data:image') ||
                d.contractAttachment.startsWith('iVBOR') ||
                d.contractAttachment.length > 1000) { // Likely base64 data

                fileObject = await createFileFromBase64(
                  d.contractAttachment,
                  `document_${d.id}.jpg`, // Default to jpg for base64 images
                  d.docType || 'Image'
                );
              } else if (d.contractAttachment.startsWith('http') || d.contractAttachment.startsWith('/')) {
                // It's a URL or file path
                fileObject = createFileObjectFromUrl(d.contractAttachment, d.docType || 'Document');
              }
            }

            return {
              id: d.id,
              docType: d.docType,
              remarks: d.remarks,
              trip: d.trip,
              vehicleNumber: d.vechileNumber,
              doc: d.docType || 'Document', // Use docType as display name
              file: fileObject
            };
          })
        );

        setTripDocsDetailsRows(tripDocsWithFiles);
      } else {
        setTripDocsDetailsRows([{ id: 1, docType: "", remarks: "", trip: "", vehicleNumber: "", doc: "", file: null }]);
      }

      console.log("✅ Form data populated successfully");

    } catch (err) {
      console.error("❌ Error loading indent:", err);
      toast.error("Failed to load indent details");
    }
  };

  const createFileFromBase64 = async (base64Data, fileName, docType) => {
    try {
      let imageData = base64Data;

      // If it's not a data URL, convert it
      if (!base64Data.startsWith('data:')) {
        imageData = `data:image/jpeg;base64,${base64Data}`;
      }

      // Fetch the base64 data and convert to blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Create file object
      const file = new File([blob], fileName, {
        type: blob.type || 'image/jpeg',
        lastModified: Date.now()
      });

      // Store base64 data for preview
      file.previewUrl = imageData;
      file.isBase64 = true;

      return file;
    } catch (error) {
      console.error('Error creating file from base64:', error);
      return null;
    }
  };

  const createFileObjectFromUrl = (fileUrl, fileName) => {
    if (!fileUrl) return null;

    // Create a file-like object
    const file = new File([], fileName || 'document', {
      type: getMimeTypeFromUrl(fileUrl)
    });

    // Add the URL as a property for preview
    file.previewUrl = fileUrl;
    file.isUrl = true;

    return file;
  };

  const getMimeTypeFromUrl = (url) => {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    return mimeTypes[extension] || 'application/octet-stream';
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer?.trim()) newErrors.customer = "Customer is required.";
    if (!formData.origin?.trim()) newErrors.origin = "Origin is required.";
    if (!formData.destination?.trim()) newErrors.destination = "Destination is required.";
    if (!formData.customerRate?.trim()) newErrors.customerRate = "Customer Rate is required.";
    if (!formData.vendorRateVehicles?.trim()) newErrors.vendorRateVehicles = "Vendor Rate is required.";

    if (
      formData.origin?.trim() &&
      formData.destination?.trim() &&
      formData.origin.trim().toLowerCase() === formData.destination.trim().toLowerCase()
    ) {
      newErrors.destination = "Origin and Destination cannot be the same.";
    }

    // if (!vehicleDetailsRows.vehicleNumber?.trim()) newErrors.vehicleNumber = "Vehicle Number is required.";
    // if (!vehicleDetailsRows.driverNumber?.trim()) newErrors.driverNumber = "Driver Number is required.";
    // if (!vehicleDetailsRows.driverName?.trim()) newErrors.driverName = "Driver Name is required.";

    // if (!tripDetailsRows.trips?.trim()) newErrors.trips = "Trips is required.";
    // if (!tripDetailsRows.origin?.trim()) newErrors.origin = "Origin is required.";
    // if (!tripDetailsRows.destination?.trim()) newErrors.destination = "Destination is required.";
    // if (!tripDetailsRows.vechile?.trim()) newErrors.vechile = "Vechile is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const transformDataForAPI = () => {
    const currentDate = new Date().toISOString().split('T')[0];

    const timeLineDTO = timelineRows
      .filter(row => row.event && row.time && row.user)
      .map(row => ({
        id: row.id || 0,
        event: row.event || "",
        time: row.time || "",
        user: row.user || ""
      }));

    const indentsParticipantsDTO = participantsRows
      .filter(row => row.vendor)
      .map(row => ({
        id: row.id || 0,
        vendor: row.vendor || "",
        vendorRate: row.vendorRate || "",
        ranks: row.rank || "",
        vendorResponse: row.vendorResponse || ""
      }));

    const indentsPitstopDTO = pitstops
      .filter(row => row.location)
      .map(row => ({
        id: row.id || 0,
        pitstop: row.location || "",
        sequence: row.sequence || 1
      }));

    const vendorResponseDTO = vehicleDetailsRows
      .filter(row => row.vehicleNumber)
      .map(row => ({
        id: row.id || 0,
        lrNumber: row.lrNumber || "",
        vehicleNumber: row.vehicleNumber || "",
        driverNumber: row.driverNumber || "",
        driverName: row.driverName || ""
      }));

    // FIXED: Include tripsLinkedDTO even if some fields are empty
    const tripsLinkedDTO = tripDetailsRows
      .filter(row => row.origin || row.destination || row.trip || row.vehicle || row.status) // Include if any field has data
      .map(row => ({
        id: row.id || 0, // Make sure to include the ID
        trips: row.trip || "", // Fixed: changed from row.trips to row.trip
        origin: row.origin || "",
        destination: row.destination || "",
        vechile: row.vehicle || "", // Fixed: changed from row.vechile to row.vehicle
        status: row.status || ""
      }));

    const tripsDocumentsDTO = tripDocsDetailsRows
      .filter(row => row.docType || row.remarks || row.trip || row.vehicleNumber) // Include if any field has data
      .map(row => ({
        id: row.id || 0,
        docType: row.docType || "",
        remarks: row.remarks || "",
        trip: row.trip || "",
        vechileNumber: row.vehicleNumber || "", // Fixed typo
        contractAttachment: null
      }));

    const payload = {
      createdBy: userName,
      customer: formData.customer || "",
      route: formData.route || "",
      customerRate: String(formData.customerRate || ""),
      destination: formData.destination || "",
      dockerNo: formData.dockerNo || "",
      extraInfo: formData.extraInfo || "",
      materialType: formData.materialType || "",
      numberOfVechicles: String(formData.numberOfVehicles || ""),
      orderType: formData.orderType || "",
      destinationPoc: formData.destinationPoc || "",
      originPoc: formData.originPoc || "",
      orgId: orgId,
      origin: formData.origin || "",
      overTimeHours: parseInt(formData.overtimeHours || 0),
      pitStop: Boolean(formData.addPitstop),
      placementDate: formData.placementDate || currentDate,
      status: formData.status || "Open",
      timeLineDTO: timeLineDTO.length > 0 ? timeLineDTO : [],
      indentsParticipantsDTO: indentsParticipantsDTO.length > 0 ? indentsParticipantsDTO : [],
      indentsPitstopDTO: indentsPitstopDTO.length > 0 ? indentsPitstopDTO : [],
      tripType: formData.tripType || "",
      tripsDocumentsDTO: tripsDocumentsDTO.length > 0 ? tripsDocumentsDTO : [],
      tripsLinkedDTO: tripsLinkedDTO.length > 0 ? tripsLinkedDTO : [], // This should now have data
      vechicleType: formData.vechicleType || "",
      vendorRank: parseInt(formData.vendorRank || participantsRows[0]?.rank || 0),
      vendorRateVehicles: String(formData.vendorRateVehicles || ""),
      vendorResponseDTO: vendorResponseDTO.length > 0 ? vendorResponseDTO : [],
      weight: String(formData.weight || "")
    };

    if (editingId) {
      payload.id = parseInt(editingId);
    }

    return payload;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill the required fields");
      return;
    }
    try {
      setIsSaving(true);

      const payload = transformDataForAPI();
      console.log("🔄 FINAL JSON PAYLOAD:", JSON.stringify(payload, null, 2));

      if (!payload.customer || !payload.origin || !payload.destination) {
        toast.error("Please fill in required fields: Customer, Origin, and Destination");
        return;
      }

      const formDataToSend = new FormData();

      formDataToSend.append(
        "indentsDTO",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      tripDocsDetailsRows.forEach((row, index) => {
        if (row.file) {
          formDataToSend.append("tripLinkedAttachment", row.file);
        }
      });

      const response = await indentAPI.createUpdateIndent(formDataToSend);
      console.log("✅ API Response:", response);

      if (response?.status === true || response?.data?.status === true) {
        toast.success(editingId ? "Indent updated successfully!" : "Indent created successfully!");
        setIsListView(true);
      } else {
        toast.error("Failed to save indent");
        console.error("Save issue:", response);
      }

    } catch (error) {
      console.error("❌ SAVE ERROR:", error);
      console.error("Error details:", error.response?.data);
      toast.error(error?.response?.data?.message || "Something went wrong while saving indent!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 shadow rounded-xl border p-6 transition dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsListView(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isSaving}
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingId ? "Edit Indent" : "New Indent"}
          </h2>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Tabs */}
      <TabComponent tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* TAB CONTENT */}
      <div className="mt-6">
        {activeTab === 0 && (
          <IndentDetailsTab
            formData={formData}
            setFormData={setFormData}
            onFormChange={handleFormChange}
            pitstops={pitstops}
            setPitstops={setPitstops}
            errors={errors}
          />
        )}

        {activeTab === 1 && (
          <IndentExtraInfoTab
            formData={formData}
            setFormData={setFormData}
            timelineRows={timelineRows}
            setTimelineRows={setTimelineRows}
            participantsRows={participantsRows}
            setParticipantsRows={setParticipantsRows}
            onFormChange={handleFormChange}
          />
        )}

        {activeTab === 2 && (
          <VendorResponse
            formData={formData}
            setFormData={setFormData}
            vehicleDetailsRows={vehicleDetailsRows}
            setVehicleDetailsRows={setVehicleDetailsRows}
            onFormChange={handleFormChange}
            errors={errors}
          />
        )}

        {activeTab === 3 && (
          <TripLinked
            formData={formData}
            setFormData={setFormData}
            tripDetailsRows={tripDetailsRows}
            setTripDetailsRows={setTripDetailsRows}
            onFormChange={handleFormChange}
            errors={errors}
          />
        )}

        {activeTab === 4 && (
          <TripsDocs
            formData={formData}
            setFormData={setFormData}
            tripDocsDetailsRows={tripDocsDetailsRows}
            setTripDocsDetailsRows={setTripDocsDetailsRows}
            onFormChange={handleFormChange}
          />
        )}
      </div>
    </div>
  );
};

export default IndentMaster;