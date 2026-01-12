import { CheckCircle, Copy, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const AddressDisplay = ({ label, address }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const iconColor =
    label.toLowerCase() === "from"
      ? "text-green-500"
      : "text-red-500";

  return (
    <div className="w-full max-w-[520px]">
      {/* Compact Row */}
      <div className="flex items-center gap-2">
        <MapPin className={`h-4 w-4 shrink-0 ${iconColor}`} />

        <div className="flex-1 min-w-0">
          <div
            className="text-sm text-gray-900 dark:text-gray-200 truncate"
            title={address}
          >
            {address}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Expanded Inline View */}
      {expanded && (
        <div className="mt-2 ml-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 mb-1">{label}</p>

          <p className="text-sm text-gray-900 dark:text-gray-200 break-words">
            {address}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              {copied ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 dark:text-red-300 hover:underline"
            >
              Open in Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;
