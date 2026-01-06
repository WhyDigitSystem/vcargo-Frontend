import { useState } from "react";
import RouteListView from "../components/routeMaster/RouteListView";
import RouteMaster from "../components/routeMaster/RouteMaster";


const RoutePage = () => {
  const [isListView, setIsListView] = useState(true);
  const [editId, setEditId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all">
      {isListView ? (
        <RouteListView setIsListView={setIsListView} setEditId={setEditId} />
      ) : (
        <RouteMaster setIsListView={setIsListView} editId={editId} />
      )}
    </div>
  );
};

export default RoutePage;
