import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Star,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { quoteAPI } from "../../api/quoteAPI";
import { toast } from "../../utils/toast";

const AuctionModal = ({ auction, quotes, onClose, onQuoteApproved }) => {
  const [sortBy, setSortBy] = useState("recommended");
  const [confirmPopup, setConfirmPopup] = useState({
    open: false,
    quoteId: null,
  });

  const formatCurrency = (n) => `₹${n?.toLocaleString("en-IN")}`;

  const sortQuotes = (list, type) => {
    const arr = [...list];
    switch (type) {
      case "priceLow":
        return arr.sort((a, b) => a.quoteAmount - b.quoteAmount);
      case "priceHigh":
        return arr.sort((a, b) => b.quoteAmount - a.quoteAmount);
      case "fastest":
        return arr.sort(
          (a, b) =>
            new Date(a.estimatedDeliveryDate) -
            new Date(b.estimatedDeliveryDate)
        );
      case "rating":
        return arr.sort(
          (a, b) => (b.user?.rating || 0) - (a.user?.rating || 0)
        );
      default:
        return arr.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
  };

  const sortedQuotes = useMemo(
    () => sortQuotes(quotes, sortBy),
    [quotes, sortBy]
  );

  const recommended = sortedQuotes[0];
  const lowestPrice = Math.min(...quotes.map((q) => q.quoteAmount));

  const handleSelectAttempt = (quoteId) => {
    setConfirmPopup({ open: true, quoteId });
  };

 const confirmSelection = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const actionBy = user?.userName || "System";

  try {
    const payload = {
      action: "Approved",
      actionBy,
      auctionId: auction.id,
      quotesId: confirmPopup.quoteId,
    };

    const res = await quoteAPI.createApprovalQuote(payload);

    // Check response validity
    if (!res || !res.status || res.status >= 400) {
      throw new Error("Invalid response from server");
    }

    toast.success("Quote approved successfully!");

    // Close modal, refresh data
    setConfirmPopup({ open: false, quoteId: null });
    if (onQuoteApproved) onQuoteApproved();
    onClose();

  } catch (err) {
    console.error("Approval API Error:", err);

    // Extract the most meaningful message
    const errorMessage =
      err?.response?.data?.message ||         // backend sends {message:"..."}
      err?.response?.data?.error ||           // backend sends {error:"..."}
      err?.message ||                         // fallback error message
      "Something went wrong, please try again.";

    toast.error(errorMessage);
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl shadow-xl border dark:border-gray-700">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Auction #{auction.id}{" "}
            <span className="text-gray-400">• Compare Quotes</span>
          </h2>

          <div className="flex items-center gap-3">
            {" "}
            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm border border-gray-300 dark:border-gray-600 shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {" "}
              <option value="recommended">Recommended</option>{" "}
              <option value="priceLow">Price — Low → High</option>{" "}
              <option value="priceHigh">Price — High → Low</option>{" "}
              <option value="fastest">Fastest Delivery</option>{" "}
              <option value="rating">Highest Rating</option>{" "}
            </select>{" "}
            <button
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
              onClick={onClose}
            >
              {" "}
              <X className="text-gray-600 dark:text-gray-300" />{" "}
            </button>{" "}
          </div>
        </div>

        {/* QUOTE LIST */}
        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-3">
          {sortedQuotes.map((q) => {
            const isRecommended = q.id === recommended.id;
            const isLowest = q.quoteAmount === lowestPrice;
            const diffPercent = isLowest
              ? 0
              : Math.round(((q.quoteAmount - lowestPrice) / lowestPrice) * 100);

            return (
              <div
                key={q.id}
                className={`
                  p-4 rounded-xl border transition-all duration-150
                  bg-gray-50 dark:bg-gray-800 flex items-center justify-between
                  ${
                    isRecommended
                      ? "border-yellow-500 shadow-md"
                      : "border-gray-300 dark:border-gray-700"
                  }
                `}
              >
                {/* LEFT: Basic Info */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <User className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {q.user?.organizationName}
                      </p>

                      {isRecommended && (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-300 text-yellow-900">
                          <Crown className="h-3 w-3" /> Recommended
                        </span>
                      )}

                      {isLowest && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-900">
                          Lowest Price
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">{q.user?.email}</p>

                    {/* Meta compact row */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {q.estimatedDeliveryDate?.slice(0, 10)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {q.user?.rating || 4 }
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {q.createdDate?.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL (Price + Action) */}
                <div className="flex flex-col items-end text-right w-44">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-300">
                    {formatCurrency(q.quoteAmount)}
                  </p>

                  {!isLowest && (
                    <div className="flex items-center gap-1 text-xs">
                      {diffPercent > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-red-500" />
                          <span className="text-red-500">+{diffPercent}%</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-green-500" />
                          <span className="text-green-500">{diffPercent}%</span>
                        </>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleSelectAttempt(q.id)}
                    className="mt-2 px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Select
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONFIRMATION POPUP */}
      {confirmPopup.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm border dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirm Selection
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to select this quote?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmPopup({ open: false, quoteId: null })}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                onClick={confirmSelection}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm"
              >
                <CheckCircle className="h-4 w-4" />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionModal;
