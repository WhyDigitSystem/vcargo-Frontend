import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  IndianRupee,
  Package,
  Search,
  Send,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auctionsAPI } from "../../api/auctionsAPI";
import { quoteAPI } from "../../api/quoteAPI";
import AddressDisplay from "../QuortsView/AddressDisplay";

const ActiveBids = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [allQuotes, setAllQuotes] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedBid, setSelectedBid] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quoteId, setQuoteId] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [quoteData, setQuoteData] = useState({
    bidId: "",
    quoteAmount: "",
    validity: 7,
    notes: "",
    terms: "",
    estimatedDelivery: "",
    branch: null,
    branchCode: null,
    orgId: null,
  });
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "";
  const usersId = JSON.parse(localStorage.getItem("user"))?.usersId || "";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    getAllAuctions(); // initial call

    const interval = setInterval(() => {
      getAllAuctions();
    }, 60_000); // 1 minute

    return () => clearInterval(interval); // cleanup on unmount
  }, [page, count, debouncedSearchTerm, usersId]);

  useEffect(() => {
    applyLocalFilters();
  }, [bids, statusFilter, priorityFilter, debouncedSearchTerm]);

  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllAuctions = async () => {
    try {
      setLoading(true);

      const searchString = debouncedSearchTerm || "";

      const response = await auctionsAPI.getAuctionsReportList({
        page,
        count,
        userId: usersId,
        search: searchString,
      });

      const list = response?.paramObjectsMap?.auctionsReportVO?.data || [];
      const total =
        response?.paramObjectsMap?.auctionsReportVO?.totalCount || 0;

      setBids(list.reverse());
      setTotalCount(total);
      setTotalPages(Math.ceil(total / count));
      console.log("Auctions List:", list);
    } catch (err) {
      console.error("Load Auctions Error:", err);
      setBids([]);
      setFilteredBids([]);
    } finally {
      setLoading(false);
    }
  };

  const applyLocalFilters = () => {
    if (!bids.length) {
      setFilteredBids([]);
      return;
    }

    let filtered = [...bids];

    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (bid) =>
          (bid.loading?.toLowerCase() || "").includes(term) ||
          (bid.unloading?.toLowerCase() || "").includes(term) ||
          (bid.material?.toLowerCase() || "").includes(term) ||
          (bid.organizationName?.toLowerCase() || "").includes(term) ||
          (bid.transporterTag?.toLowerCase() || "").includes(term) ||
          (bid.vehicle?.toLowerCase() || "").includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((bid) => {
        const bidStatus = mapStatus(bid.status);
        return bidStatus === statusFilter;
      });
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((bid) => {
        const { priority } = calculateBidExtras(bid);
        return priority === priorityFilter;
      });
    }

    setFilteredBids(filtered);
  };

  const getAllQuotes = async () => {
    try {
      const response = await quoteAPI.getAllQuotesList({
        page: 1,
        count: 1000,
        userId: usersId,
        search: "",
      });

      const list =
        response?.paramObjectsMap?.quoteVO?.data ||
        response?.paramObjectsMap?.quoteVO ||
        [];

      setAllQuotes(list);
      console.log("Quotes List:", list);
    } catch (err) {
      console.error("Load Quotes Error:", err);
      setAllQuotes([]);
    }
  };

  const getActiveBitsById = async (quoteId) => {
    try {
      const response = await quoteAPI.getQuoteById(quoteId);
      console.log("Quote API Response:", response);

      const data = response?.paramObjectsMap?.quoteVO;

      if (!data) {
        console.error("No Quote data found");
        return;
      }

      setQuoteId(quoteId);
      const bidId = data.auction.id;
      const bid = bids.find((b) => b.id === bidId);

      if (!bid) {
        console.error("Bid not found for this quote");
        return;
      }

      setSelectedBid(bid);

      setQuoteData({
        bidId: bidId,
        quoteAmount: data.quoteAmount || "",
        validity: data.validity || 7,
        notes: data.additionalNotes || "",
        terms: data.termsAndConditions || "",
        estimatedDelivery: data.estimatedDeliveryDate || "",
        branch: data.branch || "",
        branchCode: data.branchCode || "",
        orgId: data.orgId || "",
      });

      setShowQuoteModal(true);
    } catch (error) {
      console.error("Get Quote By ID Error:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...(quoteId && { id: quoteId }),
        auction: selectedBid.id,
        quoteAmount: quoteData.quoteAmount,
        validity: quoteData.validity,
        additionalNotes: quoteData.notes,
        termsAndConditions: quoteData.terms,
        estimatedDeliveryDate: quoteData.estimatedDelivery,
        branch: quoteData.branch,
        branchCode: quoteData.branchCode,
        orgId: quoteData.orgId,
        createdBy: userName,
        userCode: usersId,
      };

      console.log("Quote Payload:", payload);

      const response = await quoteAPI.createUpdateQuote(payload);
      console.log("Quote Submission Response:", response);

      getAllQuotes();
      getAllAuctions();

      setShowQuoteModal(false);
      setSelectedBid(null);
      setQuoteId(null);
      setQuoteData({
        bidId: "",
        quoteAmount: "",
        validity: 7,
        notes: "",
        terms: "",
        estimatedDelivery: "",
        branch: null,
        branchCode: null,
        orgId: null,
      });
    } catch (error) {
      console.error("Quote Submission Error:", error);
    }
  };

  const openQuoteModal = (bid) => {
    setSelectedBid(bid);
    setQuoteId(null);
    setQuoteData((prev) => ({
      ...prev,
      bidId: bid.id,
      estimatedDelivery: bid.loadingDate,
    }));
    setShowQuoteModal(true);
  };

  const openViewModal = (bid) => {
    setSelectedBid(bid);
    setShowViewModal(true);
  };

  const mapStatus = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "open";
      case 1:
        return "quoted";
      case 2:
        return "expired";
      default:
        return "open";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "quoted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Open for Quotes";
      case "quoted":
        return "Quote Submitted";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  function calculateBidExtras(bid) {
    const now = new Date();
    const loading = new Date(
      bid.loadingDate + "T" + (bid.loadingTime || "00:00")
    );

    const diffMs = loading - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    let priority = "Low";
    if (diffHours <= 24 && diffHours > 0) priority = "High";
    else if (diffHours <= 48 && diffHours > 0) priority = "Medium";

    let timeRemaining = "";

    if (diffHours <= 0) {
      timeRemaining = "Closed";
    } else {
      const remainingDays = Math.floor(diffHours / 24);
      const remainingHours = Math.floor(diffHours % 24);
      timeRemaining = `${remainingDays}d ${remainingHours}h`;
    }

    return { priority, timeRemaining };
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateStr;
    }
  }

  function formatDateTime(dateStr, timeStr = "") {
    if (!dateStr) return "";
    const formattedDate = formatDate(dateStr);
    if (!timeStr) return formattedDate;
    return `${formattedDate} ${timeStr}`;
  }

  // Render mobile card view
  const renderMobileCard = (bid) => {
    const { priority, timeRemaining } = calculateBidExtras(bid);
    const quoteForBid = allQuotes.find((q) => q.auction?.id === bid.id);
    const bidStatus = mapStatus(bid.status);

    return (
      <div
        key={bid.id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4"
      >
        {/* Bid Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 dark:text-white">
                ID: {bid.id}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(
                  priority
                )}`}
              >
                {priority}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {bid.organizationName}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
              bidStatus
            )}`}
          >
            {getStatusText(bidStatus)}
          </span>
        </div>

        {/* Route */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Route
          </p>

          <div className="space-y-2">
            <AddressDisplay label="From" address={bid.loading} />
            <AddressDisplay label="To" address={bid.unloading} />
          </div>
        </div>

        {/* Cargo */}
        <div className="flex items-start gap-2 mb-3">
          <Package className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-gray-900 dark:text-white font-medium">Cargo</p>
            <p className="text-gray-600 dark:text-gray-300">{bid.material}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {bid.materialWeight} {bid.weightUnit} • {bid.dimension}m³
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-start gap-2 mb-3">
          <Calendar className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-gray-900 dark:text-white font-medium">
              Timeline
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {formatDate(bid.loadingDate)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-orange-500" />
              <span
                className={`text-xs ${
                  timeRemaining === "Closed"
                    ? "text-red-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {timeRemaining === "Closed"
                  ? "Closed"
                  : `${timeRemaining} left`}
              </span>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Budget
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            ₹{bid.minPrice?.toLocaleString()} - ₹
            {bid.maxPrice?.toLocaleString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {bidStatus === "open" && bid.active === "Active" && (
              <button
                onClick={() => openQuoteModal(bid)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <DollarSign className="w-4 h-4" />
                Quote
              </button>
            )}
            {quoteForBid && bidStatus === "quoted" && (
              <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Quoted
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openViewModal(bid)}
              title="View Details"
              className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Eye className="w-4 h-4" />
            </button>
            {quoteForBid && (
              <button
                onClick={() => getActiveBitsById(quoteForBid.id)}
                title="Edit Quote"
                className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Active Bids
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Find and submit quotes for available transportation bids
          </p>
        </div>

        {/* Stats Overview - Mobile responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {bids.filter((b) => mapStatus(b.status) === "open").length}
                </p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Open Bids
                </p>
              </div>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {bids.filter((b) => mapStatus(b.status) === "quoted").length}
                </p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Quoted
                </p>
              </div>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    bids.filter(
                      (b) => calculateBidExtras(b).priority === "High"
                    ).length
                  }
                </p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  High Priority
                </p>
              </div>
              <AlertCircle className="w-5 h-5 md:w-8 md:h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {bids.length}
                </p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Total Bids
                </p>
              </div>
              <DollarSign className="w-5 h-5 md:w-8 md:h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters - Mobile responsive */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, material, or organization..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="quoted">Quoted</option>
              </select>

              <select
                value={priorityFilter}
                onChange={handlePriorityFilterChange}
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Show filter results count */}
        {!loading && filteredBids.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredBids.length} of {bids.length} bids
            {(statusFilter !== "all" || priorityFilter !== "all") && (
              <span className="ml-2">
                (filtered by{" "}
                {statusFilter !== "all" ? `Status: ${statusFilter}` : ""}
                {statusFilter !== "all" && priorityFilter !== "all"
                  ? " and "
                  : ""}
                {priorityFilter !== "all" ? `Priority: ${priorityFilter}` : ""})
              </span>
            )}
          </div>
        )}

        {/* Bids List - Mobile responsive */}
        {!isMobile ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Bid Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Timeline
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBids.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        {loading
                          ? "Loading..."
                          : "No bids found matching your criteria"}
                      </td>
                    </tr>
                  ) : (
                    filteredBids.map((bid) => {
                      const { priority, timeRemaining } =
                        calculateBidExtras(bid);
                      const quoteForBid = allQuotes.find(
                        (q) => q.auction?.id === bid.id
                      );
                      const bidStatus = mapStatus(bid.status);

                      return (
                        <tr
                          key={bid.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  ID: {bid.id}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(
                                    priority
                                  )}`}
                                >
                                  {priority}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {bid.organizationName}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="mb-3">
                              <div className="space-y-2">
                                <AddressDisplay
                                  label="From"
                                  address={bid.loading}
                                />
                                <AddressDisplay
                                  label="To"
                                  address={bid.unloading}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="text-sm">
                              <p className="text-gray-900 dark:text-white font-medium">
                                {bid.material}
                              </p>
                              <p className="text-gray-500 dark:text-gray-400 text-xs">
                                {bid.materialWeight} {bid.weightUnit} •{" "}
                                {bid.dimension}m³
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="text-sm">
                              <div className="flex items-center gap-1 mb-1">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span className="text-gray-900 dark:text-white">
                                  {formatDate(bid.loadingDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span
                                  className={`text-xs ${
                                    timeRemaining === "Closed"
                                      ? "text-red-500"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {timeRemaining === "Closed"
                                    ? "Closed"
                                    : `${timeRemaining} left`}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <p className="text-gray-900 dark:text-white font-medium text-sm">
                              ₹{bid.minPrice?.toLocaleString()} - ₹
                              {bid.maxPrice?.toLocaleString()}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                                bidStatus
                              )}`}
                            >
                              {getStatusText(bidStatus)}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              {bidStatus === "open" &&
                                bid.active === "Active" && (
                                  <button
                                    onClick={() => openQuoteModal(bid)}
                                    disabled={
                                      bid.auctionStatus === 0 || // NEW CONDITION: Not started
                                      bid.auctionStatus === 2  // Existing condition
                                    }
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors 
      ${
        bid.auctionStatus === 0
          ? "bg-gray-400 text-white cursor-not-allowed" // Yet to Start
          : bid.auctionStatus === 2 
          ? "bg-gray-500 text-white cursor-not-allowed" // Closed
          : "bg-blue-600 text-white hover:bg-blue-700"
      }        // Quote button enabled
    `}
                                  >
                                    {bid.auctionStatus === 0 ? (
                                      "Yet to Start"
                                    ) : bid.auctionStatus === 2  ? (
                                      "Closed"
                                    ) : (
                                      <>Quote</>
                                    )}
                                  </button>
                                )}

                              {quoteForBid && bidStatus === "quoted" && (
                                <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  Quoted
                                </span>
                              )}

                              <button
                                onClick={() => openViewModal(bid)}
                                title="View Details"
                                className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {quoteForBid && (
                                <button
                                  onClick={() =>
                                    getActiveBitsById(quoteForBid.id)
                                  }
                                  title="Edit Quote"
                                  className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBids.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                {loading
                  ? "Loading..."
                  : "No bids found matching your criteria"}
              </div>
            ) : (
              filteredBids.map((bid) => renderMobileCard(bid))
            )}
          </div>
        )}

        {/* View Bid Details Modal */}
        {showViewModal && selectedBid && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Bid Details
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ID: {selectedBid.id} • {selectedBid.organizationName}
                  </p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 dark:text-white" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Basic Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Organization
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.organizationName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Bid Type
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.bidType}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Auction Type
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.auctionsType}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Route Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Route Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            From
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.loading}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            To
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.unloading}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Round Trip
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.roundTrip ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cargo & Timeline */}
                  <div className="space-y-4">
                    {/* Cargo Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Cargo Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Material
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.material}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quantity & Weight
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.materialQuantity} units •{" "}
                            {selectedBid.materialWeight}{" "}
                            {selectedBid.weightUnit}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Dimensions
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.dimension}m³
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vehicle Type
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.vehicle}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vehicle Quantity
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.vehicleQuantity}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Timeline
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Pickup Date
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {formatDateTime(
                              selectedBid.loadingDate,
                              selectedBid.loadingTime
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Duration
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.duration} days
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                              mapStatus(selectedBid.status)
                            )}`}
                          >
                            {getStatusText(mapStatus(selectedBid.status))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget & Requirements */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Budget Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Budget Range
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            ₹{selectedBid.minPrice?.toLocaleString()} - ₹
                            {selectedBid.maxPrice?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Minimum Bid Difference
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            ₹{selectedBid.minBidDifferent?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Allowed Bids
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.allowedBits}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Requirements
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Additional Charges
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.additionalCharges || "None"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Transporter Tags
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.transporterTag || "None"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Excluded Transporters
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.excludeTransporters || "None"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Shortcuts
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {selectedBid.shortCuts || "None"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quote Submission/Edit Modal */}
        {showQuoteModal && selectedBid && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {quoteId ? "Edit Quote" : "Submit Quote"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    For Bid: {selectedBid.id} - {selectedBid.organizationName}
                  </p>
                </div>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 dark:text-white" />
                </button>
              </div>

              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="grid grid-cols-2 gap-10 text-sm">
                  <div>
                    {/* <span className="text-gray-500 dark:text-gray-400">
                      Route:
                    </span> */}
                    <p className="text-gray-900 dark:text-white font-medium">
                      {/* {selectedBid.loading} → {selectedBid.unloading} */}

                      <AddressDisplay
                        label="From"
                        address={selectedBid.loading}
                      />
                      <AddressDisplay
                        label="To"
                        address={selectedBid.unloading}
                      />
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Cargo:
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedBid.material} ({selectedBid.materialWeight}{" "}
                      {selectedBid.weightUnit})
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Pickup:
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(selectedBid.loadingDate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Budget Range:
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      ₹{selectedBid.minPrice?.toLocaleString()}-₹
                      {selectedBid.maxPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitQuote} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quote Amount (₹) *
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={quoteData.quoteAmount}
                        onChange={(e) =>
                          setQuoteData((prev) => ({
                            ...prev,
                            quoteAmount: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter amount"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Budget range: ₹{selectedBid.minPrice?.toLocaleString()} -
                      ₹{selectedBid.maxPrice?.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quote Validity (Days) *
                    </label>
                    <select
                      required
                      value={quoteData.validity}
                      onChange={(e) =>
                        setQuoteData((prev) => ({
                          ...prev,
                          validity: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="3">3 Days</option>
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={quoteData.estimatedDelivery}
                    onChange={(e) => {
                      setQuoteData((prev) => ({
                        ...prev,
                        estimatedDelivery: e.target.value,
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={selectedBid.loadingDate}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={quoteData.notes}
                    onChange={(e) =>
                      setQuoteData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    placeholder="Any special notes or conditions for this quote..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={quoteData.terms}
                    onChange={(e) =>
                      setQuoteData((prev) => ({
                        ...prev,
                        terms: e.target.value,
                      }))
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    placeholder="Payment terms, cancellation policy, etc..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuoteModal(false);
                      setQuoteId(null);
                      setQuoteData({
                        bidId: "",
                        quoteAmount: "",
                        validity: 7,
                        notes: "",
                        terms: "",
                        estimatedDelivery: "",
                        branch: null,
                        branchCode: null,
                        orgId: null,
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {quoteId ? "Update Quote" : "Submit Quote"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pagination - Mobile responsive */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
              </div>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveBids;
