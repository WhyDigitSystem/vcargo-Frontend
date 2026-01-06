import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  Upload,
  Clock,
  Truck,
  User,
  MapPin,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Eye,
  X,
  Save,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  Navigation,
  Layers
} from 'lucide-react';

// Mock API functions
const tripAPI = {
  // Get all trips
  getTrips: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('transportTrips');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default data
    const defaultTrips = [
      {
        id: 1,
        tripId: 'TRIP-2024-001',
        customerName: 'ABC Logistics',
        customerPhone: '+91 9876543210',
        route: 'Mumbai-Delhi Express',
        startPoint: 'Mumbai, Maharashtra',
        endPoint: 'Delhi, NCR',
        assignedDriver: 'Rajesh Kumar',
        assignedVehicle: 'KA01AB1234',
        scheduledDate: '2024-01-20',
        scheduledTime: '06:00',
        estimatedArrival: '2024-01-21 06:00',
        cargoType: 'Electronics',
        cargoWeight: '15 Tons',
        tripStatus: 'scheduled',
        paymentStatus: 'pending',
        tripValue: '₹85,000',
        advancePayment: '₹25,000',
        balancePayment: '₹60,000',
        specialInstructions: 'Handle with care - Fragile items',
        documents: ['Invoice', 'Delivery Challan'],
        tracking: {
          currentLocation: 'Mumbai Depot',
          lastUpdate: '2024-01-19 18:30',
          progress: 0
        },
        createdBy: 'Admin User',
        createdAt: '2024-01-18 10:00'
      },
      {
        id: 2,
        tripId: 'TRIP-2024-002',
        customerName: 'XYZ Cargo',
        customerPhone: '+91 9876543211',
        route: 'Chennai-Bangalore Corridor',
        startPoint: 'Chennai, Tamil Nadu',
        endPoint: 'Bangalore, Karnataka',
        assignedDriver: 'Suresh Patel',
        assignedVehicle: 'MH02CD5678',
        scheduledDate: '2024-01-19',
        scheduledTime: '08:00',
        estimatedArrival: '2024-01-19 14:00',
        cargoType: 'Textiles',
        cargoWeight: '8 Tons',
        tripStatus: 'in_progress',
        paymentStatus: 'advance_paid',
        tripValue: '₹45,000',
        advancePayment: '₹15,000',
        balancePayment: '₹30,000',
        specialInstructions: 'Time-sensitive delivery',
        documents: ['Invoice', 'E-Way Bill'],
        tracking: {
          currentLocation: 'Krishnagiri, TN',
          lastUpdate: '2024-01-19 11:45',
          progress: 65
        },
        createdBy: 'Admin User',
        createdAt: '2024-01-17 14:30'
      },
      {
        id: 3,
        tripId: 'TRIP-2024-003',
        customerName: 'Global Traders',
        customerPhone: '+91 9876543212',
        route: 'Kolkata-Guwahati Highway',
        startPoint: 'Kolkata, West Bengal',
        endPoint: 'Guwahati, Assam',
        assignedDriver: 'Amit Sharma',
        assignedVehicle: 'DL03EF9012',
        scheduledDate: '2024-01-18',
        scheduledTime: '05:00',
        estimatedArrival: '2024-01-19 01:00',
        cargoType: 'Machinery Parts',
        cargoWeight: '22 Tons',
        tripStatus: 'completed',
        paymentStatus: 'paid',
        tripValue: '₹1,20,000',
        advancePayment: '₹40,000',
        balancePayment: '₹80,000',
        specialInstructions: 'Heavy machinery - need forklift at destination',
        documents: ['Invoice', 'E-Way Bill', 'Test Certificate'],
        tracking: {
          currentLocation: 'Guwahati, Assam',
          lastUpdate: '2024-01-19 01:15',
          progress: 100
        },
        createdBy: 'Admin User',
        createdAt: '2024-01-16 09:15'
      },
      {
        id: 4,
        tripId: 'TRIP-2024-004',
        customerName: 'Prime Suppliers',
        customerPhone: '+91 9876543213',
        route: 'Pune-Hyderabad Sector',
        startPoint: 'Pune, Maharashtra',
        endPoint: 'Hyderabad, Telangana',
        assignedDriver: 'Vikram Singh',
        assignedVehicle: 'TN04GH3456',
        scheduledDate: '2024-01-22',
        scheduledTime: '07:30',
        estimatedArrival: '2024-01-22 17:30',
        cargoType: 'Pharmaceuticals',
        cargoWeight: '5 Tons',
        tripStatus: 'scheduled',
        paymentStatus: 'pending',
        tripValue: '₹35,000',
        advancePayment: '₹0',
        balancePayment: '₹35,000',
        specialInstructions: 'Temperature controlled storage required',
        documents: ['Invoice', 'Pharma License'],
        tracking: {
          currentLocation: 'Pune Depot',
          lastUpdate: '2024-01-18 16:00',
          progress: 0
        },
        createdBy: 'Admin User',
        createdAt: '2024-01-18 11:45'
      },
      {
        id: 5,
        tripId: 'TRIP-2024-005',
        customerName: 'Metro Distributors',
        customerPhone: '+91 9876543214',
        route: 'Mumbai-Delhi Express',
        startPoint: 'Delhi, NCR',
        endPoint: 'Mumbai, Maharashtra',
        assignedDriver: 'Not Assigned',
        assignedVehicle: 'Not Assigned',
        scheduledDate: '2024-01-23',
        scheduledTime: '09:00',
        estimatedArrival: '2024-01-24 09:00',
        cargoType: 'Automobile Parts',
        cargoWeight: '18 Tons',
        tripStatus: 'pending',
        paymentStatus: 'pending',
        tripValue: '₹95,000',
        advancePayment: '₹0',
        balancePayment: '₹95,000',
        specialInstructions: 'Reverse logistics - return cargo',
        documents: ['Invoice'],
        tracking: {
          currentLocation: 'Delhi Depot',
          lastUpdate: '2024-01-18 12:00',
          progress: 0
        },
        createdBy: 'Admin User',
        createdAt: '2024-01-18 15:20'
      }
    ];
    
    localStorage.setItem('transportTrips', JSON.stringify(defaultTrips));
    return defaultTrips;
  },

  // Get available drivers
  getDrivers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, name: 'Rajesh Kumar', phone: '+91 9876543210', status: 'available' },
      { id: 2, name: 'Suresh Patel', phone: '+91 9876543211', status: 'on_trip' },
      { id: 3, name: 'Amit Sharma', phone: '+91 9876543212', status: 'available' },
      { id: 4, name: 'Vikram Singh', phone: '+91 9876543213', status: 'available' },
      { id: 5, name: 'Rahul Verma', phone: '+91 9876543214', status: 'on_leave' }
    ];
  },

  // Get available vehicles
  getVehicles: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, number: 'KA01AB1234', type: 'Container Truck', status: 'available' },
      { id: 2, number: 'MH02CD5678', type: 'Trailer', status: 'on_trip' },
      { id: 3, number: 'DL03EF9012', type: 'Container Truck', status: 'available' },
      { id: 4, number: 'TN04GH3456', type: 'LCV', status: 'available' },
      { id: 5, number: 'HR05IJ7890', type: 'Trailer', status: 'maintenance' }
    ];
  },

  // Get routes
  getRoutes: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, name: 'Mumbai-Delhi Express', distance: '1400 km', time: '24 hours' },
      { id: 2, name: 'Chennai-Bangalore Corridor', distance: '350 km', time: '6 hours' },
      { id: 3, name: 'Kolkata-Guwahati Highway', distance: '1100 km', time: '20 hours' },
      { id: 4, name: 'Pune-Hyderabad Sector', distance: '560 km', time: '10 hours' },
      { id: 5, name: 'Delhi-Chandigarh Highway', distance: '250 km', time: '4 hours' }
    ];
  },

  // Create trip
  createTrip: async (tripData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const trips = await tripAPI.getTrips();
    const newTrip = {
      id: Math.max(...trips.map(t => t.id)) + 1,
      tripId: `TRIP-2024-${String(Math.max(...trips.map(t => t.id)) + 1).padStart(3, '0')}`,
      ...tripData,
      tracking: {
        currentLocation: tripData.startPoint,
        lastUpdate: new Date().toISOString(),
        progress: 0
      },
      createdAt: new Date().toISOString(),
      createdBy: 'Admin User'
    };
    
    const updatedTrips = [...trips, newTrip];
    localStorage.setItem('transportTrips', JSON.stringify(updatedTrips));
    return newTrip;
  },

  // Update trip
  updateTrip: async (id, tripData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const trips = await tripAPI.getTrips();
    const index = trips.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Trip not found');
    }
    
    const updatedTrip = {
      ...trips[index],
      ...tripData,
      updatedAt: new Date().toISOString()
    };
    
    trips[index] = updatedTrip;
    localStorage.setItem('transportTrips', JSON.stringify(trips));
    return updatedTrip;
  },

  // Delete trip
  deleteTrip: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const trips = await tripAPI.getTrips();
    const filteredTrips = trips.filter(t => t.id !== id);
    localStorage.setItem('transportTrips', JSON.stringify(filteredTrips));
    return true;
  },

  // Update trip status
  updateTripStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const trips = await tripAPI.getTrips();
    const index = trips.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Trip not found');
    }
    
    trips[index].tripStatus = status;
    trips[index].updatedAt = new Date().toISOString();
    
    localStorage.setItem('transportTrips', JSON.stringify(trips));
    return trips[index];
  }
};

