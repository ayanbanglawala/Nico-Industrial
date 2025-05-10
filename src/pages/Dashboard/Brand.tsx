import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type BrandType = {
  brandId: number;
  brandName: string;
  products: any;
  createdAt: string;
  updatedAt: string | null;
};

const Brand = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10;
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const filtered = brands.filter((brand) => brand.brandName.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleModalOpen = async (brand: BrandType | null = null) => {
    if (brand) {
      try {
        // First check if we have all needed data already
        if (brand.brandId && brand.brandName) {
          setBrandName(brand.brandName);
          setEditingBrand(brand);
          setIsModalOpen(true);
          return;
        }

        // Only fetch if we don't have complete data
        const response = await axios.get(`https://nicoindustrial.com/api/brand/${brand.brandId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const brandData = response.data.data;
        console.log("Fetched brand data:", brandData);

        setBrandName(brandData.brandName);
        setEditingBrand({
          brandId: brandData.brandId,
          brandName: brandData.brandName,
          products: brandData.products,
          createdAt: brandData.createdAt,
          updatedAt: brandData.updatedAt,
        });

        setIsModalOpen(true);
      } catch (error) {
        console.error("Failed to fetch brand data:", error);
        toast.error("Error fetching brand data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      // For creating new brand
      setBrandName("");
      setEditingBrand(null);
      setIsModalOpen(true);
    }
  };
  const userId = localStorage.getItem("userId");

  const handleCreateOrUpdate = async () => {
    if (!brandName.trim()) {
      toast.error("Brand name is required", { position: "top-right", autoClose: 3000 });
      return;
    }

    setIsLoading(true);

    try {
      const url = editingBrand ? `https://nicoindustrial.com/api/brand/edit/${editingBrand.brandId}?userId=${userId}` : `https://nicoindustrial.com/api/brand/save?userId=${userId}`;

      const method = editingBrand ? "PUT" : "POST";
      console.log("URL:", url);

      console.log("Save response:", method);
      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          brandName,
          userId, // Include userId if your backend requires it
        },
      });

      toast.success(response.data?.message || `Brand ${editingBrand ? "updated" : "created"} successfully`, { position: "top-right", autoClose: 3000 });

      setIsModalOpen(false);
      setBrandName("");
      setEditingBrand(null);
      fetchBrands();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error saving brand";
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (brandId: number) => {
    if (!brandId) {
      toast.error("Invalid brand ID");
      console.warn("Attempted to delete with invalid ID:", brandId);
      return;
    }

    try {
      const response = await axios.delete(`https://nicoindustrial.com/api/brand/delete/${brandId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        toast.success(response.data.message || "Brand deleted successfully!");
        setBrands((prevBrands) => prevBrands.filter((brand) => brand.brandId !== brandId));
      }
    } catch (error) {
      toast.error("Error deleting brand. Please try again.");
      console.error("Error deleting brand:", error);
    }
  };

  return (
    <div className="p-4 dark:text-white">
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
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => handleModalOpen()}>
          <FaPlus />
          Create Brand
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left">
          <thead className="bg-gray-300 dark:text-black">
            <tr className="text-center">
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Brand Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length ? (
              paginated.map((brand, index) => (
                <tr className="text-center hover:bg-gray-200" key={brand.brandId}>
                  <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-2">{brand.brandName}</td>
                  <td className="p-2 space-x-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleModalOpen(brand)}>
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(brand.brandId)}>
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
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            goToPage(1);
          }}
          className="border p-1 rounded">
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 bg-[#00000071] backdrop-blur-xs flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-md w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">{editingBrand ? "Edit Brand" : "Create New Brand"}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium">Brand Name</label>
              <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="border border-gray-300 p-2 rounded-md w-full" placeholder="Enter brand name" />
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className={`px-4 py-2 ${isLoading ? "bg-gray-400" : "bg-blue-600"} text-white rounded-md`} onClick={handleCreateOrUpdate} disabled={isLoading}>
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
