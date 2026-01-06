// components/invoices/InvoiceStatusBadge.jsx
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";

const InvoiceStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      paid: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-800 dark:text-emerald-300",
        icon: <CheckCircle className="h-4 w-4" />,
        label: "Paid"
      },
      pending: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-800 dark:text-amber-300",
        icon: <Clock className="h-4 w-4" />,
        label: "Pending"
      },
      overdue: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300",
        icon: <AlertCircle className="h-4 w-4" />,
        label: "Overdue"
      },
      draft: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300",
        icon: <FileText className="h-4 w-4" />,
        label: "Draft"
      }
    };
    
    return configs[status] || configs.draft;
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default InvoiceStatusBadge;