"use client";

import { useState, useRef, useMemo } from "react";
import mayData from "../data/may";
import juneData from "../data/june";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const salesData = {
  May: mayData,
  June: juneData,
};

export default function SalesDashboard() {
  const months = Object.keys(salesData);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [darkMode, setDarkMode] = useState(true);
  const printRef = useRef();

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    // Save original body content
    const originalBodyInnerHTML = document.body.innerHTML;

    // Create a temporary element for printing
    const printElement = document.createElement("div");
    printElement.innerHTML = `
      <html>
        <head>
          <title>Afnan Fashion - Sales Report</title>
          <style>
            @media print {
                body {
                    font-family: sans-serif;
                    padding: 20px;
                    ${darkMode ? "color: #fff; background: #000;" : "color: #000; background: #fff;"}
                    -webkit-print-color-adjust: exact; /* For WebKit browsers to print background colors */
                    print-color-adjust: exact; /* Standard property */
                }
                h1, h2, h3, h4, h5, h6 { color: ${darkMode ? "#fff" : "#000"} !important; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td {
                    border: 1px solid ${darkMode ? "#555" : "#ccc"};
                    padding: 8px;
                    text-align: left;
                    ${darkMode ? "color: #fff;" : "color: #000;"}
                }
                th { background-color: ${darkMode ? "#333" : "#f0f0f0"} !important; }
                .text-emerald-400 { color: ${darkMode ? "#4ade80" : "#047857"} !important; } /* Adjust emerald for print if needed */
                .no-print { display: none !important; } /* Hide elements with no-print class */
                .backdrop-blur-lg { filter: none !important; backdrop-filter: none !important; } /* Remove blur for print */
                .shadow-xl, .shadow-inner { box-shadow: none !important; } /* Remove shadows for print */
                .rounded-2xl, .rounded-lg { border-radius: 0 !important; } /* Remove rounded corners for print */
                /* Recharts specific print adjustments (might need more fine-tuning) */
                .recharts-wrapper { overflow: visible !important; }
                .recharts-surface { background-color: ${darkMode ? "#222" : "#fff"} !important; } /* Chart background */
                .recharts-cartesian-axis-line, .recharts-cartesian-grid-line line, .recharts-bar-rectangle {
                  stroke: ${darkMode ? "#666" : "#aaa"} !important;
                  fill: ${darkMode ? "#4ade80" : "#22c55e"} !important;
                }
                .recharts-text, .recharts-legend-item-text { fill: ${darkMode ? "#ccc" : "#333"} !important; }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `;

    // Append print element to body, print, then remove
    document.body.innerHTML = printElement.innerHTML;
    window.print();
    // setTimeout ব্যবহার করে DOM আপডেট হওয়ার জন্য একটু সময় দেওয়া হচ্ছে
    setTimeout(() => {
      document.body.innerHTML = originalBodyInnerHTML; // Restore original body
      // প্রিন্ট শেষে নির্বাচিত মোডে ফিরে আসার জন্য স্টেট রিফ্রেশ করা
      setDarkMode(darkMode); // This will re-apply the correct theme classes
    }, 100);
  };

  const filteredData = salesData[selectedMonth];

  const totalSalesForSelectedMonth = useMemo(() => {
    return filteredData.reduce((sum, d) => sum + d.total, 0);
  }, [filteredData]);

  const totalByMonth = months.map((month) => ({
    month,
    total: salesData[month].reduce((sum, d) => sum + d.total, 0),
  }));

  const highestMonth = totalByMonth.reduce(
    (max, m) => (m.total > max.total ? m : max),
    totalByMonth[0]
  );

  const themeClasses = darkMode
    ? "from-gray-900 to-gray-800 text-white"
    : "from-white to-gray-100 text-gray-900";

  const tableBg = darkMode ? "bg-gray-800" : "bg-white";
  const tableText = darkMode ? "text-white" : "text-gray-900";
  const tableBorder = darkMode ? "border-gray-700" : "border-gray-300";
  const hoverBg = darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100";
  const headText = darkMode ? "text-gray-300" : "text-gray-700";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${themeClasses} px-4 py-8 transition-all duration-500`}
    >
      <div className="max-w-7xl mx-auto"> {/* Increased max-width for larger screens */}
        <div
          className={`backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-xl border ${
            darkMode ? "bg-white/10 border-white/10" : "bg-white/70 border-gray-200"
          }`}
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 no-print gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center sm:text-left">
              📊 Afnan Fashion - মাসিক সেল রিপোর্ট
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"> {/* Buttons stack on small screens */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 transition w-full text-sm sm:text-base"
              >
                {darkMode ? "🌞 লাইট মোড" : "🌙 ডার্ক মোড"}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition w-full text-sm sm:text-base"
              >
                🖨️ প্রিন্ট করুন
              </button>
            </div>
          </div>

          {/* Month Selector and Highest Sales Info */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 no-print">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg shadow appearance-none leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-auto" // Added styling for better appearance and responsiveness
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="text-right w-full md:w-auto">
              <p className={`text-sm ${headText}`}>সর্বোচ্চ সেল হয়েছে:</p>
              <p className="text-lg font-semibold text-emerald-400">
                {highestMonth.month} (৳{highestMonth.total.toLocaleString()})
              </p>
            </div>
          </div>

          {/* Sales Report Table and Chart */}
          <div
            ref={printRef}
            className={`overflow-x-auto ${tableBg} ${tableText} rounded-lg shadow-inner p-4 text-sm`}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              📊 Afnan Fashion - মাসিক সেল রিপোর্ট ({selectedMonth} মাস)
            </h1>
            <div className="flex justify-end items-center mb-4">
              <p className={`text-sm md:text-base ${headText}`}>
                এই মাসের মোট সেল:{" "}
                <span className="text-lg font-semibold text-emerald-400">
                  ৳{totalSalesForSelectedMonth.toLocaleString()}
                </span>
              </p>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-gray-700"> {/* Added divide-y for horizontal lines */}
                <thead>
                  <tr className={`text-left border-b ${tableBorder}`}>
                    <th className="py-2 px-3 sm:px-4">📅 তারিখ</th>
                    <th className="py-2 px-3 sm:px-4">🛍️ পণ্যের বিবরণ</th>
                    <th className="py-2 px-1 text-center">🔢 পরিমাণ</th> {/* Reduced padding for quantity on mobile */}
                    <th className="py-2 px-1 text-center">💵 প্রতি ইউনিট</th> {/* Reduced padding for price on mobile */}
                    <th className="py-2 px-1 text-center">💰 মোট</th> {/* Reduced padding for total on mobile */}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, i) => (
                    <tr
                      key={i}
                      className={`border-b ${tableBorder} ${hoverBg} transition`}
                    >
                      <td className="py-1 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">{item.date}</td>
                      <td className="py-1 px-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">{item.description}</td>
                      <td className="py-1 px-1 text-center text-xs sm:text-sm">{item.quantity}</td>
                      <td className="py-1 px-1 text-center text-xs sm:text-sm">{item.price}</td>
                      <td className="py-1 px-1 text-center font-semibold text-emerald-400 text-xs sm:text-sm">
                        ৳{item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Monthly Sales Chart */}
            <div className="mt-8 sm:mt-10 p-4 border rounded-lg shadow-inner" style={{ minHeight: '350px' }}> {/* Added minHeight to chart container for consistent spacing */}
              <h2 className="text-xl font-bold mb-4">📈 মাসিক মোট সেল গ্রাফ</h2>
              <div id="sales-chart-container">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={totalByMonth}
                    margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#ccc"} />
                    <XAxis dataKey="month" stroke={darkMode ? "#ccc" : "#333"} />
                    <YAxis stroke={darkMode ? "#ccc" : "#333"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#333" : "#fff",
                        color: darkMode ? "#fff" : "#000",
                        borderRadius: 8,
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="total" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={30} /> {/* Reduced barSize for better mobile look */}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}