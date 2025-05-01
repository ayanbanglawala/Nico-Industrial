import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { LuMessageSquareText } from "react-icons/lu";
import { IoIosMail } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuAlarmClock } from "react-icons/lu";

export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="flex flex-row items-center justify-between transform duration-150 cursor-pointer group rounded-2xl border border-gray-600 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
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
      <div className="flex flex-row items-center justify-between transform duration-150 cursor-pointer group rounded-2xl border border-gray-600 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
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
      <div className="flex flex-row items-center justify-between transform duration-150 cursor-pointer group rounded-2xl border border-gray-600 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
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
      <div className="flex flex-row items-center justify-between transform duration-150 cursor-pointer group rounded-2xl border border-gray-600 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
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
      <div className="flex flex-row items-center justify-between transform duration-150 cursor-pointer group rounded-2xl border border-gray-600 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
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
      <div className="flex flex-row items-center justify-between transform duration-150 cursor-pointer group rounded-2xl border border-gray-600 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
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
      <div className="flex flex-row items-center justify-between transform duration-150 cursor-pointer group rounded-2xl border border-gray-600 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
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
      <div className="flex flex-row items-center justify-between transform duration-150 cursor-pointer group rounded-2xl border border-gray-600 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 md:py-5">
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

      {/* <!-- Metric Item End --> */}
    </div>
  );
}
