import React from "react";
import InputField from "../UI/InputField";

const OtherDetailsTab = ({ formData, setFormData, onFormChange, errors = {} }) => {

  const tdsOptions = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-b-xl transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Other Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Vendor Type
          </label>
          <select
            name="vendorType"
            value={formData.vendorType}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
          >
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
            <option value="Seasonal">Seasonal</option>
          </select>
          {errors.vendorType && <p className="text-xs text-red-500 mt-1">{errors.vendorType}</p>}
        </div>

        <InputField
          label="Advance Percent"
          name="advancePercent"
          value={formData.advancePercent}
          onChange={handleChange}
          placeholder="0"
          type="number"
          step="0.01"
          compact
        />

        <InputField
          label="Credit Period"
          name="creditPeriod"
          value={formData.creditPeriod}
          onChange={handleChange}
          placeholder="Enter credit period"
          compact
        />

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            TDS Percent
          </label>
          <select
            name="tdsPercent"
            value={formData.tdsPercent}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
          >
            {tdsOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <InputField
          label="Vendor Spot ID"
          name="vendorSpotId"
          value={formData.vendorSpotId}
          onChange={handleChange}
          placeholder="Enter vendor spot ID"
          compact
        />

        <InputField
          label="Vendor UUID"
          name="vendoruuid"
          value={formData.vendoruuid}
          onChange={handleChange}
          placeholder="Enter vendor UUID"
          compact
        />

        <div className="md:col-span-1">
          <InputField
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="All"
            compact
          />
        </div>

        <InputField
          label="Branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          placeholder="Enter branch"
          compact
        />

        <InputField
          label="Branch Code"
          name="branchCode"
          value={formData.branchCode}
          onChange={handleChange}
          placeholder="Enter branch code"
          compact
        />
      </div>
    </div>
  );
};

export default OtherDetailsTab;
