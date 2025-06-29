import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Info, AlertTriangle, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const BroadcastDashboard = () => {
    const [broadcasts, setBroadcasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingBroadcast, setEditingBroadcast] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        category: 'post',
    });
    const [errors, setErrors] = useState({});

    // Mock API base URL - replace with your actual API URL
    const API_BASE = 'http://localhost:8080/api/v1/broadcast';

    // Mock auth token - replace with your actual auth implementation
    const getAuthToken = () => localStorage.getItem('token');

    // Create axios instance with default config
    const api = axios.create({
        baseURL: API_BASE,
        headers: {
            'Authorization': getAuthToken()
        }
    });

    useEffect(() => {
        fetchBroadcasts();
    }, []);

    const fetchBroadcasts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/getAllBroadcast');
            setBroadcasts(response.data.broadcasts || []);
        } catch (error) {
            console.error('Error fetching broadcasts:', error);
            if (error.response?.status === 401) {
                alert('Unauthorized. Please login again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };



    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateBroadcast = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('message', formData.message);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('category', formData.category);



            const response = await api.post('/createBroadcast', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 201) {
                await fetchBroadcasts();
                setShowCreateForm(false);
                resetForm();
                alert('Broadcast created successfully!');
            }
        } catch (error) {
            console.error('Error creating broadcast:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create broadcast';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBroadcast = async (_id) => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const updateData = {
                title: formData.title,
                message: formData.message,
                type: formData.type,
                category: formData.category
            };

            const response = await axios.post(`http://localhost:8080/api/v1/broadcast/updateBroadcast/${editingBroadcast._id}`, updateData,{
                headers:{
                    "Authorization":localStorage.getItem("token")
                }
            });

            if (response.status === 200) {
                await fetchBroadcasts();
                setEditingBroadcast(null);
                resetForm();
                alert('Broadcast updated successfully!');
            }
        } catch (error) {
            console.error('Error updating broadcast:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update broadcast';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBroadcast = async (_id) => {
        if (!window.confirm('Are you sure you want to delete this broadcast?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/broadcast/deleteBroadcast/${_id}`, {
                headers: {
                    'Authorization': localStorage.getItem("token")
                }
            });



            if (response.status === 200) {
                await fetchBroadcasts();
                alert('Broadcast deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting broadcast:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete broadcast';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            message: '',
            type: 'info',
            category: 'post',
        });
        setErrors({});
    };

    const openEditForm = (broadcast) => {
        setEditingBroadcast(broadcast);
        setFormData({
            title: broadcast.title,
            message: broadcast.message,
            type: broadcast.type,
            category: broadcast.category,
        });
        setShowCreateForm(false);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            default:
                return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const getTypeStyle = (type) => {
        switch (type) {
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900">Broadcast Management</h1>
                            {!showCreateForm && !editingBroadcast && (
                                <button
                                    onClick={() => {
                                        setShowCreateForm(true);
                                        resetForm();
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create Broadcast</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Collapsible Create Form */}
                {showCreateForm && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
                        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-lg font-semibold text-gray-900">Create New Broadcast</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter broadcast title"
                                            autoComplete="off"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Type *
                                            </label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="info">Info</option>
                                                <option value="warning">Warning</option>
                                                <option value="error">Error</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                category *
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="post">post</option>
                                                <option value="event">event</option>
                                            </select>
                                        </div>
                                    </div>


                                </div>

                                {/* Right Column */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={8}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter broadcast message"
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        resetForm();
                                    }}
                                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateBroadcast}
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Creating...' : 'Create Broadcast'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                {editingBroadcast && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
                        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Edit Broadcast</h2>
                                <button
                                    onClick={() => {
                                        setEditingBroadcast(null);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter broadcast title"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Type *
                                            </label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="info">Info</option>
                                                <option value="warning">Warning</option>
                                                <option value="error">Error</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category *
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="post">post</option>
                                                <option value="event">event</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter broadcast message"
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingBroadcast(null);
                                        resetForm();
                                    }}
                                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUpdateBroadcast(editingBroadcast._id)}
                                    disabled={loading}
                                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Updating...' : 'Update Broadcast'}
                                </button>

                            </div>
                        </div>
                    </div>
                )}

                {/* Broadcasts List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">All Broadcasts</h2>
                    </div>

                    <div className="p-6">
                        {loading && broadcasts.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Loading broadcasts...</p>
                            </div>
                        ) : broadcasts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No broadcasts found. Create your first broadcast!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {broadcasts.map((broadcast) => (
                                    <div
                                        key={broadcast._id}
                                        className={`border rounded-lg p-4 ${getTypeStyle(broadcast.type)}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    {getTypeIcon(broadcast.type)}
                                                    <h3 className="font-semibold text-gray-900">{broadcast.title}</h3>
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                                        {broadcast.category}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 mb-3">{broadcast.message}</p>
                                                <div className="text-sm text-gray-500">
                                                    Created: {new Date(broadcast.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 ml-4">
                                                <button
                                                    onClick={() => openEditForm(broadcast)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Edit broadcast"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBroadcast(broadcast._id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete broadcast"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>


                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BroadcastDashboard;