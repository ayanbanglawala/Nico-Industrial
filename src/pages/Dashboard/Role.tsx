import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type RoleType = {
  Id: number;
  name: string;
};

const Role = () => {
  const token = localStorage.getItem("token"); // or wherever you store it
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [editingRole, setEditingRole] = useState<RoleType | null>(null);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const fetchData = async (query = "") => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://nicoindustrial.com/api/roles/list?search=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.data.roles || []);
        setTotalPages(data.data.totalPages);
      } else {
        toast.error("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(search);
  }, [currentPage, search]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleModalOpen = (role: RoleType | null = null) => {
    setIsModalOpen(true);
    if (role) {
      setRoleName(role.name);
      setEditingRole(role);
    } else {
      setRoleName("");
      setEditingRole(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRoleName("");
    setEditingRole(null);
  };

  const handleCreateOrUpdateRole = () => {
    if (roleName.trim()) {
      if (editingRole) {
        // Update locally for now
        setRoles((prev) => prev.map((r) => (r.Id === editingRole.Id ? { ...r, name: roleName } : r)));
        console.log("Role Updated:", roleName);
      } else {
        const newRole = {
          Id: roles.length ? roles[roles.length - 1].Id + 1 : 1,
          name: roleName,
        };
        setRoles((prev) => [...prev, newRole]);
        console.log("New Role Created:", roleName);
      }
      handleModalClose();
    }
  };

  const handleDeleteRole = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this role?");
    if (confirmDelete) {
      setRoles((prev) => prev.filter((role) => role.Id !== id));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search role..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full max-w-xs"
        />
        <button onClick={() => handleModalOpen()} className="ml-4 bg-gray-100 text-black border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-400">
          Create Role
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-200 text-left">
        <thead className="bg-gray-300">
          <tr className="text-center">
            <th className="border p-2">Sr No</th>
            <th className="border p-2">Role Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : roles.length ? (
            roles.map((role, index) => (
              <tr className="text-center" key={role.Id}>
                <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="p-2">{role.name}</td>
                <td className="p-2">
                  <button onClick={() => handleModalOpen(role)} className="text-blue-600 hover:underline mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteRole(role.Id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No roles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, roles.length)} of {roles.length} results
        </p>
        <div className="flex gap-2">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-100">
            Previous
          </button>
          {[...Array(totalPages).keys()].map((_, i) => (
            <button key={i} onClick={() => goToPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000071] backdrop-blur-xs bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-lg font-bold mb-4">{editingRole ? "Edit Role" : "Create Role"}</h2>
            <div className="mb-4">
              <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                Role Name
              </label>
              <input type="text" id="roleName" placeholder="Enter Role Name" value={roleName} onChange={(e) => setRoleName(e.target.value)} className="border p-2 rounded w-full mt-2" />
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleCreateOrUpdateRole} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {editingRole ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Role;
