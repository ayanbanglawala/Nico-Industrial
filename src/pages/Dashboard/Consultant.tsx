import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const Consultant = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const consultantsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [newConsultant, setNewConsultant] = useState({
    consultantName: "",
    contactNumber: "",
    contactPerson: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchConsultants();
  }, [currentPage, search]);
  const token = localStorage.getItem("token");

  const fetchConsultants = async () => {
    try {
      const response = await axios.get(`https://nicoindustrial.com/api/consultant/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          size: consultantsPerPage,
          search: search,
          filter1: "",
          filter2: "",
        },
      });

      const data = response.data.data;
      const formattedData = data.Consultants.map((item: any) => ({
        id: item.consultantId,
        consultantName: item.consultantName,
        contactNumber: item.contactNumber,
        contactPerson: item.contactPerson,
        createdAt: item.createdAt.split("T")[0],
        updatedAt: item.updatedAt.split("T")[0],
        createdBy: item.createdBy?.name || "N/A",
      }));

      setConsultants(formattedData);
      setTotalRecords(data.totalRecords);
    } catch (error) {
      console.error("Error fetching consultants:", error);
    }
  };

  const totalPages = Math.ceil(totalRecords / consultantsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewConsultant({ consultantName: "", contactNumber: "", contactPerson: "" });
    setEditId(null);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewConsultant((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editId !== null) {
      setConsultants((prev) =>
        prev.map((consultant) =>
          consultant.id === editId
            ? {
                ...consultant,
                ...newConsultant,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : consultant
        )
      );
    } else {
      const newEntry = {
        ...newConsultant,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        createdBy: "Admin",
      };
      setConsultants((prev) => [newEntry, ...prev]);
    }

    handleModalClose();
  };

  const handleEdit = (consultant: any) => {
    setNewConsultant({
      consultantName: consultant.consultantName,
      contactNumber: consultant.contactNumber,
      contactPerson: consultant.contactPerson,
    });
    setEditId(consultant.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this consultant?")) {
      setConsultants((prev) => prev.filter((consultant) => consultant.id !== id));
    }
  };

  return (
    <div className="p-4">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Consultant..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 p-2 rounded-md w-full max-w-xs"
        />
        <button onClick={handleModalOpen} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FaPlus />
          Create Consultant
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left">
          <thead className="bg-gray-300">
            <tr className="text-center">
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Consultant Name</th>
              <th className="border p-2">Contact Number</th>
              <th className="border p-2">Contact Person</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Updated At</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultants.length ? (
              consultants.map((consultant, index) => (
                <tr className="text-center" key={consultant.id}>
                  <td className="p-2">{(currentPage - 1) * consultantsPerPage + index + 1}</td>
                  <td className="p-2">{consultant.consultantName}</td>
                  <td className="p-2">{consultant.contactNumber}</td>
                  <td className="p-2">{consultant.contactPerson}</td>
                  <td className="p-2">{consultant.createdAt}</td>
                  <td className="p-2">{consultant.updatedAt}</td>
                  <td className="p-2">{consultant.createdBy}</td>
                  <td className="p-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(consultant)}>
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(consultant.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4">
                  No consultants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * consultantsPerPage + 1} to {Math.min(currentPage * consultantsPerPage, totalRecords)} of {totalRecords} results
          </p>
          <div className="flex gap-2">
            <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => goToPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#00000071] bg-opacity-50 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-semibold mb-4">{isEditing ? "Edit Consultant" : "Create Consultant"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="consultantName" className="block text-sm font-medium text-gray-700">
                  Consultant Name
                </label>
                <input
                  type="text"
                  id="consultantName"
                  name="consultantName"
                  value={newConsultant.consultantName}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={newConsultant.contactPerson}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={newConsultant.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={handleModalClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
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

export default Consultant;
