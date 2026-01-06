import { useState } from "react";

import { useNavigate } from "react-router-dom";
import TripAlertsLIstView from "../components/trip/TripAlerts/TripAlertsLIstView";
import TripAlertsMaster from "../components/trip/TripAlerts/TripAlertsMaster";

const TripAlerts = () => {
  const [isListView, setIsListView] = useState(true);

  console.log("Test", isListView)
  const navigate = useNavigate();

  return (
    <div>
      {isListView ? (
        <TripAlertsLIstView setIsListView={setIsListView} />
      ) : (
        <TripAlertsMaster setIsListView={setIsListView} />
      )}
    </div>
  );
};

export default TripAlerts;
