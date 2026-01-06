import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  Upload,
  Calendar,
  DollarSign,
  Building,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Eye,
  X,
  Save,
  FileText,
  Clock,
  Bank,
  Wallet,
  QrCode,
  Shield
} from 'lucide-react';

// Mock API functions
const paymentAPI = {
  // Get all payment methods
  getPaymentMethods: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('paymentMethods');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default data
    const defaultPayments = [
      {
        id: 1,
        methodType: 'bank_account',
        bankName: 'State Bank of India',
        accountNumber: '12345678901',
        accountHolder: 'Rajesh Transport Services',
        ifscCode: 'SBIN0000123',
        branch: 'Andheri East, Mumbai',
        status: 'active',
        isDefault: true,
        balance: '₹2,45,670',
        lastTransaction: '2024-01-15',
        upiId: 'rajesh.transport@sbi',
        qrCode: 'https://example.com/qr/rajesh',
        documents: ['Cancelled Cheque', 'Bank Statement'],
        verified: true
      },
      {
        id: 2,
        methodType: 'upi',
        upiId: 'suresh.patel@okhdfcbank',
        provider: 'Google Pay',
        status: 'active',
        isDefault: false,
        balance: '₹85,430',
        lastTransaction: '2024-01-14',
        qrCode: 'https://example.com/qr/suresh',
        documents: ['UPI Screenshot'],
        verified: true
      },
      {
        id: 3,
        methodType: 'bank_account',
        bankName: 'HDFC Bank',
        accountNumber: '98765432109',
        accountHolder: 'Rajesh Transport Services',
        ifscCode: 'HDFC0000456',
        branch: 'Connaught Place, Delhi',
        status: 'pending',
        isDefault: false,
        balance: '₹0',
        lastTransaction: '-',
        documents: ['Cancelled Cheque'],
        verified: false
      },
      {
        id: 4,
        methodType: 'wallet',
        walletType: 'PayTM Wallet',
        walletId: 'rajesh.transport@paytm',
        status: 'active',
        isDefault: false,
        balance: '₹12,500',
        lastTransaction: '2024-01-13',
        documents: ['KYC Document'],
        verified: true
      }
    ];
    
    localStorage.setItem('paymentMethods', JSON.stringify(defaultPayments));
    return defaultPayments;
  },

  // Get transactions
  getTransactions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem('paymentTransactions');
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultTransactions = [
      {
        id: 1,
        date: '2024-01-15',
        description: 'Freight Payment - Shipment #TRK-2024-001',
        amount: '₹45,000',
        type: 'credit',
        status: 'completed',
        method: 'Bank Transfer',
        reference: 'REF-001234',
        customer: 'ABC Logistics'
      },
      {
        id: 2,
        date: '2024-01-14',
        description: 'Vehicle Maintenance',
        amount: '₹12,500',
        type: 'debit',
        status: 'completed',
        method: 'UPI',
        reference: 'REF-001235',
        vendor: 'Auto Care Services'
      },
      {
        id: 3,
        date: '2024-01-13',
        description: 'Freight Payment - Shipment #TRK-2024-002',
        amount: '₹38,750',
        type: 'credit',
        status: 'pending',
        method: 'Bank Transfer',
        reference: 'REF-001236',
        customer: 'XYZ Cargo'
      },
      {
        id: 4,
        date: '2024-01-12',
        description: 'Fuel Payment',
        amount: '₹8,200',
        type: 'debit',
        status: 'completed',
        method: 'Wallet',
        reference: 'REF-001237',
        vendor: 'Indian Oil'
      },
      {
        id: 5,
        date: '2024-01-11',
        description: 'Toll Charges',
        amount: '₹3,450',
        type: 'debit',
        status: 'failed',
        method: 'UPI',
        reference: 'REF-001238',
        vendor: 'NHAI'
      }
    ];
    
    localStorage.setItem('paymentTransactions', JSON.stringify(defaultTransactions));
    return defaultTransactions;
  },

  // Create payment method
  createPaymentMethod: async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const methods = await paymentAPI.getPaymentMethods();
    const newMethod = {
      id: Math.max(...methods.map(p => p.id)) + 1,
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedMethods = [...methods, newMethod];
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
    return newMethod;
  },

  // Update payment method
  updatePaymentMethod: async (id, paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const methods = await paymentAPI.getPaymentMethods();
    const index = methods.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Payment method not found');
    }
    
    const updatedMethod = {
      ...methods[index],
      ...paymentData,
      updatedAt: new Date().toISOString()
    };
    
    methods[index] = updatedMethod;
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethod));
    return updatedMethod;
  },

  // Delete payment method
  deletePaymentMethod: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const methods = await paymentAPI.getPaymentMethods();
    const filteredMethods = methods.filter(p => p.id !== id);
    localStorage.setItem('paymentMethods', JSON.stringify(filteredMethods));
    return true;
  },

  // Set default payment method
  setDefaultPaymentMethod: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const methods = await paymentAPI.getPaymentMethods();
    const updatedMethods = methods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
    return updatedMethods;
  }
};

