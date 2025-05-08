import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
}

interface FollowUp {
  generalFollowUpId: number;
  generalFollowUpName: string;
  description: string;
  status: string;
  statusNotes: string;
  dueDate: Date;
  followUpPerson: { id: number; name: string };
  createdBy: { name: string };
  updatedBy: { name: string } | null;
}

interface FollowUpSubmitData {
  generalFollowUpName: string;
  followUpPerson: { id: number };
  description: string;
  status: string;
  statusNotes: string;
  dueDate: Date;
  createdBy: { id: string | null };
  updatedBy?: { id: string | null }; // Make updatedBy optional
}

const FollowUpTable = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFollowUpId, setEditingFollowUpId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [formData, setFormData] = useState({
    followUpName: "",
    followUpPerson: "",
    description: "",
    status: "",
    statusNotes: "",
    dueDate: "",
    dueTime: "",
  });

  const fetchFollowUps = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`https://nicoindustrial.com/api/generalFollowUp/getall?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.data?.list) {
        setFollowUps(response.data.data.list);
      }
    } catch (error) {
      console.error("Failed to fetch follow-ups", error);
    }
  };

  const fetchUsers = async (search = "") => {
    try {
      setIsLoadingUsers(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://nicoindustrial.com/api/user/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search },
      });
      if (response.data?.data?.list) {
        setUsers(response.data.data.list);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
    fetchUsers(); // Fetch users when component mounts
  }, []);

  const handleUserSearch = (searchValue: string) => {
    if (searchValue.length > 2) {
      // Only search when user types more than 2 characters
      fetchUsers(searchValue);
    }
  };

  const totalPages = Math.ceil(followUps.length / itemsPerPage);
  const paginated = followUps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    return formData.followUpName.trim() !== "" && formData.followUpPerson !== "" && formData.status !== "" && formData.dueDate !== "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Validate form
    if (!validateForm()) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
      return;
    }

    
    let dueDateObj: Date;
    
    if (formData.dueDate.includes("T")) {
      // Browser gives combined datetime string already
      dueDateObj = new Date(formData.dueDate);
    } else {
      const dueDateTime = `${formData.dueDate}T${formData.dueTime || "00:00"}:00`;
      dueDateObj = new Date(dueDateTime);
    }
    // Prepare the data to submit
    const dataToSubmit: FollowUpSubmitData = {
      generalFollowUpName: formData.followUpName,
      followUpPerson: { id: Number.parseInt(formData.followUpPerson) },
      description: formData.description,
      status: formData.status,
      statusNotes: formData.statusNotes,
      dueDate: new Date(formData.dueDate),
      createdBy: { id: userId },
    };
    // dueDate: new Date(formData.dueDate + (formData.dueTime ? `T${formData.dueTime}:00` : "T00:00:00")),
    
    // If editing, include updatedBy field
    if (isEditing && editingFollowUpId) {
      dataToSubmit.updatedBy = { id: userId };
    }
    
    try {
      let response;
      if (isEditing && editingFollowUpId) {
        // Update existing follow-up
        response = await axios.put(`https://nicoindustrial.com/api/generalFollowUp/update/${editingFollowUpId}`, dataToSubmit, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new follow-up
        response = await axios.post("https://nicoindustrial.com/api/generalFollowUp/save", dataToSubmit, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const successMessage = response.data.message || "Follow-up saved successfully!";
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        className: "toast-success",
        style: { backgroundColor: "green" },
      });

      fetchFollowUps(); // Refresh the table
      setIsModalOpen(false); // Close modal
      resetForm(); // Reset form fields
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "An error occurred while saving the follow-up.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
    }
  };
  const resetForm = () => {
    setFormData({
      followUpName: "",
      followUpPerson: "",
      description: "",
      status: "",
      statusNotes: "",
      dueDate: "",
      dueTime: "",
    });
    setIsEditing(false);
    setEditingFollowUpId(null);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://nicoindustrial.com/api/generalFollowUp/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFollowUps();
    } catch (error) {
      console.error("Failed to delete follow-up", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">General FollowUps</h2>
        <button
          onClick={() => {
            setFormData({
              followUpName: "",
              followUpPerson: "",
              description: "",
              status: "",
              statusNotes: "",
              dueDate: "",
              dueTime: "",
            });
            setIsEditing(false);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FaPlus />
          Create Follow-Up
        </button>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-300">
          <tr className="text-center">
            <th className="border px-3 py-2">Sr No</th>
            <th className="border px-3 py-2">GeneralFollowUp Name</th>
            <th className="border px-3 py-2">Created By</th>
            <th className="border px-3 py-2">Description</th>
            <th className="border px-3 py-2">Updated By</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length ? (
            paginated.map((item, index) => (
              <tr className="text-center hover:bg-gray-200" key={item.generalFollowUpId}>
                <td className="border px-3 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="border px-3 py-2">{item.generalFollowUpName}</td>
                <td className="border px-3 py-2">{item.createdBy?.name}</td>
                <td className="border px-3 py-2">{item.description}</td>
                <td className="border px-3 py-2">{item.updatedBy?.name || "—"}</td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => {
                      // Fetch the specific follow-up data before editing
                      const fetchFollowUpForEdit = async (id: number) => {
                        try {
                          const token = localStorage.getItem("token");
                          const response = await axios.get(`https://nicoindustrial.com/api/generalFollowUp/get/${id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });

                          const data = response.data.data;
                          if (data) {
                            setFormData({
                              followUpName: data.generalFollowUpName || "",
                              followUpPerson: data.followUpPerson?.id?.toString() || "",
                              description: data.description || "",
                              status: data.status || "",
                              statusNotes: data.statusNotes || "",
                              dueDate: data.dueDate?.split("T")[0] || "",
                              dueTime: data.dueDate?.split("T")[1]?.substring(0, 5) || "",
                            });
                            setIsEditing(true);
                            setEditingFollowUpId(id);
                            setIsModalOpen(true);
                          }
                        } catch (error) {
                          console.error("Failed to fetch follow-up for editing", error);
                          toast.error("Failed to load follow-up data for editing", {
                            position: "top-right",
                            autoClose: 3000,
                          });
                        }
                      };

                      fetchFollowUpForEdit(item.generalFollowUpId);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.generalFollowUpId)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No Follow-Ups found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, followUps.length)} of {followUps.length} results
        </p>
        <div className="flex gap-2">
          <button onClick={() => goToPage(currentPage - 1)} className="px-3 py-1 border rounded hover:bg-gray-100" disabled={currentPage === 1}>
            Previous
          </button>
          {[...Array(totalPages).keys()].slice(0, 3).map((_, i) => (
            <button key={i + 1} onClick={() => goToPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>
              {i + 1}
            </button>
          ))}
          {totalPages > 4 && <span className="px-2 py-1">...</span>}
          {totalPages > 3 && (
            <button onClick={() => goToPage(totalPages)} className="px-3 py-1 border rounded hover:bg-gray-100">
              {totalPages}
            </button>
          )}
          <button onClick={() => goToPage(currentPage + 1)} className="px-3 py-1 border rounded hover:bg-gray-100" disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000071] bg-opacity-50 backdrop-blur-xs flex justify-center items-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white p-6 rounded-md w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Follow-Up" : "Create Follow-Up"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Follow-Up Name</label>
                <input type="text" name="followUpName" value={formData.followUpName} onChange={handleInputChange} className="border p-2 rounded-md w-full" required />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Follow-Up Person</label>
                <select name="followUpPerson" value={formData.followUpPerson} onChange={handleSelectChange} onFocus={() => fetchUsers()} className="border p-2 rounded-md w-full" required>
                  <option value="">Select Person</option>
                  {isLoadingUsers ? (
                    <option disabled>Loading users...</option>
                  ) : (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="border p-2 rounded-md w-full" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select name="status" value={formData.status} onChange={handleSelectChange} className="border p-2 rounded-md w-full">
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="COMPLETED">Done</option>
                  <option value="Modify">Modify</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Status Notes</label>
                <textarea name="statusNotes" value={formData.statusNotes} onChange={handleInputChange} className="border p-2 rounded-md w-full" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Due Date</label>
                <input type="datetime-local" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="border p-2 rounded-md w-full" />
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpTable;
