
import { MapPin } from "lucide-react";
import AddressDisplay from "../QuortsView/AddressDisplay";

const RouteDisplay = ({ loading, unloading }) => {
  return (
    <div className="flex items-start gap-2 mb-3">
      <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />

      <div className="text-sm">
        <p className="text-gray-900 dark:text-white font-medium mb-1">Route</p>

        <div className="space-y-2">
          <AddressDisplay label="From" address={loading} />
          <AddressDisplay label="To" address={unloading} />
        </div>
      </div>
    </div>
  );
};

export default RouteDisplay;
