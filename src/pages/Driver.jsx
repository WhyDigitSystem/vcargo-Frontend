import { useState } from "react";
import DriverListView from "../components/Driver/DriverListView";
import DriverMaster from "../components/Driver/DriverMaster";

const Driver = () => {
  const [isListView, setIsListView] = useState(true);
  const [editId, setEditId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-300">
      {isListView ? (
        <DriverListView setIsListView={setIsListView} setEditId={setEditId} />
      ) : (
        <DriverMaster setIsListView={setIsListView} editId={editId} />
      )}
    </div>
  );
};

export default Driver;
