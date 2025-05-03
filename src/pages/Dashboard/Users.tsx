import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    mobile: "",
    role: "",
  });

  const token = localStorage.getItem("token");

  const filtered = users.filter((user) => user.username.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleStatus = (id: number) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: !user.status } : user)));
  };

  const handleModalOpen = (user?: any) => {
    if (user) {
      setNewUser({
        name: user.username,
        email: user.email || "",
        password: user.password || "",
        designation: user.designation ?? "",
        mobile: user.mobile ?? "",
        role: user.role ?? "",
      });
      setIsEditing(true);
      setEditingId(user.id);
    } else {
      setNewUser({
        name: "",
        email: "",
        password: "",
        designation: "",
        mobile: "",
        role: "",
      });
      setIsEditing(false);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

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
    setIsEditing(false);
    setEditingId(null);
  };

  const handleCreateOrUpdateUser = () => {
    if (Object.values(newUser).some((field) => !field.trim())) {
      alert("Please fill in all fields.");
      return;
    }

    if (isEditing && editingId !== null) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingId
            ? {
                ...user,
                username: newUser.name,
                email: newUser.email,
                designation: newUser.designation,
                mobile: newUser.mobile,
                role: newUser.role,
              }
            : user
        )
      );
    } else {
      const newUserWithDefaults = {
        ...newUser,
        id: users.length + 1,
        username: newUser.name,
        status: true,
      };
      setUsers([...users, newUserWithDefaults]);
    }

    handleModalClose();
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`https://nicoindustrial.com/api/user/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userList = res.data?.data?.list || [];

        const formattedUsers = userList.map((user: any, index: number) => ({
          id: index + 1,
          username: user.name,
          email: user.email,
          designation: user.department,
          mobile: user.phone,
          role: user.role,
          password: user.password || "",
          status: user.status,
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  return (
    <div className="p-4">
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
        <button onClick={() => handleModalOpen()} className="ml-4 bg-gray-100 text-black border-1 border-gray-400 px-4 py-2 rounded-md hover:bg-gray-400">
          Create User
        </button>
      </div>

      <table className="min-w-full border border-gray-200 text-left">
        <thead className="bg-gray-300">
          <tr className="text-center">
            <th className="border p-2">Sr No</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length ? (
            paginated.map((user, index) => (
              <tr className="text-center" key={user.id}>
                <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ease-in-out mx-auto ${user.status ? "bg-green-500" : "bg-gray-300 border-1 border-gray-400"}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${user.status ? "translate-x-7" : "translate-x-0"}`}></div>
                  </button>
                </td>
                <td className="border p-2">
                  <button onClick={() => handleModalOpen(user)} className="text-blue-600 hover:underline mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
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
        <div className="fixed inset-0 bg-[#00000071] flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-lg font-bold mb-4">{isEditing ? "Edit User" : "Create User"}</h2>
            {["name", "email", "password", "designation", "mobile"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                <input
                  type={field === "password" ? "password" : "text"}
                  value={(newUser as any)[field]}
                  onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })}
                  className="border p-2 rounded w-full mt-2"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
            {/* Role Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border p-2 rounded w-full mt-2">
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="sales">Sales</option>
                <option value="admin">Admin</option>
                <option value="accounts">Accounts</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleCreateOrUpdateUser} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
