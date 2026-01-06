import { useState } from "react";
import VendorListView from "../components/vendor/VendorListView";
import VendorMaster from "../components/vendor/VendorMaster";


const Vendor = () => {
  const [isListView, setIsListView] = useState(true);
  const [editId, setEditId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all">
      {isListView ? (
        <VendorListView setIsListView={setIsListView} setEditId={setEditId} />
      ) : (
        <VendorMaster setIsListView={setIsListView} editId={editId} />
      )}
    </div>
  );
};

export default Vendor;
