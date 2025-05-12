import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LuMessageSquareText, LuAlarmClock } from "react-icons/lu";
import { IoIosMail } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineDonutSmall, MdOutlineNavigateNext } from "react-icons/md";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface FollowUpItem {
  id: string;
  generalFollowUpName?: string;
  generalFollowUpId?: string;
  description?: string;
  dueDate: string;
  statusNotes?: string;
  status?: string;
  createdAt?: string;
  createdBy?: {
    id: string;
    name?: string;
  };
  followUpPerson?: {
    id: number;
    name: string;
    email: string;
    designation: string;
    mobileNo: string;
    active: boolean;
    deleted: boolean;
  };
}

export default function EcommerceMetrics() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [users, setUsers] = useState<{ value: number; label: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<FollowUpItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiries, setInquiries] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [completedInquiriesCount, setCompletedInquiriesCount] = useState(0);
  const [ongoingInquiriesCount, setOngoingInquiriesCount] = useState(0);
  const [remindersCount, setRemindersCount] = useState(0);
  const [rejectedInquiriesCount, setRejectedInquiriesCount] = useState(0);
  const [assignInquary, setAssignInquary] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [followUps, setFollowUps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [followUpPersonName, setfollowUpPersonName] = useState(1);
  const pageSize = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpItem | null>(null);
  const [doneModalOpen, setDoneModalOpen] = useState(false);
  const [doneDescription, setDoneDescription] = useState("");
  const [selectedDateFollowUps, setSelectedDateFollowUps] = useState<FollowUpItem[]>([]);

  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return "N/A";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  };

  const fetchFollowUps = async (page = 1) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const response = await axios.get(`https://nicoindustrial.com/api/generalFollowUp/getall`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          userId: userId,
          dueDate: currentDate,
          page: page,
          size: pageSize,
        },
      });
      setFollowUps(response.data.data.list);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      setError((error as any).message);
    }
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get(`https://nicoindustrial.com/api/inquiry/totalinquiries`, {
          params: { userId, isAdmin: false },
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setInquiries(res.data.data.totalInquiries);
      } catch (err: any) {
        setError(err.message);
      }
    };

    const dashboardDataFetch = async () => {
      try {
        const res = await axios.get(`https://nicoindustrial.com/api/user/dashboard/data`, {
          params: { userId },
          headers: { Authorization: `Bearer ${authToken}` },
        });

        setActiveUserCount(res.data.data.urgentInquiryCount || 0);
        setCompletedInquiriesCount(res.data.data.purchaseInquiryCount || 0);
        setOngoingInquiriesCount(res.data.data.procurementInquiryCount || 0);
        setRemindersCount(res.data.data.remindersCount || 0);
        setRejectedInquiriesCount(res.data.data.tenderInquiryCount || 0);
        setAssignInquary(res.data.data.assignInquiryCount || 0);
        setTotalUsers(res.data.data.totalUser || 0);
        setfollowUpPersonName(res.data.data.followUpPerson.name || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
    dashboardDataFetch();
    fetchFollowUps();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchFollowUps(page);
    }
  };

  const metricCards = [
    { title: "Unassign Inquiries", count: inquiries, bg: "bg-green-100", icon: <LuMessageSquareText className="text-white size-6" /> },
    { title: "Procurement Inquiries", count: ongoingInquiriesCount, bg: "bg-pink-100", icon: <IoIosMail className="text-white size-6" /> },
    { title: "Purchase Inquiries", count: completedInquiriesCount, bg: "bg-emerald-100", icon: <FaRegCheckCircle className="text-white size-6" /> },
    { title: "Urgent Inquiries", count: activeUserCount, bg: "bg-rose-100", icon: <IoMdPeople className="text-white size-6" /> },
    { title: "Tender Inquiries", count: rejectedInquiriesCount, bg: "bg-yellow-100", icon: <IoCloseCircleOutline className="text-white size-6" /> },
    // { title: "Reminders", count: remindersCount, bg: "bg-purple-100", icon: <LuAlarmClock className="text-white size-6" /> },
    { title: "Rejected Inquiries", count: rejectedInquiriesCount, bg: "bg-blue-100", icon: <LuMessageSquareText className="text-white size-6" /> },
    { title: "Assign Inquiries", count: assignInquary, bg: "bg-cyan-100", icon: <LuMessageSquareText className="text-white size-6" /> },
  ];

  const dueDates = followUps.map((item: FollowUpItem) => new Date(item.dueDate).toISOString().split("T")[0]);

  const CalendarWidget = () => {
    const handleDateClick = (date: Date | null, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
      if (date) {
        setSelectedDate(date);
        const dateString = date.toISOString().split("T")[0];
        const filtered = followUps.filter((item: FollowUpItem) => new Date(item.dueDate).toISOString().split("T")[0] === dateString);
        setSelectedDateFollowUps(filtered);
      }
    };

    return (
      <div className="rounded-2xl border text-center border-gray-600 bg-white p-4 pb-0 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="justify-between flex">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Calendar</h2>
          <p className=" font-medium text-gray-800 dark:text-white">{selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>

        <DatePicker
          inline
          selected={selectedDate}
          onChange={handleDateClick}
          calendarClassName="w-60.5"
          dayClassName={(date) => {
            const dateString = date.toLocaleDateString("en-CA"); // Outputs YYYY-MM-DD
            const isDueDate = dueDates.includes(dateString);
            const isSelected = date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth();

            if (isDueDate && isSelected) {
              return "bg-blue-600 text-white ";
            } else if (isDueDate) {
              return "bg-green-200 rounded dark:bg-green-900/50 ";
            } else if (isSelected) {
              return "bg-gray-800 text-white dark:bg-white dark:text-black";
            } else {
              return "bg-gray-300 rounded dark:bg-gray-800 ";
            }
          }}
        />

        {/* Events Section */}
        <div className="px-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Events on {selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}:</h3>
          {selectedDateFollowUps.length > 0 ? (
            <div className=" max-h-60 overflow-y-auto">
              {selectedDateFollowUps.map((item, index) => (
                <div
                  key={index}
                  className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedFollowUp(item);
                    setIsModalOpen(true);
                  }}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800 dark:text-white">Name: {item.generalFollowUpName || "Untitled Follow-up"}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${item.status === "COMPLETED" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>Status: {item.status || "PENDING"}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">Description: {truncateText(item.description, 30) || "No description"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center pb-4">No events scheduled for this date.</p>
          )}
        </div>
      </div>
    );
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(`https://nicoindustrial.com/api/user/list`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const userOptions = response.data.data.list.map((user: any) => ({
        value: user.id,
        label: user.name,
      }));
      setUsers(userOptions);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // After fetching follow-ups, initialize selected date follow-ups
      const currentDateString = new Date().toISOString().split("T")[0];
      const initialFiltered = followUps.filter((item: FollowUpItem) => new Date(item.dueDate).toISOString().split("T")[0] === currentDateString);
      setSelectedDateFollowUps(initialFiltered);
    };

    fetchData();
  }, []);

  const handleEditClick = (item: FollowUpItem) => {
    setSelectedReminder(item);
    setIsEditModalOpen(true);
    fetchUsers();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReminder) return;

    try {
      const reminderId = selectedReminder.id || selectedReminder.generalFollowUpId;
      if (!reminderId) {
        throw new Error("No valid ID found for this reminder");
      }

      const updatedData = {
        generalFollowUpName: selectedReminder.generalFollowUpName,
        description: selectedReminder.description,
        statusNotes: selectedReminder.statusNotes,
        followUpPerson: { id: selectedReminder.followUpPerson?.id },
        dueDate: new Date(selectedReminder.dueDate).toISOString(),
        ...(selectedReminder.createdAt && { createdAt: selectedReminder.createdAt }),
        ...(selectedReminder.createdBy && { createdBy: { id: selectedReminder.createdBy.id } }),
        ...(selectedReminder.status && { status: selectedReminder.status }),
        updatedAt: new Date().toISOString(),
        updatedBy: { id: userId },
      };

      const response = await axios.put(`https://nicoindustrial.com/api/generalFollowUp/update/${reminderId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      toast.success(response.data.message || "Reminder updated successfully");
      setIsEditModalOpen(false);
      fetchFollowUps(currentPage);
    } catch (error) {
      console.error("Error updating reminder:", error);
      alert((error as any).response?.data?.message || "Error updating reminder");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedReminder) {
      setSelectedReminder({
        ...selectedReminder,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (selectedReminder) {
      setSelectedReminder({
        ...selectedReminder,
        [name]: value,
      });
    }
  };

  const handleFollowUpPersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = parseInt(e.target.value);
    const selectedUser = users.find((user) => user.value === selectedUserId);

    if (selectedReminder && selectedUser) {
      setSelectedReminder({
        ...selectedReminder,
        followUpPerson: {
          ...(selectedReminder.followUpPerson || {}),
          id: selectedUser.value,
          name: selectedUser.label,
          email: selectedReminder.followUpPerson?.email || "",
          designation: selectedReminder.followUpPerson?.designation || "",
          mobileNo: selectedReminder.followUpPerson?.mobileNo || "",
          active: selectedReminder.followUpPerson?.active || false,
          deleted: selectedReminder.followUpPerson?.deleted || false,
        },
      });
    }
  };

  const handleMarkAsDone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReminder) return;

    if (!selectedReminder) {
      console.error("No reminder selected");
      alert("No reminder selected");
      return;
    }

    try {
      const reminderId = selectedReminder.id || selectedReminder.generalFollowUpId;
      const updatedData = {
        description: doneDescription || "Marked as completed",
        updatedBy: {
          id: userId || "",
        },
        status: "COMPLETED",
      };

      const response = await axios.put(`https://nicoindustrial.com/api/generalFollowUp/make/done/${reminderId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      toast.success(response.data.message || "Follow-up marked as done successfully");
      setDoneModalOpen(false);
      setDoneDescription("");
      fetchFollowUps(currentPage);
    } catch (error) {
      console.error("Error marking as done:", error);
      alert((error as any).response?.data?.message || "Error marking follow-up as done");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Section: 3 Cards + Calendar */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* 3 Cards */}
        <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metricCards.map((card, i) => (
            <div key={i} onClick={() => navigate("/inquiry")} className={`flex items-center justify-between cursor-pointer rounded-xl shadow-xl hover:scale-105 transform duration-200 border border-gray-600 ${card.bg} p-5 dark:border-gray-800 dark:bg-white/[0.03]`}>
              <div className="w-12 h-12 flex items-center justify-center bg-gray-700 dark:bg-gray-800">{card.icon}</div>
              <div className="ml-4 text-end">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-400">{card.title}</span>
                <h4 className="mt-1 font-bold text-title-sm text-gray-800 dark:text-white/90">{card.count}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="w-full shadow-xl md:w-1/4 hover:scale-105 transform duration-300">
          <CalendarWidget />
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-auto shadow-xl rounded-2xl border border-gray-600 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Follow Ups</h2>
        <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-200">
          <thead className="text-xs uppercase text-gray-700 bg-gray-300 dark:text-gray-400 border-b dark:border-gray-700">
            <tr className="text-center">
              <th className="px-4 py-2">SR</th>
              <th className="px-4 py-2">Follow Up Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((item: FollowUpItem, index: number) => (
              <tr key={item.id} className="dark:border-gray-700 hover:bg-gray-200 transform duration-150 text-center">
                <td className="px-4 py-2">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="px-4 py-2">{item.generalFollowUpName || "N/A"}</td>
                <td className="px-4 py-2">{truncateText(item.description, 40)}</td>
                {/* <td className="px-4 py-2">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "Not set"}</td> */}
                <td className="px-4 py-2">{item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Not set"}</td>
                <td className="px-4 py-2 text-blue-600 dark:text-blue-400 flex justify-center gap-2">
                  <div
                    className="cursor-pointer hover:scale-110 hover:text-gray-700"
                    onClick={() => {
                      setSelectedReminder(item);
                      setDoneModalOpen(true);
                    }}>
                    Check
                  </div>
                  <div className="cursor-pointer hover:scale-110 hover:text-gray-700" onClick={() => handleEditClick(item)}>
                    Edit
                  </div>
                  <div
                    className="cursor-pointer hover:scale-110 hover:text-gray-700"
                    onClick={() => {
                      setSelectedFollowUp(item);
                      setIsModalOpen(true);
                    }}>
                    View
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-end gap-2 text-sm">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 flex py-1 border rounded disabled:opacity-50">
            <MdOutlineNavigateNext className="text-xl rotate-180" /> Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-gray-800 text-white dark:bg-white dark:text-black" : ""}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 flex py-1 border rounded disabled:opacity-50">
            Next <MdOutlineNavigateNext className="text-xl" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && selectedFollowUp && (
        <div className="fixed inset-0 bg-[#00000071] bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Reminder Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <IoCloseCircleOutline size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">FollowUp Name:</p>
                <p className="text-base font-medium text-gray-800 dark:text-white">{selectedFollowUp.generalFollowUpName || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Description:</p>
                <p className="text-base font-medium text-gray-800 dark:text-white">{selectedFollowUp.description || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Due Date:</p>
                {/* <p className="text-base font-medium text-gray-800 dark:text-white">{new Date(selectedFollowUp.dueDate).toLocaleString()}</p> */}
                <p className="text-base font-medium text-gray-800 dark:text-white">{new Date(selectedFollowUp.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Status Notes:</p>
                <p className="text-base font-medium text-gray-800 dark:text-white">{selectedFollowUp.statusNotes}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Follow Up Person:</p>
                <p className="text-base font-medium text-gray-800 dark:text-white">{selectedFollowUp.followUpPerson?.name || "N/A"}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedReminder && (
        <div className="fixed inset-0 bg-[#00000071] bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Reminder</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <IoCloseCircleOutline size={24} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">FollowUp Name:</label>
                  <input type="text" name="generalFollowUpName" value={selectedReminder.generalFollowUpName || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Description:</label>
                  <textarea name="description" value={selectedReminder.description || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" rows={3} />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Due Date and Time:</label>
                  <input type="datetime-local" name="dueDate" value={new Date(selectedReminder.dueDate).toISOString().slice(0, 16)} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Status Notes:</label>
                  <textarea name="statusNotes" value={selectedReminder.statusNotes || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" rows={2} />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Follow Up Person:</label>
                  {loadingUsers ? (
                    <p>Loading users...</p>
                  ) : (
                    <select name="followUpPerson" value={selectedReminder.followUpPerson?.id || ""} onChange={handleFollowUpPersonChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" required>
                      <option value="">Select a person</option>
                      {users.map((user) => (
                        <option key={user.value} value={user.value}>
                          {user.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {doneModalOpen && selectedReminder && (
        <div className="fixed inset-0 bg-[#00000071] bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Mark as Done</h3>
              <button onClick={() => setDoneModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <IoCloseCircleOutline size={24} />
              </button>
            </div>

            <form onSubmit={handleMarkAsDone}>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Description</label>
                <textarea value={selectedReminder.description || ""} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" rows={3} placeholder="Add any notes about completing this follow-up" />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setDoneModalOpen(false)} className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Mark as Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
