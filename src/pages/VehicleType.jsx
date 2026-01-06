import { useState } from "react";
import VehicleTypeListView from "../components/Vehicle/VehicleType/VehicleTypeListView";
import VehicleTypeMaster from "../components/Vehicle/VehicleType/VehicleTypeMaster";



const VehicleType = () => {
  const [isListView, setIsListView] = useState(true);
  const [editId, setEditId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-300">
      {isListView ? (
        <VehicleTypeListView setIsListView={setIsListView} setEditId={setEditId} />
      ) : (
        <VehicleTypeMaster setIsListView={setIsListView} editId={editId} />
      )}
    </div>
  );
};

export default VehicleType;
