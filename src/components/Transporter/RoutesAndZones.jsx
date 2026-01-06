import React, { useState, useEffect } from 'react';
import {
  Map,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  Upload,
  Calendar,
  Navigation,
  Clock,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Eye,
  X,
  Save,
  Users,
  Package,
  Route,
  Layers,
  Zap,
  BarChart3
} from 'lucide-react';

// Mock API functions
const routesAPI = {
  // Get all routes
  getRoutes: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('transportRoutes');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default data
    const defaultRoutes = [
      {
        id: 1,
        routeName: 'Mumbai-Delhi Express',
        routeCode: 'MUM-DEL-001',
        startPoint: 'Mumbai, Maharashtra',
        endPoint: 'Delhi, NCR',
        totalDistance: '1400 km',
        estimatedTime: '24 hours',
        difficulty: 'medium',
        status: 'active',
        zones: ['Northern', 'Western'],
        tollCost: '₹8,500',
        fuelCost: '₹45,000',
        driverAllowance: '₹5,000',
        totalCost: '₹58,500',
        pricing: {
          perKm: '₹42',
          perTon: '₹1,200',
          minCharge: '₹25,000'
        },
        restrictions: ['No hazardous material', 'Night driving allowed'],
        preferredVehicles: ['Container Truck', 'Trailer'],
        lastUsed: '2024-01-15',
        usageCount: 45,
        rating: '4.8/5'
      },
      {
        id: 2,
        routeName: 'Chennai-Bangalore Corridor',
        routeCode: 'CHE-BLR-002',
        startPoint: 'Chennai, Tamil Nadu',
        endPoint: 'Bangalore, Karnataka',
        totalDistance: '350 km',
        estimatedTime: '6 hours',
        difficulty: 'easy',
        status: 'active',
        zones: ['Southern'],
        tollCost: '₹1,200',
        fuelCost: '₹12,000',
        driverAllowance: '₹1,500',
        totalCost: '₹14,700',
        pricing: {
          perKm: '₹38',
          perTon: '₹950',
          minCharge: '₹12,000'
        },
        restrictions: ['No over-dimensional cargo'],
        preferredVehicles: ['LCV', 'Container Truck'],
        lastUsed: '2024-01-14',
        usageCount: 32,
        rating: '4.6/5'
      },
      {
        id: 3,
        routeName: 'Kolkata-Guwahati Highway',
        routeCode: 'KOL-GUW-003',
        startPoint: 'Kolkata, West Bengal',
        endPoint: 'Guwahati, Assam',
        totalDistance: '1100 km',
        estimatedTime: '20 hours',
        difficulty: 'hard',
        status: 'active',
        zones: ['Eastern', 'North-Eastern'],
        tollCost: '₹6,800',
        fuelCost: '₹35,000',
        driverAllowance: '₹4,000',
        totalCost: '₹45,800',
        pricing: {
          perKm: '₹45',
          perTon: '₹1,500',
          minCharge: '₹30,000'
        },
        restrictions: ['Hill area caution', 'Check weather conditions'],
        preferredVehicles: ['Trailer', 'Container Truck'],
        lastUsed: '2024-01-12',
        usageCount: 18,
        rating: '4.3/5'
      },
      {
        id: 4,
        routeName: 'Pune-Hyderabad Sector',
        routeCode: 'PUN-HYD-004',
        startPoint: 'Pune, Maharashtra',
        endPoint: 'Hyderabad, Telangana',
        totalDistance: '560 km',
        estimatedTime: '10 hours',
        difficulty: 'medium',
        status: 'inactive',
        zones: ['Western', 'Southern'],
        tollCost: '₹2,500',
        fuelCost: '₹18,000',
        driverAllowance: '₹2,000',
        totalCost: '₹22,500',
        pricing: {
          perKm: '₹40',
          perTon: '₹1,100',
          minCharge: '₹15,000'
        },
        restrictions: [],
        preferredVehicles: ['LCV', 'Container Truck'],
        lastUsed: '2024-01-10',
        usageCount: 25,
        rating: '4.5/5'
      }
    ];
    
    localStorage.setItem('transportRoutes', JSON.stringify(defaultRoutes));
    return defaultRoutes;
  },

  // Get all zones
  getZones: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem('transportZones');
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultZones = [
      {
        id: 1,
        zoneName: 'Northern Zone',
        zoneCode: 'NORTH-001',
        states: ['Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Uttarakhand'],
        cities: ['Delhi', 'Gurgaon', 'Noida', 'Chandigarh', 'Lucknow'],
        coverage: '15 cities',
        status: 'active',
        pricingMultiplier: 1.0,
        specialRequirements: ['Winter gear recommended Nov-Feb'],
        assignedDrivers: 12,
        assignedVehicles: 8,
        lastActivity: '2024-01-15',
        revenue: '₹12,45,000'
      },
      {
        id: 2,
        zoneName: 'Western Zone',
        zoneCode: 'WEST-002',
        states: ['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan'],
        cities: ['Mumbai', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'],
        coverage: '22 cities',
        status: 'active',
        pricingMultiplier: 1.1,
        specialRequirements: ['Monsoon precautions Jun-Sep'],
        assignedDrivers: 18,
        assignedVehicles: 14,
        lastActivity: '2024-01-14',
        revenue: '₹18,75,000'
      },
      {
        id: 3,
        zoneName: 'Southern Zone',
        zoneCode: 'SOUTH-003',
        states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana'],
        cities: ['Bangalore', 'Chennai', 'Hyderabad', 'Kochi', 'Coimbatore'],
        coverage: '28 cities',
        status: 'active',
        pricingMultiplier: 0.9,
        specialRequirements: ['Peak season surcharge Dec-Jan'],
        assignedDrivers: 22,
        assignedVehicles: 16,
        lastActivity: '2024-01-14',
        revenue: '₹21,30,000'
      },
      {
        id: 4,
        zoneName: 'Eastern Zone',
        zoneCode: 'EAST-004',
        states: ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand'],
        cities: ['Kolkata', 'Patna', 'Bhubaneswar', 'Ranchi'],
        coverage: '12 cities',
        status: 'active',
        pricingMultiplier: 1.2,
        specialRequirements: ['Cyclone season alert Apr-May'],
        assignedDrivers: 8,
        assignedVehicles: 6,
        lastActivity: '2024-01-13',
        revenue: '₹8,90,000'
      },
      {
        id: 5,
        zoneName: 'North-Eastern Zone',
        zoneCode: 'NE-005',
        states: ['Assam', 'Meghalaya', 'Nagaland', 'Manipur', 'Tripura'],
        cities: ['Guwahati', 'Shillong', 'Kohima', 'Imphal'],
        coverage: '8 cities',
        status: 'development',
        pricingMultiplier: 1.5,
        specialRequirements: ['Permit required for certain areas'],
        assignedDrivers: 4,
        assignedVehicles: 3,
        lastActivity: '2024-01-10',
        revenue: '₹4,20,000'
      }
    ];
    
    localStorage.setItem('transportZones', JSON.stringify(defaultZones));
    return defaultZones;
  },

  // Create route
  createRoute: async (routeData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const routes = await routesAPI.getRoutes();
    const newRoute = {
      id: Math.max(...routes.map(r => r.id)) + 1,
      ...routeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedRoutes = [...routes, newRoute];
    localStorage.setItem('transportRoutes', JSON.stringify(updatedRoutes));
    return newRoute;
  },

  // Update route
  updateRoute: async (id, routeData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const routes = await routesAPI.getRoutes();
    const index = routes.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Route not found');
    }
    
    const updatedRoute = {
      ...routes[index],
      ...routeData,
      updatedAt: new Date().toISOString()
    };
    
    routes[index] = updatedRoute;
    localStorage.setItem('transportRoutes', JSON.stringify(routes));
    return updatedRoute;
  },

  // Delete route
  deleteRoute: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const routes = await routesAPI.getRoutes();
    const filteredRoutes = routes.filter(r => r.id !== id);
    localStorage.setItem('transportRoutes', JSON.stringify(filteredRoutes));
    return true;
  },

  // Create zone
  createZone: async (zoneData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const zones = await routesAPI.getZones();
    const newZone = {
      id: Math.max(...zones.map(z => z.id)) + 1,
      ...zoneData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedZones = [...zones, newZone];
    localStorage.setItem('transportZones', JSON.stringify(updatedZones));
    return newZone;
  },

  // Update zone
  updateZone: async (id, zoneData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const zones = await routesAPI.getZones();
    const index = zones.findIndex(z => z.id === id);
    
    if (index === -1) {
      throw new Error('Zone not found');
    }
    
    const updatedZone = {
      ...zones[index],
      ...zoneData,
      updatedAt: new Date().toISOString()
    };
    
    zones[index] = updatedZone;
    localStorage.setItem('transportZones', JSON.stringify(zones));
    return updatedZone;
  },

  // Delete zone
  deleteZone: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const zones = await routesAPI.getZones();
    const filteredZones = zones.filter(z => z.id !== id);
    localStorage.setItem('transportZones', JSON.stringify(filteredZones));
    return true;
  }
};

