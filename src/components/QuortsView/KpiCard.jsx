import React from "react";

const KpiCard = ({ icon: Icon, label, count, description, color }) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md 
      transition-all border border-gray-200 dark:border-gray-700">

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">
            {label}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 text-[11px] mt-1">{description}</p>
        </div>

        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/40`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>

      <div className={`mt-3 text-3xl font-bold text-${color}-700 dark:text-${color}-400`}>
        {count}
      </div>
    </div>
  );
};

export default KpiCard;
