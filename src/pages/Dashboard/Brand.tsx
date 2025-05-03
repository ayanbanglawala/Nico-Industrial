import React, { useState } from "react";

type BrandType = {
  id: number;
  name: string;
};

const Brand = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Brand data state
  const [brands, setBrands] = useState<BrandType[]>(Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `Brand ${i + 1}` })));

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [editingBrand, setEditingBrand] = useState<BrandType | null>(null);

  // Search filter
  const filtered = brands.filter((brand) => brand.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleModalOpen = (brand: BrandType | null = null) => {
    setIsModalOpen(true);
    if (brand) {
      setBrandName(brand.name);
      setEditingBrand(brand);
    } else {
      setBrandName("");
      setEditingBrand(null);
    }
  };

  const handleCreateOrUpdate = () => {
    if (editingBrand) {
      // Update
      setBrands((prev) => prev.map((b) => (b.id === editingBrand.id ? { ...b, name: brandName } : b)));
    } else {
      // Add
      const newBrand: BrandType = {
        id: brands.length ? brands[brands.length - 1].id + 1 : 1,
        name: brandName,
      };
      setBrands((prev) => [...prev, newBrand]);
    }

    setIsModalOpen(false);
    setBrandName("");
    setEditingBrand(null);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this brand?");
    if (confirmDelete) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search brand..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 p-2 rounded-md w-full max-w-xs"
        />
        <button className="ml-4 bg-gray-100 text-black border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-400" onClick={() => handleModalOpen()}>
          Create Brand
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left">
          <thead className="bg-gray-300">
            <tr>
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Brand Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length ? (
              paginated.map((brand, index) => (
                <tr key={brand.id}>
                  <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-2">{brand.name}</td>
                  <td className="p-2">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => handleModalOpen(brand)}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(brand.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No brands found.
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
        <div className="fixed inset-0 bg-opacity-50 bg-[#00000071] backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-lg font-medium mb-4">{editingBrand ? "Edit Brand" : "Create New Brand"}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium">Brand Name</label>
              <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="border border-gray-300 p-2 rounded-md w-full" placeholder="Enter brand name" />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setBrandName("");
                  setEditingBrand(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded-md">
                Cancel
              </button>
              <button onClick={handleCreateOrUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                {editingBrand ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;
