import React, { useState } from "react";
interface ConsumerType {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  createdAt: string;
}

const Consumer = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [newConsumer, setNewConsumer] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [consumers, setConsumers] = useState(() =>
    Array.from({ length: 27 }, (_, i) => ({
      id: i + 1,
      name: `Consumer ${i + 1}`,
      email: `consumer${i + 1}@example.com`,
      address: `consumer address ${i + 1}`,
      phone: `+91 9${Math.floor(Math.random() * 1000000000)}`,
      createdAt: "2025-05-01",
    }))
  );
  const [editConsumerId, setEditConsumerId] = useState<number | null>(null); // Track which consumer we're editing

  const consumersPerPage = 10;

  const filteredConsumers = consumers.filter((consumer) => consumer.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredConsumers.length / consumersPerPage);
  const startIndex = (currentPage - 1) * consumersPerPage;
  const endIndex = Math.min(startIndex + consumersPerPage, filteredConsumers.length);
  const currentConsumers = filteredConsumers.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  const handleCreateConsumer = () => {
    setEditConsumerId(null); // Reset edit mode
    setNewConsumer({ name: "", email: "", address: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewConsumer({ name: "", email: "", address: "", phone: "" }); // Reset form after closing
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewConsumer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editConsumerId !== null) {
      // Update existing consumer
      setConsumers((prev) => prev.map((consumer) => (consumer.id === editConsumerId ? { ...consumer, ...newConsumer } : consumer)));
    } else {
      // Add new consumer
      const newEntry = {
        ...newConsumer,
        id: consumers.length ? consumers[consumers.length - 1].id + 1 : 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setConsumers((prev) => [...prev, newEntry]);
    }

    handleCloseModal();
  };

  const handleEdit = (consumer: ConsumerType) => {
    setEditConsumerId(consumer.id);
    setNewConsumer(consumer);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this consumer?")) {
      setConsumers((prev) => prev.filter((consumer) => consumer.id !== id));
    }
  };

  return (
    <div className="p-4">
      {/* Top Controls */}
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
        <button onClick={handleCreateConsumer} className="ml-4 bg-gray-100 text-black border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-400">
          Create Consumer
        </button>
      </div>

      {/* Consumer Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left">
          <thead className="bg-gray-300">
            <tr>
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
                <tr key={consumer.id}>
                  <td className="p-2">{startIndex + index + 1}</td>
                  <td className="p-2">{consumer.name}</td>
                  <td className="p-2">{consumer.email}</td>
                  <td className="p-2">{consumer.address}</td>
                  <td className="p-2">{consumer.phone}</td>
                  <td className="p-2">{consumer.createdAt}</td>
                  <td className="p-2">
                    <button onClick={() => handleEdit(consumer)} className="text-blue-600 hover:underline mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(consumer.id)} className="text-red-600 hover:underline">
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

      {/* Modal for Creating/Editing Consumer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000071] bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
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
