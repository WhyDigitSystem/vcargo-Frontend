import { Download, BarChart3, Activity, DollarSign, Users, Map, Calendar, FileText } from "lucide-react";

export const FuelReports = () => {
  const reports = [
    {
      title: "Monthly Consumption Report",
      description: "Detailed fuel consumption analysis by vehicle for March 2024",
      icon: BarChart3,
      color: "blue",
      format: "PDF, CSV, Excel",
      size: "2.4 MB",
    },
    {
      title: "Vehicle Efficiency Report",
      description: "Fuel efficiency comparison across all vehicles",
      icon: Activity,
      color: "emerald",
      format: "PDF, CSV",
      size: "1.8 MB",
    },
    {
      title: "Cost Analysis Report",
      description: "Fuel cost breakdown and budget analysis",
      icon: DollarSign,
      color: "purple",
      format: "PDF, Excel",
      size: "3.1 MB",
    },
    {
      title: "Driver Performance Report",
      description: "Fuel efficiency and consumption by driver",
      icon: Users,
      color: "amber",
      format: "PDF, CSV",
      size: "2.2 MB",
    },
    {
      title: "Station Comparison Report",
      description: "Fuel prices and quality across different stations",
      icon: Map,
      color: "red",
      format: "PDF, Excel",
      size: "1.5 MB",
    },
    {
      title: "Quarterly Summary Report",
      description: "Q1 2024 fuel consumption and cost summary",
      icon: Calendar,
      color: "cyan",
      format: "PDF",
      size: "4.2 MB",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    cyan: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
  };

  const borderClasses = {
    blue: "hover:border-blue-300 dark:hover:border-blue-700",
    emerald: "hover:border-emerald-300 dark:hover:border-emerald-700",
    purple: "hover:border-purple-300 dark:hover:border-purple-700",
    amber: "hover:border-amber-300 dark:hover:border-amber-700",
    red: "hover:border-red-300 dark:hover:border-red-700",
    cyan: "hover:border-cyan-300 dark:hover:border-cyan-700",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fuel Reports</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and download detailed fuel consumption reports
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
          <FileText className="h-4 w-4" />
          Generate Custom Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <div
            key={index}
            className={`border border-gray-200 dark:border-gray-700 rounded-2xl p-5 transition-colors ${borderClasses[report.color]}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${colorClasses[report.color]}`}>
                <report.icon className="h-6 w-6" />
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Download className="h-5 w-5" />
              </button>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{report.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{report.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{report.format}</span>
              <span className="font-medium">{report.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};