// Route Form Component
const RouteForm = ({ route, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    routeName: '',
    routeCode: '',
    startPoint: '',
    endPoint: '',
    totalDistance: '',
    estimatedTime: '',
    difficulty: 'medium',
    status: 'active',
    zones: [],
    tollCost: '',
    fuelCost: '',
    driverAllowance: '',
    pricing: {
      perKm: '',
      perTon: '',
      minCharge: ''
    },
    restrictions: [],
    preferredVehicles: []
  });

  const [errors, setErrors] = useState({});
  const [newRestriction, setNewRestriction] = useState('');
  const [newVehicle, setNewVehicle] = useState('');

  const availableZones = ['Northern', 'Western', 'Southern', 'Eastern', 'North-Eastern'];
  const vehicleTypes = ['Container Truck', 'Trailer', 'LCV', 'Pickup Truck', 'Tanker'];

  useEffect(() => {
    if (route) {
      setFormData(route);
    } else {
      setFormData({
        routeName: '',
        routeCode: '',
        startPoint: '',
        endPoint: '',
        totalDistance: '',
        estimatedTime: '',
        difficulty: 'medium',
        status: 'active',
        zones: [],
        tollCost: '',
        fuelCost: '',
        driverAllowance: '',
        pricing: {
          perKm: '',
          perTon: '',
          minCharge: ''
        },
        restrictions: [],
        preferredVehicles: []
      });
    }
  }, [route, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.routeName) newErrors.routeName = 'Route name is required';
    if (!formData.routeCode) newErrors.routeCode = 'Route code is required';
    if (!formData.startPoint) newErrors.startPoint = 'Start point is required';
    if (!formData.endPoint) newErrors.endPoint = 'End point is required';
    if (!formData.totalDistance) newErrors.totalDistance = 'Total distance is required';
    if (!formData.estimatedTime) newErrors.estimatedTime = 'Estimated time is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Calculate total cost
      const totalCost = (
        parseInt(formData.tollCost?.replace(/[^0-9]/g, '') || 0) +
        parseInt(formData.fuelCost?.replace(/[^0-9]/g, '') || 0) +
        parseInt(formData.driverAllowance?.replace(/[^0-9]/g, '') || 0)
      );
      
      const dataWithTotal = {
        ...formData,
        totalCost: `₹${totalCost.toLocaleString()}`
      };
      
      onSave(dataWithTotal);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePricingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value }
    }));
  };

  const addRestriction = () => {
    if (newRestriction.trim()) {
      setFormData(prev => ({
        ...prev,
        restrictions: [...prev.restrictions, newRestriction.trim()]
      }));
      setNewRestriction('');
    }
  };

  const removeRestriction = (index) => {
    setFormData(prev => ({
      ...prev,
      restrictions: prev.restrictions.filter((_, i) => i !== index)
    }));
  };

  const addVehicle = () => {
    if (newVehicle && !formData.preferredVehicles.includes(newVehicle)) {
      setFormData(prev => ({
        ...prev,
        preferredVehicles: [...prev.preferredVehicles, newVehicle]
      }));
      setNewVehicle('');
    }
  };

  const removeVehicle = (vehicle) => {
    setFormData(prev => ({
      ...prev,
      preferredVehicles: prev.preferredVehicles.filter(v => v !== vehicle)
    }));
  };

  const toggleZone = (zone) => {
    setFormData(prev => ({
      ...prev,
      zones: prev.zones.includes(zone)
        ? prev.zones.filter(z => z !== zone)
        : [...prev.zones, zone]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {route ? 'Edit Route' : 'Add New Route'}
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
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Route Name *
                </label>
                <input
                  type="text"
                  value={formData.routeName}
                  onChange={(e) => handleChange('routeName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.routeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mumbai-Delhi Express"
                />
                {errors.routeName && (
                  <p className="text-red-500 text-sm mt-1">{errors.routeName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Route Code *
                </label>
                <input
                  type="text"
                  value={formData.routeCode}
                  onChange={(e) => handleChange('routeCode', e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.routeCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., MUM-DEL-001"
                />
                {errors.routeCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.routeCode}</p>
                )}
              </div>

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
                  placeholder="e.g., Mumbai, Maharashtra"
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
                  placeholder="e.g., Delhi, NCR"
                />
                {errors.endPoint && (
                  <p className="text-red-500 text-sm mt-1">{errors.endPoint}</p>
                )}
              </div>
            </div>

            {/* Route Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Route Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Distance *
                  </label>
                  <input
                    type="text"
                    value={formData.totalDistance}
                    onChange={(e) => handleChange('totalDistance', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.totalDistance ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 1400 km"
                  />
                  {errors.totalDistance && (
                    <p className="text-red-500 text-sm mt-1">{errors.totalDistance}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Time *
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) => handleChange('estimatedTime', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.estimatedTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 24 hours"
                  />
                  {errors.estimatedTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.estimatedTime}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zones Covered
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableZones.map(zone => (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => toggleZone(zone)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.zones.includes(zone)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Cost Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Toll Cost
                </label>
                <input
                  type="text"
                  value={formData.tollCost}
                  onChange={(e) => handleChange('tollCost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., ₹8,500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fuel Cost
                </label>
                <input
                  type="text"
                  value={formData.fuelCost}
                  onChange={(e) => handleChange('fuelCost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., ₹45,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Driver Allowance
                </label>
                <input
                  type="text"
                  value={formData.driverAllowance}
                  onChange={(e) => handleChange('driverAllowance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., ₹5,000"
                />
              </div>
            </div>

            {/* Pricing & Restrictions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Pricing & Restrictions
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price per KM
                  </label>
                  <input
                    type="text"
                    value={formData.pricing.perKm}
                    onChange={(e) => handlePricingChange('perKm', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., ₹42"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price per Ton
                  </label>
                  <input
                    type="text"
                    value={formData.pricing.perTon}
                    onChange={(e) => handlePricingChange('perTon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., ₹1,200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Charge
                  </label>
                  <input
                    type="text"
                    value={formData.pricing.minCharge}
                    onChange={(e) => handlePricingChange('minCharge', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., ₹25,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Restrictions
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRestriction}
                      onChange={(e) => setNewRestriction(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Add restriction..."
                    />
                    <button
                      type="button"
                      onClick={addRestriction}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.restrictions.map((restriction, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-sm"
                      >
                        {restriction}
                        <button
                          type="button"
                          onClick={() => removeRestriction(index)}
                          className="hover:text-red-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Vehicles
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={newVehicle}
                      onChange={(e) => setNewVehicle(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select vehicle type</option>
                      {vehicleTypes.map(vehicle => (
                        <option key={vehicle} value={vehicle}>{vehicle}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addVehicle}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredVehicles.map((vehicle, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm"
                      >
                        {vehicle}
                        <button
                          type="button"
                          onClick={() => removeVehicle(vehicle)}
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
              {route ? 'Update Route' : 'Add Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Zone Form Component
const ZoneForm = ({ zone, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    zoneName: '',
    zoneCode: '',
    states: [],
    cities: [],
    status: 'active',
    pricingMultiplier: 1.0,
    specialRequirements: []
  });

  const [errors, setErrors] = useState({});
  const [newState, setNewState] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  useEffect(() => {
    if (zone) {
      setFormData(zone);
    } else {
      setFormData({
        zoneName: '',
        zoneCode: '',
        states: [],
        cities: [],
        status: 'active',
        pricingMultiplier: 1.0,
        specialRequirements: []
      });
    }
  }, [zone, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.zoneName) newErrors.zoneName = 'Zone name is required';
    if (!formData.zoneCode) newErrors.zoneCode = 'Zone code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addState = () => {
    if (newState.trim() && !formData.states.includes(newState.trim())) {
      setFormData(prev => ({
        ...prev,
        states: [...prev.states, newState.trim()]
      }));
      setNewState('');
    }
  };

  const removeState = (state) => {
    setFormData(prev => ({
      ...prev,
      states: prev.states.filter(s => s !== state)
    }));
  };

  const addCity = () => {
    if (newCity.trim() && !formData.cities.includes(newCity.trim())) {
      setFormData(prev => ({
        ...prev,
        cities: [...prev.cities, newCity.trim()]
      }));
      setNewCity('');
    }
  };

  const removeCity = (city) => {
    setFormData(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c !== city)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        specialRequirements: [...prev.specialRequirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {zone ? 'Edit Zone' : 'Add New Zone'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Zone Name *
              </label>
              <input
                type="text"
                value={formData.zoneName}
                onChange={(e) => handleChange('zoneName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.zoneName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Northern Zone"
              />
              {errors.zoneName && (
                <p className="text-red-500 text-sm mt-1">{errors.zoneName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Zone Code *
              </label>
              <input
                type="text"
                value={formData.zoneCode}
                onChange={(e) => handleChange('zoneCode', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.zoneCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., NORTH-001"
              />
              {errors.zoneCode && (
                <p className="text-red-500 text-sm mt-1">{errors.zoneCode}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              States Covered
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add state..."
                />
                <button
                  type="button"
                  onClick={addState}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.states.map((state, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm"
                  >
                    {state}
                    <button
                      type="button"
                      onClick={() => removeState(state)}
                      className="hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Major Cities
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add city..."
                />
                <button
                  type="button"
                  onClick={addCity}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cities.map((city, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm"
                  >
                    {city}
                    <button
                      type="button"
                      onClick={() => removeCity(city)}
                      className="hover:text-purple-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pricing Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="2.0"
                value={formData.pricingMultiplier}
                onChange={(e) => handleChange('pricingMultiplier', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="development">Under Development</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Special Requirements
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add requirement..."
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialRequirements.map((requirement, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-sm"
                  >
                    {requirement}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="hover:text-orange-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
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
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {zone ? 'Update Zone' : 'Add Zone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Routes and Zones Component
const RoutesAndZones = () => {
  const [routes, setRoutes] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [editingZone, setEditingZone] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [routesData, zonesData] = await Promise.all([
        routesAPI.getRoutes(),
        routesAPI.getZones()
      ]);
      setRoutes(routesData);
      setZones(zonesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Route Handlers
  const handleCreateRoute = async (routeData) => {
    try {
      await routesAPI.createRoute(routeData);
      await loadData();
      setShowRouteForm(false);
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  const handleUpdateRoute = async (routeData) => {
    try {
      await routesAPI.updateRoute(editingRoute.id, routeData);
      await loadData();
      setShowRouteForm(false);
      setEditingRoute(null);
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      await routesAPI.deleteRoute(id);
      await loadData();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  // Zone Handlers
  const handleCreateZone = async (zoneData) => {
    try {
      await routesAPI.createZone(zoneData);
      await loadData();
      setShowZoneForm(false);
    } catch (error) {
      console.error('Error creating zone:', error);
    }
  };

  const handleUpdateZone = async (zoneData) => {
    try {
      await routesAPI.updateZone(editingZone.id, zoneData);
      await loadData();
      setShowZoneForm(false);
      setEditingZone(null);
    } catch (error) {
      console.error('Error updating zone:', error);
    }
  };

  const handleDeleteZone = async (id) => {
    try {
      await routesAPI.deleteZone(id);
      await loadData();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting zone:', error);
    }
  };

  // Common Handlers
  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setShowRouteForm(true);
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setShowZoneForm(true);
  };

  const handleAddNew = () => {
    if (activeTab === 'routes') {
      setEditingRoute(null);
      setShowRouteForm(true);
    } else {
      setEditingZone(null);
      setShowZoneForm(true);
    }
  };

  // Filter data
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.routeCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.zoneCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || zone.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalRoutes: routes.length,
    activeRoutes: routes.filter(r => r.status === 'active').length,
    totalZones: zones.length,
    activeZones: zones.filter(z => z.status === 'active').length,
    totalCoverage: zones.reduce((acc, zone) => acc + parseInt(zone.coverage), 0) + ' cities',
    totalRevenue: zones.reduce((acc, zone) => acc + parseInt(zone.revenue.replace(/[^0-9]/g, '')), 0).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
      inactive: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle },
      maintenance: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', icon: AlertTriangle },
      development: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: Clock }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const difficultyConfig = {
      easy: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Easy' },
      medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Medium' },
      hard: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Hard' }
    };
    
    const config = difficultyConfig[difficulty] || difficultyConfig.medium;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Map className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading routes and zones...</p>
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
                <Map className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Routes & Zones Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage transportation routes, zones, and regional operations
            </p>
          </div>
          <button 
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add {activeTab === 'routes' ? 'Route' : 'Zone'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Routes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalRoutes}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Route className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Routes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeRoutes}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Navigation className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Operational Zones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalZones}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Coverage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalCoverage}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'routes', name: 'Routes', count: routes.length, icon: Route },
              { id: 'zones', name: 'Zones', count: zones.length, icon: Layers }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                  <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={`Search by ${activeTab === 'routes' ? 'route name or code' : 'zone name or code'}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  {activeTab === 'routes' && <option value="maintenance">Maintenance</option>}
                  {activeTab === 'zones' && <option value="development">Development</option>}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
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

          {/* Routes Tab */}
          {activeTab === 'routes' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRoutes.map((route) => (
                <div key={route.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Route className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {route.routeName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{route.routeCode}</p>
                      </div>
                    </div>
                    {getStatusBadge(route.status)}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{route.totalDistance}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{route.estimatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                      {getDifficultyBadge(route.difficulty)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Cost:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{route.totalCost}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      <span>{route.usageCount} trips</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      <span>{route.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewDetails(route)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditRoute(route)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'route', data: route })}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setViewDetails(route)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Zones Tab */}
          {activeTab === 'zones' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredZones.map((zone) => (
                <div key={zone.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Layers className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {zone.zoneName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{zone.zoneCode}</p>
                      </div>
                    </div>
                    {getStatusBadge(zone.status)}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Coverage:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{zone.coverage}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Pricing Multiplier:</span>
                      <span className="font-medium text-gray-900 dark:text-white">x{zone.pricingMultiplier}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Assigned Drivers:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{zone.assignedDrivers}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{zone.revenue}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {zone.states.slice(0, 3).map((state, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs">
                        {state}
                      </span>
                    ))}
                    {zone.states.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 rounded-full text-xs">
                        +{zone.states.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewDetails(zone)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditZone(zone)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'zone', data: zone })}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setViewDetails(zone)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {(activeTab === 'routes' && filteredRoutes.length === 0) || 
           (activeTab === 'zones' && filteredZones.length === 0) && (
            <div className="text-center py-12">
              <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {activeTab} found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button 
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Your First {activeTab === 'routes' ? 'Route' : 'Zone'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <BarChart3 className="h-4 w-4" />
          Route Analytics
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <DollarSign className="h-4 w-4" />
          Pricing Strategy
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Users className="h-4 w-4" />
          Zone Performance
        </button>
      </div>

      {/* Route Form Modal */}
      <RouteForm
        route={editingRoute}
        onSave={editingRoute ? handleUpdateRoute : handleCreateRoute}
        onCancel={() => {
          setShowRouteForm(false);
          setEditingRoute(null);
        }}
        isOpen={showRouteForm}
      />

      {/* Zone Form Modal */}
      <ZoneForm
        zone={editingZone}
        onSave={editingZone ? handleUpdateZone : handleCreateZone}
        onCancel={() => {
          setShowZoneForm(false);
          setEditingZone(null);
        }}
        isOpen={showZoneForm}
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
                Delete {deleteConfirm.type === 'route' ? 'Route' : 'Zone'}
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete {deleteConfirm.type === 'route' ? 'route' : 'zone'}{' '}
              <strong>{deleteConfirm.data.routeName || deleteConfirm.data.zoneName}</strong>? 
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
                onClick={() => deleteConfirm.type === 'route' 
                  ? handleDeleteRoute(deleteConfirm.data.id)
                  : handleDeleteZone(deleteConfirm.data.id)
                }
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete {deleteConfirm.type === 'route' ? 'Route' : 'Zone'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeTab === 'routes' ? 'Route Details' : 'Zone Details'}
              </h2>
              <button
                onClick={() => setViewDetails(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {activeTab === 'routes' ? (
                // Route Details
                <>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Route className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {viewDetails.routeName}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">{viewDetails.routeCode}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {getStatusBadge(viewDetails.status)}
                      {getDifficultyBadge(viewDetails.difficulty)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Route Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Start Point:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.startPoint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">End Point:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.endPoint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Distance:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.totalDistance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Estimated Time:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.estimatedTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Cost Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Toll Cost:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.tollCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Fuel Cost:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.fuelCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Driver Allowance:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.driverAllowance}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Total Cost:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">{viewDetails.totalCost}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Pricing</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Per KM:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.pricing.perKm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Per Ton:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.pricing.perTon}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Minimum Charge:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.pricing.minCharge}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Usage Count:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.usageCount} trips</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.rating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Last Used:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.lastUsed}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {viewDetails.zones.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Zones Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewDetails.zones.map((zone, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewDetails.restrictions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Restrictions</h4>
                      <div className="space-y-2">
                        {viewDetails.restrictions.map((restriction, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-4 w-4" />
                            {restriction}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewDetails.preferredVehicles.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Preferred Vehicles</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewDetails.preferredVehicles.map((vehicle, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm">
                            {vehicle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Zone Details
                <>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Layers className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {viewDetails.zoneName}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">{viewDetails.zoneCode}</p>
                    </div>
                    <div className="ml-auto">
                      {getStatusBadge(viewDetails.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Coverage</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Cities Covered:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.coverage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Pricing Multiplier:</span>
                          <span className="font-medium text-gray-900 dark:text-white">x{viewDetails.pricingMultiplier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Assigned Drivers:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.assignedDrivers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Assigned Vehicles:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.assignedVehicles}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Performance</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Revenue:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">{viewDetails.revenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Last Activity:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{viewDetails.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">States Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewDetails.states.map((state, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
                            {state}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Major Cities</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewDetails.cities.map((city, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm">
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {viewDetails.specialRequirements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Special Requirements</h4>
                      <div className="space-y-2">
                        {viewDetails.specialRequirements.map((requirement, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-4 w-4" />
                            {requirement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewDetails(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewDetails(null);
                  activeTab === 'routes' ? handleEditRoute(viewDetails) : handleEditZone(viewDetails);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Edit {activeTab === 'routes' ? 'Route' : 'Zone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesAndZones;