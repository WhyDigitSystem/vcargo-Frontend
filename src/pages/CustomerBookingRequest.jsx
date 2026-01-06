import { useState } from "react";
import CustomerBookingRequestListView from "../components/customer/CustomerBookingRequest/CustomerBookingRequestListView";
import CustomerBookingRequestMaster from "../components/customer/CustomerBookingRequest/CustomerBookingRequestMaster";


const CustomerBookingRequest = () => {
  const [isListView, setIsListView] = useState(true);
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all">
      {isListView ? (
        <CustomerBookingRequestListView setIsListView={setIsListView} setEditingId={setEditingId} />
      ) : (
        <CustomerBookingRequestMaster setIsListView={setIsListView} editingId={editingId} />
      )}
    </div>
  );
};

export default CustomerBookingRequest;
