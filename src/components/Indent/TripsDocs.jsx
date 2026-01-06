import { Plus, Trash2, Paperclip, Eye, Download } from "lucide-react";
import { useRef, useState } from "react";

const TripsDocs = ({
    tripDocsDetailsRows,
    setTripDocsDetailsRows
}) => {
    const rows = tripDocsDetailsRows ?? [];
    const fileInputRef = useRef({});
    const [previewFile, setPreviewFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const addRow = () => {
        setTripDocsDetailsRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                doc: "",
                docType: "",
                remarks: "",
                trip: "",
                vehicleNumber: "",
                file: null
            }
        ]);
    };

    const removeRow = (id) => {
        setTripDocsDetailsRows((prev) => prev.filter((r) => r.id !== id));
    };

    const updateRow = (id, key, value) => {
        setTripDocsDetailsRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [key]: value } : row
            )
        );
    };

    const handleFileSelect = (id, file) => {
        if (file) {
            setTripDocsDetailsRows(prev =>
                prev.map((row) =>
                    row.id === id
                        ? { 
                            ...row, 
                            file: file, 
                            doc: file.name,
                            docType: row.docType || file.name.split('.').pop().toUpperCase() + " File"
                        }
                        : row
                )
            );
        }
    };

    const handleViewFile = (file) => {
        if (!file) return;
        
        let previewUrl;
        
        // Check the type of file and get the appropriate URL
        if (file.previewUrl) {
            // For files from API (base64 or URL)
            previewUrl = file.previewUrl;
        } else if (file instanceof File) {
            // For newly uploaded files
            previewUrl = URL.createObjectURL(file);
        } else {
            return;
        }
        
        setPreviewFile({
            url: previewUrl,
            name: file.name || 'Document',
            type: file.type || 'image/jpeg',
            isBlob: !file.previewUrl, // Mark if it's a blob URL that needs cleanup
            file: file
        });
        setShowPreview(true);
    };

    const closePreview = () => {
        if (previewFile && previewFile.isBlob) {
            URL.revokeObjectURL(previewFile.url); // Clean up blob URLs
        }
        setPreviewFile(null);
        setShowPreview(false);
    };

    // Check if file is an image
    const isImageFile = (file) => {
        if (!file) return false;
        return file.type?.startsWith('image/') || 
               file.previewUrl?.startsWith('data:image') ||
               file.previewUrl?.startsWith('/9j/');
    };

    // Check if file is PDF
    const isPdfFile = (file) => {
        if (!file) return false;
        return file.type === 'application/pdf' || 
               file.previewUrl?.includes('.pdf') ||
               file.name?.endsWith('.pdf');
    };

    // Get file display name
    const getFileDisplayName = (row) => {
        if (row.file?.name) {
            return row.file.name;
        }
        if (row.doc) {
            return row.doc;
        }
        if (row.docType) {
            return `${row.docType} Document`;
        }
        return 'No file attached';
    };

    // Check if file is from API (has previewUrl)
    const isApiFile = (file) => {
        return file && file.previewUrl;
    };

    // Get file type badge
    const getFileTypeBadge = (file) => {
        if (!file) return null;
        
        if (file.isBase64) return 'BASE64';
        if (file.isUrl) return 'URL';
        if (file instanceof File) return 'FILE';
        
        return 'DOC';
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Trips Documents
            </h3>

            <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-3 py-2 w-10">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                                />
                            </th>
                            <th className="px-3 py-2 w-10">No.</th>
                            <th className="px-3 py-2">Doc</th>
                            <th className="px-3 py-2">Doc Type</th>
                            <th className="px-3 py-2">Remark</th>
                            <th className="px-3 py-2">Trip</th>
                            <th className="px-3 py-2">Vehicle Number</th>
                            <th className="px-3 py-2 w-16 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white dark:bg-gray-800">
                        {rows.map((row, index) => (
                            <tr 
                                key={row.id} 
                                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                                <td className="px-3 py-2">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>

                                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{index + 1}</td>

                                {/* DOC */}
                                <td className="px-3 py-2">
                                    <div className="flex flex-col gap-2">
                                        {/* Upload Button */}
                                        <button
                                            onClick={() => fileInputRef.current[row.id]?.click()}
                                            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-sm transition-colors border border-gray-300 dark:border-gray-600"
                                        >
                                            <Paperclip size={16} />
                                            <span>Attach File</span>
                                        </button>

                                        {/* File Display with View Option */}
                                        {(row.file || row.doc) && (
                                            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-2">
                                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                    <Paperclip size={14} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                    <span className="text-sm text-blue-800 dark:text-blue-300 truncate">
                                                        {getFileDisplayName(row)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {row.file && (
                                                        <button
                                                            onClick={() => handleViewFile(row.file)}
                                                            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors flex-shrink-0"
                                                            title="View file"
                                                        >
                                                            <Eye size={14} className="text-blue-600 dark:text-blue-400" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Hidden File Input */}
                                        <input
                                            type="file"
                                            ref={(el) => (fileInputRef.current[row.id] = el)}
                                            className="hidden"
                                            onChange={(e) => handleFileSelect(row.id, e.target.files[0])}
                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                        />
                                    </div>
                                </td>

                                {/* DOC TYPE */}
                                <td className="px-3 py-1">
                                    <input
                                        type="text"
                                        value={row.docType}
                                        onChange={(e) => updateRow(row.id, "docType", e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter document type"
                                    />
                                </td>

                                {/* REMARKS */}
                                <td className="px-3 py-1">
                                    <input
                                        type="text"
                                        value={row.remarks}
                                        onChange={(e) => updateRow(row.id, "remarks", e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter remarks"
                                    />
                                </td>

                                {/* TRIP */}
                                <td className="px-3 py-1">
                                    <input
                                        type="text"
                                        value={row.trip}
                                        onChange={(e) => updateRow(row.id, "trip", e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter trip"
                                    />
                                </td>

                                {/* VEHICLE NUMBER */}
                                <td className="px-3 py-1">
                                    <input
                                        type="text"
                                        value={row.vehicleNumber}
                                        onChange={(e) => updateRow(row.id, "vehicleNumber", e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter vehicle number"
                                    />
                                </td>

                                {/* ACTION */}
                                <td className="px-3 py-2 text-center">
                                    <button
                                        onClick={() => removeRow(row.id)}
                                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
                                    >
                                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={addRow}
                className="mt-3 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
            >
                <Plus className="h-4 w-4" /> Add Row
            </button>

            {/* File Preview Modal */}
            {showPreview && previewFile && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] w-full">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {previewFile.name}
                            </h3>
                            <button
                                onClick={closePreview}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-4 max-h-[80vh] overflow-auto flex items-center justify-center">
                            {isImageFile(previewFile) ? (
                                <div className="text-center">
                                    <img 
                                        src={previewFile.url} 
                                        alt={previewFile.name}
                                        className="max-w-full max-h-[70vh] h-auto mx-auto rounded-lg shadow-lg"
                                        onError={(e) => {
                                            console.error('Error loading image:', previewFile.url);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Click outside to close
                                    </p>
                                </div>
                            ) : isPdfFile(previewFile) ? (
                                <div className="w-full h-96">
                                    <iframe
                                        src={previewFile.url}
                                        className="w-full h-full border-0 rounded-lg"
                                        title={previewFile.name}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Paperclip size={48} className="mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Preview not available for this file type.
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                        File: {previewFile.name}
                                    </p>
                                    <a
                                        href={previewFile.url}
                                        download={previewFile.name}
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        <Download size={16} className="mr-2" />
                                        Download File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripsDocs;