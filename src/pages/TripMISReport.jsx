import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TripMISReportListView from "../components/TripMSIReport/TripMISReportListView";
import TripMISReportMaster from "../components/TripMSIReport/TripMISReportMaster";

const TripMISReport = () => {
  const [isListView, setIsListView] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openMaster) {
      setIsListView(false);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-300">
      {isListView ? (
        <TripMISReportListView setIsListView={setIsListView} />
      ) : (
        <TripMISReportMaster setIsListView={setIsListView} />
      )}
    </div>
  );
};

export default TripMISReport;
