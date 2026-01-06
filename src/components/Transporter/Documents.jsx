import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  Upload,
  Eye,
  X,
  Save,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Calendar,
  User,
  Truck,
  MapPin,
  Clock,
  Shield,
  Archive,
  RefreshCw,
  BarChart3,
  Building,
  FolderOpen,
  FileCheck,
  FileX
} from 'lucide-react';

// Mock API functions
const documentsAPI = {
  // Get all documents
  getDocuments: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('transportDocuments');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default data
    const defaultDocuments = [
      {
        id: 1,
        documentId: 'DOC-2024-001',
        documentName: 'Vehicle RC - KA01AB1234',
        documentType: 'vehicle_rc',
        associatedWith: 'KA01AB1234',
        associatedType: 'vehicle',
        issueDate: '2022-05-15',
        expiryDate: '2027-05-14',
        status: 'active',
        verificationStatus: 'verified',
        fileSize: '2.4 MB',
        fileType: 'PDF',
        uploadedBy: 'Admin User',
        uploadedDate: '2024-01-10',
        lastUpdated: '2024-01-10',
        tags: ['RC', 'Vehicle', 'Legal'],
        description: 'Vehicle Registration Certificate for Tata Prima 5530.S',
        downloadCount: 12,
        sharedWith: ['Rajesh Kumar']
      },
      {
        id: 2,
        documentId: 'DOC-2024-002',
        documentName: 'Driving License - Rajesh Kumar',
        documentType: 'driver_license',
        associatedWith: 'Rajesh Kumar',
        associatedType: 'driver',
        issueDate: '2021-08-20',
        expiryDate: '2031-08-19',
        status: 'active',
        verificationStatus: 'verified',
        fileSize: '1.8 MB',
        fileType: 'PDF',
        uploadedBy: 'Admin User',
        uploadedDate: '2024-01-09',
        lastUpdated: '2024-01-09',
        tags: ['License', 'Driver', 'Legal'],
        description: 'Commercial Driving License for Rajesh Kumar',
        downloadCount: 8,
        sharedWith: ['Rajesh Kumar', 'Operations Team']
      },
      {
        id: 3,
        documentId: 'DOC-2024-003',
        documentName: 'Insurance Policy - Comprehensive',
        documentType: 'insurance',
        associatedWith: 'All Vehicles',
        associatedType: 'company',
        issueDate: '2024-01-01',
        expiryDate: '2025-01-01',
        status: 'active',
        verificationStatus: 'verified',
        fileSize: '5.2 MB',
        fileType: 'PDF',
        uploadedBy: 'Admin User',
        uploadedDate: '2024-01-08',
        lastUpdated: '2024-01-08',
        tags: ['Insurance', 'Legal', 'Financial'],
        description: 'Comprehensive vehicle insurance policy for all fleet vehicles',
        downloadCount: 15,
        sharedWith: ['Finance Team', 'Operations Team']
      },
      {
        id: 4,
        documentId: 'DOC-2024-004',
        documentName: 'Goods Tax Receipt - Jan 2024',
        documentType: 'tax_receipt',
        associatedWith: 'Company',
        associatedType: 'company',
        issueDate: '2024-01-05',
        expiryDate: '2024-12-31',
        status: 'active',
        verificationStatus: 'pending',
        fileSize: '1.1 MB',
        fileType: 'PDF',
        uploadedBy: 'Finance User',
        uploadedDate: '2024-01-07',
        lastUpdated: '2024-01-07',
        tags: ['Tax', 'Financial', 'Monthly'],
        description: 'Goods and services tax receipt for January 2024',
        downloadCount: 5,
        sharedWith: ['Finance Team']
      },
      {
        id: 5,
        documentId: 'DOC-2024-005',
        documentName: 'Vehicle Fitness - MH02CD5678',
        documentType: 'fitness_certificate',
        associatedWith: 'MH02CD5678',
        associatedType: 'vehicle',
        issueDate: '2023-11-15',
        expiryDate: '2024-11-14',
        status: 'expiring_soon',
        verificationStatus: 'verified',
        fileSize: '2.1 MB',
        fileType: 'PDF',
        uploadedBy: 'Admin User',
        uploadedDate: '2024-01-06',
        lastUpdated: '2024-01-06',
        tags: ['Fitness', 'Vehicle', 'Legal'],
        description: 'Vehicle fitness certificate for Ashok Leyland 3718',
        downloadCount: 7,
        sharedWith: ['Suresh Patel']
      },
      {
        id: 6,
        documentId: 'DOC-2024-006',
        documentName: 'Pollution Certificate - DL03EF9012',
        documentType: 'pollution_certificate',
        associatedWith: 'DL03EF9012',
        associatedType: 'vehicle',
        issueDate: '2023-12-01',
        expiryDate: '2024-06-01',
        status: 'active',
        verificationStatus: 'verified',
        fileSize: '1.5 MB',
        fileType: 'PDF',
        uploadedBy: 'Admin User',
        uploadedDate: '2024-01-05',
        lastUpdated: '2024-01-05',
        tags: ['PUC', 'Vehicle', 'Environmental'],
        description: 'Pollution Under Control Certificate for Mahindra Bolero',
        downloadCount: 9,
        sharedWith: ['Amit Sharma']
      },
      {
        id: 7,
        documentId: 'DOC-2024-007',
        documentName: 'Route Permit - Northern Zone',
        documentType: 'route_permit',
        associatedWith: 'All Vehicles',
        associatedType: 'company',
        issueDate: '2023-12-15',
        expiryDate: '2024-12-14',
        status: 'active',
        verificationStatus: 'verified',
        fileSize: '3.2 MB',
        fileType: 'PDF',
        uploadedBy: 'Admin User',
        uploadedDate: '2024-01-04',
        lastUpdated: '2024-01-04',
        tags: ['Permit', 'Legal', 'Routes'],
        description: 'Route permit for operating in Northern Zone states',
        downloadCount: 11,
        sharedWith: ['All Drivers']
      },
      {
        id: 8,
        documentId: 'DOC-2024-008',
        documentName: 'Driver Aadhar - Vikram Singh',
        documentType: 'aadhar_card',
        associatedWith: 'Vikram Singh',
        associatedType: 'driver',
        issueDate: '2018-03-10',
        expiryDate: '2028-03-09',
        status: 'active',
        verificationStatus: 'rejected',
        fileSize: '1.2 MB',
        fileType: 'PDF',
        uploadedBy: 'Vikram Singh',
        uploadedDate: '2024-01-03',
        lastUpdated: '2024-01-03',
        tags: ['Aadhar', 'Driver', 'KYC'],
        description: 'Aadhar card copy for driver verification',
        downloadCount: 3,
        sharedWith: ['HR Team']
      }
    ];
    
    localStorage.setItem('transportDocuments', JSON.stringify(defaultDocuments));
    return defaultDocuments;
  },

  // Get document categories
  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, name: 'Vehicle Documents', count: 12, icon: Truck },
      { id: 2, name: 'Driver Documents', count: 8, icon: User },
      { id: 3, name: 'Legal & Compliance', count: 15, icon: Shield },
      { id: 4, name: 'Financial Documents', count: 7, icon: FileText },
      { id: 5, name: 'Insurance Papers', count: 5, icon: FileCheck },
      { id: 6, name: 'Tax Documents', count: 9, icon: BarChart3 }
    ];
  },

  // Create document
  createDocument: async (documentData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const documents = await documentsAPI.getDocuments();
    const newDocument = {
      id: Math.max(...documents.map(d => d.id)) + 1,
      documentId: `DOC-2024-${String(Math.max(...documents.map(d => d.id)) + 1).padStart(3, '0')}`,
      ...documentData,
      uploadedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      downloadCount: 0
    };
    
    const updatedDocuments = [...documents, newDocument];
    localStorage.setItem('transportDocuments', JSON.stringify(updatedDocuments));
    return newDocument;
  },

  // Update document
  updateDocument: async (id, documentData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const documents = await documentsAPI.getDocuments();
    const index = documents.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    const updatedDocument = {
      ...documents[index],
      ...documentData,
      lastUpdated: new Date().toISOString()
    };
    
    documents[index] = updatedDocument;
    localStorage.setItem('transportDocuments', JSON.stringify(documents));
    return updatedDocument;
  },

  // Delete document
  deleteDocument: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const documents = await documentsAPI.getDocuments();
    const filteredDocuments = documents.filter(d => d.id !== id);
    localStorage.setItem('transportDocuments', JSON.stringify(filteredDocuments));
    return true;
  },

  // Update document status
  updateDocumentStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const documents = await documentsAPI.getDocuments();
    const index = documents.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    documents[index].status = status;
    documents[index].lastUpdated = new Date().toISOString();
    
    localStorage.setItem('transportDocuments', JSON.stringify(documents));
    return documents[index];
  }
};

