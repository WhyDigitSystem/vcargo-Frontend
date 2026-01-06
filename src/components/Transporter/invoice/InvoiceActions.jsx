// components/invoices/InvoiceActions.jsx
import { MoreVertical, Eye, Download, Printer, Mail, Edit, Trash2, CheckCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const InvoiceActions = ({ 
  invoice, 
  onView, 
  onDownload, 
  onPrint, 
  onEdit, 
  onDelete, 
  onMarkPaid,
  onSend 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actionItems = [
    { icon: Eye, label: "View", onClick: onView },
    { icon: Download, label: "Download", onClick: onDownload },
    { icon: Printer, label: "Print", onClick: onPrint },
    { icon: Mail, label: "Send Email", onClick: onSend },
    { icon: Edit, label: "Edit", onClick: onEdit },
    ...(invoice.status === "pending" ? [
      { icon: CheckCircle, label: "Mark as Paid", onClick: onMarkPaid }
    ] : []),
    { icon: Trash2, label: "Delete", onClick: onDelete, danger: true }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {actionItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  item.danger 
                    ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" 
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InvoiceActions;