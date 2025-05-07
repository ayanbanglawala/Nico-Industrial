import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CreatedByType {
  id: number;
  name: string;
  email: string;
  designation: string;
  mobileNo: string;
  active: boolean;
  deleted: boolean;
}

interface ConsumerType {
  consumerId: number;
  consumerName: string;
  emailId: string;
  address: string;
  contact: string;
  createdAt: string;
  createdBy: CreatedByType;
}

const Consumer = () => {
  const [search, setSearch] = useState("");
  const [filter1, setFilter1] = useState("");
  const [filter2, setFilter2] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editConsumerId, setEditConsumerId] = useState<number | null>(null);
  const [consumers, setConsumers] = useState<ConsumerType[]>([]);
  const [newConsumer, setNewConsumer] = useState({
    consumerName: "",
    emailId: "",
    address: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);

  const consumersPerPage = 10;

  const fetchConsumers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://nicoindustrial.com/api/consumer/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          size: consumersPerPage,
          search: search,
          filter1: filter1,
          filter2: filter2,
        },
      });
      if (response.data?.statusCode === 200) {
        setConsumers(response.data.data.consumers);
      }
    } catch (error) {
      console.error("Error fetching consumers:", error);
      toast.error("Failed to fetch consumers", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumers();
  }, [currentPage, search, filter1, filter2]);

  const validateForm = () => {
    if (!newConsumer.consumerName.trim()) {
      toast.error("Consumer name is required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
      return false;
    }
    if (!newConsumer.emailId.trim()) {
      toast.error("Email is required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
      return false;
    }
    if (!newConsumer.contact.trim()) {
      toast.error("Contact number is required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
      return false;
    }
    return true;
  };

  const filteredConsumers = consumers.filter((consumer) => consumer.consumerName && consumer.consumerName.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredConsumers.length / consumersPerPage);
  const startIndex = (currentPage - 1) * consumersPerPage;
  const endIndex = Math.min(startIndex + consumersPerPage, filteredConsumers.length);
  const currentConsumers = filteredConsumers.slice(startIndex, endIndex);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePageClick = (pageNum: number) => setCurrentPage(pageNum);

  const handleCreateConsumer = () => {
    setEditConsumerId(null);
    setNewConsumer({
      consumerName: "",
      emailId: "",
      address: "",
      contact: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewConsumer({
      consumerName: "",
      emailId: "",
      address: "",
      contact: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewConsumer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!userId) {
      toast.error("User ID not found in localStorage", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
      return;
    }

    try {
      let response;
      if (editConsumerId !== null) {
        // Update consumer
        response = await axios.put(
          `https://nicoindustrial.com/api/consumer/update/${editConsumerId}`,
          { ...newConsumer, createdBy: { id: parseInt(userId, 10) } },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const successMessage = response.data.message || "Consumer updated successfully";
        toast.success(successMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          className: "toast-success",
          style: { backgroundColor: "green" },
        });
      } else {
        // Create new consumer
        response = await axios.post(
          `https://nicoindustrial.com/api/consumer/save`,
          { ...newConsumer, createdBy: { id: parseInt(userId, 10) } },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const successMessage = response.data.message || "Consumer created successfully";
        toast.success(successMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          className: "toast-success",
          style: { backgroundColor: "green" },
        });
      }

      handleCloseModal();
      fetchConsumers();
    } catch (error) {
      const backendError = (error as any).response?.data?.message || "Error submitting consumer. Please try again later.";
      toast.error(backendError, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
    }
  };

  const handleEdit = async (consumer: ConsumerType) => {
    try {
      const response = await axios.get(`https://nicoindustrial.com/api/consumer/get/${consumer.consumerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const consumerData = response.data.data;

      setNewConsumer({
        consumerName: consumerData.consumerName || "",
        emailId: consumerData.emailId || "",
        address: consumerData.address || "",
        contact: consumerData.contact || "",
      });

      setEditConsumerId(consumer.consumerId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching consumer details:", error);
      toast.error("Failed to fetch consumer details", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this consumer?")) return;

    try {
      const response = await axios.delete(`https://nicoindustrial.com/api/consumer/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const successMessage = response.data.message || "Consumer deleted successfully";
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        className: "toast-success",
        style: { backgroundColor: "green" },
      });
      fetchConsumers();
    } catch (error) {
      const backendError = (error as any).response?.data?.message || "Error deleting consumer. Please try again later.";
      toast.error(backendError, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        style: { backgroundColor: "red" },
      });
    }
  };

  return (
    <div className="p-4">
      {/* Search + Add */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Consumer..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 p-2 rounded-md w-full max-w-xs"
        />
        <button onClick={handleCreateConsumer} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FaPlus />
          Create Consumer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left">
          <thead className="bg-gray-300">
            <tr className="text-center">
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentConsumers.length ? (
              currentConsumers.map((consumer, index) => (
                <tr className="text-center" key={consumer.consumerId}>
                  <td className="p-2">{startIndex + index + 1}</td>
                  <td className="p-2">{consumer.consumerName}</td>
                  <td className="p-2">{consumer.emailId}</td>
                  <td className="p-2">{consumer.address}</td>
                  <td className="p-2">{consumer.contact}</td>
                  <td className="p-2">{consumer.createdBy?.name || "N/A"}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(consumer)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(consumer.consumerId)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  {loading ? "Loading..." : "No consumers found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {endIndex} of {filteredConsumers.length} results
          </p>
          <div className="flex gap-2">
            <button onClick={handlePrev} disabled={currentPage === 1} className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}`}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button key={pageNum} onClick={() => handlePageClick(pageNum)} className={`px-3 py-1 border rounded ${currentPage === pageNum ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>
                {pageNum}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}`}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000071] flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4 font-semibold">{editConsumerId ? "Edit Consumer" : "Create Consumer"}</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Consumer Name *</label>
              <input
                type="text"
                name="consumerName"
                placeholder="Consumer Name"
                value={newConsumer.consumerName}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Email *</label>
              <input
                type="email"
                name="emailId"
                placeholder="Email"
                value={newConsumer.emailId}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={newConsumer.address}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Contact *</label>
              <input
                type="text"
                name="contact"
                placeholder="Contact"
                value={newConsumer.contact}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {editConsumerId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consumer;
