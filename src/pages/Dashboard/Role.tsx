import { useRole } from "../../hooks/userole";
import React from "react";

const RoleComponent = () => {
  const {
    roles,
    search,
    setSearch,
    currentPage,
    goToPage,
    totalPages,
    isLoading,
    isModalOpen,
    roleName,
    setRoleName,
    editingRole,
    handleModalOpen,
    handleModalClose,
    handleCreateOrUpdateRole,
    handleDeleteRole,
    isSaving,
    itemsPerPage,
  } = useRole();

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
            goToPage(1); // this replaces setCurrentPage
          }}
          className="border p-2 rounded w-full max-w-xs"
        />
        <button
          onClick={() => handleModalOpen()}
          className="ml-4 bg-gray-100 text-black border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-400"
        >
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
              <tr className="text-center hover:bg-gray-200" key={role.Id}>
                <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="p-2">{role.name}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleModalOpen(role)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.Id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
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
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
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
              <input
                type="text"
                id="roleName"
                placeholder="Enter Role Name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="border p-2 rounded w-full mt-2"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdateRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : editingRole ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleComponent;
