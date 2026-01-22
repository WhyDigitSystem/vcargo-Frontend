import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  IndianRupee,
} from "lucide-react";

export const InvoiceStats = ({ invoices }) => {
  const stats = {
    totalInvoices: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "pending").length,
    overdue: invoices.filter((i) => {
      if (i.status === "pending") {
        const dueDate = new Date(i.dueDate);
        const today = new Date();
        return dueDate < today;
      }
      return false;
    }).length,
    draft: invoices.filter((i) => i.status === "draft").length,
    totalRevenue: invoices.reduce(
      (sum, invoice) => sum + (invoice.totalAmount || 0),
      0
    ),
    pendingAmount: invoices.reduce(
      (sum, invoice) => sum + (invoice.balanceDue || 0),
      0
    ),
  };

  const statCards = [
    {
      title: "Total Invoices",
      value: stats.totalInvoices,
      icon: FileText,
      color: "blue",
      // change: "+12%",
      trend: "up",
    },
    {
      title: "Paid",
      value: stats.paid,
      icon: CheckCircle,
      color: "emerald",
      // change: "+5",
      trend: "up",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "amber",
      // change: "3",
      trend: "neutral",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "red",
      // change: "1",
      trend: "down",
      urgent: stats.overdue > 0,
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "purple",
      // change: "+18%",
      trend: "up",
    },
    {
      title: "Pending Amount",
      value: `₹${stats.pendingAmount.toLocaleString()}`,
      icon: DollarSign,
      color: "orange",
      // change: "-2%",
      trend: "down",
    },
  ];

  const colorConfig = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      iconBg: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      iconBg: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-500",
      text: "text-purple-600 dark:text-purple-400",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      iconBg: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
    },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, idx) => {
        const colors = colorConfig[stat.color];

        return (
          <div
            key={idx}
            className={`bg-white dark:bg-gray-800 rounded-xl border p-4 hover:shadow-sm transition-shadow ${
              stat.urgent
                ? "border-red-300 dark:border-red-700 ring-1 ring-red-200 dark:ring-red-800"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                <div className={`p-2 rounded-md ${colors.iconBg}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>

              {stat.change && (
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : stat.trend === "down"
                      ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {stat.change}
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </p>

            {stat.urgent && (
              <div className="mt-2">
                <div className="w-full h-1 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full animate-pulse"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
