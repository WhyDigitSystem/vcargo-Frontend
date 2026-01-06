import { useRef, useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Paperclip, Eye, Download } from "lucide-react";

export default function TripsDocs({ 
    tripDocs,
    addDocRow,
    removeDocRow,
    updateDocField,
    handleFileSelect,
    tripList = [],
    editingId
}) {
    const fileInputRef = useRef({});
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    
    const docTypeOptions = [
        "Aadhar",
        "Bank",
        "DL",
        "Invoice",
        "POD",
        "LR",
        "PAN",
        "Other"
    ];

    // Handle viewing document - FIXED LOGIC
    const handleViewDocument = (doc) => {
        // Check for new file OR existing file when editing
        const hasFile = doc.file || (editingId && doc.fileName);
        
        if (!hasFile) {
            console.log("No document to view");
            return;
        }

        if (doc.file) {
            // For new files
            const fileUrl = URL.createObjectURL(doc.file);
            setSelectedDocument({
                name: doc.file.name,
                url: fileUrl,
                type: doc.file.type,
                isExisting: false
            });
        } else if (editingId && doc.fileName) {
            // For existing files (when editing)
            setSelectedDocument({
                name: doc.fileName,
                url: null,
                type: 'existing',
                isExisting: true,
                filePath: doc.filePath
            });
        }
        setShowDocumentModal(true);
    };

    // Handle downloading document - FIXED LOGIC
    const handleDownloadDocument = (doc) => {
        // Check for new file OR existing file when editing
        const hasFile = doc.file || (editingId && doc.fileName);
        
        if (!hasFile) {
            console.log("No document to download");
            return;
        }

        if (doc.file) {
            const url = URL.createObjectURL(doc.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (editingId && doc.fileName) {
            // Implement download for existing files
            console.log(`Downloading ${doc.fileName}`);
            // You'll need to implement API call to download the file
            alert(`Download functionality for existing file: ${doc.fileName}\nImplement API call to download from server.`);
        }
    };

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            if (selectedDocument?.url) {
                URL.revokeObjectURL(selectedDocument.url);
            }
        };
    }, [selectedDocument]);

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Docs
            </h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="px-3 py-3 w-12">No.</th>
                            <th className="px-3 py-3">Doc</th>
                            <th className="px-3 py-3">Doc Type</th>
                            <th className="px-3 py-3">Remark</th>
                            <th className="px-3 py-3">Trip</th>
                            <th className="px-3 py-3">Vehicle Number</th>
                            <th className="px-3 py-3 text-center w-32">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tripDocs.map((row, index) => {
                            // FIXED: Check if we should show eye/download icons
                            const shouldShowEyeIcon = row.file || (editingId && row.fileName);
                            const shouldShowDownloadIcon = row.file || (editingId && row.fileName);

                            return (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-3 py-2">{index + 1}</td>

                                    {/* Attach Button */}
                                    <td className="px-3 py-2">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => fileInputRef.current[row.id]?.click()}
                                                className="flex items-center space-x-1 px-2 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <Paperclip size={14} />
                                                <span className="truncate max-w-[120px]">
                                                    {row.file ? row.file.name : row.fileName || "Attach"}
                                                </span>
                                            </button>
                                            
                                            {/* Show existing file indicator */}
                                            {row.isExistingFile && row.fileName && (
                                                <span className="text-xs text-green-600 dark:text-green-400">
                                                    ✓ Existing
                                                </span>
                                            )}
                                        </div>

                                        {/* Hidden File Input */}
                                        <input
                                            type="file"
                                            ref={(el) => (fileInputRef.current[row.id] = el)}
                                            className="hidden"
                                            onChange={(e) =>
                                                handleFileSelect(row.id, e.target.files[0])
                                            }
                                        />
                                    </td>

                                    {/* Doc Type */}
                                    <td className="px-3 py-2">
                                        <select
                                            value={row.docType}
                                            onChange={(e) =>
                                                updateDocField(row.id, "docType", e.target.value)
                                            }
                                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Doc Type</option>
                                            {docTypeOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Remark */}
                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            value={row.remark}
                                            onChange={(e) =>
                                                updateDocField(row.id, "remark", e.target.value)
                                            }
                                            placeholder="Enter Remark"
                                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </td>

                                    {/* Trip */}
                                    <td className="px-3 py-2">
                                        <select
                                            value={row.trip}
                                            onChange={(e) =>
                                                updateDocField(row.id, "trip", e.target.value)
                                            }
                                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Trip</option>
                                            {tripList.map((trip) => (
                                                <option key={trip.id} value={trip.id}>
                                                    Trip-{trip.id} {trip.vehicleNumber && `(${trip.vehicleNumber})`}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Vehicle Number */}
                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            value={row.vehicleNumber}
                                            onChange={(e) =>
                                                updateDocField(
                                                    row.id,
                                                    "vehicleNumber",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter Vehicle Number"
                                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </td>

                                    {/* Action Buttons - Updated with Eye Icon - FIXED CONDITIONS */}
                                    <td className="px-3 py-2">
                                        <div className="flex justify-center items-center space-x-2">
                                            {/* View Button (Eye Icon) */}
                                            {shouldShowEyeIcon && (
                                                <button 
                                                    onClick={() => handleViewDocument(row)}
                                                    className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                                    title="View Document"
                                                >
                                                    <Eye size={16} className="text-blue-600 dark:text-blue-400" />
                                                </button>
                                            )}

                                            {/* Download Button */}
                                            {shouldShowDownloadIcon && (
                                                <button 
                                                    onClick={() => handleDownloadDocument(row)}
                                                    className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                                                    title="Download Document"
                                                >
                                                    <Download size={16} className="text-green-600 dark:text-green-400" />
                                                </button>
                                            )}

                                            {/* Delete Button */}
                                            {tripDocs.length > 1 && (
                                                <button
                                                    onClick={() => removeDocRow(row.id)}
                                                    className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                                    title="Delete Row"
                                                >
                                                    <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Add Row Button */}
            <button
                onClick={addDocRow}
                className="mt-4 flex items-center space-x-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
            >
                <Plus size={16} />
                <span>Add Row</span>
            </button>

            {/* Document Modal */}
            {showDocumentModal && selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {selectedDocument.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowDocumentModal(false);
                                    if (selectedDocument.url) {
                                        URL.revokeObjectURL(selectedDocument.url);
                                    }
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="p-4 overflow-auto max-h-[70vh]">
                            {selectedDocument.url ? (
                                selectedDocument.type.startsWith('image/') ? (
                                    <img 
                                        src={selectedDocument.url} 
                                        alt="Document" 
                                        className="max-w-full max-h-full mx-auto"
                                    />
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="mb-4">
                                            <Paperclip size={48} className="text-gray-400 mx-auto" />
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Preview not available for this file type
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            File: {selectedDocument.name}
                                        </p>
                                        <button
                                            onClick={() => handleDownloadDocument(selectedDocument)}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Download File
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="text-center p-8">
                                    <p className="text-gray-500 mb-2">Existing document on server</p>
                                    <p className="text-sm text-gray-600 mb-4">{selectedDocument.name}</p>
                                    <button
                                        onClick={() => {
                                            // Implement download from server
                                            alert(`Download functionality for existing file: ${selectedDocument.name}\nImplement API call to download from server.`);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Download from Server
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}