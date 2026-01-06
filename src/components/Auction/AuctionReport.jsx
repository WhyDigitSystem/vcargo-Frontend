import {
  BarChart3,
  Calendar,
  FileText,
  PieChart,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RCPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { auctionsAPI } from "../../api/auctionsAPI";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

export default function AuctionAnalyticsReport() {
  const [search, setSearch] = useState("");
  const [auctionData, setAuctionData] = useState([]);

  const { user } = useSelector((state) => state.auth);
  const orgId = user.orgId;

  const count = 10;
  const page = 1;

  console.log("orgId==>", orgId);

  // ================= CALL API =================
  useEffect(() => {
    async function loadData() {
      try {
        const response = await auctionsAPI.getAuctionsReport({
          count,
          page,
          orgId,
        });

        setAuctionData(response.paramObjectsMap.approvedQuotes.data || []);
      } catch (e) {
        console.error("API Error", e);
      }
    }
    loadData();
  }, []);

  // ================= FILTERING =================
  const filtered = useMemo(() => {
    return auctionData.filter((a) =>
      a.material?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, auctionData]);

  // ===================== KPI VALUES =====================
  const totalAuctions = auctionData.length;

  const avgApprovedAmount =
    auctionData.reduce((s, a) => s + (a.approvedamount || 0), 0) /
      totalAuctions || 0;

  const totalMaterialQty = auctionData.reduce(
    (s, a) => s + (a.materialquantity || 0),
    0
  );

  const activeDates = new Set(auctionData.map((a) => a.unloadingdate)).size;

  // ===================== CHART DATA =====================
  const barData = auctionData.map((a) => ({
    id: a.auctionsid,
    minQuoted: a.minquotedamount,
    maxQuoted: a.maxquotedamount,
  }));

  const pieData = [
    {
      name: "Min Approved",
      value: auctionData.reduce((s, a) => s + a.minquotedamount, 0),
    },
    {
      name: "Max Approved",
      value: auctionData.reduce((s, a) => s + a.maxquotedamount, 0),
    },
  ];

  const trendData = auctionData.map((a) => ({
    date: a.unloadingdate,
    approved: a.approvedamount,
  }));

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Auction Analytics Report
        </h1>

        <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border dark:border-gray-700 gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            className="bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200"
            placeholder="Search Material"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard
          icon={FileText}
          title="Total Auctions"
          value={totalAuctions}
          color="blue"
        />

        <KpiCard
          icon={Users}
          title="Total Material Qty"
          value={totalMaterialQty}
          color="purple"
        />

        <KpiCard
          icon={TrendingUp}
          title="Avg Approved Amount"
          value={`₹${avgApprovedAmount.toFixed(2)}`}
          color="green"
        />

        <KpiCard
          icon={Calendar}
          title="Active Dates"
          value={`${activeDates} days`}
          color="yellow"
        />
      </div>

      {/* ================= GRAPHS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* BAR CHART */}
        <ChartCard title="Min vs Max Quoted Amount" icon={BarChart3}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="minQuoted" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="maxQuoted" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* LINE CHART */}
        <ChartCard title="Approved Amount Trend" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="approved"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ================= PIE CHART ================= */}
      <div className="mb-8">
        <ChartCard title="Overall Bid Distribution" icon={PieChart}>
          <ResponsiveContainer width="100%" height={280}>
            <RCPieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </RCPieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border dark:border-gray-700">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">
          Auction Details
        </h2>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2">Auction ID</th>
              <th>Material</th>
              <th>Min Quote</th>
              <th>Max Quote</th>
              <th>Approved</th>
              <th>Vendor</th>
              <th>Unloading Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a) => (
              <tr
                key={a.auctionsid}
                className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/40"
              >
                <td className="py-2">{a.auctionsid}</td>
                <td>{a.material}</td>
                <td>₹{a.minquotedamount}</td>
                <td>₹{a.maxquotedamount}</td>
                <td>₹{a.approvedamount}</td>
                <td>{a.approvedVendor}</td>
                <td>{a.unloadingdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================ REUSABLE COMPONENTS ================ */

function KpiCard({ title, value, icon: Icon, color }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/40",
    purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/40",
    green: "text-green-600 bg-green-100 dark:bg-green-900/40",
    yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40",
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function ChartCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>

      {children}
    </div>
  );
}
