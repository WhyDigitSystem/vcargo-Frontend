import { useState } from "react";
import { Mail, Pencil } from "lucide-react";
import InputField from "../UI/InputField";


export default function AuctionsMISMaster({ setIsListView }) {

    const [form, setForm] = useState({
        vendor: "",
        invoiceAmount: "",
        totalInvoiceAmount: "",
        payoutReference: "",
        purpose: "",
        quantity: "1",
        requiredForValidation: "",
        invoiceType: "",
        vendorDetails: "",
    });

    const [comment, setComment] = useState("");

    const commentHistory = [
        { id: 1, user: "Administrator", text: "last edited this", time: "2 years ago" },
        { id: 2, user: "Administrator", text: "created this", time: "3 years ago" },
    ];

    const [roles, setRoles] = useState([
        { id: 1, role: "Operation Manager" },
        { id: 2, role: "Guest" }   // ⭐ Added Guest role
    ]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCommentSubmit = () => {
        if (!comment.trim()) return;
        console.log("Comment added:", comment);
        setComment("");
    };

    // ⭐ FORM DATA CREATION
    const handleSave = () => {
        const formData = {
            ...form,
            roles: roles.map((r) => r.role),   // add roles list
            timestamp: new Date().toISOString()
        };

        console.log("FORM DATA:", formData);

        // later you can send formData to backend here
        // await api.post("/saveMIS", formData)
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                <h1 className="flex-1 text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                    Auctions MIS Report
                    <span className="text-sm text-orange-500 ml-2">• Not Saved</span>
                </h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                    >
                        Clear Form
                    </button>

                    <button
                        onClick={() => setIsListView(true)}
                        className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition"
                    >
                        Show Report
                    </button>

                    {/* ⭐ SAVE BUTTON */}
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">

                {/* Static Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Ref DocType" value="Auctions" required />
                    <InputField label="Report Type" value="Script Report" required />
                    <InputField label="Reference Report" value="Auctions" />
                    <InputField label="Is Standard" value="Yes" required />
                    <InputField label="Module" value="Reverse Auction" />
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6 mt-4">
                    <label className="flex items-center gap-2 text-sm dark:text-gray-300"><input type="checkbox" checked readOnly /> Add Total Row</label>
                    <label className="flex items-center gap-2 text-sm dark:text-gray-300"><input type="checkbox" /> Disabled</label>
                    <label className="flex items-center gap-2 text-sm dark:text-gray-300"><input type="checkbox" /> Disable Prepared Report</label>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Roles Table */}
                <div>
                    <p className="font-medium mb-2 text-gray-700 dark:text-gray-300">Roles</p>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 w-10"></th>
                                    <th className="px-4 py-3 text-left w-20">No.</th>
                                    <th className="px-4 py-3 text-left">Role</th>
                                    <th className="px-4 py-3 text-center w-24">Action</th> {/* ⭐ Action column appears */}
                                </tr>
                            </thead>

                            <tbody>
                                {roles.map((r, index) => (
                                    <tr key={r.id} className="border-t border-gray-200 dark:border-gray-700">
                                        <td className="px-3 py-2">
                                            <input type="checkbox" className="h-4 w-4" />
                                        </td>

                                        <td className="px-3 py-2 dark:text-gray-300">{index + 1}</td>

                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                value={r.role}
                                                onChange={(e) => {
                                                    const updated = [...roles];
                                                    updated[index].role = e.target.value;
                                                    setRoles(updated);
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                                            />
                                        </td>

                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => alert(`Editing: ${r.role}`)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>

            {/* Comment + Timeline */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-2 dark:text-gray-300">Add a comment</h2>
                <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border"
                ></textarea>

                {/* Email Button */}
                <button className="mt-6 flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 rounded-md">
                    <Mail className="h-4 w-4" /> New Email
                </button>

                {/* Timeline */}
                <div className="relative pl-6 border-l mt-6">
                    {commentHistory.map((item) => (
                        <div key={item.id} className="mb-6">
                            <span className="absolute -left-[7px] h-3 w-3 rounded-full bg-white border"></span>

                            <p className="font-semibold dark:text-gray-300">{item.user}
                                <span className="text-gray-500 ml-1">{item.text}</span>
                            </p>
                            <p className="text-sm text-gray-500">{item.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
