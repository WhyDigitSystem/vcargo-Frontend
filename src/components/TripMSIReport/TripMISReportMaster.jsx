import { useState } from "react";
import { Mail } from "lucide-react";
import InputField from "../UI/InputField";

export default function TripMISReportMaster({ setIsListView }) {

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

    return (
        <div className="max-w-6xl mx-auto mt-5 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">

            {/* --Header-- */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">

                <h1 className="flex-1 text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                    Trip Report MIS
                    <span className="text-sm text-orange-500 ml-2">• Not Saved</span>
                </h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 
                                   text-gray-800 dark:text-gray-200 hover:bg-gray-200 
                                   dark:hover:bg-gray-700 rounded-lg">
                        Clear Form
                    </button>
                    <button
                        onClick={() => setIsListView(true)}
                        className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition"
                    >
                        Show Report
                    </button>
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </div>

            {/* -- Content Section -- */}
            <div className="p-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Ref DocType" value="Trips" required />
                    <InputField label="Report Type" value="Report Builder" required />
                    <InputField label="Reference Report" value="Trips" />
                    <InputField label="Is Standard" value="Yes" required />
                    <InputField label="Module" value="Execution" />

                </div>
                <div className="flex items-center gap-3 mt-6">
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input type="checkbox" checked readOnly className="h-4 w-4" />
                        Add Total Row
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input type="checkbox" />
                        Disabled
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input type="checkbox" />
                        Disable Prepared Report
                    </label>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div>
                    <button className="flex justify-between items-center w-full text-left font-semibold text-gray-800 dark:text-gray-200">
                        Client Code
                    </button>

                    <div className="mt-4">

                        <p className="font-medium mb-2 text-gray-700 dark:text-gray-300">Roles</p>

                        {/* TABLE CONTAINER */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">

                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 w-10"></th>
                                        <th className="px-4 py-3 text-left w-20">No.</th>
                                        <th className="px-4 py-3 text-left">Role</th>
                                        <th className="px-4 py-3 text-center w-24">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white dark:bg-gray-900">

                                    {/* Row */}
                                    <tr className="border-t border-gray-200 dark:border-gray-700">
                                        <td className="px-4 py-3">
                                            <input type="checkbox" className="h-4 w-4" />
                                        </td>

                                        <td className="px-4 py-3">1</td>

                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                defaultValue="Operation Manager"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                                           bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200
                                           focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Enter Role"
                                            />
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                ✎
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        {/* ADD ROW BUTTON */}
                        {/* <button
                            className="flex items-center gap-2 mt-4 px-4 py-2 
                       bg-blue-600 hover:bg-blue-700 text-white text-sm 
                       rounded-lg shadow transition"
                        >
                            <span className="text-lg">＋</span> Add Row
                        </button> */}
                    </div>
                </div>
            </div>

            {/* -- Add Comment Section -- */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                    Add a comment
                </h2>

                <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 
                               border border-gray-200 dark:border-gray-700 
                               text-gray-800 dark:text-gray-200 outline-none focus:ring-2 
                               focus:ring-blue-500"
                ></textarea>

                {/* -- Timeline Section -- */}
                <div className="mt-8">
                    {/* New Email Button */}
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition mb-6"
                    >
                        <Mail className="h-4 w-4" />
                        New Email
                    </button>

                    {/* Timeline */}
                    <div className="relative pl-6 border-l border-gray-300 dark:border-gray-600">

                        {commentHistory.map((item) => (
                            <div key={item.id} className="mb-8 relative">

                                {/* Timeline Dot */}
                                <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full 
                                  bg-white dark:bg-gray-900 
                                  border border-gray-400 dark:border-gray-500">
                                </span>

                                {/* User + Activity Text */}
                                <p className="text-gray-900 dark:text-gray-100 font-semibold ml-4">
                                    {item.user}
                                    <span className="font-normal text-gray-600 dark:text-gray-400 ml-1">
                                        {item.text}
                                    </span>
                                </p>

                                {/* Time */}
                                <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                                    {item.time}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
