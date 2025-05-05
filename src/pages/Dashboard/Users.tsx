import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    mobile: "",
    role: "",
  });

  const token = localStorage.getItem("token");

  const fetchUsers = async (page: number, size: number, searchQuery: string = "") => {
    try {
      const res = await axios.get(`https://nicoindustrial.com/api/user/list`, {
        params: {
          page: page,
          size: size,
          search: searchQuery,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userList = res.data?.data?.list || [];
      const totalRecords = res.data?.data?.totalRecords || 0;
      const totalPages = res.data?.data?.totalPages || 1;

      const formattedUsers = userList.map((user: any, index: number) => ({
        id: user.Id || index + 1,
        username: user.name,
        email: user.email,
        designation: user.designation || user.department || "",
        mobile: user.mobileNo || user.phone || "",
        role: user.role?.name || user.role || "",
        password: user.password || "",
        status: user.status,
      }));

      setUsers(formattedUsers);
      setTotalRecords(totalRecords);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers(currentPage, itemsPerPage, search);
    }
  }, [token, currentPage, itemsPerPage, search]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await axios.put(
        `https://nicoindustrial.com/api/user/active/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers(currentPage, itemsPerPage, search);
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleModalOpen = (user?: any) => {
    if (user) {
      setNewUser({
        name: user.username,
        email: user.email || "",
        password: "",
        designation: user.designation || "",
        mobile: user.mobile || "",
        role: user.role || "",
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

  const handleCreateOrUpdateUser = async () => {
    if (Object.values(newUser).some((field) => !field.trim())) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (isEditing && editingId !== null) {
        await axios.put(
          `https://nicoindustrial.com/api/user/editProfile`,
          {
            id: editingId,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password || undefined,
            designation: newUser.designation,
            mobileNo: newUser.mobile,
            role: { name: newUser.role },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `https://nicoindustrial.com/api/user/signup`,
          {
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            designation: newUser.designation,
            mobileNo: newUser.mobile,
            role: { name: newUser.role },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      fetchUsers(currentPage, itemsPerPage, search);
      handleModalClose();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://nicoindustrial.com/api/user/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers(currentPage, itemsPerPage, search);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

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
            {/* <th className="border p-2">Email</th> */}
            {/* <th className="border p-2">Designation</th> */}
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user, index) => (
              <tr className="text-center hover:bg-gray-200" key={user.id}>
                <td className="p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="p-2">{user.username}</td>
                {/* <td className="p-2">{user.email}</td> */}
                {/* <td className="p-2">{user.designation}</td> */}
                <td className="p-2 text-center">
                  <button
                    onClick={() => toggleStatus(user.id, user.status)}
                    className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ease-in-out mx-auto ${user.status ? "bg-green-500" : "bg-gray-300 border-1 border-gray-400"}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${user.status ? "translate-x-7" : "translate-x-0"}`}></div>
                  </button>
                </td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => handleModalOpen(user)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="bg-red-600 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} results
        </p>
        <div className="flex gap-2">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-100">
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button key={pageNum} onClick={() => goToPage(pageNum)} className={`px-3 py-1 border rounded ${currentPage === pageNum ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-2">...</span>}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <button onClick={() => goToPage(totalPages)} className="px-3 py-1 border rounded hover:bg-gray-100">
              {totalPages}
            </button>
          )}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100">
            Next
          </button>
        </div>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border p-1 rounded">
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000071] flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-lg font-bold mb-4">{isEditing ? "Edit User" : "Create User"}</h2>
            {["name", "email", "password", "designation", "mobile"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field} {field !== "password" || !isEditing ? "*" : ""}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  value={(newUser as any)[field]}
                  onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })}
                  className="border p-2 rounded w-full mt-2"
                  placeholder={`Enter ${field}`}
                  required={field !== "password" || !isEditing}
                />
              </div>
            ))}
            {/* Role Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role *</label>
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border p-2 rounded w-full mt-2" required>
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
