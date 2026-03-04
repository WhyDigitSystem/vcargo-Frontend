import {
  Ban,
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Mail,
  MoreVertical,
  Phone,
  RefreshCw,
  Search,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { settingsAPI } from "../../api/settings";

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await settingsAPI.getUser();

      if (response.status && response.paramObjectsMap?.userVO) {
        setUsers(response.paramObjectsMap.userVO);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, action, userName) => {
    setLoadingId(userId);

    try {
      const response = await settingsAPI.createApprovalUserList({
        action: action.toUpperCase(),
        actionBy: "admin",
        id: userId,
        userName: userName,
      });

      if (response.status) {
        setUsers((prev) =>
          prev.map((user) =>
            user.userId === userId
              ? { ...user, status: action.toUpperCase() }
              : user
          )
        );
      }
    } finally {
      setLoadingId(null);
    }
  };

  const mapApiUserToFrontend = (apiUser) => ({
    userId: apiUser.userId,
    name: apiUser.userName || apiUser.email,
    email: apiUser.email,
    phone: apiUser.mobileNo,
    type: apiUser.type,
    industry: apiUser.organizationName,
    status: apiUser.status,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users: users.map(mapApiUserToFrontend),
    loading,
    loadingId,
    updateUserStatus,
  };
};

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const {
    users,
    loading,
    loadingId,
    updateUserStatus,
  } = useUserManagement();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const statusConfig = {
    PENDING: {
      icon: Clock,
      style:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
      label: "Pending",
    },
    APPROVED: {
      icon: CheckCircle,
      style:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
      label: "Approved",
    },
    REJECTED: {
      icon: Ban,
      style:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
      label: "Rejected",
    },
  };

  // Client-side filtering for status and type
  // Client-side filtering
  const filteredUsers = users.filter((user) => {
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesType =
      typeFilter === "all" || user.type === typeFilter;

    return matchesStatus && matchesType;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // KPI Calculations
  const totalUsers = filteredUsers.length || users.length;
  const pendingUsers = users.filter((u) => u.status === "PENDING").length;
  const approvedUsers = users.filter((u) => u.status === "APPROVED").length;
  const rejectedUsers = users.filter((u) => u.status === "REJECTED").length;

  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Handle approve action
  const handleApprove = (userId, userName) => {
    if (window.confirm(`Are you sure you want to approve ${userName}?`)) {
      updateUserStatus(userId, "approved", userName);
    }
  };

  // Handle reject action
  const handleReject = (userId, userName) => {
    if (window.confirm(`Are you sure you want to reject ${userName}?`)) {
      updateUserStatus(userId, "rejected", userName);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const current = currentPage;
    const total = totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(total);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Manage user access and permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {totalUsers} Users
              </span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded">
                <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {totalUsers}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/20 rounded">
                <Clock className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {pendingUsers}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pending
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded">
                <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {approvedUsers}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Approved
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/20 rounded">
                <Ban className="h-3 w-3 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {rejectedUsers}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rejected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none text-sm text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="Transporter">Transporter</option>
                <option value="Industry">Industry</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-2">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <RefreshCw className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2 animate-spin" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Loading users...
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please wait while we fetch the data
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Search className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                No users found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Page {currentPage} of {totalPages} •
                Showing {filteredUsers.length} users
              </div>
              {currentUsers.map((user) => {
                const statusInfo =
                  statusConfig[user.status] || statusConfig.PENDING;
                const StatusIcon = statusInfo.icon;
                const isLoading = loadingId === user.userId;

                return (
                  <div
                    key={user.userId}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {user.name}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${statusInfo.style}`}
                            >
                              <StatusIcon className="h-2.5 w-2.5" />
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{user.email}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span className="truncate">{user.industry}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {user.type}
                        </span>

                        {isLoading ? (
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                            Processing...
                          </div>
                        ) : (
                          <>
                            {user.status === "PENDING" && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    handleApprove(user.userId, user.name)
                                  }
                                  className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
                                  disabled={loadingId !== null}
                                  title="Approve User"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleReject(user.userId, user.name)
                                  }
                                  className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                                  disabled={loadingId !== null}
                                  title="Reject User"
                                >
                                  <XCircle className="h-3 w-3" />
                                  Reject
                                </button>
                              </div>
                            )}

                            {(user.status === "APPROVED" ||
                              user.status === "REJECTED") && (
                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                  <MoreVertical className="h-4 w-4 text-gray-400" />
                                </button>
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {indexOfFirstUser + 1} to{" "}
              {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-gray-200 dark:border-gray-700"
                title="First Page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-gray-200 dark:border-gray-700"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {generatePageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" ? handlePageChange(page) : null
                  }
                  disabled={page === "..."}
                  className={`min-w-[2.5rem] px-3 py-2 text-sm rounded border ${page === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    } ${page === "..." ? "cursor-default hover:bg-transparent" : ""
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-gray-200 dark:border-gray-700"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded border border-gray-200 dark:border-gray-700"
                title="Last Page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 Efit Transport · User Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
