import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  List,
  MapPin,
  MoreVertical,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Timer,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { auctionsAPI } from "../../api/auctionsAPI";

const AuctionsListView = ({ setIsListView, setEditingId }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [allAuctions, setAllAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [showMoreOptions, setShowMoreOptions] = useState(null);
  const moreOptionsRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  // Extract unique vehicle types for filter
  const vehicleTypes = [...new Set(allAuctions.map((a) => a.vehicle))].filter(
    Boolean
  );

  // Status options with improved dark mode colors
  const statusOptions = [
    {
      value: "Active",
      label: "Active",
      color: "green",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      value: "In-Active",
      label: "Inactive",
      color: "red",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-700 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      value: "Running",
      label: "Running",
      color: "blue",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      value: "Closed",
      label: "Closed",
      color: "gray",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-700 dark:text-gray-300",
      borderColor: "border-gray-200 dark:border-gray-700",
    },
    {
      value: "Scheduled",
      label: "Scheduled",
      color: "yellow",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-700 dark:text-yellow-400",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
  ];

  // Enhanced stats calculation with mobile optimization
  const calculateStats = () => {
    const total = allAuctions.length;
    const active = allAuctions.filter((a) => a.active === "Active").length;
    const inactive = allAuctions.filter((a) => a.active === "In-Active").length;
    const running = allAuctions.filter((a) => a.status === "Running").length;
    const scheduled = allAuctions.filter(
      (a) => a.status === "Scheduled"
    ).length;
    const closed = allAuctions.filter((a) => a.status === "Closed").length;

    return [
      {
        label: "Total Auctions",
        count: total,
        color: "blue",
        icon: BarChart3,
        description: "All auctions",
        bgClass:
          "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10",
      },
      {
        label: "Active",
        count: active,
        color: "green",
        icon: CheckCircle,
        description: "Currently active",
        bgClass:
          "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10",
      },
      {
        label: "Running",
        count: running,
        color: "orange",
        icon: Timer,
        description: "In progress",
        bgClass:
          "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10",
      },
      {
        label: "Scheduled",
        count: scheduled,
        color: "yellow",
        icon: Clock,
        description: "Upcoming",
        bgClass:
          "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10",
      },
      {
        label: "Closed",
        count: closed,
        color: "gray",
        icon: CheckCircle,
        description: "Completed",
        bgClass:
          "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-900/10",
      },
      {
        label: "Inactive",
        count: inactive,
        color: "red",
        icon: AlertTriangle,
        description: "Not active",
        bgClass:
          "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10",
      },
    ];
  };

  const stats = calculateStats();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Truncate text with ellipsis
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get status configuration
  const getStatusConfig = (auction) => {
    return (
      statusOptions.find((s) => s.value === auction.active) ||
      statusOptions.find((s) => s.value === auction.status) ||
      statusOptions[0]
    );
  };

  // Fetch auctions
  const getAllAuctions = async () => {
    try {
      setLoading(true);
      const response = await auctionsAPI.getAllAuctionsList({
        page,
        count,
        search,
        orgId,
        status: statusFilter,
        vehicle: vehicleFilter,
        date: dateFilter,
        branchCode: "CHE001",
      });

      const list =
        response?.paramObjectsMap?.auctionVO?.data ||
        response?.paramObjectsMap?.auctionsVO?.data ||
        [];

      const total =
        response?.paramObjectsMap?.auctionVO?.totalCount ||
        response?.paramObjectsMap?.auctionsVO?.totalCount ||
        0;

      setAllAuctions(list.reverse());
      setTotalCount(total);
      setTotalPages(Math.ceil(total / count));
      setAuctions(list);
    } catch (err) {
      console.error("Load Auctions Error:", err);
      setAllAuctions([]);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setVehicleFilter("");
    setDateFilter("");
    setPage(1);
  };

  // Handle view details
  const handleViewDetails = (auction) => {
    setSelectedAuction(auction);
    setShowDetails(true);
    setShowMoreOptions(null);
  };

  // Handle edit
  const handleEdit = (auction) => {
    setEditingId(auction.id);
    setIsListView(false);
    setShowMoreOptions(null);
  };

  // Handle export
  const handleExport = () => {
    // Export functionality here
    console.log("Exporting auctions data...");
  };

  // Close more options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(event.target)
      ) {
        setShowMoreOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data on filter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAllAuctions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, count, search, statusFilter, vehicleFilter, dateFilter]);

  // Mobile view detection
  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Auctions Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
              Manage and monitor all transport auctions
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 md:p-2.5 ${
                  viewMode === "list"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <List className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 md:p-2.5 ${
                  viewMode === "grid"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <div className="grid grid-cols-2 gap-0.5 h-4 w-4 md:h-5 md:w-5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="p-2 md:p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Export Data"
            >
              <Download className="h-4 w-4 md:h-5 md:w-5" />
            </button>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`p-2 md:p-2.5 rounded-lg border transition-colors flex items-center gap-1 md:gap-2 ${
                showFilter
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden md:inline text-sm">Filters</span>
              {showFilter && <X className="h-3 w-3 ml-1" />}
            </button>

            {/* Add Auction Button */}
            <button
              onClick={() => setIsListView(false)}
              className="px-3 py-2 md:px-4 md:py-2.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-1 md:gap-2 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden md:inline">Add Auction</span>
              <span className="md:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* STATS CARDS - Mobile optimized */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 min-w-max md:min-w-0">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.bgClass} border border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all min-w-[160px] md:min-w-0 flex-shrink-0`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-1.5 md:p-2 rounded-lg bg-white dark:bg-gray-800/50`}
                    >
                      <Icon
                        className={`h-4 w-4 md:h-5 md:w-5 text-${stat.color}-600 dark:text-${stat.color}-400`}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                      {stat.description}
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.count}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FILTER PANEL - Mobile optimized */}
        {showFilter && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                Filters
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className="md:hidden text-gray-500 dark:text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {/* Search - Full width on mobile */}
              <div className="relative col-span-1 md:col-span-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setPage(1);
                    setStatusFilter(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Vehicle Filter */}
              <div className="relative">
                <select
                  value={vehicleFilter}
                  onChange={(e) => {
                    setPage(1);
                    setVehicleFilter(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Vehicles</option>
                  {vehicleTypes.map((vehicle) => (
                    <option key={vehicle} value={vehicle}>
                      {vehicle}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Truck className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setPage(1);
                    setDateFilter(e.target.value);
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW CONTENT - List or Grid */}
        {viewMode === "list" ? (
          /* LIST VIEW - Mobile optimized */
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Auction Details
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Schedule
                    </th>
                    <th
                      scope="col"
                      className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Material
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={isMobile ? 3 : 5}
                        className="px-6 py-12 text-center"
                      >
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Loading auctions...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : auctions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isMobile ? 3 : 5}
                        className="px-6 py-12 text-center"
                      >
                        <div className="flex flex-col items-center">
                          <FileText className="h-12 w-12 mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No auctions found
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm text-center max-w-md mx-auto">
                            {search ||
                            statusFilter ||
                            vehicleFilter ||
                            dateFilter
                              ? "Try adjusting your filters or search terms"
                              : "Create your first auction to get started"}
                          </p>
                          {search ||
                          statusFilter ||
                          vehicleFilter ||
                          dateFilter ? (
                            <button
                              onClick={resetFilters}
                              className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Clear Filters
                            </button>
                          ) : (
                            <button
                              onClick={() => setIsListView(false)}
                              className="mt-4 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Create Auction
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    auctions.map((auction) => {
                      const status = getStatusConfig(auction);

                      return (
                        <tr
                          key={auction.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                    #{auction.id}
                                  </span>
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${status.bgColor} ${status.textColor} ${status.borderColor} border hidden sm:inline-block`}
                                  >
                                    {auction.auctionsType}
                                  </span>
                                </div>
                                <div className="md:hidden">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${status.bgColor} ${status.textColor}`}
                                  >
                                    {status.label === "Active"
                                      ? "✓"
                                      : status.label === "Inactive"
                                      ? "✗"
                                      : status.label.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <Truck className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {truncateText(auction.vehicle, 15)}
                                </span>
                                <span className="mx-1">•</span>
                                <span>{auction.vehicleQuantity}</span>
                              </div>
                              <div className="flex items-start gap-2 text-xs">
                                <MapPin className="h-3 w-3 mt-0.5 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0">
                                  <div className="text-gray-700 dark:text-gray-300 truncate">
                                    {truncateText(auction.loading, 25)}
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-400 text-xs truncate">
                                    {truncateText(auction.unloading, 25)}
                                  </div>
                                </div>
                              </div>
                              {/* Mobile-only schedule info */}
                              <div className="md:hidden">
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDate(auction.loadingDate)}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Schedule Column - Hidden on mobile */}
                          <td className="hidden md:table-cell px-4 py-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {formatDateTime(auction.startDate)}
                                </span>
                              </div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs">
                                Loading: {formatDate(auction.loadingDate)}
                              </div>
                              {auction.duration && (
                                <div className="text-gray-600 dark:text-gray-400 text-xs">
                                  Duration: {auction.duration} Mins
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Material Column - Hidden on mobile/tablet */}
                          <td className="hidden lg:table-cell px-4 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Package className="h-3 w-3 text-gray-400" />
                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                  {truncateText(auction.material, 15)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Qty: {auction.materialQuantity}
                              </div>
                              {auction.numTransporter && (
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <Users className="h-3 w-3 text-gray-400" />
                                  <span>{auction.numTransporter}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status Column - Full on desktop, minimal on mobile */}
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full w-fit ${status.bgColor} ${status.textColor} hidden md:inline-block`}
                              >
                                {status.label}
                              </span>
                              <div className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">
                                {auction.roundTrip && "Round Trip • "}
                                {auction.customGeofence && "Geofenced"}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-500 hidden md:block">
                                {auction.commonDate?.createdon?.split(" ")[0]}
                              </div>
                            </div>
                          </td>

                          {/* Actions Column */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleViewDetails(auction)}
                                className="p-1.5 md:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(auction)}
                                className="p-1.5 md:p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                title="Edit Auction"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              {/* More options for mobile */}
                              <div
                                className="relative md:hidden"
                                ref={moreOptionsRef}
                              >
                                <button
                                  onClick={() =>
                                    setShowMoreOptions(
                                      showMoreOptions === auction.id
                                        ? null
                                        : auction.id
                                    )
                                  }
                                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                {showMoreOptions === auction.id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                    <button
                                      onClick={() => {
                                        handleViewDetails(auction);
                                        setShowMoreOptions(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleEdit(auction);
                                        setShowMoreOptions(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      Edit Auction
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Clone functionality
                                        console.log(
                                          "Clone auction:",
                                          auction.id
                                        );
                                        setShowMoreOptions(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      Clone
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Cancel functionality
                                        console.log(
                                          "Cancel auction:",
                                          auction.id
                                        );
                                        setShowMoreOptions(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                                    >
                                      Cancel Auction
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION - Mobile optimized */}
            {auctions.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-0">
                  <span className="font-medium">
                    {(page - 1) * count + 1}-
                    {Math.min(page * count, totalCount)}
                  </span>{" "}
                  of <span className="font-medium">{totalCount}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300 hidden sm:inline">
                      Show:
                    </span>
                    <select
                      value={count}
                      onChange={(e) => {
                        setCount(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="p-1.5 sm:p-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center">
                      <span className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">
                        {page}
                      </span>
                      <span className="px-2 text-gray-500 dark:text-gray-400">
                        of {totalPages}
                      </span>
                    </div>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="p-1.5 sm:p-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* GRID VIEW - Mobile optimized */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))
            ) : auctions.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <FileText className="h-12 w-12 mb-4 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No auctions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {search || statusFilter || vehicleFilter || dateFilter
                    ? "Try adjusting your filters"
                    : "Create your first auction to get started"}
                </p>
                {search || statusFilter || vehicleFilter || dateFilter ? (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setIsListView(false)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Create Auction
                  </button>
                )}
              </div>
            ) : (
              auctions.map((auction) => {
                const status = getStatusConfig(auction);

                return (
                  <div
                    key={auction.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            #{auction.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${status.bgColor} ${status.textColor}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {auction.auctionsType}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(auction)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Route Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-xs">
                        <MapPin className="h-3 w-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-gray-700 dark:text-gray-300 truncate">
                            {truncateText(auction.loading, 30)}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 truncate">
                            {truncateText(auction.unloading, 30)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle & Material */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-xs">
                        <Truck className="h-3 w-3 text-gray-400" />
                        <div>
                          <div className="text-gray-900 dark:text-white font-medium">
                            {truncateText(auction.vehicle, 12)}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {auction.vehicleQuantity} units
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Package className="h-3 w-3 text-gray-400" />
                        <div>
                          <div className="text-gray-900 dark:text-white font-medium">
                            {truncateText(auction.material, 12)}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {auction.materialQuantity} qty
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(auction.loadingDate)}</span>
                      {auction.loadingTime && (
                        <span className="text-gray-500 dark:text-gray-500">
                          • {auction.loadingTime}
                        </span>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {auction.commonDate?.createdon?.split(" ")[0]}
                      </div>
                      <button
                        onClick={() => handleEdit(auction)}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Load More Button for Mobile Grid View */}
        {viewMode === "grid" && auctions.length > 0 && page < totalPages && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setPage(page + 1)}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* AUCTION DETAILS MODAL - Mobile optimized */}
      {showDetails && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Auction Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Auction ID
                    </h3>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      #{selectedAuction.id}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Type
                    </h3>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedAuction.auctionsType}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Status
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        selectedAuction.active === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {selectedAuction.active}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Branch
                    </h3>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedAuction.branch} ({selectedAuction.branchCode})
                    </p>
                  </div>
                </div>

                {/* Location Details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Route Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Loading Point
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedAuction.loading}
                      </p>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Date: {selectedAuction.loadingDate} at{" "}
                        {selectedAuction.loadingTime}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Unloading Point
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedAuction.unloading}
                      </p>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Date: {selectedAuction.unloadingDate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Material */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Vehicle
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-900 dark:text-white">
                          {selectedAuction.vehicle}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Quantity: {selectedAuction.vehicleQuantity}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Material
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-900 dark:text-white">
                          {selectedAuction.material}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Quantity: {selectedAuction.materialQuantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Timestamps
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Created
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedAuction.commonDate?.createdon}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Modified
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedAuction.commonDate?.modifiedon}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionsListView;
