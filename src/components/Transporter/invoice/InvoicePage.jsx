import { InvoiceDashboard } from "./InvoiceDashboard";

export const InvoicePage = () => {
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
  ];

  const customers = [
    {
      id: "CUST-001",
      name: "Reliance Industries",
      email: "accounts@reliance.com",
      phone: "+91 9876543210",
      address: "Mumbai, Maharashtra",
    },
    {
      id: "CUST-002",
      name: "Tata Motors",
      email: "payments@tatamotors.com",
      phone: "+91 9876543211",
      address: "Pune, Maharashtra",
    },
    {
      id: "CUST-003",
      name: "Aditya Birla Group",
      email: "finance@adityabirla.com",
      phone: "+91 9876543212",
      address: "Delhi, NCR",
    },
  ];

  const drivers = [
    { id: "D001", name: "Rajesh Kumar", license: "DL1234567890" },
    { id: "D002", name: "Amit Sharma", license: "DL0987654321" },
    { id: "D003", name: "Suresh Patel", license: "DL1122334455" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <InvoiceDashboard
        vehicles={vehicles}
        customers={customers}
        drivers={drivers}
      />
      <div className="mt-8">{/* <InvoiceReports /> */}</div>
    </div>
  );
};
