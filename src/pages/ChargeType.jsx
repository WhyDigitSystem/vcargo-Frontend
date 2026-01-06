import { useState } from "react";
import ChargeTypeListView from "../components/ChargeType/ChargeTypeListView";
import ChargeTypeMaster from "../components/ChargeType/ChargeTypeMaster";

const ChargeType = () => {
  const [isListView, setIsListView] = useState(true);
  const [editId, setEditId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all">
      {isListView ? (
        <ChargeTypeListView setIsListView={setIsListView} setEditId={setEditId} />
      ) : (
        <ChargeTypeMaster setIsListView={setIsListView} editId={editId} />
      )}
    </div>
  );
};

export default ChargeType;