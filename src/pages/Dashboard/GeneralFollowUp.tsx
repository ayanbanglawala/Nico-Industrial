import React, { useState } from "react";

const GeneralFollowUp = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    followUpName: "",
    followUpPerson: "",
    description: "",
    status: "",
    statusNotes: "",
    dueDate: "",
    dueTime: "",
  });

  const itemsPerPage = 10;

  const [followUps, setFollowUps] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      mobile: `9876543${(100 + i).toString().slice(-3)}`,
      remarks: `Remark for User ${i + 1}`,
      createdAt: "2025-05-01",
      createdBy: "Admin",
    }))
  );

  const filtered = followUps.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editId !== null) {
      setFollowUps((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: formData.followUpName,
                mobile: "0000000000",
                remarks: formData.description,
                createdAt: formData.dueDate,
                createdBy: formData.followUpPerson,
              }
            : item
        )
      );
    } else {
      const newFollowUp = {
        id: Date.now(),
        name: formData.followUpName,
        mobile: "0000000000",
        remarks: formData.description,
        createdAt: formData.dueDate,
        createdBy: formData.followUpPerson,
      };
      setFollowUps((prev) => [newFollowUp, ...prev]);
    }

    setFormData({
      followUpName: "",
      followUpPerson: "",
      description: "",
      status: "",
      statusNotes: "",
      dueDate: "",
      dueTime: "",
    });

    setIsModalOpen(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (id: number) => {
    const selected = followUps.find((item) => item.id === id);
    if (!selected) return;

    setFormData({
      followUpName: selected.name,
      followUpPerson: selected.createdBy,
      description: selected.remarks,
      status: "",
      statusNotes: "",
      dueDate: selected.createdAt,
      dueTime: "",
    });

    setIsEditing(true);
    setEditId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this follow-up?")) {
      setFollowUps((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 p-2 rounded-md w-full max-w-xs"
        />
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
          className="ml-4 bg-gray-100 text-black border-1 border-gray-400 px-4 py-2 rounded-md hover:bg-gray-400">
          Create Follow-Up
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left">
          <thead className="bg-gray-300">
            <tr>
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Remarks</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length ? (
              paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.mobile}</td>
                  <td className="p-2">{item.remarks}</td>
                  <td className="p-2">{item.createdAt}</td>
                  <td className="p-2">{item.createdBy}</td>
                  <td className="p-2">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEdit(item.id)}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results
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
                <input type="text" name="followUpName" value={formData.followUpName} onChange={handleInputChange} className="border border-gray-300 p-2 rounded-md w-full" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Follow-Up Person</label>
                <select name="followUpPerson" value={formData.followUpPerson} onChange={handleSelectChange} className="border border-gray-300 p-2 rounded-md w-full" required>
                  <option value="">Select Person</option>
                  <option value="Person 1">Person 1</option>
                  <option value="Person 2">Person 2</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="border border-gray-300 p-2 rounded-md w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Due Date</label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="border border-gray-300 p-2 rounded-md w-full" />
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 text-black rounded-md">
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

export default GeneralFollowUp;
