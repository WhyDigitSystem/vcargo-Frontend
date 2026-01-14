import {
  BarChart3,
  Car,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Fuel,
  Loader2,
  MapPin,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TrendsDashboard = () => {
  const tripCanvasRef = useRef(null);
  const fuelCanvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("month");
  const [activeTab, setActiveTab] = useState("trips");
  const [showFuelChart, setShowFuelChart] = useState(true);
  const [showTripChart, setShowTripChart] = useState(true);

  const timeFilters = [
    { id: "week", label: "Last 7 Days" },
    { id: "month", label: "Last 30 Days" },
    { id: "quarter", label: "Last 90 Days" },
  ];

  // Sample data - replace with your API data
  const trendsData = {
    week: {
      trips: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        completed: [18, 22, 20, 25, 28, 24, 16],
        delayed: [2, 1, 3, 2, 1, 4, 6],
        revenue: [4200, 5100, 4800, 6200, 6800, 5600, 3800],
        avgDuration: [4.2, 3.8, 4.5, 3.9, 4.1, 4.8, 5.2],
      },
      fuel: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        efficiency: [8.2, 8.0, 8.4, 7.9, 8.3, 8.1, 7.8],
        consumption: [425, 410, 440, 390, 430, 415, 380],
        cost: [1250, 1200, 1300, 1150, 1280, 1220, 1120],
        vehicles: [18, 22, 20, 25, 28, 24, 16],
      },
    },
    month: {
      trips: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        completed: [85, 92, 88, 95],
        delayed: [12, 8, 10, 6],
        revenue: [19800, 21500, 20800, 22500],
        avgDuration: [4.1, 3.9, 4.2, 3.8],
      },
      fuel: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        efficiency: [8.2, 8.1, 8.3, 8.5],
        consumption: [1650, 1720, 1580, 1480],
        cost: [4850, 5050, 4650, 4350],
        vehicles: [85, 92, 88, 95],
      },
    },
    quarter: {
      trips: {
        labels: ["Jan", "Feb", "Mar"],
        completed: [320, 350, 380],
        delayed: [45, 38, 32],
        revenue: [75800, 82500, 89200],
        avgDuration: [4.2, 4.0, 3.9],
      },
      fuel: {
        labels: ["Jan", "Feb", "Mar"],
        efficiency: [8.1, 8.3, 8.6],
        consumption: [4850, 5250, 4950],
        cost: [14250, 15450, 14550],
        vehicles: [320, 350, 380],
      },
    },
  };

  const currentData = trendsData[timeFilter];

  // Draw Trip Trend Chart
  useEffect(() => {
    const canvas = tripCanvasRef.current;
    if (!canvas || !showTripChart) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const data = currentData.trips;
    const maxValue = Math.max(...data.completed, ...data.delayed);
    const xStep = chartWidth / (data.labels.length - 1);
    const yStep = chartHeight / maxValue;

    // Draw grid lines
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw X and Y axes
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth = 2;

    // Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // X axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = "#6B7280";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // X axis labels
    data.labels.forEach((label, i) => {
      const x = padding + i * xStep;
      ctx.fillText(label, x, height - padding + 10);
    });

    // Y axis labels
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue / 5) * i);
      const y = height - padding - (chartHeight / 5) * i;
      ctx.textAlign = "right";
      ctx.fillText(value.toString(), padding - 10, y - 6);
    }

    // Draw completed trips line
    ctx.beginPath();
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";

    data.completed.forEach((value, i) => {
      const x = padding + i * xStep;
      const y = height - padding - value * yStep;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw delayed trips line
    ctx.beginPath();
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    data.delayed.forEach((value, i) => {
      const x = padding + i * xStep;
      const y = height - padding - value * yStep;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw data points for completed trips
    data.completed.forEach((value, i) => {
      const x = padding + i * xStep;
      const y = height - padding - value * yStep;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#3B82F6";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Chart titles
    ctx.fillStyle = "#1F2937";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Trips Trend", padding, 20);
  }, [currentData, showTripChart]);

  // Draw Fuel Efficiency Chart
  useEffect(() => {
    const canvas = fuelCanvasRef.current;
    if (!canvas || !showFuelChart) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const data = currentData.fuel;
    const maxEfficiency = Math.max(...data.efficiency) * 1.1;
    const maxConsumption = Math.max(...data.consumption);
    const xStep = chartWidth / (data.labels.length - 1);

    // Draw grid lines
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw X and Y axes
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth = 2;

    // Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // X axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = "#6B7280";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // X axis labels
    data.labels.forEach((label, i) => {
      const x = padding + i * xStep;
      ctx.fillText(label, x, height - padding + 10);
    });

    // Y axis labels (efficiency)
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const value = ((maxEfficiency / 5) * i).toFixed(1);
      const y = height - padding - (chartHeight / 5) * i;
      ctx.fillText(value, padding - 10, y - 6);
    }

    // Draw efficiency bars
    const barWidth = xStep * 0.6;
    data.efficiency.forEach((value, i) => {
      const x = padding + i * xStep - barWidth / 2;
      const barHeight = (value / maxEfficiency) * chartHeight;
      const y = height - padding - barHeight;

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, "#10B981");
      gradient.addColorStop(1, "#34D399");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Value on top of bar
      ctx.fillStyle = "#047857";
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(value.toFixed(1), x + barWidth / 2, y - 8);
    });

    // Chart titles
    ctx.fillStyle = "#1F2937";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Fuel Efficiency Trend", padding, 20);
  }, [currentData, showFuelChart]);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleDownload = (type) => {
    const canvas =
      type === "trips" ? tripCanvasRef.current : fuelCanvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${type}-trend-${timeFilter}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Calculate stats
  const tripStats = {
    totalCompleted: currentData.trips.completed.reduce((a, b) => a + b, 0),
    totalDelayed: currentData.trips.delayed.reduce((a, b) => a + b, 0),
    avgRevenue: Math.round(
      currentData.trips.revenue.reduce((a, b) => a + b, 0) /
        currentData.trips.revenue.length
    ),
    onTimeRate: Math.round(
      ((currentData.trips.completed.reduce((a, b) => a + b, 0) -
        currentData.trips.delayed.reduce((a, b) => a + b, 0)) /
        currentData.trips.completed.reduce((a, b) => a + b, 0)) *
        100
    ),
  };

  const fuelStats = {
    avgEfficiency: (
      currentData.fuel.efficiency.reduce((a, b) => a + b, 0) /
      currentData.fuel.efficiency.length
    ).toFixed(1),
    totalConsumption: currentData.fuel.consumption.reduce((a, b) => a + b, 0),
    totalCost: currentData.fuel.cost.reduce((a, b) => a + b, 0),
    avgCostPerKm: (
      currentData.fuel.cost.reduce((a, b) => a + b, 0) /
      currentData.fuel.consumption.reduce((a, b) => a + b, 0)
    ).toFixed(2),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trip Trend Component */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Trip Trends
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Completed vs Delayed trips
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Time Filter */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {timeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    timeFilter === filter.id
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowTripChart(!showTripChart)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={showTripChart ? "Hide chart" : "Show chart"}
              >
                {showTripChart ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => handleDownload("trips")}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Download chart"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Refresh data"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Completed
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {tripStats.totalCompleted}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>+12%</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Delayed
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {tripStats.totalDelayed}
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <TrendingDown className="h-3 w-3" />
              <span>-8%</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg Revenue
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              ${(tripStats.avgRevenue / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>+5.2%</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                On-time Rate
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {tripStats.onTimeRate}%
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>+3.1%</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        {showTripChart ? (
          <div className="relative">
            <canvas
              ref={tripCanvasRef}
              width={600}
              height={300}
              className="w-full h-auto"
            />

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Completed Trips
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-red-500 border-dashed border"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Delayed Trips
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-3" />
              <p className="text-sm">
                Chart is hidden. Click the eye icon to show.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500 dark:text-gray-400">
              Showing{" "}
              {timeFilter === "week"
                ? "7"
                : timeFilter === "month"
                ? "30"
                : "90"}{" "}
              day trend
            </div>
            <button
              onClick={() => console.log("View trip analytics")}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
            >
              Trip Analytics
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fuel Efficiency Component */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <Fuel className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                Fuel Efficiency
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Consumption vs Efficiency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Time Filter */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {timeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    timeFilter === filter.id
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowFuelChart(!showFuelChart)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={showFuelChart ? "Hide chart" : "Show chart"}
              >
                {showFuelChart ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => handleDownload("fuel")}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Download chart"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Refresh data"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Avg Efficiency
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {fuelStats.avgEfficiency} km/l
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>+0.4</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Consumption
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {(fuelStats.totalConsumption / 1000).toFixed(1)}K L
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <TrendingDown className="h-3 w-3" />
              <span>-5%</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Cost
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              ${(fuelStats.totalCost / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
              <TrendingDown className="h-3 w-3" />
              <span>-8%</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Cost/Km
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              ${fuelStats.avgCostPerKm}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="h-3 w-3" />
              <span>-12%</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        {showFuelChart ? (
          <div className="relative">
            <canvas
              ref={fuelCanvasRef}
              width={600}
              height={300}
              className="w-full h-auto"
            />

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Fuel Efficiency (km/l)
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-3" />
              <p className="text-sm">
                Chart is hidden. Click the eye icon to show.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500 dark:text-gray-400">
              {fuelStats.avgEfficiency} km/l average efficiency
            </div>
            <button
              onClick={() => console.log("View fuel analytics")}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              Fuel Analytics
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsDashboard;
