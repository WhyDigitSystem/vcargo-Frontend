import { useState } from "react";

import { useNavigate } from "react-router-dom";
import TripListView from "../components/trip/TripListView";
import TripMaster from "../components/trip/TripMaster";

const Trips = () => {
  const [isListView, setIsListView] = useState(true);
  const [editId, setEditId] = useState(null);

  console.log("Test", isListView)
  const navigate = useNavigate();

  return (
    <div>
      {isListView ? (
        <TripListView setIsListView={setIsListView} setEditId={setEditId} />
      ) : (
        <TripMaster setIsListView={setIsListView} editId={editId} />
      )}
    </div>
  );
};

export default Trips;
