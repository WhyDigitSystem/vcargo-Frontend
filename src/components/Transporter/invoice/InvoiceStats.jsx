// components/invoices/InvoiceStats.jsx
import { DollarSign, FileText, Clock, AlertCircle } from "lucide-react";

const InvoiceStats = ({ stats }) => {
  const getIcon = (label) => {
    switch (label) {
      case "Total Revenue":
        return <DollarSign className="h-6 w-6" />;
      case "Pending":
        return <Clock className="h-6 w-6" />;
      case "Overdue":
        return <AlertCircle className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              {getIcon(stat.label)}
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className={`text-sm font-medium ${stat.color}`}>
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceStats;