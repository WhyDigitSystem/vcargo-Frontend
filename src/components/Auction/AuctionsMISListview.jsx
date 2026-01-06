import { Plus, Filter, MapPin, Calendar, Edit3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuctionsMISListview = ({ setIsListView }) => {

    const mockMIS = [
        {
            id: 1,
            vendor: "Tata Logistics",
            invoiceAmount: "150000",
            purpose: "Auction Handling",
            invoiceType: "Service",
            date: "2025-11-07",
            status: "Pending",
        },
        {
            id: 2,
            vendor: "VRL Transport",
            invoiceAmount: "82000",
            purpose: "MIS Update",
            invoiceType: "Service",
            date: "2025-11-06",
            status: "Approved",
        },
        {
            id: 3,
            vendor: "Express Cargo",
            invoiceAmount: "200000",
            purpose: "Auction Support",
            invoiceType: "Service",
            date: "2025-11-08",
            status: "In Review",
        },
    ];

    const handleEdit = (misItem) => {
        console.log("Editing MIS:", misItem);
        setIsListView(false); // Go to Master
    };

    return (
        <div className="max-w-6xl mt-8 mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsListView(false)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Auctions MIS Report
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg 
                        bg-gray-100 hover:bg-gray-200 
                        dark:bg-gray-700 dark:hover:bg-gray-600 
                        text-gray-700 dark:text-gray-200 transition">
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>

                    <button
                        onClick={() => setIsListView(false)} 
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Add MIS Report
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-gray-600 dark:text-gray-300 text-xs">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">#</th>
                            <th className="px-5 py-3 text-left font-semibold">Vendor</th>
                            <th className="px-5 py-3 text-left font-semibold">Invoice Amount</th>
                            <th className="px-5 py-3 text-left font-semibold">Purpose</th>
                            <th className="px-5 py-3 text-left font-semibold">Invoice Type</th>
                            <th className="px-5 py-3 text-left font-semibold">Date</th>
                            <th className="px-5 py-3 text-left font-semibold">Status</th>
                            <th className="px-5 py-3 text-center font-semibold">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mockMIS.map((item, idx) => (
                            <tr
                                key={item.id}
                                className="border-t border-gray-200 dark:border-gray-700 
                                hover:bg-blue-50 dark:hover:bg-gray-800/60 
                                transition-all duration-200"
                            >
                                <td className="px-5 py-3">{idx + 1}</td>
                                <td className="px-5 py-3">{item.vendor}</td>
                                <td className="px-5 py-3">₹ {item.invoiceAmount}</td>
                                <td className="px-5 py-3">{item.purpose}</td>
                                <td className="px-5 py-3">{item.invoiceType}</td>

                                <td className="px-5 py-3 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {item.date}
                                </td>

                                <td className="px-5 py-3">
                                    <span
                                        className={`
                                            px-3 py-1 text-xs font-medium rounded-full 
                                            ${ item.status === "Approved"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : item.status === "In Review"
                                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            }
                                        `}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                <td className="px-5 py-3 text-center">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        <Edit3 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
                <span>Showing 1–3 of 3 results</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Prev</button>
                    <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white hover:bg-blue-700">1</button>
                    <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Next</button>
                </div>
            </div>
        </div>
    );
};

export default AuctionsMISListview;
