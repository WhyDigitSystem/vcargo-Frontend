import { TripDashboard } from "./TripDashboard";

export const TripPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <TripDashboard />
      <div className="mt-8">{/* <TripReports /> */}</div>
    </div>
  );
};