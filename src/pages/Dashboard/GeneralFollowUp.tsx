import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

interface FollowUp {
  generalFollowUpId: number;
  generalFollowUpName: string;
  description: string;
  status: string;
  statusNotes: string;
  dueDate: string;
  createdBy: { name: string };
  updatedBy: { name: string } | null;
}

const FollowUpTable = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFollowUpId, setEditingFollowUpId] = useState<number | null>(null);

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
      const response = await axios.get(
        `https://nicoindustrial.com/api/generalFollowUp/getall?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.data?.list) {
        setFollowUps(response.data.data.list);
      }
    } catch (error) {
      console.error("Failed to fetch follow-ups", error);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      if (isEditing) {
        await axios.put(
          `https://nicoindustrial.com/api/generalFollowUp/update/${editingFollowUpId}`,
          {
            generalFollowUpName: formData.followUpName,
            followUpPerson: formData.followUpPerson,
            description: formData.description,
            status: formData.status,
            statusNotes: formData.statusNotes,
            dueDate: formData.dueDate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          "https://nicoindustrial.com/api/generalFollowUp/add",
          {
            generalFollowUpName: formData.followUpName,
            createdBy: userId,
            followUpPerson: formData.followUpPerson,
            description: formData.description,
            status: formData.status,
            statusNotes: formData.statusNotes,
            dueDate: formData.dueDate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      fetchFollowUps();
      setIsModalOpen(false);
      setIsEditing(false);
      setFormData({
        followUpName: "",
        followUpPerson: "",
        description: "",
        status: "",
        statusNotes: "",
        dueDate: "",
        dueTime: "",
      });
    } catch (error) {
      console.error("Failed to submit follow-up", error);
    }
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
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
                      setFormData({
                        followUpName: item.generalFollowUpName,
                        followUpPerson: item.createdBy?.name || "",
                        description: item.description,
                        status: item.status,
                        statusNotes: item.statusNotes,
                        dueDate: item.dueDate?.split("T")[0] || "",
                        dueTime: "",
                      });
                      setIsEditing(true);
                      setEditingFollowUpId(item.generalFollowUpId);
                      setIsModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.generalFollowUpId)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
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
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, followUps.length)} of {followUps.length} results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].slice(0, 3).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 4 && <span className="px-2 py-1">...</span>}
          {totalPages > 3 && (
            <button onClick={() => goToPage(totalPages)} className="px-3 py-1 border rounded hover:bg-gray-100">
              {totalPages}
            </button>
          )}
          <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-[#00000071] bg-opacity-50 backdrop-blur-xs flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Follow-Up" : "Create Follow-Up"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Follow-Up Name</label>
                <input
                  type="text"
                  name="followUpName"
                  value={formData.followUpName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Follow-Up Person</label>
                <select
                  name="followUpPerson"
                  value={formData.followUpPerson}
                  onChange={handleSelectChange}
                  className="border p-2 rounded-md w-full"
                  required
                >
                  <option value="">Select Person</option>
                  <option value="Person 1">Person 1</option>
                  <option value="Person 2">Person 2</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="COMPLETED">Done</option>
                  <option value="Modify">Modify</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Status Notes</label>
                <textarea
                  name="statusNotes"
                  value={formData.statusNotes}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
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
