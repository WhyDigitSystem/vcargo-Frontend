import { useState } from "react";

import AuctionsListView from "../components/Auction/AuctionsListView";
import AuctionsMaster from "../components/Auction/AuctionsMaster";

const Auctions = () => {
  const [isListView, setIsListView] = useState(true);
  const [editingId, setEditingId] = useState(null);

  return (
    <div>
      {isListView ? (
        <AuctionsListView setIsListView={setIsListView} setEditingId={setEditingId} />
      ) : (
        <AuctionsMaster setIsListView={setIsListView} editingId={editingId} />
      )}
    </div>
  );
};

export default Auctions;
