import { Plus, Trash2 } from "lucide-react";
import InputField from "../UI/InputField";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { vendorAPI } from "../../api/vendorAPI";
import { vendorRateAPI } from "../../api/vendorRateAPI";
import { useSelector } from "react-redux";

const IndentExtraInfoTab = ({
    formData,
    setFormData,
    timelineRows,
    setTimelineRows,
    participantsRows,
    setParticipantsRows,
    onFormChange
}) => {
    const rows = timelineRows ?? [];
    const Participants = participantsRows ?? [];

    const [vendorList, setVendorList] = useState([]);
    const [vendorRateList, setVendorRateList] = useState([]);

    const [vendorSearch, setVendorSearch] = useState("");
    const [showVendorDropdown, setShowVendorDropdown] = useState(null);

    const [vendorRateSearch, setVendorRateSearch] = useState("");
    const [showVendorRateDropdown, setShowVendorRateDropdown] = useState(null);

    const { user } = useSelector((state) => state.auth);
    const orgId = user.orgId;

    const [loading, setLoading] = useState(false);

    const vendorRef = useRef(null);
    const vendorRateRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        getVendor();
        getVendorRate();
    }, []);

    // ========== FILTERS =============
    const filteredVendors = vendorList.filter((v) =>
        (v.organization || "").toLowerCase().includes(vendorSearch.toLowerCase())
    );

    const filteredVendorRates = vendorRateList.filter((v) =>
        String(v.rate || "").toLowerCase().includes(vendorRateSearch.toLowerCase())
    );

    // ========== API CALLS ============
    const getVendor = async () => {
        try {
            setLoading(true);
            const response = await vendorAPI.getVendorName({ orgId });
            const data = response?.paramObjectsMap?.vendorVO || [];
            setVendorList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching vendor list:", error);
            setVendorList([]);
        } finally {
            setLoading(false);
        }
    };

    const getVendorRate = async () => {
        try {
            setLoading(true);
            const response = await vendorRateAPI.getVendorRate({orgId});
            const data = response?.paramObjectsMap?.vendorRateVO || [];
            setVendorRateList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching vendor rates:", error);
            setVendorRateList([]);
        } finally {
            setLoading(false);
        }
    };

    // ========== FORM STATE ============
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFormChange(name, value);
    };

    // ========== TIMELINE ROWS ===========
    const addTimelineRow = () => {
        setTimelineRows((prev) => [
            ...prev,
            { id: Date.now(), event: "", time: "", user: "" }
        ]);
    };

    const removeTimelineRow = (id) => {
        setTimelineRows((prev) => prev.filter((r) => r.id !== id));
    };

    const updateTimelineRow = (id, key, value) => {
        setTimelineRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [key]: value } : row
            )
        );
    };

    // ========== PARTICIPANTS ===========
    const addParticipantRow = () => {
        const newParticipant = {
            id: Date.now(),
            vendor: "",
            vendorRate: "",
            rank: "",
            vendorResponse: "Pending"
        };
        setParticipantsRows([...participantsRows, newParticipant]);
    };

    const removeParticipantRow = (id) => {
        const updatedParticipants = participantsRows.filter(participant => participant.id !== id);
        setParticipantsRows(updatedParticipants);
    };

    const updateParticipantRow = (id, key, value) => {
        setParticipantsRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [key]: value } : row
            )
        );
    };

    const handleVendorSelect = (rowId, vendorName) => {
        updateParticipantRow(rowId, "vendor", vendorName);
        setVendorSearch("");
        setShowVendorDropdown(null);
    };

    const handleVendorRateSelect = (rowId, vendorRate) => {
        updateParticipantRow(rowId, "vendorRate", vendorRate);
        setVendorRateSearch("");
        setShowVendorRateDropdown(null);
    };

    const handleCreateNewVendor = () => {
        navigate("/vendor");
    };

    const handleCreateNewVendorRate = () => {
        navigate("/vendor-rate");
    };

    // ========== CLOSE DROPDOWNS ON CLICK OUTSIDE ==========
    useEffect(() => {
        const handler = (e) => {
            if (vendorRef.current && !vendorRef.current.contains(e.target)) {
                setShowVendorDropdown(null);
            }
            if (vendorRateRef.current && !vendorRateRef.current.contains(e.target)) {
                setShowVendorRateDropdown(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="space-y-6">

            {/* TIMELINE TABLE */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Timeline Table
                </h3>

                <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-3 py-2 w-10">
                                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                                </th>
                                <th className="px-3 py-2 w-10">No.</th>
                                <th className="px-3 py-2">Event</th>
                                <th className="px-3 py-2">Time</th>
                                <th className="px-3 py-2">User</th>
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
                                            className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                        />
                                    </td>

                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{index + 1}</td>

                                    <td className="px-3 py-1">
                                        <input
                                            type="text"
                                            value={row.event}
                                            onChange={(e) =>
                                                updateTimelineRow(row.id, "event", e.target.value)
                                            }
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter event"
                                        />
                                    </td>

                                    <td className="px-3 py-1">
                                        <input
                                            type="datetime-local"
                                            value={row.time}
                                            onChange={(e) =>
                                                updateTimelineRow(row.id, "time", e.target.value)
                                            }
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </td>

                                    <td className="px-3 py-1">
                                        <input
                                            type="text"
                                            value={row.user}
                                            onChange={(e) =>
                                                updateTimelineRow(row.id, "user", e.target.value)
                                            }
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter user"
                                        />
                                    </td>

                                    <td className="px-3 py-2 text-center">
                                        <button
                                            onClick={() => removeTimelineRow(row.id)}
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
                    onClick={addTimelineRow}
                    className="mt-3 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Row
                </button>
            </div>

            {/* EXTRA INFO FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Order Type
                    </label>

                    <select
                        name="orderType"
                        value={formData.orderType || ""}
                        onChange={handleInputChange}
                        className="w-full h-9 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select Order Type</option>
                        <option value="Contracted scheduled">Contracted scheduled</option>
                        <option value="Contracted order">Contracted order</option>
                        <option value="Leased order">Leased order</option>
                        <option value="AdHoc">AdHoc</option>
                        <option value="Empty">Empty</option>
                    </select>
                </div>

                <InputField
                    label="Docket No"
                    name="dockerNo"
                    value={formData.dockerNo || ""}
                    onChange={handleInputChange}
                />

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Trip Type
                    </label>

                    <select
                        name="tripType"
                        value={formData.tripType || ""}
                        onChange={handleInputChange}
                        className="w-full h-9 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select TripType</option>
                        <option value="First Mile">First Mile</option>
                        <option value="Middle Mile">Middle Mile</option>
                    </select>
                </div>

                <InputField
                    label="Material Type"
                    name="materialType"
                    value={formData.materialType || ""}
                    onChange={handleInputChange}
                />

                <InputField
                    label="Overtime Hours"
                    type="number"
                    name="overtimeHours"
                    value={formData.overtimeHours || 0}
                    onChange={handleInputChange}
                />
            </div>

            {/* POC Details */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-0">
                    POC Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <InputField
                        label="Origin POC"
                        name="originPoc"
                        value={formData.originPoc || ""}
                        onChange={handleInputChange}
                    />

                    <InputField
                        label="Destination POC"
                        name="destinationPoc"
                        value={formData.destinationPoc || ""}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* PARTICIPANTS TABLE */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Participants
                </h3>

                <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-3 py-2 w-10">
                                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
                                </th>
                                <th className="px-3 py-2 w-10">No.</th>
                                <th className="px-3 py-2">Vendor</th>
                                <th className="px-3 py-2">Vendor Rate</th>
                                <th className="px-3 py-2">Rank</th>
                                <th className="px-3 py-2">Vendor Response</th>
                                <th className="px-3 py-2 w-16 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white dark:bg-gray-800">
                            {Participants.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <td className="px-3 py-2">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                        />
                                    </td>

                                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{index + 1}</td>

                                    {/* VENDOR DROPDOWN */}
                                    <td className="px-3 py-1">
                                        <div className="relative" ref={vendorRef}>
                                            <input
                                                type="text"
                                                value={row.vendor}
                                                onChange={(e) => {
                                                    updateParticipantRow(row.id, "vendor", e.target.value);
                                                    setVendorSearch(e.target.value);
                                                    setShowVendorDropdown(row.id);
                                                }}
                                                onFocus={() => setShowVendorDropdown(row.id)}
                                                placeholder="Search Vendor..."
                                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />

                                            {showVendorDropdown === row.id && (
                                                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                                                    <div className="p-1">
                                                        {filteredVendors.length > 0 ? (
                                                            filteredVendors.map((v, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md transition-colors"
                                                                    onClick={() => handleVendorSelect(row.id, v.organization)}
                                                                >
                                                                    {v.organization}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                                                                No vendors found
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={handleCreateNewVendor}
                                                        className="w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 border-t border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm flex items-center gap-2 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4" /> Add New Vendor
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* VENDOR RATE DROPDOWN */}
                                    <td className="px-3 py-1">
                                        <div className="relative" ref={vendorRateRef}>
                                            <input
                                                type="text"
                                                value={row.vendorRate}
                                                onChange={(e) => {
                                                    updateParticipantRow(row.id, "vendorRate", e.target.value);
                                                    setVendorRateSearch(e.target.value);
                                                    setShowVendorRateDropdown(row.id);
                                                }}
                                                onFocus={() => setShowVendorRateDropdown(row.id)}
                                                placeholder="Search Vendor Rate..."
                                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />

                                            {showVendorRateDropdown === row.id && (
                                                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                                                    <div className="p-1">
                                                        {filteredVendorRates.length > 0 ? (
                                                            filteredVendorRates.map((r, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md transition-colors"
                                                                    onClick={() => handleVendorRateSelect(row.id, r.rate)}
                                                                >
                                                                    {r.rate}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                                                                No vendor rates found
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={handleCreateNewVendorRate}
                                                        className="w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 border-t border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm flex items-center gap-2 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4" /> Add New Vendor Rate
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* RANK */}
                                    <td className="px-3 py-1">
                                        <input
                                            type="text"
                                            value={row.rank}
                                            onChange={(e) =>
                                                updateParticipantRow(row.id, "rank", e.target.value)
                                            }
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter rank"
                                        />
                                    </td>

                                    {/* VENDOR RESPONSE */}
                                    <td className="px-3 py-1">
                                        <select
                                            value={row.vendorResponse}
                                            onChange={(e) =>
                                                updateParticipantRow(row.id, "vendorResponse", e.target.value)
                                            }
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Expired">Expired</option>
                                        </select>
                                    </td>

                                    {/* DELETE BUTTON */}
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            onClick={() => removeParticipantRow(row.id)}
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
                    onClick={addParticipantRow}
                    className="mt-3 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Row
                </button>
            </div>
        </div>
    );
};

export default IndentExtraInfoTab;