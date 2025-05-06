import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type BrandType = {
  _id: string;
  brandName: string;
};

const Brand = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [brands, setBrands] = useState<BrandType[]>([]);
  const token = localStorage.getItem("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [editingBrand, setEditingBrand] = useState<BrandType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await axios.get("https://nicoindustrial.com/api/brand/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && Array.isArray(res.data.data)) {
        const brandList = res.data.data.map((brand: any) => ({
          ...brand,
          _id: brand._id || brand.id, // Fallback in case _id is missing
        }));
        console.log("Fetched brands:", brandList);
        setBrands(brandList);
      }
    } catch (error: any) {
      console.error("Failed to fetch brands:", error);
      toast.error(error.response?.data?.message || "Failed to fetch brands");
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const filtered = brands.filter((brand) =>
    brand.brandName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleModalOpen = (brand: BrandType | null = null) => {
    setIsModalOpen(true);
    if (brand) {
      setBrandName(brand.brandName);
      setEditingBrand(brand);
    } else {
      setBrandName("");
      setEditingBrand(null);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!brandName.trim()) return;

    setIsLoading(true);

    const url =
      editingBrand && editingBrand._id
        ? `https://nicoindustrial.com/api/brand/edit/${editingBrand._id}?userId=1`
        : `https://nicoindustrial.com/api/brand/save?userId=1`;

    try {
      const res = await axios({
        method: editingBrand ? "PUT" : "POST",
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { brandName },
      });

      if (res.data) {
        toast.success(
          res.data.message || `Brand ${editingBrand ? "updated" : "created"} successfully`
        );
        setIsModalOpen(false);
        setBrandName("");
        setEditingBrand(null);
        fetchBrands();
      }
    } catch (error) {
      toast.error("Error saving brand");
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || id === "undefined") {
      toast.error("Invalid ID");
      console.warn("Attempted to delete with invalid ID:", id);
      return;
    }

    try {
      const response = await axios.delete(
        `https://nicoindustrial.com/api/brand/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        toast.success(response.data.message || "Brand deleted successfully!");
        setBrands((prevBrands) => prevBrands.filter((brand) => brand._id !== id));
      }
    } catch (error) {
      toast.error("Error deleting brand. Please try again.");
      console.error("Error deleting brand:", error);
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
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
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => handleModalOpen()}
        >
          <FaPlus />
          Create Brand
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left">
          <thead className="bg-gray-300">
            <tr className="text-center">
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Brand Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length ? (
              paginated.map((brand, index) => (
                <tr className="text-center hover:bg-gray-200" key={brand._id}>
                  <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-2">{brand.brandName}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleModalOpen(brand)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(brand._id)}
                    >
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

      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results
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
            <button
              onClick={() => goToPage(totalPages)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 bg-[#00000071] backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-lg font-medium mb-4">
              {editingBrand ? "Edit Brand" : "Create New Brand"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full"
                placeholder="Enter brand name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 ${isLoading ? "bg-gray-400" : "bg-blue-600"} text-white rounded-md`}
                onClick={handleCreateOrUpdate}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;
