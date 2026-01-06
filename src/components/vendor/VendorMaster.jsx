import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import TabComponent from "../common/TabComponent";
import BankDetailsTab from "./BankDetailsTab";
import OtherDetailsTab from "./OtherDetailsTab";
import POCDetailsTab from "./POCDetailsTab";
import VendorDetailsTab from "./VendorDetailsTab";
import VendorUsersTable from "./VendorUsersTable";
import { vendorAPI } from "../../api/vendorAPI";
import { toast } from "../../utils/toast";
import { useSelector } from "react-redux";

const VendorMaster = ({ setIsListView, editId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const [formData, setFormData] = useState({
    vendorCode: "",
    status: "Active",
    organization: "",
    primaryPhoneNumber: "",
    approvalStatus: "PENDING",
    primaryEmail: "",
    additionalPhoneNumber: "",
    additionalEmails: "",
    address: "",
    pocName: "",
    pocNumber: "",
    pocEmail: "",
    branch: "",
    branchCode: "",
    vendorType: "Regular",
    advancePercent: 0,
    creditPeriod: "",
    tdsPercent: 0,
    vendorSpotId: "",
    vendoruuid: "",
    tags: "All",
    active: true,
    orgId,
    createdBy: "",
  });

  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";

  const [vendorUserRows, setVendorUserRows] = useState([{ id: 1, users: "" }]);

  const [gstRows, setGstRows] = useState([{ id: 1, gst: "" }]);

  const [bankRows, setBankRows] = useState([
    { id: 1, accountNumber: "", ifsc: "", accountHolderName: "", bankName: "" }
  ]);

  const [vendorDetailsRows, setVendorDetailsRows] = useState([
    {
      id: 1,
      effectiveFrom: "",
      effectioveTo: "",
      contractAttachment: null,
      backgroundVerification: null,
      securityCheck: null,
      contractAttachmentName: "",
      backgroundVerificationName: "",
      securitycheckName: "",
    },
  ]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editId) {
      getVendorById(editId);
    }
  }, [editId]);

  const tabs = [
    { label: "Details" },
    { label: "POC Details" },
    { label: "Bank Details" },
    { label: "Other Details" },
    { label: "Users" },
  ];

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleClear = () => {
    setFormData({
      id: null,
      vendorCode: "",
      status: "Active",
      organization: "",
      primaryPhoneNumber: "",
      primaryEmail: "",
      additionalPhoneNumber: "",
      additionalEmails: "",
      address: "",
      pocName: "",
      pocNumber: "",
      pocEmail: "",
      branch: "",
      branchCode: "",
      vendorType: "Regular",
      advancePercent: 0,
      creditPeriod: "",
      tdsPercent: 0,
      vendorSpotId: "",
      vendoruuid: "",
      tags: "All",
      active: true,
      orgId,
      createdBy: userName,
    });

    setVendorDetailsRows([
      {
        id: 1,
        effectiveFrom: "",
        effectioveTo: "",
        contractAttachment: null,
        backgroundVerification: null,
        securityCheck: null,
        contractAttachmentName: "",
        backgroundVerificationName: "",
        securitycheckName: "",
      },
    ]);

    setVendorUserRows([{ id: 1, users: "" }]);
    setGstRows([{ id: 1, gst: "" }]);
    setBankRows([
      { id: 1, accountNumber: "", ifsc: "", accountHolderName: "", bankName: "" }
    ]);

    setActiveTab(0);
    setErrors({});
  };

  const getVendorById = async (id) => {
    try {
      const res = await vendorAPI.getVendorById(id);
      const vendor = res?.paramObjectsMap?.vendorVO;

      if (!vendor) {
        toast.error("Vendor not found");
        return;
      }

      setFormData({
        id: vendor.id || null,
        vendorCode: vendor.vendorCode || "",
        status: vendor.status || "Active",
        approvalStatus: vendor.approvalStatus || "PENDING", // Added this line
        organization: vendor.organization || "",
        primaryPhoneNumber: vendor.primaryPhoneNumber || "",
        primaryEmail: vendor.primaryEmail || "",
        additionalPhoneNumber: vendor.additionalPhoneNumber || "",
        additionalEmails: vendor.additionalEmails || "",
        address: vendor.address || "",
        pocName: vendor.pocName || "",
        pocNumber: vendor.pocNumber || "",
        pocEmail: vendor.pocEmail || "",
        branch: vendor.branch || "",
        branchCode: vendor.branchCode || "",
        vendorType: vendor.vendorType || "Regular",
        advancePercent: vendor.advancePercent || 0,
        creditPeriod: vendor.creditPeriod || "",
        tdsPercent: vendor.tdsPercent || 0,
        vendorSpotId: vendor.vendorSpotId || "",
        vendoruuid: vendor.vendoruuid || "",
        tags: vendor.tags || "All",
        active: vendor.cancel === false, // Changed from vendor.active to vendor.cancel
        orgId: vendor.orgId || orgId,
        createdBy: vendor.createdBy || userName,
      });

      // Handle GST Rows - NOTE: Field name is vendorGstVO not vendorGstDTO
      if (vendor.vendorGstVO && Array.isArray(vendor.vendorGstVO) && vendor.vendorGstVO.length > 0) {
        setGstRows(
          vendor.vendorGstVO.map((gst, index) => ({
            id: index + 1,
            gst: gst.gst || "",
          }))
        );
      } else {
        setGstRows([{ id: 1, gst: "" }]);
      }

      // Handle Bank Details - NOTE: Field name is vendorBankDetailsVO not vendorBankDetailsDTO
      if (vendor.vendorBankDetailsVO && Array.isArray(vendor.vendorBankDetailsVO) && vendor.vendorBankDetailsVO.length > 0) {
        setBankRows(
          vendor.vendorBankDetailsVO.map((bank, index) => ({
            id: index + 1,
            accountNumber: bank.accountNumber || "",
            ifsc: bank.ifsc || "",
            accountHolderName: bank.accountHolderName || "",
            bankName: bank.bankName || "",
          }))
        );
      } else {
        setBankRows([
          { id: 1, accountNumber: "", ifsc: "", accountHolderName: "", bankName: "" }
        ]);
      }

      // Handle Vendor Details - NOTE: Field name is vendorDetailsVO not vendorDetailsDTO
      if (vendor.vendorDetailsVO && Array.isArray(vendor.vendorDetailsVO) && vendor.vendorDetailsVO.length > 0) {
        setVendorDetailsRows(
          vendor.vendorDetailsVO.map((row, index) => ({
            id: index + 1,
            effectiveFrom: row.effectiveFrom || "",
            effectioveTo: row.effectioveTo || "",
            contractAttachmentName: row.contractAttachmentName || "",
            backgroundVerificationName: row.backgroundVerificationName || "",
            securitycheckName: row.securitycheckName || "",
            // These will be null for existing files that are already uploaded
            contractAttachment: null,
            backgroundVerification: null,
            securityCheck: null,
          }))
        );
      } else {
        setVendorDetailsRows([
          {
            id: 1,
            effectiveFrom: "",
            effectioveTo: "",
            contractAttachment: null,
            backgroundVerification: null,
            securityCheck: null,
            contractAttachmentName: "",
            backgroundVerificationName: "",
            securitycheckName: "",
          },
        ]);
      }

      // Handle Vendor Users - NOTE: Field name is vendorUsersVO not vendorUsersDTO
      if (vendor.vendorUsersVO && Array.isArray(vendor.vendorUsersVO) && vendor.vendorUsersVO.length > 0) {
        setVendorUserRows(
          vendor.vendorUsersVO.map((u, index) => ({
            id: index + 1,
            users: u.users || "",
          }))
        );
      } else {
        setVendorUserRows([{ id: 1, users: "" }]);
      }
    } catch (error) {
      console.error("Error loading vendor:", error);
      toast.error("Failed to load vendor details");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    if (!formData.primaryPhoneNumber.trim()) {
      newErrors.primaryPhoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.primaryPhoneNumber.trim())) {
      newErrors.primaryPhoneNumber = "Phone number must be exactly 10 digits";
    }

    if (!formData.primaryEmail.trim()) {
      newErrors.primaryEmail = "Primary email is required";
    } else if (!emailRegex.test(formData.primaryEmail.trim())) {
      newErrors.primaryEmail = "Enter a valid email address";
    }

    if (formData.additionalPhoneNumber?.trim()) {
      let phones = formData.additionalPhoneNumber.split(",").map(p => p.trim());
      for (let p of phones) {
        if (!phoneRegex.test(p)) {
          newErrors.additionalPhoneNumber =
            `Invalid phone number "${p}". Must be 10 digits.`;
        }
      }
    }

    if (formData.additionalEmails?.trim()) {
      let emails = formData.additionalEmails.split(",").map(e => e.trim());
      for (let e of emails) {
        if (!emailRegex.test(e)) {
          newErrors.additionalEmails = `Invalid email "${e}".`;
        }
      }
    }

    if (formData.pocNumber?.trim()) {
      if (!phoneRegex.test(formData.pocNumber.trim())) {
        newErrors.pocNumber = "POC number must be 10 digits";
      }
    }

    if (formData.pocEmail?.trim()) {
      if (!emailRegex.test(formData.pocEmail.trim())) {
        newErrors.pocEmail = "Enter a valid POC email";
      }
    }

    // Validate GST rows
    const gstErrors = {};
    gstRows.forEach((row, index) => {
      if (row.gst?.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(row.gst.trim())) {
        gstErrors[index] = "Invalid GST format";
      }
    });
    if (Object.keys(gstErrors).length > 0) {
      newErrors.gstRows = gstErrors;
    }

    // Validate Bank rows
    const bankErrors = {};
    bankRows.forEach((row, index) => {
      const rowErr = {};
      if (row.accountNumber?.trim() && !/^[0-9]{9,18}$/.test(row.accountNumber.trim())) {
        rowErr.accountNumber = "Invalid account number";
      }
      if (row.ifsc?.trim() && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(row.ifsc.trim())) {
        rowErr.ifsc = "Invalid IFSC code";
      }
      if (Object.keys(rowErr).length > 0) {
        bankErrors[index] = rowErr;
      }
    });
    if (Object.keys(bankErrors).length > 0) {
      newErrors.bankRows = bankErrors;
    }

    const detailErrors = {};
    vendorDetailsRows.forEach((row, index) => {
      const rowErr = {};

      if (!row.effectiveFrom) rowErr.effectiveFrom = "Required";
      if (!row.effectioveTo) rowErr.effectioveTo = "Required";

      if (row.effectiveFrom && row.effectioveTo) {
        if (new Date(row.effectioveTo) < new Date(row.effectiveFrom)) {
          rowErr.effectioveTo = "End date must be after start date";
        }
      }

      if (Object.keys(rowErr).length > 0) {
        detailErrors[index] = rowErr;
      }
    });

    if (Object.keys(detailErrors).length > 0) {
      newErrors.vendorDetailsRows = detailErrors;
    }

    const userErrors = {};
    vendorUserRows.forEach((u, idx) => {
      if (!u.users?.trim()) userErrors[idx] = "Select a user";
    });

    if (Object.keys(userErrors).length > 0) {
      newErrors.vendorUserRows = userErrors;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Fix all validation errors before saving");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    try {
      if (!validateForm()) return;

      // Prepare main payload
      const payload = {
        vendorCode: formData.vendorCode,
        status: formData.status,
        organization: formData.organization,
        primaryPhoneNumber: formData.primaryPhoneNumber,
        primaryEmail: formData.primaryEmail,
        additionalPhoneNumber: formData.additionalPhoneNumber || "",
        additionalEmails: formData.additionalEmails || "",
        address: formData.address || "",
        pocName: formData.pocName || "",
        pocNumber: formData.pocNumber || "",
        pocEmail: formData.pocEmail || "",
        branch: formData.branch || "",
        branchCode: formData.branchCode || "",
        createdBy: userName,
        orgId: orgId,
        vendorType: formData.vendorType,
        advancePercent: Number(formData.advancePercent),
        creditPeriod: formData.creditPeriod || "",
        tdsPercent: Number(formData.tdsPercent),
        vendorSpotId: formData.vendorSpotId || "",
        vendoruuid: formData.vendoruuid || "",
        tags: formData.tags || "",
        active: formData.active,

        // Arrays as per new format
        vendorGstDTO: gstRows
          .filter(row => row.gst?.trim())
          .map(row => ({
            gst: row.gst.trim()
          })),

        vendorBankDetailsDTO: bankRows
          .filter(row => row.accountNumber?.trim() || row.ifsc?.trim() || row.accountHolderName?.trim() || row.bankName?.trim())
          .map(row => ({
            accountHolderName: row.accountHolderName || "",
            accountNumber: row.accountNumber || "",
            bankName: row.bankName || "",
            ifsc: row.ifsc || ""
          })),

        vendorDetailsDTO: vendorDetailsRows.map((row) => ({
          effectiveFrom: row.effectiveFrom,
          effectioveTo: row.effectioveTo,
          contractAttachmentName: row.contractAttachmentName || "",
          backgroundVerificationName: row.backgroundVerificationName || "",
          securitycheckName: row.securitycheckName || "",
        })),

        vendorUsersDTO: vendorUserRows
          .filter(u => u.users?.trim())
          .map((u) => ({
            id: u.id || 0,
            users: u.users.trim()
          })),
      };

      if (formData.id) {
        payload.id = formData.id;
      }

      // Remove empty arrays
      if (payload.vendorGstDTO.length === 0) delete payload.vendorGstDTO;
      if (payload.vendorBankDetailsDTO.length === 0) delete payload.vendorBankDetailsDTO;
      if (payload.vendorUsersDTO.length === 0) delete payload.vendorUsersDTO;

      const saveRes = await vendorAPI.createUpdateVendor(payload);

      if (!saveRes?.status) {
        toast.error("Vendor save failed");
        return;
      }

      const vendorId = saveRes.paramObjectsMap?.vendorVO?.id;
      if (!vendorId) {
        toast.error("Vendor saved but ID missing.");
        return;
      }

      // Upload files if any
      const hasFiles = vendorDetailsRows.some(row =>
        row.contractAttachment || row.backgroundVerification || row.securityCheck
      );

      if (hasFiles) {
        const fd = new FormData();
        fd.append("vendorId", vendorId);
        fd.append("createdBy", userName);

        const fileRow = vendorDetailsRows[0];

        if (fileRow.contractAttachment) {
          fd.append("contractAttachment", fileRow.contractAttachment);
        }
        if (fileRow.backgroundVerification) {
          fd.append("backgroundVerification", fileRow.backgroundVerification);
        }
        if (fileRow.securityCheck) {
          fd.append("securityCheck", fileRow.securityCheck);
        }

        const fileRes = await vendorAPI.uploadVendorDocuments(fd);

        if (fileRes?.status === true) {
          toast.success("Vendor & documents uploaded successfully!");
        } else {
          toast.warning("Vendor saved, but documents upload failed!");
        }
      } else {
        toast.success("Vendor saved successfully!");
      }

      handleClear();
      setIsListView(true);
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Save Error: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow rounded-xl border p-6 transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsListView(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editId ? "Edit Vendor" : "New Vendor"}
          </h2>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>

      {/* Tabs */}
      <TabComponent tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* TAB CONTENT */}
      <div className="mt-6">
        {activeTab === 0 && (
          <VendorDetailsTab
            formData={formData}
            setFormData={setFormData}
            onFormChange={handleFormChange}
            gstRows={gstRows}
            setGstRows={setGstRows}
            vendorDetailsRows={vendorDetailsRows}
            setVendorDetailsRows={setVendorDetailsRows}
            errors={errors}
          />
        )}

        {activeTab === 1 && (
          <POCDetailsTab
            formData={formData}
            setFormData={setFormData}
            onFormChange={handleFormChange}
            errors={errors}
          />
        )}

        {activeTab === 2 && (
          <BankDetailsTab
            formData={formData}
            setFormData={setFormData}
            bankRows={bankRows}
            setBankRows={setBankRows}
            onFormChange={handleFormChange}
            errors={errors}
          />
        )}

        {activeTab === 3 && (
          <OtherDetailsTab
            formData={formData}
            setFormData={setFormData}
            onFormChange={handleFormChange}
            errors={errors}
          />
        )}

        {activeTab === 4 && (
          <VendorUsersTable
            vendorUserRows={vendorUserRows}
            setVendorUserRows={setVendorUserRows}
            errors={errors}
          />
        )}
      </div>
    </div>
  );
};

export default VendorMaster;