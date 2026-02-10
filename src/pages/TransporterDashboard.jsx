import QuickStats from "../components/Transporter/Dashboard/QuickStats";
import RecentActivities from "../components/Transporter/Dashboard/RecentActivities";
import DashboardHighlights from "../components/Transporter/Dashboard/DashboardHighlights";

const TransporterDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <DashboardHighlights />
      </div>
    </div>
  );
};

export default TransporterDashboard;
