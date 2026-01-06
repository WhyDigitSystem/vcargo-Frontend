import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Truck,
  X,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Package,
  Filter,
  Download,
  Eye,
  AlertCircle,
  BarChart3,
  CheckSquare,
  XSquare,
  Hourglass
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { quoteAPI } from "../../api/quoteAPI";
import AddressDisplay from "../QuortsView/AddressDisplay";

/* ===================== MAIN COMPONENT ===================== */

const MyQuotes = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.usersId;

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "pending", "approved", "rejected"

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalCount, setTotalCount] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchQuotes();
  }, [page]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await quoteAPI.getQuotesByUserId({
        page,
        count: pageSize,
        userId,
      });

      const quoteVO = res?.paramObjectsMap?.quoteVO;
      const mappedQuotes = mapApiQuotes(quoteVO?.data || []);
      setQuotes(mappedQuotes);
      setTotalCount(quoteVO?.totalCount || 0);
      calculateStats(mappedQuotes);
    } catch (err) {
      console.error("Failed to fetch quotes", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (quotesData) => {
    const statsData = {
      total: quotesData.length,
      pending: quotesData.filter(q => q.status === "pending").length,
      approved: quotesData.filter(q => q.status === "approved").length,
      rejected: quotesData.filter(q => q.status === "rejected").length,
      totalAmount: quotesData.reduce((sum, q) => sum + q.amount, 0)
    };
    setStats(statsData);
  };

  const filteredQuotes = quotes.filter(quote => {
    if (filter === "all") return true;
    return quote.status === filter;
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 sm:p-6 transition-colors">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Quotes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track and manage all your transportation quotes in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Quotes"
            value={stats.total}
            icon={<Package className="h-5 w-5" />}
            color="blue"
            trend={"+12%"}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
            color="yellow"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircle className="h-5 w-5" />}
            color="green"
            trend={"+8%"}
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<XCircle className="h-5 w-5" />}
            color="red"
          />
          <StatCard
            title="Total Value"
            value={`₹${(stats.totalAmount / 1000).toFixed(1)}k`}
            icon={<DollarSign className="h-5 w-5" />}
            color="purple"
            trend={"+15%"}
          />
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "approved", "rejected"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === filterType
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType !== "all" && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-black/10 dark:bg-white/10">
                    {stats[filterType]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QUOTES LIST */}
      <div className="space-y-4 mb-8">
        {loading ? (
          Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => (
            <EnhancedQuoteCard
              key={quote.id}
              quote={quote}
              onView={() => setSelectedQuote(quote)}
            />
          ))
        ) : (
          <EmptyState filter={filter} />
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {Math.min((page - 1) * pageSize + 1, totalCount)} to{" "}
            {Math.min(page * pageSize, totalCount)} of {totalCount} quotes
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium ${page === pageNumber
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* DRAWER */}
      <EnhancedQuoteDrawer
        quote={selectedQuote}
        onClose={() => setSelectedQuote(null)}
      />
    </div>
  );
};

/* ===================== ENHANCED QUOTE CARD ===================== */

const EnhancedQuoteCard = ({ quote, onView }) => {
  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        text: "Approved",
        icon: CheckSquare,
        bgColor: "bg-green-50 dark:bg-green-900/20",
        textColor: "text-green-700 dark:text-green-400",
        borderColor: "border-green-200 dark:border-green-800",
        iconColor: "text-green-600 dark:text-green-500",
        progress: "w-full",
        progressColor: "bg-green-500",
        step: "complete"
      },
      rejected: {
        text: "Rejected",
        icon: XSquare,
        bgColor: "bg-red-50 dark:bg-red-900/20",
        textColor: "text-red-700 dark:text-red-400",
        borderColor: "border-red-200 dark:border-red-800",
        iconColor: "text-red-600 dark:text-red-500",
        progress: "w-full",
        progressColor: "bg-red-500",
        step: "rejected"
      },
      pending: {
        text: "Pending",
        icon: Hourglass,
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        textColor: "text-yellow-700 dark:text-yellow-400",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        iconColor: "text-yellow-600 dark:text-yellow-500",
        progress: "w-1/2",
        progressColor: "bg-yellow-500",
        step: "pending"
      }
    };
    return configs[status] || configs.pending;
  };

  const config = getStatusConfig(quote.status);
  const StatusIcon = config.icon;

  // Format date safely
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Not specified";
      
      // Handle various date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as DD-MM-YYYY
        const parts = dateString.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          const newDate = new Date(year, month, day);
          if (!isNaN(newDate.getTime())) {
            return newDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
          }
        }
        return dateString;
      }
      
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString || "Invalid Date";
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* LEFT SECTION */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {quote.quoteId}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor} flex items-center gap-1.5`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {config.text}
                  {quote.approvedOn && quote.status !== "pending" && (
                    <span className="text-xs opacity-75">
                      • {formatDate(quote.approvedOn)}
                    </span>
                  )}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Customer: <span className="font-semibold text-gray-800 dark:text-gray-200">{quote.customer}</span>
                {quote.auctionId && (
                  <span className="ml-4 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    Auction: {quote.auctionId}
                  </span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{quote.amount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Quote Amount</p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Route</p>
                <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {quote.from} → {quote.to}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Truck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Material</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {quote.material} • {quote.weight}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated Delivery</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(quote.delivery)}
                </p>
              </div>
            </div>
          </div>

          {/* STATUS BAR */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span className={quote.status === "pending" ? "font-semibold text-yellow-600 dark:text-yellow-400" : ""}>
                Submitted
              </span>
              <span className={quote.status === "pending" ? "font-semibold text-yellow-600 dark:text-yellow-400" : ""}>
                Under Review
              </span>
              <span className={quote.status === "approved" ? "font-semibold text-green-600 dark:text-green-400" : 
                quote.status === "rejected" ? "font-semibold text-red-600 dark:text-red-400" : ""}>
                {quote.status === "approved" ? "Approved" : quote.status === "rejected" ? "Rejected" : "Decision"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${config.progress} ${config.progressColor} transition-all duration-500`} />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - ACTION */}
        <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-4">
          <button
            onClick={onView}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full lg:w-auto"
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===================== STAT CARD ===================== */

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    red: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
  };

  return (
    <div className={`p-5 rounded-xl border ${colorClasses[color]} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[0]} bg-opacity-50`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/5 dark:bg-white/10">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  );
};

/* ===================== ENHANCED DRAWER ===================== */

const EnhancedQuoteDrawer = ({ quote, onClose }) => {
  if (!quote) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <CheckSquare className="h-5 w-5 text-green-500" />;
      case "rejected": return <XSquare className="h-5 w-5 text-red-500" />;
      default: return <Hourglass className="h-5 w-5 text-yellow-500" />;
    }
  };

  // Format date safely for drawer
  const formatDateForDrawer = (dateString) => {
    try {
      if (!dateString) return "Not specified";
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as DD-MM-YYYY HH:MM:SS format
        const parts = dateString.match(/(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/);
        if (parts) {
          const day = parseInt(parts[1], 10);
          const month = parseInt(parts[2], 10) - 1;
          const year = parseInt(parts[3], 10);
          const hour = parseInt(parts[4], 10);
          const minute = parseInt(parts[5], 10);
          const second = parseInt(parts[6], 10);
          const newDate = new Date(year, month, day, hour, minute, second);
          if (!isNaN(newDate.getTime())) {
            return newDate.toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        }
        return dateString;
      }
      
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString || "Invalid Date";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="relative w-screen max-w-md">
          <div className="flex h-full flex-col bg-white dark:bg-gray-900 shadow-xl">
            {/* HEADER */}
            <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(quote.status)}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Quote Details
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                {quote.quoteId} • {quote.customer}
              </p>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* STATUS INFO */}
              <div className="mb-6">
                <div className={`p-4 rounded-xl ${quote.status === "approved" 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                    : quote.status === "rejected"
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(quote.status)}
                      <span className={`font-semibold ${quote.status === "approved" 
                          ? "text-green-700 dark:text-green-400" 
                          : quote.status === "rejected"
                          ? "text-red-700 dark:text-red-400"
                          : "text-yellow-700 dark:text-yellow-400"
                        }`}>
                        {quote.status === "approved" ? "Quote Approved" : 
                         quote.status === "rejected" ? "Quote Rejected" : 
                         "Pending Approval"}
                      </span>
                    </div>
                    {quote.approvedBy && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        By: {quote.approvedBy}
                      </span>
                    )}
                  </div>
                  {quote.approvedOn && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      On: {formatDateForDrawer(quote.approvedOn)}
                    </p>
                  )}
                </div>
              </div>

              {/* DETAILS */}
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Financial Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quote Amount</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        ₹{quote.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Auction Range</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        ₹{quote.minPrice || 0} - ₹{quote.maxPrice || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <DetailItem
                    label="Route"
                    value={
                      <div className="space-y-2">
                      

                          <AddressDisplay label="From" address={quote.from} />
                          <AddressDisplay label="To" address={quote.to} />
                      </div>
                    }
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem
                      label="Material"
                      value={
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          {quote.material}
                        </div>
                      }
                    />
                    <DetailItem label="Weight" value={quote.weight} />
                  </div>

                  <DetailItem
                    label="Estimated Delivery"
                    value={
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateForDrawer(quote.delivery)}
                      </div>
                    }
                  />

                  {quote.notes && (
                    <DetailItem
                      label="Additional Notes"
                      value={
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300">{quote.notes}</p>
                        </div>
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Export Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================== DETAIL ITEM ===================== */

const DetailItem = ({ label, value }) => (
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
    <div className="text-gray-900 dark:text-white">{value}</div>
  </div>
);

/* ===================== EMPTY STATE ===================== */

const EmptyState = ({ filter }) => (
  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      No {filter !== "all" ? filter : ""} quotes found
    </h3>
    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
      {filter === "all"
        ? "You haven't submitted any quotes yet. Start by bidding on available auctions."
        : `You don't have any ${filter} quotes at the moment.`}
    </p>
  </div>
);

/* ===================== SKELETON ===================== */

const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full lg:w-32" />
    </div>
  </div>
);

