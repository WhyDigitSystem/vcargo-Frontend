import { 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MoreVertical,
  ChevronRight,
  Shield,
  Zap
} from "lucide-react";

export const TyreList = ({ 
  tyres, 
  onEdit, 
  onDelete, 
  selectedTyres, 
  onSelectTyre 
}) => {
  const handleSelectAll = () => {
    if (selectedTyres.length === tyres.length) {
      onSelectTyre([]);
    } else {
      onSelectTyre(tyres.map(t => t.id));
    }
  };

  const handleSelectTyre = (id) => {
    if (selectedTyres.includes(id)) {
      onSelectTyre(selectedTyres.filter(tId => tId !== id));
    } else {
      onSelectTyre([...selectedTyres, id]);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      case 'repair': return 'bg-blue-500';
      case 'scrap': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Active';
      case 'warning': return 'Warning';
      case 'critical': return 'Critical';
      case 'repair': return 'Under Repair';
      case 'scrap': return 'Scrapped';
      default: return 'Unknown';
    }
  };

  const getTreadDepthColor = (depth) => {
    if (depth <= 1.6) return 'text-red-600 dark:text-red-400';
    if (depth <= 3) return 'text-amber-600 dark:text-amber-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={tyres.length > 0 && selectedTyres.length === tyres.length}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tyres ({tyres.length})
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="hidden md:inline">Status</span>
            <span className="hidden lg:inline">Tread Depth</span>
            <span className="hidden xl:inline">Actions</span>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {tyres.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4">
              <Shield className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tyres found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add your first tyre or adjust your filters
            </p>
          </div>
        ) : (
          tyres.map((tyre) => (
            <div 
              key={tyre.id} 
              className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors ${
                selectedTyres.includes(tyre.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedTyres.includes(tyre.id)}
                    onChange={() => handleSelectTyre(tyre.id)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  
                  {/* Tyre Info */}
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      tyre.treadDepth <= 1.6 ? 'bg-red-100 dark:bg-red-900/20' :
                      tyre.treadDepth <= 3 ? 'bg-amber-100 dark:bg-amber-900/20' :
                      'bg-emerald-100 dark:bg-emerald-900/20'
                    }`}>
                      <Zap className={`h-5 w-5 ${
                        tyre.treadDepth <= 1.6 ? 'text-red-600 dark:text-red-400' :
                        tyre.treadDepth <= 3 ? 'text-amber-600 dark:text-amber-400' :
                        'text-emerald-600 dark:text-emerald-400'
                      }`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {tyre.serialNumber}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tyre.status)} text-white`}>
                          {getStatusText(tyre.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tyre.brand} {tyre.model} • {tyre.size}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {tyre.vehicleName}
                        </span>
                        <span>•</span>
                        <span>{tyre.position}</span>
                        <span>•</span>
                        <span>Odometer: {tyre.odometerReading.toLocaleString()} km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-8">
                  {/* Status Indicator */}
                  <div className="hidden md:block">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(tyre.status)}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getStatusText(tyre.status)}
                      </span>
                    </div>
                  </div>

                  {/* Tread Depth */}
                  <div className="hidden lg:block">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getTreadDepthColor(tyre.treadDepth)}`}>
                        {tyre.treadDepth} mm
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Tread Depth
                      </div>
                    </div>
                  </div>

                  {/* Pressure */}
                  <div className="hidden xl:block">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        Math.abs(tyre.pressure - tyre.recommendedPressure) > 3 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {tyre.pressure} PSI
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Pressure
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(tyre)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      title="Edit tyre"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(tyre.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Delete tyre"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info - Mobile */}
              <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Tread Depth
                    </div>
                    <div className={`text-sm font-medium ${getTreadDepthColor(tyre.treadDepth)}`}>
                      {tyre.treadDepth} mm
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Pressure
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {tyre.pressure} PSI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};