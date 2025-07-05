import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../../config';
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('users');
  const [updatedUser, setUpdatedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/users/allusers`);
      setUsers(res.data.users);
    } catch (error) {
      console.log("Fetch user error", error);
    } finally {
      setLoading(false);
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
        `${BACKEND_URL}/users/updateuser/${id}`,
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
        `${BACKEND_URL}/users/deleteuser/${id}`,
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
return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto">
        {activeSection === 'users' && (
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">#</th>
                    <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">User</th>
                    <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Contact</th>
                    <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Role</th>
                    <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Address</th>
                    <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">{index + 1}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3">
                              <span className="text-gray-700 font-bold">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-gray-500 text-sm">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{user.phoneNumber || '-'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{user.houseNumber || '-'}</td>
                        <td className="py-4 px-6 space-x-2">
                          <button
                            onClick={() => openUpdateUserInfoModal(user)}
                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && updatedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5">
              <h3 className="text-xl font-semibold text-white">
                Update {updatedUser.name}'s Information
              </h3>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUserInfo(updatedUser._id, updatedUser);
              }}
              className="p-6 space-y-4"
            >
              {["name", "email", "phoneNumber", "houseNumber"].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}:
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={updatedUser[field] || ""}
                    onChange={(e) =>
                      setUpdatedUser((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              ))}
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setUpdatedUser(null);
                  }}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition shadow-md"
                >
                  Update Information
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