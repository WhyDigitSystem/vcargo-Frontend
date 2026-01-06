import { useState } from "react";

import { useNavigate } from "react-router-dom";
import VendorRateMaster from "../components/VendorRate/VendoeRateMaster";
import VendorRateListView from "../components/VendorRate/VendorRateListView";

const VendorRate = () => {
  const [isListView, setIsListView] = useState(true);
  const [editId, setEditId] = useState(null);

  console.log("Test", isListView);
  const navigate = useNavigate();

  return (
    <div>
      {isListView ? (
        <VendorRateListView setIsListView={setIsListView} setEditId={setEditId} />
      ) : (
        <VendorRateMaster setIsListView={setIsListView} editId={editId} />
      )}
    </div>
  );
};

export default VendorRate;