// Document Form Component
const DocumentForm = ({ document, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    documentName: '',
    documentType: '',
    associatedWith: '',
    associatedType: 'vehicle',
    issueDate: '',
    expiryDate: '',
    status: 'active',
    description: '',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');

  const documentTypes = [
    { value: 'vehicle_rc', label: 'Vehicle RC' },
    { value: 'driver_license', label: 'Driver License' },
    { value: 'insurance', label: 'Insurance Policy' },
    { value: 'fitness_certificate', label: 'Fitness Certificate' },
    { value: 'pollution_certificate', label: 'Pollution Certificate' },
    { value: 'route_permit', label: 'Route Permit' },
    { value: 'aadhar_card', label: 'Aadhar Card' },
    { value: 'pan_card', label: 'PAN Card' },
    { value: 'tax_receipt', label: 'Tax Receipt' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'contract', label: 'Contract' },
    { value: 'other', label: 'Other' }
  ];

  const associatedTypes = [
    { value: 'vehicle', label: 'Vehicle', icon: Truck },
    { value: 'driver', label: 'Driver', icon: User },
    { value: 'company', label: 'Company', icon: Building },
    { value: 'trip', label: 'Trip', icon: MapPin }
  ];

  useEffect(() => {
    if (document) {
      setFormData(document);
    } else {
      setFormData({
        documentName: '',
        documentType: '',
        associatedWith: '',
        associatedType: 'vehicle',
        issueDate: '',
        expiryDate: '',
        status: 'active',
        description: '',
        tags: []
      });
    }
  }, [document, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.documentName) newErrors.documentName = 'Document name is required';
    if (!formData.documentType) newErrors.documentType = 'Document type is required';
    if (!formData.associatedWith) newErrors.associatedWith = 'Associated entity is required';
    if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file upload
      console.log('File uploaded:', file.name);
      // In real implementation, you would upload to server and get file URL
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {document ? 'Edit Document' : 'Upload New Document'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Document Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Document Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Name *
              </label>
              <input
                type="text"
                value={formData.documentName}
                onChange={(e) => handleChange('documentName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.documentName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter document name"
              />
              {errors.documentName && (
                <p className="text-red-500 text-sm mt-1">{errors.documentName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Type *
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => handleChange('documentType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.documentType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Document Type</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.documentType && (
                <p className="text-red-500 text-sm mt-1">{errors.documentType}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleChange('issueDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.issueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.issueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Association */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Association
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Associated With *
              </label>
              <input
                type="text"
                value={formData.associatedWith}
                onChange={(e) => handleChange('associatedWith', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.associatedWith ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., KA01AB1234 or Rajesh Kumar"
              />
              {errors.associatedWith && (
                <p className="text-red-500 text-sm mt-1">{errors.associatedWith}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Association Type
              </label>
              <select
                value={formData.associatedType}
                onChange={(e) => handleChange('associatedType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {associatedTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              File Upload
            </h3>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Additional Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter document description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Add tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
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
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </select>
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
              {document ? 'Update Document' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Documents Component
const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewDocument, setViewDocument] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docsData, catsData] = await Promise.all([
        documentsAPI.getDocuments(),
        documentsAPI.getCategories()
      ]);
      setDocuments(docsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (documentData) => {
    try {
      await documentsAPI.createDocument(documentData);
      await loadData();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const handleUpdateDocument = async (documentData) => {
    try {
      await documentsAPI.updateDocument(editingDocument.id, documentData);
      await loadData();
      setShowForm(false);
      setEditingDocument(null);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleDeleteDocument = async (id) => {
    try {
      await documentsAPI.deleteDocument(id);
      await loadData();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingDocument(null);
    setShowForm(true);
  };

  const handleFormSave = (documentData) => {
    if (editingDocument) {
      handleUpdateDocument(documentData);
    } else {
      handleCreateDocument(documentData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDocument(null);
  };

  const toggleDocumentSelection = (id) => {
    setSelectedDocuments(prev =>
      prev.includes(id)
        ? prev.filter(docId => docId !== id)
        : [...prev, id]
    );
  };

  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.associatedWith.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || document.status === statusFilter;
    const matchesType = typeFilter === 'all' || document.documentType === typeFilter;
    const matchesCategory = categoryFilter === 'all' || 
      (categoryFilter === 'vehicle' && document.associatedType === 'vehicle') ||
      (categoryFilter === 'driver' && document.associatedType === 'driver') ||
      (categoryFilter === 'company' && document.associatedType === 'company');
    
    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  // Calculate stats
  const stats = {
    total: documents.length,
    active: documents.filter(d => d.status === 'active').length,
    expiringSoon: documents.filter(d => d.status === 'expiring_soon').length,
    expired: documents.filter(d => d.status === 'expired').length,
    verified: documents.filter(d => d.verificationStatus === 'verified').length,
    pendingVerification: documents.filter(d => d.verificationStatus === 'pending').length
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
      expiring_soon: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', icon: AlertTriangle },
      expired: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle },
      archived: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: Archive }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  const getVerificationBadge = (status) => {
    const statusConfig = {
      verified: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle }
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

  const getDocumentTypeIcon = (type) => {
    const iconConfig = {
      vehicle_rc: { icon: Truck, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
      driver_license: { icon: User, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
      insurance: { icon: Shield, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
      fitness_certificate: { icon: FileCheck, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
      pollution_certificate: { icon: FileCheck, color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30' },
      route_permit: { icon: MapPin, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30' },
      aadhar_card: { icon: User, color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30' },
      tax_receipt: { icon: FileText, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
      default: { icon: FileText, color: 'text-gray-600 bg-gray-100 dark:bg-gray-700' }
    };
    
    const config = iconConfig[type] || iconConfig.default;
    const IconComponent = config.icon;
    
    return (
      <div className={`p-2 rounded-lg ${config.color}`}>
        <IconComponent className="h-5 w-5" />
      </div>
    );
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading documents...</p>
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
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Documents Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all your transport documents in one place
            </p>
          </div>
          <button 
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.expiringSoon}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.expired}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.verified}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Verification</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pendingVerification}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setCategoryFilter(category.name.toLowerCase().includes('vehicle') ? 'vehicle' : 
                       category.name.toLowerCase().includes('driver') ? 'driver' : 'company')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{category.name}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{category.count}</p>
                </div>
              </div>
            </div>
          );
        })}
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
                placeholder="Search by document name, ID, associated entity..."
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
                <option value="active">Active</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="vehicle_rc">Vehicle RC</option>
                <option value="driver_license">Driver License</option>
                <option value="insurance">Insurance</option>
                <option value="fitness_certificate">Fitness Certificate</option>
                <option value="pollution_certificate">Pollution Certificate</option>
                <option value="route_permit">Route Permit</option>
                <option value="aadhar_card">Aadhar Card</option>
                <option value="tax_receipt">Tax Receipt</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <FolderOpen className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <FileText className="h-4 w-4" />
              </button>
            </div>

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

        {/* Bulk Actions */}
        {selectedDocuments.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                {selectedDocuments.length} documents selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                <Download className="h-3 w-3" />
                Download Selected
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                <FileCheck className="h-3 w-3" />
                Mark Verified
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
                <Archive className="h-3 w-3" />
                Archive
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents Grid/List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
            >
              <div className="p-6">
                {/* Document Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getDocumentTypeIcon(document.documentType)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {document.documentName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{document.documentId}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(document.id)}
                    onChange={() => toggleDocumentSelection(document.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>

                {/* Document Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Associated With:</span>
                    <span className="font-medium text-gray-900 dark:text-white truncate ml-2">
                      {document.associatedWith}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Expiry:</span>
                    <span className={`font-medium ${
                      document.status === 'expired' ? 'text-red-600 dark:text-red-400' :
                      document.status === 'expiring_soon' ? 'text-orange-600 dark:text-orange-400' :
                      'text-gray-900 dark:text-white'
                    }`}>
                      {document.expiryDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">File:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {document.fileSize} • {document.fileType}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(document.status)}
                  {getVerificationBadge(document.verificationStatus)}
                </div>

                {/* Tags */}
                {document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {document.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {document.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs">
                        +{document.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewDocument(document)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(document)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit Document"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Download">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(document)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                      onChange={selectAllDocuments}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Associated With
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(document.id)}
                        onChange={() => toggleDocumentSelection(document.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getDocumentTypeIcon(document.documentType)}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {document.documentName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {document.documentId}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {document.fileSize} • {document.fileType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {document.associatedWith}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {document.associatedType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${
                        document.status === 'expired' ? 'text-red-600 dark:text-red-400' :
                        document.status === 'expiring_soon' ? 'text-orange-600 dark:text-orange-400' :
                        'text-gray-900 dark:text-white'
                      }`}>
                        {document.expiryDate}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getDaysUntilExpiry(document.expiryDate)} days
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(document.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getVerificationBadge(document.verificationStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewDocument(document)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(document)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(document)}
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
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No documents found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button 
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Upload Your First Document
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <RefreshCw className="h-4 w-4" />
          Scan for Expiring
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <BarChart3 className="h-4 w-4" />
          Document Analytics
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Shield className="h-4 w-4" />
          Compliance Check
        </button>
      </div>

      {/* Document Form Modal */}
      <DocumentForm
        document={editingDocument}
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
                Delete Document
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete document <strong>{deleteConfirm.documentName}</strong>? 
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
                onClick={() => handleDeleteDocument(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {viewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Document Details
              </h2>
              <button
                onClick={() => setViewDocument(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Document Header */}
              <div className="flex items-center gap-4">
                {getDocumentTypeIcon(viewDocument.documentType)}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {viewDocument.documentName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">{viewDocument.documentId}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(viewDocument.status)}
                  {getVerificationBadge(viewDocument.verificationStatus)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Basic Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Document Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {viewDocument.documentType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Associated With:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {viewDocument.associatedWith}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Association Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {viewDocument.associatedType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">File Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {viewDocument.fileType} • {viewDocument.fileSize}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates & Usage */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Dates & Usage</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Issue Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewDocument.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expiry Date:</span>
                      <span className={`font-medium ${
                        viewDocument.status === 'expired' ? 'text-red-600 dark:text-red-400' :
                        viewDocument.status === 'expiring_soon' ? 'text-orange-600 dark:text-orange-400' :
                        'text-gray-900 dark:text-white'
                      }`}>
                        {viewDocument.expiryDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Days Until Expiry:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getDaysUntilExpiry(viewDocument.expiryDate)} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Download Count:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewDocument.downloadCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Upload Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Uploaded By:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{viewDocument.uploadedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Upload Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(viewDocument.uploadedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(viewDocument.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sharing */}
                {viewDocument.sharedWith && viewDocument.sharedWith.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Shared With</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewDocument.sharedWith.map((person, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {viewDocument.description && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    {viewDocument.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {viewDocument.tags.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewDocument.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Preview */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Document Preview</h4>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {viewDocument.documentName}.{viewDocument.fileType.toLowerCase()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click below to view or download the document
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                        View Document
                      </button>
                      <button className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewDocument(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewDocument(null);
                  handleEdit(viewDocument);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Edit Document
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;