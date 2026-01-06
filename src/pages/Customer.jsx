import { useState } from "react";
import CustomerListView from "../components/customer/CustomerListView";
import CustomerMaster from "../components/customer/CustomerMaster";

const Customer = () => {
  const [isListView, setIsListView] = useState(true);
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const handleEditCustomer = (customerId) => {
    setEditingCustomerId(customerId);
    setIsListView(false);
  };

  const handleAddCustomer = () => {
    setEditingCustomerId(null);
    setIsListView(false);
  };

  const handleBackToList = () => {
    setEditingCustomerId(null);
    setIsListView(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all">
      {isListView ? (
        <CustomerListView
          onEdit={handleEditCustomer}
          onAddCustomer={handleAddCustomer}
        />
      ) : (
        <CustomerMaster
          editingCustomerId={editingCustomerId}
          onBackToList={handleBackToList}
        />
      )}
    </div>
  );
};

export default Customer;