// Payment Method Form Component
const PaymentMethodForm = ({ method, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    methodType: 'bank_account',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    ifscCode: '',
    branch: '',
    upiId: '',
    provider: '',
    walletType: '',
    walletId: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (method) {
      setFormData(method);
    } else {
      // Reset form for new method
      setFormData({
        methodType: 'bank_account',
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        ifscCode: '',
        branch: '',
        upiId: '',
        provider: '',
        walletType: '',
        walletId: '',
        status: 'active'
      });
    }
  }, [method, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.methodType) newErrors.methodType = 'Payment method type is required';
    
    if (formData.methodType === 'bank_account') {
      if (!formData.bankName) newErrors.bankName = 'Bank name is required';
      if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
      if (!formData.accountHolder) newErrors.accountHolder = 'Account holder name is required';
      if (!formData.ifscCode) newErrors.ifscCode = 'IFSC code is required';
    }
    
    if (formData.methodType === 'upi') {
      if (!formData.upiId) newErrors.upiId = 'UPI ID is required';
      if (!formData.provider) newErrors.provider = 'Provider is required';
    }
    
    if (formData.methodType === 'wallet') {
      if (!formData.walletType) newErrors.walletType = 'Wallet type is required';
      if (!formData.walletId) newErrors.walletId = 'Wallet ID is required';
    }
    
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {method ? 'Edit Payment Method' : 'Add Payment Method'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Method Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method Type *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'bank_account', label: 'Bank Account', icon: Building },
                { value: 'upi', label: 'UPI', icon: QrCode },
                { value: 'wallet', label: 'Wallet', icon: Wallet }
              ].map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleChange('methodType', type.value)}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.methodType === type.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <IconComponent className={`h-6 w-6 mx-auto mb-2 ${
                      formData.methodType === type.value ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.methodType && (
              <p className="text-red-500 text-sm mt-1">{errors.methodType}</p>
            )}
          </div>

          {/* Dynamic Form Fields Based on Method Type */}
          {formData.methodType === 'bank_account' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.bankName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., State Bank of India"
                />
                {errors.bankName && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 12345678901"
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => handleChange('accountHolder', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.accountHolder ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Rajesh Transport Services"
                />
                {errors.accountHolder && (
                  <p className="text-red-500 text-sm mt-1">{errors.accountHolder}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., SBIN0000123"
                />
                {errors.ifscCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Andheri East, Mumbai"
                />
              </div>
            </div>
          )}

          {formData.methodType === 'upi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  UPI ID *
                </label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.upiId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., username@okhdfcbank"
                />
                {errors.upiId && (
                  <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provider *
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => handleChange('provider', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.provider ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Provider</option>
                  <option value="Google Pay">Google Pay</option>
                  <option value="PhonePe">PhonePe</option>
                  <option value="PayTM">PayTM</option>
                  <option value="BHIM UPI">BHIM UPI</option>
                  <option value="Other">Other</option>
                </select>
                {errors.provider && (
                  <p className="text-red-500 text-sm mt-1">{errors.provider}</p>
                )}
              </div>
            </div>
          )}

          {formData.methodType === 'wallet' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wallet Type *
                </label>
                <select
                  value={formData.walletType}
                  onChange={(e) => handleChange('walletType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.walletType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Wallet</option>
                  <option value="PayTM Wallet">PayTM Wallet</option>
                  <option value="Amazon Pay">Amazon Pay</option>
                  <option value="MobiKwik">MobiKwik</option>
                  <option value="Freecharge">Freecharge</option>
                  <option value="Other">Other</option>
                </select>
                {errors.walletType && (
                  <p className="text-red-500 text-sm mt-1">{errors.walletType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wallet ID *
                </label>
                <input
                  type="text"
                  value={formData.walletId}
                  onChange={(e) => handleChange('walletId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.walletId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., username@paytm"
                />
                {errors.walletId && (
                  <p className="text-red-500 text-sm mt-1">{errors.walletId}</p>
                )}
              </div>
            </div>
          )}

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
              <option value="pending">Pending Verification</option>
              <option value="inactive">Inactive</option>
            </select>
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
              {method ? 'Update Payment Method' : 'Add Payment Method'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Payment Setup Component
const PaymentSetup = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('methods');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMethod, setViewMethod] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [methodsData, transactionsData] = await Promise.all([
        paymentAPI.getPaymentMethods(),
        paymentAPI.getTransactions()
      ]);
      setPaymentMethods(methodsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMethod = async (methodData) => {
    try {
      await paymentAPI.createPaymentMethod(methodData);
      await loadData();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating payment method:', error);
    }
  };

  const handleUpdateMethod = async (methodData) => {
    try {
      await paymentAPI.updatePaymentMethod(editingMethod.id, methodData);
      await loadData();
      setShowForm(false);
      setEditingMethod(null);
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  const handleDeleteMethod = async (id) => {
    try {
      await paymentAPI.deletePaymentMethod(id);
      await loadData();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const updatedMethods = await paymentAPI.setDefaultPaymentMethod(id);
      setPaymentMethods(updatedMethods);
    } catch (error) {
      console.error('Error setting default method:', error);
    }
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingMethod(null);
    setShowForm(true);
  };

  const handleFormSave = (methodData) => {
    if (editingMethod) {
      handleUpdateMethod(methodData);
    } else {
      handleCreateMethod(methodData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMethod(null);
  };

  // Filter payment methods
  const filteredMethods = paymentMethods.filter(method => {
    const matchesSearch = method.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.upiId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.walletType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || method.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalMethods: paymentMethods.length,
    activeMethods: paymentMethods.filter(m => m.status === 'active').length,
    totalBalance: '₹3,43,600',
    pendingVerification: paymentMethods.filter(m => m.status === 'pending').length
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
      pending: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', icon: Clock },
      inactive: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle }
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

  const getTransactionStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
      pending: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getMethodIcon = (methodType) => {
    const iconConfig = {
      bank_account: { icon: Building, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
      upi: { icon: QrCode, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
      wallet: { icon: Wallet, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' }
    };
    
    const config = iconConfig[methodType] || iconConfig.bank_account;
    const IconComponent = config.icon;
    
    return (
      <div className={`p-2 rounded-lg ${config.color}`}>
        <IconComponent className="h-5 w-5" />
      </div>
    );
  };

  const getMethodDisplayName = (method) => {
    if (method.methodType === 'bank_account') {
      return `${method.bankName} •••${method.accountNumber.slice(-4)}`;
    } else if (method.methodType === 'upi') {
      return `${method.provider} - ${method.upiId}`;
    } else if (method.methodType === 'wallet') {
      return `${method.walletType} - ${method.walletId}`;
    }
    return 'Unknown Method';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="h-12 w-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading payment methods...</p>
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
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              Payment Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage payment methods, transactions, and financial settings
            </p>
          </div>
          <button 
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalBalance}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Methods</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalMethods}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Methods</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeMethods}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Verification</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pendingVerification}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'methods', name: 'Payment Methods', count: paymentMethods.length },
              { id: 'transactions', name: 'Transactions', count: transactions.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Payment Methods Tab */}
          {activeTab === 'methods' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search by bank, UPI, wallet..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMethods.map((method) => (
                  <div key={method.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getMethodIcon(method.methodType)}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {getMethodDisplayName(method)}
                          </h3>
                          <div className="mt-1">{getStatusBadge(method.status)}</div>
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {method.balance && (
                        <div className="flex justify-between">
                          <span>Balance:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{method.balance}</span>
                        </div>
                      )}
                      {method.lastTransaction && (
                        <div className="flex justify-between">
                          <span>Last Transaction:</span>
                          <span>{method.lastTransaction}</span>
                        </div>
                      )}
                      {method.verified !== undefined && (
                        <div className="flex justify-between">
                          <span>Verified:</span>
                          <span className={method.verified ? 'text-green-600' : 'text-orange-600'}>
                            {method.verified ? 'Yes' : 'No'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewMethod(method)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(method)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(method)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredMethods.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No payment methods found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <button 
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Payment Method
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date & Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {transaction.date}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {transaction.customer || transaction.vendor}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${
                          transaction.type === 'credit' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {transaction.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getTransactionStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {transaction.reference}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <FileText className="h-4 w-4" />
          Generate Tax Report
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Shield className="h-4 w-4" />
          Security Settings
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Download className="h-4 w-4" />
          Download Statements
        </button>
      </div>

      {/* Payment Method Form Modal */}
      <PaymentMethodForm
        method={editingMethod}
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
                Delete Payment Method
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this payment method? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMethod(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Method Modal */}
      {viewMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment Method Details
              </h2>
              <button
                onClick={() => setViewMethod(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                {getMethodIcon(viewMethod.methodType)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getMethodDisplayName(viewMethod)}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(viewMethod.status)}
                    {viewMethod.isDefault && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Default
                      </span>
                    )}
                    {viewMethod.verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {viewMethod.methodType === 'bank_account' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Name</label>
                      <p className="text-gray-900 dark:text-white">{viewMethod.bankName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Number</label>
                      <p className="text-gray-900 dark:text-white">{viewMethod.accountNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Holder</label>
                      <p className="text-gray-900 dark:text-white">{viewMethod.accountHolder}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">IFSC Code</label>
                      <p className="text-gray-900 dark:text-white">{viewMethod.ifscCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Branch</label>
                      <p className="text-gray-900 dark:text-white">{viewMethod.branch}</p>
                    </div>
                  </>
                )}

                {viewMethod.methodType === 'upi' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">UPI ID</label>
                      <p className="text-gray-900 dark:text-white">{viewMethod.upiId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Provider</label>
                      <p className="text-gray-900 dark:text-white">{viewMethod.provider}</p>
                    </div>
                  </>
                )}

                {viewMethod.methodType === 'wallet' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Type</label>
                      <p className="text-gray-900 dark:text-white">{viewMethod.walletType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet ID</label>
                      <p className="text-gray-900 dark:text-white">{viewMethod.walletId}</p>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</label>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewMethod.balance}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Transaction</label>
                  <p className="text-gray-900 dark:text-white">{viewMethod.lastTransaction}</p>
                </div>
              </div>

              {viewMethod.documents && viewMethod.documents.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Documents</label>
                  <div className="flex flex-wrap gap-2">
                    {viewMethod.documents.map((doc, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMethod(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewMethod(null);
                  handleEdit(viewMethod);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Edit Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSetup;