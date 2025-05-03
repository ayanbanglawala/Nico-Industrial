import React, { useState } from "react";

const Users = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [users, setUsers] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      status: i % 2 === 0, // true = Active, false = Inactive
    }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    mobile: "",
    role: "",
  });

  const filtered = users.filter((user) => user.username.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleStatus = (id: number) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: !user.status } : user)));
  };

  const handleModalOpen = () => setIsModalOpen(true);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewUser({
      name: "",
      email: "",
      password: "",
      designation: "",
      mobile: "",
      role: "",
    });
  };

  const handleCreateUser = () => {
    // Ensure that all fields are filled
    if (Object.values(newUser).some((field) => !field.trim())) {
      alert("Please fill in all fields.");
      return;
    }

    // Add new user to the list (make sure to include the username and status)
    const newUserWithDefaults = {
      ...newUser,
      id: users.length + 1, // Assign an id
      username: newUser.name, // Use name as the username (or create a separate username field)
      status: true, // Set status to true by default (you can adjust this as needed)
    };

    setUsers([...users, newUserWithDefaults]); // Add the new user to the users list
    handleModalClose(); // Close the modal after creating the user
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full max-w-xs"
        />
        <button onClick={handleModalOpen} className="ml-4 bg-gray-100 text-black border-1 border-gray-400 px-4 py-2 rounded-md hover:bg-gray-400">
          Create User
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-200 text-left">
        <thead className="bg-gray-300">
          <tr>
            <th className="border p-2">Sr No</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length ? (
            paginated.map((user, index) => (
              <tr key={user.id}>
                <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ease-in-out ${user.status ? "bg-green-500" : "bg-gray-300 border-1 border-gray-400"}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${user.status ? "translate-x-7" : "translate-x-0"}`}></div>
                  </button>
                </td>
                <td className="border p-2">
                  <button className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No users found.
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
            <button key={i + 1} onClick={() => goToPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>
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
            <h2 className="text-lg font-bold mb-4">Create User</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="border p-2 rounded w-full mt-2" placeholder="Enter name" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border p-2 rounded w-full mt-2" placeholder="Enter email" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="border p-2 rounded w-full mt-2"
                placeholder="Enter password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                value={newUser.designation}
                onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
                className="border p-2 rounded w-full mt-2"
                placeholder="Enter designation"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Mobile No</label>
              <input type="text" value={newUser.mobile} onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })} className="border p-2 rounded w-full mt-2" placeholder="Enter mobile no" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input type="text" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border p-2 rounded w-full mt-2" placeholder="Enter role" />
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleCreateUser} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
