import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AuctionDashboard from "./components/Auction/AuctionDashboard";
import LoginForm from "./components/Auth/LoginForm";
import Layout from "./components/Layout/Layout";
import ProfileSettings from "./components/settings/Profile";
import SettingsDashboard from "./components/settings/SettingsDashboard";
import UserManagement from "./components/settings/UserManagement";
import ActiveBids from "./components/Transporter/ActiveBids";
import MyQuotes from "./components/Transporter/MyQuotes";
import VehicleFleet from "./components/Transporter/VehicleFleet";
import TripExecutionDashboard from "./components/trip/TripExecutionDashboard";
import Auctions from "./pages/Auctions";
import AuctionsMIS from "./pages/AuctionsMIS";
import Customer from "./pages/Customer";
import CustomerBookingRequest from "./pages/CustomerBookingRequest";
import CustomerRate from "./pages/CustomerRateMaster";
import Dashboard from "./pages/Dashboard";
import Driver from "./pages/Driver";
import Indent from "./pages/Indent";
import Invoice from "./pages/Invoice";
import Payouts from "./pages/Payouts";
import RFQ from "./pages/RFQ";
import RoutePage from "./pages/RoutePage";
import TransporterDashboard from "./pages/TransporterDashboard";
import Trip from "./pages/Trip";
import TripAlerts from "./pages/TripAlerts";
import TripGeofenceAlerts from "./pages/TripGeofenceAlerts";
import TripMISReport from "./pages/TripMISReport";
import Vehicle from "./pages/Vehicle";
import VehicleType from "./pages/VehicleType";
import Vendor from "./pages/Vendor";
import VendorRate from "./pages/VendorRate";
import { store } from "./store";
import "./styles/globals.css";

// ADD THIS IMPORT
import GoogleMapsProvider from "./components/common/GoogleMapsProvider";
import QuortsListView from "./components/QuortsView/quortsListView";
import Documents from "./components/Transporter/Documents";
import DriverManagement from "./components/Transporter/DriverManagement";
import FuelManagement from "./components/Transporter/FuelManagement";
import InvoiceManagement from "./components/Transporter/InvoiceManagement";
import PaymentSetup from "./components/Transporter/PaymentSetup";
import RoutesAndZones from "./components/Transporter/RoutesAndZones";
import SettingsScreen from "./components/Transporter/Settings";
import TripScheduling from "./components/Transporter/TripScheduling";
import { TyreManagementPage } from "./components/Transporter/tyre/TyreManagementPage";
import VehicleMaintenance from "./components/Transporter/VehicleMaintenance";
import VehicleManagement from "./components/Transporter/VehicleManagement";
import ChargeType from "./pages/ChargeType";
import ListOfValues from "./pages/ListOfValues";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NetworkStatusNotifier from "./utils/NetworkStatusNotifier";
import { MaintenancePage } from "./components/Transporter/maintenance/MaintenancePage";

// Theme initializer component
const ThemeInitializer = () => {
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return null;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/" />;
};

// User Type Based Route Component
const UserTypeRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.type === "Transporter") {
    return <TransporterDashboard />;
  }

  if (user?.type === "Sadmin") {
    // Fixed typo: retutn -> return
    return <SuperAdminDashboard />;
  }

  // Default to Industry dashboard
  return <Dashboard />;
};

const AppContent = () => {
  const { user } = useSelector((state) => state.auth);
  const isTransporter = user?.type === "Transporter";

  return (
    <>
      <ThemeInitializer />
      {/* WRAP ROUTER WITH GOOGLE MAPS PROVIDER */}
      <GoogleMapsProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      {/* Main route based on user type */}
                      <Route path="/" element={<UserTypeRoute />} />

                      {/* Industry routes - only accessible if not transporter */}
                      {!isTransporter && (
                        <>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/vendor" element={<Vendor />} />
                          <Route path="/customer" element={<Customer />} />
                          <Route
                            path="/customer-rate"
                            element={<CustomerRate />}
                          />
                          <Route path="/route" element={<RoutePage />} />
                          <Route path="/trip" element={<Trip />} />
                          <Route
                            path="/vehicle-type"
                            element={<VehicleType />}
                          />
                          <Route path="/vehicle" element={<Vehicle />} />
                          <Route path="/driver" element={<Driver />} />
                          <Route path="/charge-type" element={<ChargeType />} />
                          <Route
                            path="/auction"
                            element={<AuctionDashboard />}
                          />
                          <Route path="/auction-list" element={<Auctions />} />
                          <Route path="/quotes" element={<QuortsListView />} />
                          <Route
                            path="/auction-report"
                            element={<AuctionsMIS />}
                          />
                          <Route
                            path="/trip-execution"
                            element={<TripExecutionDashboard />}
                          />
                          <Route
                            path="/trip-geofence-alerts"
                            element={<TripGeofenceAlerts />}
                          />
                          <Route path="/trip-alerts" element={<TripAlerts />} />
                          <Route
                            path="/trip-report-mis"
                            element={<TripMISReport />}
                          />
                          <Route path="/indents" element={<Indent />} />
                          <Route path="/vendor-invoice" element={<Invoice />} />
                          <Route path="/vendor-rate" element={<VendorRate />} />
                          <Route
                            path="/booking-request"
                            element={<CustomerBookingRequest />}
                          />
                          <Route path="/payouts" element={<Payouts />} />
                          <Route
                            path="/calendar"
                            element={<div className="p-6">Calendar Page</div>}
                          />
                          <Route path="/rfq" element={<RFQ />} />
                          <Route
                            path="/settings"
                            element={<SettingsDashboard />}
                          />
                          <Route
                            path="/settings/users"
                            element={<UserManagement />}
                          />
                          <Route
                            path="/settings/profile"
                            element={<ProfileSettings />}
                          />
                          <Route
                            path="/listOfValues"
                            element={<ListOfValues />}
                          />
                          <Route
                            path="/dashboard/sadmin"
                            element={<SuperAdminDashboard />}
                          />
                        </>
                      )}

                      {/* Transporter routes - only accessible if transporter */}
                      {isTransporter && (
                        <>
                          <Route
                            path="/transporter"
                            element={<TransporterDashboard />}
                          />
                          <Route path="/active-bids" element={<ActiveBids />} />
                          <Route
                            path="/vehicle-fleet"
                            element={<VehicleFleet />}
                          />
                          <Route path="/my-quotes" element={<MyQuotes />} />
                          <Route
                            path="/vehicles"
                            element={<VehicleManagement />}
                          />
                          <Route
                            path="/drivers"
                            element={<DriverManagement />}
                          />
                          <Route path="/payments" element={<PaymentSetup />} />
                          <Route path="/routes" element={<RoutesAndZones />} />
                          <Route
                            path="/scheduling"
                            element={<TripScheduling />}
                          />
                          <Route
                            path="/invoice"
                            element={<InvoiceManagement />}
                          />

                          <Route
                            path="/maintenance"
                            element={<MaintenancePage />}
                          />
                          <Route
                            path="fuel-management"
                            element={<FuelManagement />}
                          />

                          <Route
                            path="tyre-management"
                            element={<TyreManagementPage />}
                          />

                          <Route path="/documents" element={<Documents />} />
                          <Route
                            path="/transporter/settings"
                            element={<SettingsScreen />}
                          />
                        </>
                      )}

                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </GoogleMapsProvider>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <Toaster />
      <NetworkStatusNotifier />
    </Provider>
  );
}

export default App;
