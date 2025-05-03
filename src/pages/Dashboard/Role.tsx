import React, { useState } from "react";
type RoleType = {
  id: number;
  project: string;
};

const Role = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [editingRole, setEditingRole] = useState<RoleType | null>(null);
  const [roles, setRoles] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      project: `Project ${i + 1}`,
    }))
  );

  const itemsPerPage = 10;

  const filtered = roles.filter((role) => role.project.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleModalOpen = (role: RoleType | null = null) => {
    setIsModalOpen(true);
    if (role) {
      setRoleName(role.project);
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
        setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? { ...r, project: roleName } : r)));
        console.log("Role Updated:", roleName);
      } else {
        const newRole = {
          id: roles.length ? roles[roles.length - 1].id + 1 : 1,
          project: roleName,
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
      setRoles((prev) => prev.filter((role) => role.id !== id));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search project..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full max-w-xs"
        />
        <button onClick={() => handleModalOpen()} className="ml-4 bg-gray-100 text-black border-1 border-gray-400 px-4 py-2 rounded-md hover:bg-gray-400">
          Create Role
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-200 text-left">
        <thead className="bg-gray-300">
          <tr>
            <th className="border p-2">Sr No</th>
            <th className="border p-2">Project Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length ? (
            paginated.map((role, index) => (
              <tr key={role.id}>
                <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="p-2">{role.project}</td>
                <td className="p-2">
                  <button onClick={() => handleModalOpen(role)} className="text-blue-600 hover:underline mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteRole(role.id)} className="text-red-600 hover:underline">
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
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} results
        </p>
        <div className="flex gap-2">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-100">
            Previous
          </button>
          {[...Array(totalPages).keys()].slice(0, 3).map((_, i) => (
            <button key={i + 1} onClick={() => goToPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`}>
              {i + 1}
            </button>
          ))}
          {totalPages > 4 && <span className="px-2">...</span>}
          {totalPages > 3 && (
            <button onClick={() => goToPage(totalPages)} className="px-3 py-1 border rounded hover:bg-gray-100">
              {totalPages}
            </button>
          )}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000071] bg-opacity-50 backdrop-blur-xs flex justify-center items-center z-50">
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
