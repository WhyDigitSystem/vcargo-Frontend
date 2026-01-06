import { CheckCircle, Copy, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AddressDisplay = ({ label, address }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Check if overflowing one line
    const isOverflowing = el.scrollWidth > el.clientWidth;
    setIsTruncated(isOverflowing);
  }, [address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Icon color by direction
  const iconColor =
    label.toLowerCase() === "from"
      ? "text-green-600 dark:text-green-300"
      : "text-red-600 dark:text-red-300";

  return (
    <div className="flex items-start gap-3">
      <MapPin className={`h-5 w-5 mt-1 ${iconColor}`} />

      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>

        {/* Address */}
        <div
          ref={textRef}
          className={`text-sm text-gray-800 dark:text-gray-200 max-w-xs 
            ${expanded ? "" : "truncate"} 
          `}
        >
          {address}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1 text-xs">
          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>

          {/* Google Maps */}
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

          {/* Expand/Collapse ONLY if text was truncated */}
          {isTruncated && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 dark:text-gray-400 hover:underline"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressDisplay;
