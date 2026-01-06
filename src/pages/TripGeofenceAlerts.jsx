import { useState } from "react";

import { useNavigate } from "react-router-dom";
import TripGeofenceAlertsListView from "../components/trip/TripGeofenceAlerts/TripGeofenceAlertsListView";
import TripGeofenceAlertsMaster from "../components/trip/TripGeofenceAlerts/TripGeofenceAlertsMaster";

const TripGeofenceAlerts = () => {
  const [isListView, setIsListView] = useState(true);

  console.log("Test", isListView)
  const navigate = useNavigate();

  return (
    <div>
      {isListView ? (
        <TripGeofenceAlertsListView setIsListView={setIsListView} />
      ) : (
        <TripGeofenceAlertsMaster setIsListView={setIsListView} />
      )}
    </div>
  );
};

export default TripGeofenceAlerts;
