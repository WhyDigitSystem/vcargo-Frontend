import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "../../UI/InputField";

export default function TripAlertsMaster({ setIsListView }) {

    const tripRef = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        trip: "",
        vehicle: "",
        driver: "",
        fromDate: "",
        toDate: "",
        type: "",
        extra: ""
    });

    const [tripSearch, setTripSearch] = useState("");
    const [showTripDropdown, setShowTripDropdown] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState("");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tripRef.current && !tripRef.current.contains(event.target)) {
                setShowTripDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const tripList = [
        { id: 1, name: "Trip A" },
        { id: 2, name: "Trip B" },
        { id: 3, name: "Trip C" },
    ];

    const filteredTrips = tripList.filter((t) =>
        t.name.toLowerCase().includes(tripSearch.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTripSelect = (trip) => {
        setSelectedTrip(trip.name);
        handleChange({ target: { name: "trip", value: trip.name } });
        setShowTripDropdown(false);
    };

    const handleCreateNewTrip = () => {
        setShowTripDropdown(false);
        navigate("/trip");
    };

    return (
        <div className="max-w-6xl mx-auto mt-5 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setIsListView(true)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>

                <h1 className="flex-1 text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                    New Trip Alerts
                    <span className="text-sm text-orange-500 ml-2">• Not Saved</span>
                </h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 
                        text-gray-800 dark:text-gray-200 hover:bg-gray-200 
                        dark:hover:bg-gray-700 rounded-lg"
                    >
                        Clear Form
                    </button>

                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Trip Dropdown */}
                    <div className="relative" ref={tripRef}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Trip <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            name="trip"
                            value={selectedTrip || tripSearch}
                            onChange={(e) => {
                                setSelectedTrip("");
                                setTripSearch(e.target.value);
                                setShowTripDropdown(true);
                                handleChange(e);
                            }}
                            onFocus={() => setShowTripDropdown(true)}
                            placeholder="Search Trip..."
                            className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 
                                       rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                       focus:ring-2 focus:ring-blue-500"
                        />

                        {showTripDropdown && (
                            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 
                                            rounded-xl shadow-xl border border-gray-200 
                                            dark:border-gray-700 z-50 p-2">

                                {filteredTrips.length > 0 ? (
                                    filteredTrips.map((trip) => (
                                        <div
                                            key={trip.id}
                                            onClick={() => handleTripSelect(trip)}
                                            className="px-3 py-1 rounded-md hover:bg-gray-100 
                                                       dark:hover:bg-gray-800 cursor-pointer"
                                        >
                                            <p className="font-medium text-gray-700 dark:text-gray-100">
                                                {trip.name}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 px-3 py-2">
                                        No trips found
                                    </p>
                                )}

                                <button
                                    onClick={handleCreateNewTrip}
                                    className="w-full flex items-center gap-2 px-3 py-2 mt-1 
                                               text-blue-600 hover:bg-blue-50 rounded-md text-sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create a new Trip
                                </button>
                            </div>
                        )}
                    </div>
                    <InputField label="Vehicle" name="vehicle" value={formData.vehicle} onChange={handleChange} />
                    <InputField label="Driver" name="driver" value={formData.driver} onChange={handleChange} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) =>
                                setFormData({ ...formData, type: e.target.value })
                            }
                            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="Switched Off">Switched Off</option>
                            <option value="Route Deviation">Route Deviation</option>
                            <option value="Long Stoppage">Long Stoppage</option>
                            <option value="Tracking Interrupt">Tracking Interrupt</option>
                        </select>
                    </div>
                    <InputField label="Extra" name="extra" value={formData.extra} onChange={handleChange} />
                    <InputField label="From" name="fromDate" value={formData.fromDate} onChange={handleChange} type="datetime-local" />
                    <InputField label="To" name="toDate" value={formData.toDateDate} onChange={handleChange} type="datetime-local" />
                </div>
            </div>
        </div>
    );
}
