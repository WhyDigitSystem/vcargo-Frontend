import { Award, FileText, Gavel, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuctionModal from "./AuctionModal";
import KpiCard from "./KpiCard";
import QuoteCard from "./QuoteCard";

import { quoteAPI } from "../../api/quoteAPI";

const QuortsListView = () => {
  const [quotes, setQuotes] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const [selectedAuction, setSelectedAuction] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.usersId;

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      const res = await quoteAPI.getQuotesListByUser({
        page: 1,
        count: 500,
        search,
        userId,
      });

      const list = res?.paramObjectsMap?.quoteVO?.data || [];
      setQuotes(list.reverse());

      setGrouped(
        list.reduce((acc, q) => {
          const id = q.auction.id;
          if (!acc[id]) acc[id] = { auction: q.auction, quotes: [] };
          acc[id].quotes.push(q);
          return acc;
        }, {})
      );
    } catch (err) {
      console.error("Error loading quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  // KPI Stats
  const stats = [
    {
      label: "Active Auctions",
      count: Object.keys(grouped).length,
      color: "purple",
      icon: Gavel,
      description: "With quotes received",
    },
    {
      label: "Total Quotes",
      count: quotes.length,
      color: "blue",
      icon: FileText,
      description: "Across all auctions",
    },
    {
      label: "Avg Quotes/Auction",
      count:
        Object.keys(grouped).length > 0
          ? (quotes.length / Object.keys(grouped).length).toFixed(1)
          : 0,
      color: "green",
      icon: Star,
      description: "Competition level",
    },
    {
      label: "Quotes Selected",
      count: 0,
      color: "yellow",
      icon: Award,
      description: "Chosen by user",
    },
  ];

  const sortList = (arr) => {
    const sorted = [...arr];

    switch (sortBy) {
      case "priceLow":
        return sorted.sort((a, b) => a.quoteAmount - b.quoteAmount);
      case "priceHigh":
        return sorted.sort((a, b) => b.quoteAmount - a.quoteAmount);
      case "fastest":
        return sorted.sort(
          (a, b) =>
            new Date(a.estimatedDeliveryDate) -
            new Date(b.estimatedDeliveryDate)
        );
      case "rating":
        return sorted.sort(
          (a, b) => (b.user?.rating || 0) - (a.user?.rating || 0)
        );
      case "recommended":
      default:
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
  };

  const filtered = Object.entries(grouped).filter(([id, data]) => {
    if (search) {
      const s = search.toLowerCase();
      return (
        data.auction.material.toLowerCase().includes(s) ||
        data.auction.loading.toLowerCase().includes(s) ||
        data.auction.unloading.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Auction Quotes Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            View and select the best quotes for each auction
          </p>
        </div>

        <button
          onClick={() => navigate("/auction-list")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
            dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl flex gap-2 items-center"
        >
          <Plus className="h-4 w-4" />
          New Auction
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <KpiCard key={s.label} {...s} />
        ))}
      </div>

      {/* ---------------- EMPTY STATE or AUCTION CARDS ---------------- */}
      <div className="min-h-[100px]">
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center text-center py-5 
            bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 
            shadow-sm animate-fadeIn"
          >
            <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/40 mb-4">
              <Gavel className="h-10 w-10 text-blue-600 dark:text-blue-300" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Auctions Found
            </h3>

            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
              {quotes.length === 0
                ? "You haven't received any auction quotes yet. Create a new auction to begin."
                : "No auctions match your search or filters. Try adjusting your criteria."}
            </p>

            <button
              onClick={() => navigate("/auction-list")}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 
                dark:bg-blue-500 dark:hover:bg-blue-600 text-white flex items-center gap-2 
                transition-all shadow-md"
            >
              <Plus className="h-4 w-4" />
              Create New Auction
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filtered.map(([id, data]) => {
              const sortedQuotes = sortList(data.quotes);
              return (
                <QuoteCard
                  key={id}
                  auction={data.auction}
                  quotes={sortedQuotes}
                  onView={() =>
                    setSelectedAuction({
                      auction: data.auction,
                      quotes: sortedQuotes,
                    })
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedAuction && (
        <AuctionModal
          auction={selectedAuction.auction}
          quotes={selectedAuction.quotes}
          onClose={() => setSelectedAuction(null)}
          onQuoteApproved={fetchQuotes}
        />
      )}
    </div>
  );
};

export default QuortsListView;
