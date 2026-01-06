import { useEffect, useState } from "react";
import TabComponent from "../common/TabComponent";
import { ArrowLeft } from "lucide-react";

// Import tab components
import BasicDetailsTab from "./BasicDetailsTab";
import ExtraInfoTab from "./ExtraInfoTab";
import VerificationTab from "./VerificationTab";
import { toast } from "../../utils/toast";
import { tripAPI } from "../../api/tripAPI";
import { useSelector } from "react-redux";
// import TimelineTab from "./tabs/TimelineTab";
// import DocumentsTab from "./tabs/DocumentsTab";

const TripMaster = ({ setIsListView, editId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [directions, setDirections] = useState(null);
  const [clearCounter, setClearCounter] = useState(0);
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
  const [errors, setErrors] = useState({});
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const [form, setForm] = useState({
    vendor: "",
    customer: "",
    lrNumber: "",
    vehicleNumber: "",
    route: "",
    roundTrip: false,
    addPitstops: false,
    origin: "",
    destination: "",
    driverNumber: "",
    driverName: "",
    tatDays: "",
    branch: "",
    status: "Driver Consent Pending",
    createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    eta: "",
    materialType: "",
    vehicleType: "",
    vehicleTonnageCapacity: "0.000",
    vehicleSqftCapacity: "",
    materialSqft: "",
    weightTon: "",
  });

  const [verificationDetailsRows, setVerificationDetailsRows] = useState([
    { id: Date.now(), field: "", value: "" }
  ]);

  const [pitStopDetailsRows, setPitStopDetailsRows] = useState([
    { id: Date.now(), pitstop: "" }
  ]);

  useEffect(() => {
    if (editId) {
      getTripById(editId);
    }
  }, [editId]);

  const handleClear = () => {
    setForm({
      vendor: "",
      customer: "",
      lrNumber: "",
      vehicleNumber: "",
      route: "",
      roundTrip: false,
      addPitstops: false,
      origin: "",
      destination: "",
      driverNumber: "",
      driverName: "",
      tatDays: "",
      branch: "",
      status: "Driver Consent Pending",
      createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      eta: "",
      materialType: "",
      vehicleType: "",
      vehicleTonnageCapacity: "0.000",
      vehicleSqftCapacity: "",
      materialSqft: "",
      weightTon: "",
    });

    setPitStopDetailsRows([]);
    setDirections(null);

    setVerificationDetailsRows([
      { id: Date.now(), field: "", value: "" }
    ]);
    setPitStopDetailsRows([
      { id: Date.now(), pitstop: "" }
    ]);

    setClearCounter((prev) => prev + 1); // ⬅ Trigger clear in child
    setActiveTab(0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    // 🔥 Allow only digits, prevent more than 10 digits
    if (name === "driverNumber") {
      newValue = newValue.replace(/[^0-9]/g, ""); // remove non-numeric
      newValue = newValue.slice(0, 10);           // enforce max 10 digits
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,  // 🔥 FIXED
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getTripById = async (id) => {
    try {
      const response = await tripAPI.getTripById(id);

      const data = response?.paramObjectsMap?.tripsVO;
      if (!data) {
        toast.error("No trip data found!");
        return;
      }

      // 🟦 Set Form Values
      const updatedForm = {
        id: data.id || "",
        vendor: data.vendor || "",
        customer: data.customer || "",
        lrNumber: data.lrNumber || "",
        vehicleNumber: data.vehicleNumber || "",
        route: data.route || "",
        roundTrip: data.routeTrip || false,
        addPitstops: data.pitStop || false,
        origin: data.origin || data.orgin || "", // 🔥 FIX: Handle both spellings
        destination: data.destination || "",
        driverNumber: data.driverNumber || "",
        driverName: data.driverName || "",
        tatDays: data.tatDays || "",
        branch: data.branch || "",
        status: data.status || "",
        createdAt: data.commonDate?.createdon || "",
        eta: data.eta || "",
        materialType: data.materialType || "",
        vehicleType: data.vehicleType || "",
        vehicleTonnageCapacity: data.vehicleTonnageCapacity || "",
        vehicleSqftCapacity: data.vehicleSqFt || "",
        materialSqft: data.materialSqFt || "",
        weightTon: data.weight || "",
        orgId: data.orgId || 0,
        branchCode: data.branchCode || "",
      };

      setForm(updatedForm);

      // 🟩 Load Pitstops
      if (data.pitStop && Array.isArray(data.tripsPitStopVO)) {
        const stops = data.tripsPitStopVO.map((p) => ({
          id: p.id,
          name: p.pitstop || "",   // <-- FIXED HERE
        }));
        setPitStopDetailsRows(stops);
      } else {
        setPitStopDetailsRows([]);
      }

      const formattedVerifications = (data.tripsDLVerificationVO || []).map((v) => ({
        id: v.id,
        field: v.field,
        value: v.value,
      }));

      setVerificationDetailsRows(
        formattedVerifications.length > 0
          ? formattedVerifications
          : [{ id: Date.now(), field: "", value: "" }]
      );

      toast.success("Trip loaded successfully!");

    } catch (err) {
      console.error("GET TRIP ERROR:", err);
      toast.error("Failed to load trip!");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.vendor.trim()) newErrors.vendor = "Vendor is required";
    if (!form.customer.trim()) newErrors.customer = "Customer is required";
    if (!form.origin.trim()) newErrors.origin = "Origin is required";
    if (!form.destination.trim()) newErrors.destination = "Destination is required";
    if (!form.driverNumber.trim()) newErrors.driverNumber = "Driver number is required";
    if (!form.vehicleType.trim()) newErrors.vehicleType = "Vehicle type is required";

    if (form.driverNumber && !/^[0-9]{10}$/.test(form.driverNumber)) {
      newErrors.driverNumber = "Driver number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill the required fields");
      return;
    }
    try {
      const payload = {
        branch: form.branch || "",
        branchCode: form.branchCode || "",
        createdBy: userName || "",
        customer: form.customer || "",
        destination: form.destination || "",
        orgin: form.origin || "",
        driverName: form.driverName || "",
        driverNumber: form.driverNumber || "",
        eta: form.eta || "",
        lrNumber: form.lrNumber || "",
        materialSqFt: form.materialSqft || "",
        materialType: form.materialType || "",
        orgId: orgId,
        overTimeHours: form.overTimeHours || "",
        pitStop: form.addPitstops === true,
        routeTrip: form.roundTrip === true,
        route: form.route || `${form.origin} - ${form.destination}`,
        status: form.status || "Driver Consent Pending",
        tatDays: form.tatDays || "",

        tripsDLVerificationDTO: verificationDetailsRows.map(row => ({
          field: row.field || "",
          value: row.value || ""
        })),

        tripsPitStopDTO: pitStopDetailsRows.map(stop => ({
          pitstop: stop.name || ""
        })),

        vehicleNumber: form.vehicleNumber || "",
        vehicleTonnageCapacity: form.vehicleTonnageCapacity || "",
        vehicleType: form.vehicleType || "",
        vendor: form.vendor || "",
        weight: form.weightTon || ""
      };

      // Only main Trip ID
      if (form.id) {
        payload.id = form.id;
      }

      const response = await tripAPI.createUpdateTrip(payload);

      if (response?.statusFlag === "Ok") {
        toast.success(form.id ? "Trip updated successfully!" : "Trip created successfully!");
        setIsListView(true);
      } else {
        toast.error("Failed to save trip!");
      }

    } catch (error) {
      console.error("SAVE ERROR:", error);
      toast.error("Error while saving trip!");
    }
  };

  const tabs = [
    { label: "Basic Details" },
    { label: "Extra Info" },
    { label: "Verification" },
    { label: "Timeline" },
    { label: "Documents" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <BasicDetailsTab
            form={form}
            setForm={setForm}
            handleChange={handleChange}
            pitstops={pitStopDetailsRows}
            setPitstops={setPitStopDetailsRows}
            directions={directions}
            setDirections={setDirections}
            clearCounter={clearCounter}
            errors={errors}
          />
        );
      case 1:
        return (
          <ExtraInfoTab
            form={form}
            setForm={setForm}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <VerificationTab
            verificationDetailsRows={verificationDetailsRows}
            setVerificationDetailsRows={setVerificationDetailsRows}
          />
        );
      case 3:
      // return <DocumentsTab />;
      case 4:
      // return <TimelineTab />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-5 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsListView(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              New Trips
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg"
            >
              Clear Form
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>

        {/* Tabs */}
        <TabComponent
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}

export default TripMaster;