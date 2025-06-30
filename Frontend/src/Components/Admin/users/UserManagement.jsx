import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState('users');
  const [updatedUser, setUpdatedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/users/allusers');
      setUsers(res.data.users);
    } catch (error) {
      console.log("Fetch user error", error);
    }
  };

  const handleUpdateUserInfo = async (id, updatedData) => {
    console.log("Updated Data being sent:", updatedData);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please log in again.");
      window.location.href = "/login"; // or use navigate("/login") if you're using react-router
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/users/updateuser/${id}`,
        updatedData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
         setUsers(users.map(user =>
          user._id === id ? { ...user, ...res.data.user } : user
        ));
        setIsModalOpen(false);
        setUpdatedUser(null);
        alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user info:", error);
      if (error.response) {
        alert(`Failed to update user: ${error.response.data.message}`);
      } else {
        alert("Failed to update user. Please try again.");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/users/deleteuser/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.status === 200) {
        setUsers(users.filter((user) => user._id !== id));
        alert("User deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };


  const openUpdateUserInfoModal = (user) => {
    setUpdatedUser({ ...user }); // make a copy to avoid direct mutation
    setIsModalOpen(true);
  };

  const SectionTitle = ({ title }) => (
    <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-300 pb-2">
      {title}
    </h2>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <main className="bg-white rounded-xl shadow-lg p-8">
        {activeSection === 'users' && (
          <section>
            <SectionTitle title="User Management" />
            <p className="text-gray-600 mb-6">Manage user roles and information.</p>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white border-collapse">
                <thead className="bg-blue-50 text-blue-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase">#</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Name</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Role</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase">House Number</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Phone</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {users.map((user, index) => (
                    <tr key={user._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 border-b border-gray-200">{index + 1}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{user.name}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{user.email}</td>
                      <td className="py-3 px-4 border-b border-gray-200 capitalize">{user.role}</td>
                      <td className="py-3 px-4 border-b border-gray-200 capitalize">{user.houseNumber}</td>
                      <td className="py-3 px-4 border-b border-gray-200 capitalize">{user.phoneNumber}</td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <button
                          onClick={() => openUpdateUserInfoModal(user)}
                          className="px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition duration-200 shadow-md"
                        >
                          Edit Info
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && updatedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Update User Information for {updatedUser.name}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUserInfo(updatedUser._id, updatedUser);
              }}
              className="space-y-4"
            >
              {["name", "email", "phoneNumber", "houseNumber"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 text-sm font-semibold capitalize">
                    {field}:
                  </label>
                  <input
                    type="text"
                    value={updatedUser[field] || ""}
                    onChange={(e) =>
                      setUpdatedUser((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Update Info
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setUpdatedUser(null);
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;