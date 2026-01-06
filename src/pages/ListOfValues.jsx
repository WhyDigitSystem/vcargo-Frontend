import { useState } from "react";
import ListOfValuesListView from "../components/ListOfValues/ListOfValuesListView";
import ListOfValuesMaster from "../components/ListOfValues/ListOfValuesMaster";

const ListOfValues = () => {
  const [isListView, setIsListView] = useState(true);
  const [editId, setEditId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-300">
      {isListView ? (
        <ListOfValuesListView setIsListView={setIsListView} setEditId={setEditId} />
      ) : (
        <ListOfValuesMaster setIsListView={setIsListView} editId={editId} />
      )}
    </div>
  );
};

export default ListOfValues;
