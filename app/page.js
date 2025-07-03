"use client";

import { useState, useRef, useMemo } from "react";
// import html2pdf from "html2pdf.js"; // html2pdf লাইব্রেরি ইম্পোর্ট সরিয়ে দেওয়া হয়েছে
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
    const printElement = document.createElement('div');
    printElement.innerHTML = `
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body { font-family: sans-serif; padding: 20px; ${darkMode ? 'color: #fff; background: #000;' : 'color: #000; background: #fff;'} } /* ডার্ক মোড অনুযায়ী প্রিন্ট স্টাইল */
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid ${darkMode ? '#777' : '#ccc'}; padding: 8px; text-align: left; ${darkMode ? 'color: #fff;' : 'color: #000;'} }
            th { background-color: ${darkMode ? '#333' : '#f0f0f0'}; }
            /* Ensure text is visible in print (adjust based on dark mode) */
            .text-white { color: ${darkMode ? '#fff' : '#000'} !important; }
            .bg-gray-800 { background-color: ${darkMode ? '#000' : '#fff'} !important; }
            .border-gray-700 { border-color: ${darkMode ? '#777' : '#ccc'} !important; }
            .text-emerald-400 { color: ${darkMode ? '#4ade80' : '#000'} !important; }
            /* Adjust padding and margins for print */
            .py-2 { padding-top: 4px; padding-bottom: 4px; }
            .px-4 { padding-left: 8px; padding-right: 8px; }
            .mb-6 { margin-bottom: 12px; }
            .mt-10 { margin-top: 20px; }
            /* Hide buttons and select dropdown in print */
            .no-print { display: none !important; }
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
        setDarkMode(darkMode);
    }, 100);
  };

  // handleDownloadPDF ফাংশন সম্পূর্ণরূপে সরিয়ে দেওয়া হয়েছে

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
    <div className={`min-h-screen bg-gradient-to-br ${themeClasses} px-4 py-8 transition-all duration-500`}>
      <div className="max-w-6xl mx-auto">
        <div className={`backdrop-blur-lg p-6 rounded-2xl shadow-xl border ${darkMode ? "bg-white/10 border-white/10" : "bg-white/70 border-gray-200"}`}>
          <div className="flex justify-between items-center mb-6 no-print">
            <h1 className="text-3xl font-bold text-center">📊 Afnan Fashion - মাসভিত্তিক সেল রিপোর্ট</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 transition"
              >
                {darkMode ? "🌞 লাইট মোড" : "🌙 ডার্ক মোড"}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              >
                🖨️ প্রিন্ট করুন
              </button>
              {/* PDF ডাউনলোড বাটন সরিয়ে দেওয়া হয়েছে */}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 no-print">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg shadow"
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <div className="text-right">
              <p className={`text-sm ${headText}`}>সর্বোচ্চ সেল হয়েছে:</p>
              <p className="text-lg font-semibold text-emerald-400">
                {highestMonth.month} (৳{highestMonth.total.toLocaleString()})
              </p>
            </div>
          </div>

          <div ref={printRef} className={`overflow-x-auto ${tableBg} ${tableText} rounded-lg shadow-inner p-4 text-sm`}>
            <h1 className="text-3xl font-bold text-center mb-6">📊 Afnan Fashion - মাসভিত্তিক সেল রিপোর্ট ({selectedMonth} মাস)</h1>
            <div className="flex justify-end items-center mb-4">
              <p className={`text-sm ${headText}`}>এই মাসের মোট সেল: <span className="text-lg font-semibold text-emerald-400">৳{totalSalesForSelectedMonth.toLocaleString()}</span></p>
            </div>

            <table className="min-w-full">
              <thead>
                <tr className={`text-left border-b ${tableBorder}`}>
                  <th className="py-2">📅 তারিখ</th>
                  <th className="py-2">🛍️ পণ্যের বিবরণ</th>
                  <th className="py-2 text-center">🔢 পরিমাণ</th>
                  <th className="py-2 text-center">💵 প্রতি ইউনিট</th>
                  <th className="py-2 text-center">💰 মোট</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, i) => (
                  <tr
                    key={i}
                    className={`border-b ${tableBorder} ${hoverBg} transition`}
                  >
                    <td className="py-1 whitespace-nowrap">{item.date}</td>
                    <td className="whitespace-nowrap">{item.description}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center">{item.price}</td>
                    <td className="text-center font-semibold text-emerald-400">
                      ৳{item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-10">
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
                      contentStyle={{ backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000", borderRadius: 8, border: 'none' }}
                    />
                    <Legend />
                    <Bar dataKey="total" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={40} />
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