/* ===================== API MAPPERS - FIXED ===================== */

const mapStatus = (approvedStatus) => {
  if (!approvedStatus) return "pending";
  
  const status = approvedStatus.toLowerCase();
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  return "pending";
};

const mapApiQuotes = (data) =>
  data.map((q) => {
    // Debug log to see what's in the data
    console.log('Quote data:', {
      id: q.id,
      approvedStatus: q.approvedStatus,
      approveBy: q.approveBy,
      approveOn: q.approveOn
    });
    
    return {
      id: q.id,
      quoteId: `QT-${q.id.toString().padStart(6, '0')}`,
      auctionId: q.auction?.id ? `AU-${q.auction.id.toString().padStart(6, '0')}` : null,
      customer: q.auction?.user?.organizationName || "Unknown Customer",
      from: q.auction?.loading || "Loading location not specified",
      to: q.auction?.unloading || "Unloading location not specified",
      material: q.auction?.material || "Not specified",
      weight: `${q.auction?.materialWeight || 0} ${q.auction?.weightUnit || "TON"}`,
      amount: q.quoteAmount || 0,
      delivery: q.estimatedDeliveryDate || new Date().toISOString().split('T')[0],
      status: mapStatus(q.approvedStatus), // FIXED: Using approvedStatus from quote object
      notes: q.additionalNotes || "",
      approvedBy: q.approveBy,
      approvedOn: q.approveOn,
      minPrice: q.auction?.minPrice,
      maxPrice: q.auction?.maxPrice,
      bidType: q.auction?.bidType,
      vehicle: q.auction?.vehicle,
      vehicleQuantity: q.auction?.vehicleQuantity,
      auctionStatus: q.auction?.auctionStatus,
      createdOn: q.commonDate?.createdon,
      modifiedOn: q.commonDate?.modifiedon
    };
  });

export default MyQuotes;