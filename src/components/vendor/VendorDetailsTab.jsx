import InputField from "../UI/InputField";
import ContractHistoryTable from "./ContractHistoryTable";
import { Plus, Trash2 } from "lucide-react"; // Add this import

const VendorDetailsTab = ({
  formData,
  setFormData,
  onFormChange,
  vendorDetailsRows,
  setVendorDetailsRows,
  setGstRows,
  gstRows,
  errors = {},
  rows = [],
  updateTimelineRow,
  removeTimelineRow,
}) => {
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "primaryPhoneNumber") {
      value = value.replace(/[^0-9]/g, "");
      value = value.slice(0, 10);
    }

    if (name === "additionalPhoneNumber") {
      value = value.replace(/[^0-9,]/g, "");
      value = value.slice(0, 10);
    }

    if (name === "primaryEmail" || name === "additionalEmails") {
      value = value.replace(/[^a-zA-Z0-9@._,\-]/g, "");
    }

    if (name === "gst") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      value = value.slice(0, 15);
    }

    onFormChange(name, value);
  };

  // Add a handler for the GST input in the table if updateTimelineRow is not provided
  const handleGSTChange = (rowId, newValue) => {
    // Clean the GST value
    let cleanedValue = newValue.toUpperCase().replace(/[^A-Z0-9]/g, "");
    cleanedValue = cleanedValue.slice(0, 15);

    if (updateTimelineRow) {
      updateTimelineRow(rowId, "gst", cleanedValue);
    }
  };

  const addTimelineRow = () => {
    const newRow = {
      id: Date.now(),
      gst: "",
    };

    if (setVendorDetailsRows) {
      setVendorDetailsRows(prev => [...prev, newRow]);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-b-xl transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <InputField
          label="Code"
          value={formData.vendorCode}
          name="vendorCode"
          placeholder="Enter Vendor Code"
          onChange={handleChange}
          compact
        />

        <div>
          <InputField
            label="Organization"
            required
            name="organization"
            value={formData.organization}
            placeholder="Enter Organization"
            onChange={handleChange}
            compact
          />
          {errors.organization && (
            <p className="text-xs text-red-500 mt-1">{errors.organization}</p>
          )}
        </div>

        <InputField
          label="Approval Status"
          value={formData.approvalStatus}
          name="approvalStatus"
          disabled
          compact
        />

        <div>
          <InputField
            label="Primary Phone Number"
            required
            name="primaryPhoneNumber"
            value={formData.primaryPhoneNumber}
            onChange={handleChange}
            placeholder="+91-9876543210"
            compact
          />
          {errors.primaryPhoneNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.primaryPhoneNumber}</p>
          )}
        </div>

        <div>
          <InputField
            label="Primary Email"
            required
            name="primaryEmail"
            value={formData.primaryEmail}
            onChange={handleChange}
            placeholder="test@example.com"
            compact
          />
          {errors.primaryEmail && (
            <p className="text-xs text-red-500 mt-1">{errors.primaryEmail}</p>
          )}
        </div>

        <div>
          <InputField
            label="Additional Phone Numbers"
            name="additionalPhoneNumber"
            value={formData.additionalPhoneNumber}
            onChange={handleChange}
            placeholder="+91-9876545654"
            compact
          />
          {errors.additionalPhoneNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.additionalPhoneNumber}</p>
          )}
        </div>

        <div>
          <InputField
            label="Additional Emails"
            name="additionalEmails"
            value={formData.additionalEmails}
            onChange={handleChange}
            placeholder="test@example.com"
            compact
          />
          {errors.additionalEmails && (
            <p className="text-xs text-red-500 mt-1">{errors.additionalEmails}</p>
          )}
        </div>

        <InputField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter full address"
          compact
        />

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* GST Table Section */}
      <div>
        {/* GST Table Section */}
        <div className="mt-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-3 py-2 w-10"></th>
                <th className="px-3 py-2 w-10">No.</th>
                <th className="px-3 py-2">GST</th>
                <th className="px-3 py-2 w-16 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800">
              {gstRows.map((row, index) => (
                <tr key={row.id} className="border-t border-gray-200 dark:border-gray-700">

                  <td className="px-3 py-2"></td>

                  <td className="px-3 py-2 dark:text-gray-300">{index + 1}</td>

                  <td className="px-3 py-1">
                    <input
                      type="text"
                      value={row.gst}
                      onChange={(e) =>
                        setGstRows(prev =>
                          prev.map(r =>
                            r.id === row.id ? { ...r, gst: e.target.value } : r
                          )
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter GST number"
                    />
                  </td>

                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() =>
                        setGstRows(prev => prev.filter(r => r.id !== row.id))
                      }
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Add Row Button */}
        <button
          onClick={() =>
            setGstRows(prev => [...prev, { id: Date.now(), gst: "" }])
          }
          className="mt-3 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md flex items-center gap-2"
        >
          <Plus className="h-2 w-3" /> Add Row
        </button>

      </div>

      <br />
      <ContractHistoryTable
        vendorDetailsRows={vendorDetailsRows}
        setVendorDetailsRows={setVendorDetailsRows}
        errors={errors.vendorDetailsRows}
      />
    </div>
  );
};

export default VendorDetailsTab;