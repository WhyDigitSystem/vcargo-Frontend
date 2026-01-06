import { useState } from "react";
import IndentMaster from "../components/Indent/IndentMaster";
import IndentListView from "../components/Indent/IndentListView";


const Indent = () => {
  const [isListView, setIsListView] = useState(true);
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all">
      {isListView ? (
        <IndentListView setIsListView={setIsListView} setEditingId={setEditingId}  />
      ) : (
        <IndentMaster setIsListView={setIsListView} editingId={editingId} />
      )}
    </div>
  );
};

export default Indent;
