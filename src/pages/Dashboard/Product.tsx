import React, { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  price: number;
  createdBy: string;
  createdAt: string;
};

const Product = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    createdBy: "",
    createdAt: "",
  });

  const productsPerPage = 10;

  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchProducts = async (query = search) => {
      try {
        const res = await axios.get("https://nicoindustrial.com/api/product/list", {
          params: {
            search: query,
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
          createdBy: p.createdBy?.name || "Unknown",
          createdAt: new Date(p.createdAt).toLocaleDateString(),
        }));
        setProducts(apiProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

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

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      price: "",
      createdBy: "",
      createdAt: "",
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      createdBy: product.createdBy,
      createdAt: product.createdAt,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedProduct = {
      ...newProduct,
      price: parseFloat(newProduct.price),
    };

    if (editingProduct) {
      setProducts((prev) => prev.map((product) => (product.id === editingProduct.id ? { ...product, ...updatedProduct } : product)));
    } else {
      const newId = products.length + 1;
      const addedProduct = { id: newId, ...updatedProduct };
      setProducts((prev) => [...prev, addedProduct]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
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
          className="border border-gray-300 p-2 rounded-md w-full max-w-xs"
        />
        <button onClick={handleCreateProduct} className="ml-4 bg-gray-100 text-black border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-400">
          Create Product
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left">
          <thead className="bg-gray-300">
            <tr className="text-center">
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length ? (
              currentProducts.map((product, index) => (
                <tr className="text-center" key={product.id}>
                  <td className="p-2">{startIndex + index + 1}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">₹{product.price}</td>
                  <td className="p-2">{product.createdBy}</td>
                  <td className="p-2">{product.createdAt}</td>
                  <td className="p-2">
                    <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:underline mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} results
          </p>
          <div className="flex gap-2">
            <button onClick={handlePrev} disabled={currentPage === 1} className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}`}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>
                {i + 1}
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
        <div className="fixed inset-0 bg-[#00000071] z-50 bg-opacity-50 backdrop-blur-xs flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl mb-4">{editingProduct ? "Edit Product" : "Create Product"}</h2>
            <form onSubmit={handleSaveProduct}>
              <div className="mb-4">
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required className="mt-1 block w-full border p-2 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required className="mt-1 block w-full border p-2 rounded" />
              </div>
              <div className="mb-4">
                <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700">
                  Created By
                </label>
                <input
                  type="text"
                  value={newProduct.createdBy}
                  onChange={(e) => setNewProduct({ ...newProduct, createdBy: e.target.value })}
                  required
                  className="mt-1 block w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <input
                  type="date"
                  value={newProduct.createdAt}
                  onChange={(e) => setNewProduct({ ...newProduct, createdAt: e.target.value })}
                  required
                  className="mt-1 block w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="mr-4 px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save
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
