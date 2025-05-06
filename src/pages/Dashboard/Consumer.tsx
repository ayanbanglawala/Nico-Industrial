import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

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

interface EditableConsumer {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  createdAt: string;
}

const Consumer = () => {
  const [search, setSearch] = useState("");
  const [filter1, setFilter1] = useState("");
  const [filter2, setFilter2] = useState("");
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editConsumerId, setEditConsumerId] = useState<number | null>(null);
  const [consumers, setConsumers] = useState<ConsumerType[]>([]);
  const [newConsumer, setNewConsumer] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const consumersPerPage = 10;

  useEffect(() => {
    const fetchConsumers = async () => {
      try {
        const response = await axios.get("https://nicoindustrial.com/api/consumer/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            size: consumersPerPage,
            search: search, // Include search query
            filter1: filter1, // Include filter1 if necessary
            filter2: filter2, // Include filter2 if necessary
          },
        });
        if (response.data?.statusCode === 200) {
          setConsumers(response.data.data.consumers);
        }
      } catch (error) {
        console.error("Error fetching consumers:", error);
      }
    };

    fetchConsumers();
  }, []);

  // const filteredConsumers = consumers.filter((consumer) => consumer.consumerName.toLowerCase().includes(search.toLowerCase()));
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
    setNewConsumer({ name: "", email: "", address: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewConsumer({ name: "", email: "", address: "", phone: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewConsumer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editConsumerId !== null) {
      setConsumers((prev) =>
        prev.map((consumer) =>
          consumer.consumerId === editConsumerId
            ? {
                ...consumer,
                consumerName: newConsumer.name,
                emailId: newConsumer.email,
                address: newConsumer.address,
                contact: newConsumer.phone,
              }
            : consumer
        )
      );
    } else {
      const newEntry: ConsumerType = {
        consumerId: consumers.length ? consumers[consumers.length - 1].consumerId + 1 : 1,
        consumerName: newConsumer.name,
        emailId: newConsumer.email,
        address: newConsumer.address,
        contact: newConsumer.phone,
        createdAt: new Date().toISOString(),
        createdBy: {
          id: 0,
          name: "Unknown",
          email: "",
          designation: "",
          mobileNo: "",
          active: false,
          deleted: false,
        },
      };
      setConsumers((prev) => [...prev, newEntry]);
    }

    handleCloseModal();
  };

  const handleEdit = (consumer: ConsumerType) => {
    setEditConsumerId(consumer.consumerId);
    setNewConsumer({
      name: consumer.consumerName,
      email: consumer.emailId,
      address: consumer.address,
      phone: consumer.contact,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this consumer?")) {
      setConsumers((prev) => prev.filter((c) => c.consumerId !== id));
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
                  <td className="p-2">
                    <button onClick={() => handleEdit(consumer)} className="bg-blue-500 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(consumer.consumerId)} className="bg-red-600 text-white px-2 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No consumers found.
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
            <h2 className="text-xl mb-4">{editConsumerId ? "Edit Consumer" : "Create Consumer"}</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">Consumer Name</label>
              <input type="text" name="name" placeholder="Consumer Name" value={newConsumer.name} onChange={handleInputChange} className="border border-gray-300 p-2 w-full rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">Email</label>
              <input type="email" name="email" placeholder="Email" value={newConsumer.email} onChange={handleInputChange} className="border border-gray-300 p-2 w-full rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">Address</label>
              <input type="text" name="address" placeholder="Address" value={newConsumer.address} onChange={handleInputChange} className="border border-gray-300 p-2 w-full rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600">Contact</label>
              <input type="text" name="phone" placeholder="Contact" value={newConsumer.phone} onChange={handleInputChange} className="border border-gray-300 p-2 w-full rounded-md" />
            </div>
            <div className="flex justify-between">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 text-black rounded-md">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md">
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
