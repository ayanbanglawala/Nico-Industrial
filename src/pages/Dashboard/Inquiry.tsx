import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Inquiry = () => {
  const [status, setStatus] = useState("");
  const [quotation, setQuotation] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 10;

  // Inquiry data state
  const [inquiries, setInquiries] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      projectName: `Project ${i + 1}`,
      consumer: `Consumer ${i + 1}`,
      product: `Product ${i + 1}`,
      consultant: `Consultant ${i + 1}`,
      inquiry: `INQ-2025-00${i + 1}`,
      status: i % 2 === 0 ? "Open" : "Closed",
      winLoss: i % 2 === 0 ? "Pending" : "Won",
      description: `Description for Project ${i + 1}`,
      brand: `Brand ${String.fromCharCode(65 + (i % 4))}`,
      followUpQuotation: `Quotation ${String.fromCharCode(65 + (i % 4))}`,
      followUpUser: `User ${(i % 3) + 1}`,
      remark: `Remark for Project ${i + 1}`,
      createdBy: `Admin`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
      updatedAt: new Date(Date.now() - i * 43200000).toISOString().split("T")[0],
    }))
  );

  // Filters
  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      (status === "" || inquiry.status.toLowerCase() === status.toLowerCase()) &&
      (quotation === "" || inquiry.winLoss.toLowerCase() === quotation.toLowerCase()) &&
      (followUp === "" || inquiry.winLoss.toLowerCase() === followUp.toLowerCase()) &&
      inquiry.projectName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredInquiries.length / inquiriesPerPage);
  const startIndex = (currentPage - 1) * inquiriesPerPage;
  const currentInquiries = filteredInquiries.slice(startIndex, startIndex + inquiriesPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [form, setForm] = useState({
    projectName: "",
    status: "",
    description: "",
    consumer: "",
    brand: "",
    product: "",
    consultant: "",
    followUpQuotation: "",
    followUpUser: "",
    remark: "",
  });
  const [editId, setEditId] = useState(null);

  // Sample options for select fields
  const consumerOptions = ["Consumer 1", "Consumer 2", "Consumer 3", "Consumer 4"];
  const brandOptions = ["Brand A", "Brand B", "Brand C", "Brand D"];
  const productOptions = ["Product X", "Product Y", "Product Z"];
  const consultantOptions = ["Consultant 1", "Consultant 2", "Consultant 3"];
  const followUpUserOptions = ["User 1", "User 2", "User 3", "User 4"];
  const followUpQuotationOptions = ["Quotation A", "Quotation B", "Quotation C", "Quotation D"];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId !== null) {
      // Edit logic
      setInquiries((prev) => prev.map((inq) => (inq.id === editId ? { ...inq, ...form } : inq)));
    } else {
      // Add logic
      const newId = inquiries.length ? inquiries[inquiries.length - 1].id + 1 : 1;
      const newInquiry = {
        id: newId,
        inquiry: `INQ-2025-00${newId}`,
        winLoss: "Pending",
        createdBy: "Admin",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        ...form,
      };
      setInquiries((prev) => [...prev, newInquiry]);
    }

    setForm({
      projectName: "",
      status: "",
      description: "",
      consumer: "",
      brand: "",
      product: "",
      consultant: "",
      followUpQuotation: "",
      followUpUser: "",
      remark: "",
    });
    setEditId(null);
    setShowCreateModal(false);
  };

  const handleEdit = (inq: any) => {
    setForm({
      projectName: inq.projectName,
      status: inq.status,
      description: inq.description || "",
      consumer: inq.consumer,
      brand: inq.brand || "",
      product: inq.product,
      consultant: inq.consultant,
      followUpQuotation: inq.followUpQuotation || "",
      followUpUser: inq.followUpUser || "",
      remark: inq.remark || "",
    });
    setEditId(inq.id);
    setShowCreateModal(true);
  };

  const handleView = (inq: any) => {
    setSelectedInquiry(inq);
    setShowViewModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col w-full sm:w-1/5">
          <label className="mb-1 font-medium">Filter by Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-3 border rounded-lg">
            <option value="">All</option>
            <option value="tender">Tender</option>
            <option value="purchase">Purchase</option>
            <option value="procurement">Procurement</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="flex flex-col w-full sm:w-1/4">
          <label className="mb-1 font-medium">Filter by Quotation</label>
          <select value={quotation} onChange={(e) => setQuotation(e.target.value)} className="p-3 border rounded-lg">
            <option value="">All</option>
            <option value="yes">Ayan</option>
          </select>
        </div>
        <div className="flex flex-col w-full sm:w-1/4">
          <label className="mb-1 font-medium">Filter by Follow Up</label>
          <select value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="p-3 border rounded-lg">
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="flex flex-col w-full sm:w-1/4">
          <label className="mb-1 font-medium">Search</label>
          <input type="text" placeholder="Search inquiries..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-3 border rounded-lg" />
        </div>
      </div>

      {/* Month/Year + Buttons */}
      <div className="flex flex-wrap sm:flex-nowrap items-end gap-4 mb-6">
        <div className="flex flex-col w-full sm:w-1/6">
          <label className="mb-1 font-medium">Month</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-3 border rounded-lg">
            <option value="">All</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full sm:w-1/4">
          <label className="mb-1 font-medium">Year</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="p-3 border rounded-lg">
            <option value="">All</option>
            <option>2024</option>
            <option>2025</option>
            <option>2026</option>
          </select>
        </div>
        <div className="flex gap-2 mt-6 sm:mt-0 w-full sm:w-[100%]">
          <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Export to Excel</button>
        </div>
        <div className="flex gap-2 mt-6 sm:mt-0 w-full justify-end">
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaPlus />
            Create Inquiry
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white border-gray-300 rounded-lg">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 border">Sr No</th>
              <th className="px-4 py-2 border">Project Name</th>
              <th className="px-4 py-2 border">Consumer</th>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Consultant</th>
              <th className="px-4 py-2 border">Inquiry Status</th>
              <th className="px-4 py-2 border">Win/Loss</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInquiries.length ? (
              currentInquiries.map((inquiry, index) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">{startIndex + index + 1}</td>
                  <td className="px-4 py-2">{inquiry.projectName}</td>
                  <td className="px-4 py-2">{inquiry.consumer}</td>
                  <td className="px-4 py-2">{inquiry.product}</td>
                  <td className="px-4 py-2">{inquiry.consultant}</td>
                  <td className="px-4 py-2">
                    <select className="p-3 text-sm border rounded-lg">
                      <option value="ALL">All</option>
                      <option value="TENDER">TENDER</option>
                      <option value="PURCHASE">PURCHASE</option>
                      <option value="PROCUREMENT">PROCUREMENT</option>
                      <option value="URGENT">URGENT</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <p className="text-green-600">WIN</p>/<p className="text-red-600">LOSS</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button onClick={() => handleView(inquiry)} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
                      View
                    </button>
                    <button onClick={() => handleEdit(inquiry)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(inquiry.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  No inquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {startIndex + currentInquiries.length} of {filteredInquiries.length} results
          </p>
          <div className="flex gap-2">
            <button onClick={handlePrev} className="px-3 py-1 border rounded hover:bg-gray-100">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={handleNext} className="px-3 py-1 border rounded hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-[#00000071] backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{editId ? "Edit" : "Create"} Inquiry</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Project Name</label>
                <input name="projectName" value={form.projectName} onChange={handleFormChange} type="text" placeholder="Project Name" className="p-3 border rounded" required />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Status</label>
                <select name="status" value={form.status} onChange={handleFormChange} className="p-3 border rounded" required>
                  <option value="">Select Status</option>
                  <option value="TENDER">TENDER</option>
                  <option value="PURCHASE">PURCHASE</option>
                  <option value="PROCUREMENT">PROCUREMENT</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div className="flex flex-col col-span-2">
                <label className="mb-1 font-medium">Description</label>
                <input name="description" value={form.description} onChange={handleFormChange} type="text" placeholder="Description" className="p-3 border rounded" />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Consumer</label>
                <select name="consumer" value={form.consumer} onChange={handleFormChange} className="p-3 border rounded" required>
                  <option value="">Select Consumer</option>
                  {consumerOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Brand</label>
                <select name="brand" value={form.brand} onChange={handleFormChange} className="p-3 border rounded">
                  <option value="">Select Brand</option>
                  {brandOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Product</label>
                <select name="product" value={form.product} onChange={handleFormChange} className="p-3 border rounded" required>
                  <option value="">Select Product</option>
                  {productOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Consultant</label>
                <select name="consultant" value={form.consultant} onChange={handleFormChange} className="p-3 border rounded">
                  <option value="">Select Consultant</option>
                  {consultantOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Follow-up Quotation</label>
                <select name="followUpQuotation" value={form.followUpQuotation} onChange={handleFormChange} className="p-3 border rounded">
                  <option value="">Select Quotation</option>
                  {followUpQuotationOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium">Follow-up User</label>
                <select name="followUpUser" value={form.followUpUser} onChange={handleFormChange} className="p-3 border rounded">
                  <option value="">Select User</option>
                  {followUpUserOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col col-span-2">
                <label className="mb-1 font-medium">Remark</label>
                <textarea name="remark" value={form.remark} onChange={handleFormChange} placeholder="Remark" className="p-3 border rounded"></textarea>
              </div>

              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditId(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedInquiry && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-[#00000071] backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Inquiry Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Project Name:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.projectName}</p>
              </div>

              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Inquiry Status:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.status}</p>
              </div>

              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Consumer Name:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.consumer}</p>
              </div>

              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Product Name:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.product}</p>
              </div>

              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Consultant Name:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.consultant}</p>
              </div>

              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Assigned To:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.followUpUser}</p>
              </div>

              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Quotation By:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.followUpQuotation}</p>
              </div>

              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Created By:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.createdBy}</p>
              </div>

              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Created At:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.createdAt}</p>
              </div>

              <div className="flex gap-2">
                <label className="mb-1 font-medium text-gray-600">Last Updated:</label>
                <p className=" bg-gray-100 rounded">{selectedInquiry.updatedAt}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <label className="mb-1 font-medium text-gray-600">Remark:</label>
              <p className="bg-gray-100 rounded min-h-20">{selectedInquiry.remark}</p>
            </div>

            <div className="flex gap-2">
              <label className="mb-1 font-medium text-gray-600">Description:</label>
              <p className=" bg-gray-100 rounded min-h-20">{selectedInquiry.description}</p>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiry;
