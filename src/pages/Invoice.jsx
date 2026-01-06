import { useState } from "react";
import InvoiceListView from "../components/Invoice/InvoiceListView";
import InvoiceMaster from "../components/Invoice/InvoiceMaster";


const Invoice = () => {
  const [isListView, setIsListView] = useState(true);
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all">
      {isListView ? (
        <InvoiceListView setIsListView={setIsListView} setEditingId={setEditingId} />
      ) : (
        <InvoiceMaster setIsListView={setIsListView} editingId={editingId} />
      )}
    </div>
  );
};

export default Invoice;
