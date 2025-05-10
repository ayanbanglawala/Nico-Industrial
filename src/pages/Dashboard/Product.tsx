"use client";

import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Brand = {
  brandId: number;
  brandName: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  brandId?: number;
  brandName?: string;
  createdBy: string;
  createdAt: string;
};

const Product = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    createdBy: "",
    createdAt: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const productsPerPage = 10;
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, [currentPage, search]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("https://nicoindustrial.com/api/product/list", {
        params: {
          search: search,
          page: currentPage,
          size: productsPerPage,
          userId: userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const apiProducts = res.data.data.productList.map((p: any) => ({
        id: p.productId,
        name: p.productName,
        price: p.price,
        brandId: p.brand?.brandId,
        brandName: p.brand?.brandName,
        createdBy: p.createdBy?.name || "Unknown",
        createdAt: new Date(p.createdAt).toLocaleDateString(),
      }));
      setProducts(apiProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to fetch products", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get("https://nicoindustrial.com/api/brand/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Map the brands correctly to match the API structure
      const brandsData = res.data.data || [];
      setBrands(brandsData);
    } catch (error) {
      console.error("Failed to fetch brands", error);
      toast.error("Failed to load brands", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      price: "",
      createdBy: "",
      createdAt: "",
    });
    setSelectedBrandId(null);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    if (!newProduct.name.trim()) {
      setErrorMessage("Product Name is required");
      return;
    }

    if (!newProduct.price) {
      setErrorMessage("Price is required");
      return;
    }

    const priceValue = Number.parseFloat(newProduct.price);
    if (isNaN(priceValue)) {
      setErrorMessage("Please enter a valid number for price");
      return;
    }

    if (priceValue <= 0) {
      setErrorMessage("Price must be greater than 0");
      return;
    }

    if (!selectedBrandId) {
      setErrorMessage("Please select a brand");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        productName: newProduct.name.trim(),
        price: priceValue,
        brand: { brandId: selectedBrandId },
        createdBy: { id: userId },
      };

      let response;

      if (editingProduct) {
        // Update existing product
        response = await axios.put(
          `https://nicoindustrial.com/api/product/update/${editingProduct.id}`,
          {
            ...payload,
            updatedBy: { id: userId },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(response.data.message || "Product updated successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
      } else {
        // Create new product
        response = await axios.post(`https://nicoindustrial.com/api/product/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(response.data.message || "Product created successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
      }

      setIsModalOpen(false);
      resetForm(); // Reset the form
      fetchProducts(); // Refresh the list
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || (editingProduct ? "Error updating product. Please try again." : "Error creating product. Please try again.");
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setIsLoading(true);
        const response = await axios.delete(`https://nicoindustrial.com/api/product/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const successMessage = response.data.message || "Product deleted successfully!";
        // Show success toast with green color and red progress bar
        toast.success(successMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false, // Show progress bar
          className: "toast-success", // Custom class for green background
          style: { backgroundColor: "green" }, // Green progress bar
        });

        fetchProducts(); // Refresh the product list
      } catch (error) {
        const errorMessage = (error as any).response?.data?.message || "Error deleting product. Please try again.";
        // Show error toast if deletion fails with red progress bar
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false, // Show progress bar
          style: { backgroundColor: "red" }, // Red progress bar
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      createdBy: product.createdBy,
      createdAt: product.createdAt,
    });
    setSelectedBrandId(product.brandId || null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <div className="p-4 dark:text-white">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-black p-2 rounded-md w-full max-w-xs"
        />
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm(); // Use the reset function here
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FaPlus />
          Create Product
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left">
          <thead className="bg-gray-400 dark:text-black">
            <tr className="text-center">
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Loading products...
                </td>
              </tr>
            ) : currentProducts.length ? (
              currentProducts.map((product, index) => (
                <tr className="text-center bg-gray-300 hover:bg-gray-200" key={product.id}>
                  <td className="p-2">{startIndex + index + 1}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">₹{product.price}</td>
                  <td className="p-2">{product.brandName || "N/A"}</td>
                  <td className="p-2">{product.createdBy}</td>
                  <td className="p-2">{product.createdAt}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEditProduct(product)} className="bg-blue-500 text-white px-2 py-1 rounded" disabled={isLoading}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 text-white px-2 py-1 rounded" disabled={isLoading}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  {search ? "No matching products found" : "No products available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} results
            </p>
            <div className="flex gap-2">
              <button onClick={handlePrev} disabled={currentPage === 1 || isLoading} className={`px-3 py-1 border border-black rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}`}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} disabled={isLoading} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={handleNext} disabled={currentPage === totalPages || isLoading} className={`px-3 py-1 border border-black rounded ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}`}>
                Next
              </button>
            </div>
            <select
              value={productsPerPage}
              onChange={(e) => {
                setProductsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-black p-1 rounded">
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000071] z-50 bg-opacity-50 backdrop-blur-xs flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl mb-4">{editingProduct ? "Edit Product" : "Create Product"}</h2>
            {errorMessage && <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                  Product Name*
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, name: e.target.value });
                    setErrorMessage("");
                  }}
                  required
                  className="mt-1 block w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price*
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, price: e.target.value });
                    setErrorMessage("");
                  }}
                  required
                  className="mt-1 block w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Brand*
                </label>
                <select
                  id="brand"
                  value={selectedBrandId || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedBrandId(value ? Number(value) : null);
                    setErrorMessage(""); // Clear error when selection changes
                  }}
                  required
                  className="mt-1 block w-full border p-2 rounded">
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.brandId} value={brand.brandId} className="text-black">
                      {brand.brandName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="mr-4 px-4 py-2 border rounded" disabled={isLoading}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
