import { MaintenanceDashboard } from "./MaintenanceDashboard";

export const MaintenancePage = () => {
  const vehicles = [
    {
      id: "V001",
      registrationNumber: "MH01AB1234",
      make: "Tata",
      model: "Ace",
    },
    {
      id: "V002",
      registrationNumber: "MH01CD5678",
      make: "Ashok Leyland",
      model: "Dost",
    },
    {
      id: "V003",
      registrationNumber: "MH01EF9012",
      make: "Mahindra",
      model: "Bolero",
    },
    // Add more vehicles...
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <MaintenanceDashboard vehicles={vehicles} />
      <div className="mt-8">{/* <MaintenanceReports/> */}</div>
    </div>
  );
};
