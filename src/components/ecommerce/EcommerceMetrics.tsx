import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { LuMessageSquareText } from "react-icons/lu";
import { IoIosMail } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuAlarmClock } from "react-icons/lu";
import { MdOutlineDonutSmall } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function EcommerceMetrics() {
  const dummyFollowUps = Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    name: `Follow Up ${i + 1}`,
    description: `Description for follow up ${i + 1}`,
    dueDate: `2025-05-${((i % 30) + 1).toString().padStart(2, "0")}`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dummyFollowUps.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(dummyFollowUps.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-4">
        {/* <!-- Metric Item Start --> */}
        <div
          onClick={() => navigate("/inquiry")}
          className="flex flex-row items-center justify-between cursor-pointer rounded-2xl hover:scale-105 transform duration-200 border border-gray-600 bg-green-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
          {/* Left Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg dark:bg-gray-800">
            <LuMessageSquareText className="text-white size-6 dark:text-white/90" />
          </div>

          {/* Text content */}
          <div className="ml-4 flex-1 text-end">
            <span className="text-sm text-end text-gray-800 font-bold dark:text-gray-400">Unassign Inquiries</span>
            <h4 className="mt-1 text-end font-bold text-gray-800 text-title-sm dark:text-white/90">100</h4>
          </div>
        </div>
        <div
          onClick={() => navigate("/inquiry")}
          className="flex flex-row items-center justify-between cursor-pointer rounded-2xl hover:scale-105 transform duration-200 border border-gray-600 bg-pink-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
          {/* Left Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg dark:bg-gray-800">
            <IoIosMail className="text-white size-6 dark:text-white/90" />
          </div>

          {/* Text content */}
          <div className="ml-4 flex-1 text-end">
            <span className="text-sm text-end text-gray-800 font-bold dark:text-gray-400">Procurement Inquiries</span>
            <h4 className="mt-1 text-end font-bold text-gray-800 text-title-sm dark:text-white/90">82</h4>
          </div>
        </div>
        <div
          onClick={() => navigate("/inquiry")}
          className="flex flex-row items-center justify-between cursor-pointer rounded-2xl hover:scale-105 transform duration-200 border border-gray-600 bg-emerald-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
          {/* Left Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg dark:bg-gray-800">
            <FaRegCheckCircle className="text-white size-6 dark:text-white/90" />
          </div>

          {/* Text content */}
          <div className="ml-4 flex-1 text-end">
            <span className="text-sm text-end text-gray-800 font-bold dark:text-gray-400">Purchase Inquiries</span>
            <h4 className="mt-1 text-end font-bold text-gray-800 text-title-sm dark:text-white/90">82</h4>
          </div>
        </div>
        <div
          onClick={() => navigate("/inquiry")}
          className="flex flex-row items-center justify-between cursor-pointer rounded-2xl hover:scale-105 transform duration-200 border border-gray-600 bg-rose-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
          {/* Left Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg dark:bg-gray-800">
            <IoMdPeople className="text-white size-6 dark:text-white/90" />
          </div>

          {/* Text content */}
          <div className="ml-4 flex-1 text-end">
            <span className="text-sm text-end text-gray-800 font-bold dark:text-gray-400">Urgent Inquiries</span>
            <h4 className="mt-1 text-end font-bold text-gray-800 text-title-sm dark:text-white/90">82</h4>
          </div>
        </div>
        <div
          onClick={() => navigate("/inquiry")}
          className="flex flex-row items-center justify-between transform duration-200 cursor-pointer group rounded-2xl border border-gray-600 hover:scale-105 bg-yellow-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
          {/* Left Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg dark:bg-gray-800">
            <IoCloseCircleOutline className="text-white size-6 dark:text-white/90" />
          </div>

          {/* Text content */}
          <div className="ml-4 flex-1 text-end">
            <span className="text-sm text-end text-gray-800 font-bold dark:text-gray-400">Tender Inquiries</span>
            <h4 className="mt-1 text-end font-bold text-gray-800 text-title-sm dark:text-white/90">82</h4>
          </div>
        </div>
        <div
          onClick={() => navigate("/inquiry")}
          className="flex flex-row items-center justify-between transform duration-200 cursor-pointer group rounded-2xl border border-gray-600 hover:scale-105 bg-purple-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
          {/* Left Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg dark:bg-gray-800">
            <LuAlarmClock className="text-white size-6 dark:text-white/90" />
          </div>

          {/* Text content */}
          <div className="ml-4 flex-1 text-end">
            <span className="text-sm text-end text-gray-800 font-bold dark:text-gray-400">Reminders</span>
            <h4 className="mt-1 text-end font-bold text-gray-800 text-title-sm dark:text-white/90">82</h4>
          </div>
        </div>
        <div
          onClick={() => navigate("/inquiry")}
          className="flex flex-row items-center justify-between transform duration-200 cursor-pointer group rounded-2xl border border-gray-600 hover:scale-105 bg-blue-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
          {/* Left Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg dark:bg-gray-800">
            <LuMessageSquareText className="text-white size-6 dark:text-white/90" />
          </div>

          {/* Text content */}
          <div className="ml-4 flex-1 text-end">
            <span className="text-sm text-end text-gray-800 font-bold dark:text-gray-400">Rejected Inquiries</span>
            <h4 className="mt-1 text-end font-bold text-gray-800 text-title-sm dark:text-white/90">82</h4>
          </div>
        </div>
        <div
          onClick={() => navigate("/inquiry")}
          className="flex flex-row items-center justify-between transform duration-200 cursor-pointer group rounded-2xl border border-gray-600 hover:scale-105 bg-cyan-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
          {/* Left Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-lg dark:bg-gray-800">
            <LuMessageSquareText className="text-white size-6 dark:text-white/90" />
          </div>

          {/* Text content */}
          <div className="ml-4 flex-1 text-end">
            <span className="text-sm text-end text-gray-800 font-bold dark:text-gray-400">Assign Inquiries</span>
            <h4 className="mt-1 text-end font-bold text-gray-800 text-title-sm dark:text-white/90">82</h4>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-4 col-span-full">
          {/* Right Cards */}
          <div className="w-full md:max-w-sm flex flex-col gap-4">
            {/* Total Users */}
            <div className="rounded-2xl border border-gray-600 hover:scale-105 transform duration-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Users</h2>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">1,245</p>
            </div>

            {/* Analytics */}
            <div
              onClick={() => navigate("/analytics")}
              className="rounded-2xl cursor-pointer border border-gray-600 hover:scale-105 transform duration-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Analytics</h2>
              </div>
              <MdOutlineDonutSmall className="text-gray-700 dark:text-white/80" size={50} />
            </div>
          </div>

          {/* Table Section */}
          <div className="w-full overflow-auto rounded-2xl border border-gray-600 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Follow Ups</h2>
            <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-200">
              <thead className="text-xs uppercase text-gray-700 bg-gray-300 dark:text-gray-400 border-b dark:border-gray-700">
                <tr>
                  <th className="px-4 py-2">SR</th>
                  <th className="px-4 py-2">Follow Up Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="dark:border-gray-700 hover:bg-gray-200 transform duration-150">
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">{item.dueDate}</td>
                    <td className="px-4 py-2 text-blue-600 hover:scale-105 dark:text-blue-400 cursor-pointer">View</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-end gap-2 text-sm">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-gray-800 text-white dark:bg-white dark:text-black" : ""}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Metric Item End --> */}
      </div>
    </div>
  );
}
