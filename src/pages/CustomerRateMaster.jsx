import { useState } from "react";
import CustomerRateListView from "../components/customer/CustomerRateMaster/CustomerRateListView";
import CustomerRateMaster from "../components/customer/CustomerRateMaster/CustomerRateMaster";


const CustomerRate = () => {
  const [isListView, setIsListView] = useState(true);
  const [editId, setEditId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all">
      {isListView ? (
        <CustomerRateListView setIsListView={setIsListView} setEditId={setEditId} />
      ) : (
        <CustomerRateMaster setIsListView={setIsListView} editId={editId} />
      )}
    </div>
  );
};

export default CustomerRate;
