import { Clock, Navigation, MapPin, Car, User, AlertCircle } from "lucide-react";

export const TripTimeline = ({ trips, onStatusChange }) => {
  const activeTrips = trips.filter(t => t.status === 'in_progress');
  const upcomingTrips = trips.filter(t => t.status === 'scheduled')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimeRemaining = (trip) => {
    if (trip.status !== 'in_progress') return null;
    
    const start = new Date(`${trip.startDate}T${trip.startTime}`);
    const now = new Date();
    const elapsed = now - start;
    const estimatedMs = parseFloat(trip.estimatedDuration) * 60 * 60 * 1000;
    const remainingMs = estimatedMs - elapsed;
    
    if (remainingMs <= 0) return { text: 'Overdue', color: 'text-red-600 dark:text-red-400' };
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return { text: `${hours}h ${minutes}m left`, color: 'text-amber-600 dark:text-amber-400' };
    } else {
      return { text: `${minutes}m left`, color: 'text-amber-600 dark:text-amber-400' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Trips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Active Trips</h3>
          <span className="ml-auto bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {activeTrips.length}
          </span>
        </div>
        
        {activeTrips.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No active trips</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTrips.map((trip) => {
              const timeRemaining = getTimeRemaining(trip);
              
              return (
                <div key={trip.id} className="p-4 border border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {trip.tripNumber}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {trip.source} → {trip.destination}
                      </div>
                    </div>
                    {timeRemaining && (
                      <span className={`text-xs font-medium ${timeRemaining.color}`}>
                        {timeRemaining.text}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Car className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{trip.vehicleName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{trip.driverName}</span>
                    </div>
                  </div>
                  
                  {trip.currentLocation && (
                    <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Current Location</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {trip.currentLocation}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => onStatusChange(trip.id, 'completed')}
                    className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                  >
                    Mark as Completed
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
            <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Trips</h3>
          <span className="ml-auto bg-cyan-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {upcomingTrips.length}
          </span>
        </div>
        
        {upcomingTrips.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            No upcoming trips
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {trip.tripNumber}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {trip.source} → {trip.destination}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {formatTime(trip.startTime)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(trip.startDate).toLocaleDateString('en-IN', { weekday: 'short' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    {trip.vehicleName}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {trip.driverName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Today's Summary</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {trips.filter(t => 
                new Date(t.startDate).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Trips Today
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {trips.filter(t => 
                new Date(t.startDate).toDateString() === new Date().toDateString() &&
                t.status === 'completed'
              ).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Completed
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {trips.filter(t => 
                new Date(t.startDate).toDateString() === new Date().toDateString() &&
                t.status === 'in_progress'
              ).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              In Progress
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {trips.filter(t => 
                new Date(t.startDate).toDateString() === new Date().toDateString()
              ).reduce((sum, trip) => sum + (trip.distance || 0), 0)} km
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Distance Today
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};