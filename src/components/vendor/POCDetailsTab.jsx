import React from "react";
import InputField from "../UI/InputField";

const POCDetailsTab = ({ formData, setFormData, onFormChange, errors = {} }) => {
  const handleChange = (e) => {
    const { name } = e.target;
    let value = e.target.value;

    if (name === "pocNumber") {
      value = value.replace(/[^0-9]/g, "");
      value = value.slice(0, 10);
    }

    if (name === "pocEmail") {
      value = value.replace(/[^a-zA-Z0-9@._,\-]/g, "");
    }

    onFormChange(name, value);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-b-xl transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        POC Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <InputField
            label="POC Name"
            name="pocName"
            value={formData.pocName}
            onChange={handleChange}
            placeholder="Enter POC Name"
            compact
          />
          {errors.pocName && <p className="text-xs text-red-500 mt-1">{errors.pocName}</p>}
        </div>

        <div>
          <InputField
            label="POC Phone Number"
            name="pocNumber"
            value={formData.pocNumber}
            onChange={handleChange}
            placeholder="Enter POC Number"
            compact
          />
          {errors.pocNumber && <p className="text-xs text-red-500 mt-1">{errors.pocNumber}</p>}
        </div>

        <div>
          <InputField
            label="POC Email"
            name="pocEmail"
            value={formData.pocEmail}
            onChange={handleChange}
            placeholder="Enter POC Email"
            compact
          />
          {errors.pocEmail && <p className="text-xs text-red-500 mt-1">{errors.pocEmail}</p>}
        </div>
      </div>
    </div>
  );
};

export default POCDetailsTab;
