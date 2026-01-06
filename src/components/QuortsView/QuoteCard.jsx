import {
  BadgeCheck,
  CheckCircle,
  Eye,
  Gavel,
  Package,
  Truck,
} from "lucide-react";
import AddressDisplay from "./AddressDisplay";

const QuoteCard = ({ auction, quotes, onView }) => {
  const isSelected = auction?.quotes === true; // quote approved

  console.log("Action==>", auction);

  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden border 
        shadow-md transition-all duration-300 
        ${
          isSelected
            ? "border-green-500 shadow-green-300/40 bg-green-50 dark:bg-green-900/20"
            : "border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1"
        }
      `}
    >
      {/* =======================
          GOLD APPROVED BADGE
      ======================== */}
      {isSelected && (
        <div
          className="absolute top-3 right-3 px-3 py-1.5 rounded-full 
            bg-yellow-400 text-yellow-900 font-semibold text-xs flex items-center gap-1 
            shadow-md"
        >
          <BadgeCheck className="h-4 w-4" />
          Approved
        </div>
      )}

      {/* =======================
          HEADER - COLOR BLOCK
      ======================== */}
      <div
        className={`
          px-5 py-4 flex justify-between items-center
          ${
            isSelected
              ? "bg-green-600 dark:bg-green-500"
              : "bg-blue-600 dark:bg-blue-500"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-white" />
          <h3 className="text-white font-semibold text-lg">
            Auction #{auction.id}
          </h3>
        </div>

        <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white">
          {quotes.length} Quotes
        </span>
      </div>

      {/* Selected Vendor Label */}
      {isSelected && (
        <p className="px-5 pt-2 text-sm text-green-800 dark:text-green-200 font-medium">
          Selected Vendor:{" "}
          <span className="font-semibold">
            {auction?.approvedVendor?.organization || "Vendor Not Specified"}
          </span>
        </p>
      )}

      {/* =======================
          BODY SECTION
      ======================== */}
      <div className="px-5 py-6 space-y-5 bg-white dark:bg-gray-900">
        {/* MATERIAL */}
        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {auction.material}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {auction.materialQuantity} {auction.weightUnit}
            </p>
          </div>
        </div>

        {/* VEHICLE */}
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {auction.vehicle} • {auction.vehicleQuantity} units
          </p>
        </div>

        {/* ROUTE */}
        <div className="space-y-4">
          <div className="space-y-4">
            <AddressDisplay label="From" address={auction.loading} />
            <AddressDisplay label="To" address={auction.unloading} />
          </div>
        </div>
      </div>

      {/* =======================
          FOOTER BUTTON
      ======================== */}
      <div className="px-5 pb-5">
        {isSelected ? (
          <div
            className="
            mt-2 w-full py-2.5 rounded-lg bg-green-600 text-white 
            font-semibold flex items-center justify-center gap-2 shadow-md
          "
          >
            <CheckCircle className="h-4 w-4" />
            Quote Selected
          </div>
        ) : (
          <button
            onClick={onView}
            className="
            mt-2 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 
            dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold 
            flex items-center justify-center gap-2 transition-all shadow-sm
          "
          >
            <Eye className="h-4 w-4" />
            Compare Quotes
          </button>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;
