import { useState } from "react";

import { useNavigate } from "react-router-dom";
import AuctionsMISListview from "../components/Auction/AuctionsMISListview";
import AuctionsMISMaster from "../components/Auction/AuctionsMISMaster";

const AuctionsMIS = () => {
  const [isListView, setIsListView] = useState(false);

  console.log("Test", isListView)
  const navigate = useNavigate();

  return (
    <div>
      {isListView ? (
        <AuctionsMISListview setIsListView={setIsListView} />
      ) : (
        <AuctionsMISMaster setIsListView={setIsListView} />
      )}
    </div>
  );
};

export default AuctionsMIS;
