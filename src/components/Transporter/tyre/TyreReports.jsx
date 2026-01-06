import {
  AlertTriangle,
  BarChart3,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

export const TyreReports = () => {
  const reports = [
    {
      id: 1,
      title: "Tyre Life Analysis",
      description: "Expected lifespan and replacement forecasting",
      icon: TrendingUp,
      color: "blue",
      format: "PDF, Excel",
      size: "3.2 MB",
      date: "Mar 20, 2024",
      views: 42,
      tags: ["Lifecycle", "Forecasting"],
      popular: true,
    },
    {
      id: 2,
      title: "Wear & Tear Report",
      description: "Tread depth analysis and wear patterns",
      icon: BarChart3,
      color: "emerald",
      format: "PDF, CSV",
      size: "2.1 MB",
      date: "Mar 18, 2024",
      views: 31,
      tags: ["Wear", "Analysis"],
    },
    {
      id: 3,
      title: "Cost Analysis Report",
      description: "Tyre maintenance and replacement costs",
      icon: IndianRupee,
      color: "purple",
      format: "PDF, Excel",
      size: "4.5 MB",
      date: "Mar 15, 2024",
      views: 28,
      tags: ["Cost", "Budget"],
    },
    {
      id: 4,
      title: "Safety Alert Report",
      description: "Critical tyres needing immediate attention",
      icon: AlertTriangle,
      color: "red",
      format: "PDF",
      size: "1.8 MB",
      date: "Mar 12, 2024",
      views: 36,
      tags: ["Safety", "Alerts"],
      new: true,
    },
    {
      id: 5,
      title: "Maintenance Schedule",
      description: "Rotation, balancing and alignment schedule",
      icon: Calendar,
      color: "amber",
      format: "PDF, CSV",
      size: "2.7 MB",
      date: "Mar 10, 2024",
      views: 24,
      tags: ["Maintenance", "Schedule"],
    },
    {
      id: 6,
      title: "Performance Comparison",
      description: "Tyre performance across different brands",
      icon: BarChart3,
      color: "cyan",
      format: "PDF, Excel",
      size: "3.9 MB",
      date: "Mar 8, 2024",
      views: 19,
      tags: ["Comparison", "Performance"],
    },
  ];

  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-cyan-500",
    emerald: "bg-gradient-to-br from-emerald-500 to-green-500",
    purple: "bg-gradient-to-br from-purple-500 to-violet-500",
    red: "bg-gradient-to-br from-red-500 to-pink-500",
    amber: "bg-gradient-to-br from-amber-500 to-orange-500",
    cyan: "bg-gradient-to-br from-cyan-500 to-blue-500",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tyre Reports
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and download detailed tyre analysis reports
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium">
            <Filter className="h-4 w-4" />
            Filter Reports
          </button>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium">
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors hover:shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${
                  colorClasses[report.color]
                } shadow-lg`}
              >
                <report.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                {report.popular && (
                  <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-xs font-medium">
                    Popular
                  </span>
                )}
                {report.new && (
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-medium">
                    New
                  </span>
                )}
                <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {report.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {report.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {report.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {report.date}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {report.views} views
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mt-3">
              <span className="text-gray-600 dark:text-gray-400">
                {report.format}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {report.size}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