// Trip Form Component
const TripForm = ({ trip, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    route: '',
    startPoint: '',
    endPoint: '',
    assignedDriver: '',
    assignedVehicle: '',
    scheduledDate: '',
    scheduledTime: '',
    cargoType: '',
    cargoWeight: '',
    tripValue: '',
    advancePayment: '',
    specialInstructions: '',
    documents: []
  });

  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [errors, setErrors] = useState({});
  const [newDocument, setNewDocument] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (trip) {
      setFormData(trip);
    } else {
      setFormData({
        customerName: '',
        customerPhone: '',
        route: '',
        startPoint: '',
        endPoint: '',
        assignedDriver: '',
        assignedVehicle: '',
        scheduledDate: '',
        scheduledTime: '',
        cargoType: '',
        cargoWeight: '',
        tripValue: '',
        advancePayment: '',
        specialInstructions: '',
        documents: []
      });
    }
  }, [trip, isOpen]);

  const loadFormData = async () => {
    try {
      const [drivers, vehicles, routes] = await Promise.all([
        tripAPI.getDrivers(),
        tripAPI.getVehicles(),
        tripAPI.getRoutes()
      ]);
      setAvailableDrivers(drivers);
      setAvailableVehicles(vehicles);
      setAvailableRoutes(routes);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName) newErrors.customerName = 'Customer name is required';
    if (!formData.customerPhone) newErrors.customerPhone = 'Customer phone is required';
    if (!formData.route) newErrors.route = 'Route is required';
    if (!formData.startPoint) newErrors.startPoint = 'Start point is required';
    if (!formData.endPoint) newErrors.endPoint = 'End point is required';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
    if (!formData.scheduledTime) newErrors.scheduledTime = 'Scheduled time is required';
    if (!formData.cargoType) newErrors.cargoType = 'Cargo type is required';
    if (!formData.cargoWeight) newErrors.cargoWeight = 'Cargo weight is required';
    if (!formData.tripValue) newErrors.tripValue = 'Trip value is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Calculate balance payment
      const balancePayment = `₹${(parseInt(formData.tripValue.replace(/[^0-9]/g, '') || 0) - 
        parseInt(formData.advancePayment.replace(/[^0-9]/g, '') || 0)).toLocaleString()}`;
      
      const dataWithBalance = {
        ...formData,
        balancePayment,
        paymentStatus: formData.advancePayment && parseInt(formData.advancePayment.replace(/[^0-9]/g, '')) > 0 ? 
          'advance_paid' : 'pending'
      };
      
      onSave(dataWithBalance);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument.trim()]
      }));
      setNewDocument('');
    }
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleRouteChange = (routeName) => {
    const selectedRoute = availableRoutes.find(r => r.name === routeName);
    if (selectedRoute) {
      // Auto-fill start and end points based on route name
      const [start, end] = routeName.split('-');
      setFormData(prev => ({
        ...prev,
        route: routeName,
        startPoint: start ? `${start.trim()}, ${getStateFromCity(start.trim())}` : '',
        endPoint: end ? `${end.trim()}, ${getStateFromCity(end.trim())}` : ''
      }));
    }
  };

  const getStateFromCity = (city) => {
    const cityStateMap = {
      'Mumbai': 'Maharashtra',
      'Delhi': 'NCR',
      'Chennai': 'Tamil Nadu',
      'Bangalore': 'Karnataka',
      'Kolkata': 'West Bengal',
      'Guwahati': 'Assam',
      'Pune': 'Maharashtra',
      'Hyderabad': 'Telangana',
      'Chandigarh': 'Punjab'
    };
    return cityStateMap[city] || '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {trip ? 'Edit Trip' : 'Schedule New Trip'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Customer Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Phone *
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleChange('customerPhone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+91 9876543210"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Trip Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Route *
                </label>
                <select
                  value={formData.route}
                  onChange={(e) => handleRouteChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.route ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Route</option>
                  {availableRoutes.map(route => (
                    <option key={route.id} value={route.name}>
                      {route.name} ({route.distance}, {route.time})
                    </option>
                  ))}
                </select>
                {errors.route && (
                  <p className="text-red-500 text-sm mt-1">{errors.route}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Point *
                  </label>
                  <input
                    type="text"
                    value={formData.startPoint}
                    onChange={(e) => handleChange('startPoint', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.startPoint ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Start location"
                  />
                  {errors.startPoint && (
                    <p className="text-red-500 text-sm mt-1">{errors.startPoint}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Point *
                  </label>
                  <input
                    type="text"
                    value={formData.endPoint}
                    onChange={(e) => handleChange('endPoint', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.endPoint ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Destination"
                  />
                  {errors.endPoint && (
                    <p className="text-red-500 text-sm mt-1">{errors.endPoint}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule & Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Schedule & Assignment
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => handleChange('scheduledDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.scheduledDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled Time *
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => handleChange('scheduledTime', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.scheduledTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.scheduledTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.scheduledTime}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign Driver
                </label>
                <select
                  value={formData.assignedDriver}
                  onChange={(e) => handleChange('assignedDriver', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Driver</option>
                  {availableDrivers.map(driver => (
                    <option key={driver.id} value={driver.name} disabled={driver.status !== 'available'}>
                      {driver.name} {driver.status !== 'available' && `(${driver.status})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign Vehicle
                </label>
                <select
                  value={formData.assignedVehicle}
                  onChange={(e) => handleChange('assignedVehicle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Vehicle</option>
                  {availableVehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.number} disabled={vehicle.status !== 'available'}>
                      {vehicle.number} - {vehicle.type} {vehicle.status !== 'available' && `(${vehicle.status})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cargo & Payment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Cargo & Payment
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cargo Type *
                  </label>
                  <select
                    value={formData.cargoType}
                    onChange={(e) => handleChange('cargoType', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.cargoType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Cargo Type</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Machinery Parts">Machinery Parts</option>
                    <option value="Pharmaceuticals">Pharmaceuticals</option>
                    <option value="Automobile Parts">Automobile Parts</option>
                    <option value="FMCG Goods">FMCG Goods</option>
                    <option value="Construction Material">Construction Material</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.cargoType && (
                    <p className="text-red-500 text-sm mt-1">{errors.cargoType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cargo Weight *
                  </label>
                  <input
                    type="text"
                    value={formData.cargoWeight}
                    onChange={(e) => handleChange('cargoWeight', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.cargoWeight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 15 Tons"
                  />
                  {errors.cargoWeight && (
                    <p className="text-red-500 text-sm mt-1">{errors.cargoWeight}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trip Value *
                  </label>
                  <input
                    type="text"
                    value={formData.tripValue}
                    onChange={(e) => handleChange('tripValue', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.tripValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., ₹85,000"
                  />
                  {errors.tripValue && (
                    <p className="text-red-500 text-sm mt-1">{errors.tripValue}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Advance Payment
                  </label>
                  <input
                    type="text"
                    value={formData.advancePayment}
                    onChange={(e) => handleChange('advancePayment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., ₹25,000"
                  />
                </div>
              </div>
            </div>

            {/* Instructions & Documents */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Instructions & Documents
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleChange('specialInstructions', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Any special instructions for the driver..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Required Documents
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDocument}
                      onChange={(e) => setNewDocument(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Add required document..."
                    />
                    <button
                      type="button"
                      onClick={addDocument}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.documents.map((document, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm"
                      >
                        {document}
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="hover:text-green-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {trip ? 'Update Trip' : 'Schedule Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Trip Scheduling Component
const TripScheduling = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewTrip, setViewTrip] = useState(null);
  const [actionTrip, setActionTrip] = useState(null);

  // Load trips on component mount
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await tripAPI.getTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (tripData) => {
    try {
      await tripAPI.createTrip(tripData);
      await loadTrips();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  const handleUpdateTrip = async (tripData) => {
    try {
      await tripAPI.updateTrip(editingTrip.id, tripData);
      await loadTrips();
      setShowForm(false);
      setEditingTrip(null);
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      await tripAPI.deleteTrip(id);
      await loadTrips();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await tripAPI.updateTripStatus(id, status);
      await loadTrips();
      setActionTrip(null);
    } catch (error) {
      console.error('Error updating trip status:', error);
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingTrip(null);
    setShowForm(true);
  };

  const handleFormSave = (tripData) => {
    if (editingTrip) {
      handleUpdateTrip(tripData);
    } else {
      handleCreateTrip(tripData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  // Filter trips
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.tripId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.tripStatus === statusFilter;
    const matchesDate = !dateFilter || trip.scheduledDate === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate stats
  const stats = {
    total: trips.length,
    scheduled: trips.filter(t => t.tripStatus === 'scheduled').length,
    inProgress: trips.filter(t => t.tripStatus === 'in_progress').length,
    completed: trips.filter(t => t.tripStatus === 'completed').length,
    pending: trips.filter(t => t.tripStatus === 'pending').length,
    totalRevenue: trips.reduce((acc, trip) => acc + parseInt(trip.tripValue.replace(/[^0-9]/g, '') || 0), 0)
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: Clock, label: 'Scheduled' },
      in_progress: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', icon: Navigation, label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock, label: 'Pending' },
      cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle, label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
      advance_paid: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: Clock },
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Trip Scheduling
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and schedule transportation trips efficiently
            </p>
          </div>
          <button 
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Schedule New Trip
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.scheduled}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Navigation className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by customer, trip ID, driver..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Upload className="h-4 w-4" />
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trip Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status & Tracking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {trip.tripId}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {trip.customerName}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {trip.cargoType} • {trip.cargoWeight}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {trip.scheduledDate}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {trip.scheduledTime}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {trip.route}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                        <User className="h-3 w-3" />
                        {trip.assignedDriver}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Truck className="h-3 w-3" />
                        {trip.assignedVehicle}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {getStatusBadge(trip.tripStatus)}
                      {trip.tripStatus === 'in_progress' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Progress</span>
                            <span>{trip.tracking.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(trip.tracking.progress)}`}
                              style={{ width: `${trip.tracking.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {trip.tracking.currentLocation}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {getPaymentStatusBadge(trip.paymentStatus)}
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {trip.tripValue}
                      </div>
                      {trip.advancePayment !== '₹0' && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Advance: {trip.advancePayment}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setViewTrip(trip)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(trip)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {trip.tripStatus === 'scheduled' && (
                        <button 
                          onClick={() => setActionTrip(trip)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      {trip.tripStatus === 'in_progress' && (
                        <button 
                          onClick={() => setActionTrip(trip)}
                          className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => setDeleteConfirm(trip)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No trips found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button 
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Schedule Your First Trip
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <BarChart3 className="h-4 w-4" />
          Trip Analytics
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <RefreshCw className="h-4 w-4" />
          Bulk Operations
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Layers className="h-4 w-4" />
          Route Optimization
        </button>
      </div>

      {/* Trip Form Modal */}
      <TripForm
        trip={editingTrip}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
        isOpen={showForm}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Trip
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete trip <strong>{deleteConfirm.tripId}</strong>? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTrip(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 ${
                actionTrip.tripStatus === 'scheduled' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
              } rounded-lg`}>
                {actionTrip.tripStatus === 'scheduled' ? (
                  <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Pause className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {actionTrip.tripStatus === 'scheduled' ? 'Start Trip' : 'Pause Trip'}
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to {actionTrip.tripStatus === 'scheduled' ? 'start' : 'pause'} trip{' '}
              <strong>{actionTrip.tripId}</strong>?
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActionTrip(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(
                  actionTrip.id, 
                  actionTrip.tripStatus === 'scheduled' ? 'in_progress' : 'scheduled'
                )}
                className={`px-4 py-2 ${
                  actionTrip.tripStatus === 'scheduled' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                } text-white rounded-lg transition-colors flex items-center gap-2`}
              >
                {actionTrip.tripStatus === 'scheduled' ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
                {actionTrip.tripStatus === 'scheduled' ? 'Start Trip' : 'Pause Trip'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Details Modal */}
      {viewTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Trip Details - {viewTrip.tripId}
              </h2>
              <button
                onClick={() => setViewTrip(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Trip Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Trip Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Route:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <div>{getStatusBadge(viewTrip.tripStatus)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Schedule & Assignment
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Scheduled Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.scheduledDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Scheduled Time:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.scheduledTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Driver:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.assignedDriver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Vehicle:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.assignedVehicle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cargo & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Cargo Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cargo Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.cargoType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.cargoWeight}</span>
                    </div>
                    {viewTrip.specialInstructions && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Special Instructions:</span>
                        <p className="text-sm text-gray-900 dark:text-white mt-1 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                          {viewTrip.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Trip Value:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{viewTrip.tripValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Advance Paid:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.advancePayment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Balance Due:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.balancePayment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                      <div>{getPaymentStatusBadge(viewTrip.paymentStatus)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking & Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Live Tracking
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Location:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.tracking.currentLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewTrip.tracking.lastUpdate}</span>
                    </div>
                    {viewTrip.tripStatus === 'in_progress' && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{viewTrip.tracking.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getProgressColor(viewTrip.tracking.progress)}`}
                            style={{ width: `${viewTrip.tracking.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {viewTrip.documents.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Required Documents
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {viewTrip.documents.map((doc, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Route Map */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Route Map
                </h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {viewTrip.startPoint} → {viewTrip.endPoint}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Interactive map would be displayed here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewTrip(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewTrip(null);
                  handleEdit(viewTrip);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Edit Trip
              </button>
              {viewTrip.tripStatus === 'scheduled' && (
                <button
                  onClick={() => {
                    setViewTrip(null);
                    setActionTrip(viewTrip);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Trip
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripScheduling;