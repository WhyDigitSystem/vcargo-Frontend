import { Calendar, Clock, AlertTriangle, CheckCircle, Car } from "lucide-react";
import { useState } from "react";

export const MaintenanceSchedule = ({ vehicles, records }) => {
  const [view, setView] = useState("week"); // week, month, upcoming

  const upcomingMaintenance = records
    .filter(record => 
      (record.status === 'pending' || record.status === 'scheduled') && 
      new Date(record.scheduledDate) > new Date()
    )
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 5);

  const recentCompleted = records
    .filter(record => record.status === 'completed')
    .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
    .slice(0, 3);

  const overdueMaintenance = records.filter(record => {
    if (record.status === 'pending' || record.status === 'scheduled') {
      const scheduled = new Date(record.scheduledDate);
      const today = new Date();
      return scheduled < today;
    }
    return false;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getDaysUntil = (dateString) => {
    const scheduled = new Date(dateString);
    const today = new Date();
    const diffTime = scheduled - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Maintenance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Maintenance</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1 text-sm rounded-lg ${
                view === "week"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-3 py-1 text-sm rounded-lg ${
                view === "month"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {upcomingMaintenance.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No upcoming maintenance</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingMaintenance.map((record) => {
              const daysUntil = getDaysUntil(record.scheduledDate);
              
              return (
                <div 
                  key={record.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {record.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {record.vehicleName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(record.scheduledDate)}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      daysUntil <= 1 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                      daysUntil <= 3 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' :
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    }`}>
                      {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      record.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                      record.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {record.priority} priority
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {record.odometerReading?.toLocaleString()} km
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Overdue Alerts */}
      {overdueMaintenance.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-red-700 dark:text-red-300">Overdue Maintenance</h3>
            <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {overdueMaintenance.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {overdueMaintenance.slice(0, 3).map((record) => (
              <div key={record.id} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {record.title}
                  </span>
                  <span className="text-xs text-red-600 dark:text-red-400">
                    Overdue
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {record.vehicleName} • Due {formatDate(record.scheduledDate)}
                </div>
              </div>
            ))}
            
            {overdueMaintenance.length > 3 && (
              <div className="text-center pt-2">
                <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                  + {overdueMaintenance.length - 3} more overdue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recently Completed */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Recently Completed</h3>
        </div>
        
        {recentCompleted.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            No completed maintenance
          </p>
        ) : (
          <div className="space-y-3">
            {recentCompleted.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {record.title}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {record.vehicleName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{record.cost || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(record.completedDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};