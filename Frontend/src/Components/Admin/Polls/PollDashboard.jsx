// PollDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Dummy auth
const getAuthHeaders = () => ({
  headers: {
    Authorization: localStorage.getItem('token'),
  },
});

const API_BASE_URL = 'http://localhost:8080/api/v1/poll/';

const PollDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAnalytics, setSelectedAnalytics] = useState(null);
  const [deletingPollId, setDeletingPollId] = useState(null);

  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    expiresAt: '',
  });

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}getallpolls`, getAuthHeaders());
      setPolls(res.data.polls);
    } catch (err) {
      setToast({ message: 'Failed to fetch polls', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const handleOptionChange = (index, value) => {
    const updated = [...newPoll.options];
    updated[index] = value;
    setNewPoll(prev => ({ ...prev, options: updated }));
  };

  const addOption = () => {
    setNewPoll(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const removeOption = (index) => {
    if (newPoll.options.length <= 2) {
      showToast('At least 2 options required', 'error');
      return;
    }
    const updated = newPoll.options.filter((_, i) => i !== index);
    setNewPoll(prev => ({ ...prev, options: updated }));
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const validOptions = newPoll.options.filter(opt => opt.trim() !== '');
    if (!newPoll.question.trim() || validOptions.length < 2) {
      showToast('Please provide question and at least 2 options', 'error');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}createpoll`, {
        ...newPoll,
        options: validOptions,
      }, getAuthHeaders());
      showToast('Poll created!', 'success');
      setNewPoll({ question: '', options: ['', ''], expiresAt: '' });
      setShowCreateForm(false);
      fetchPolls();
    } catch (err) {
      showToast('Creation failed', 'error');
    }
  };

  const openAnalytics = async (pollId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}poll/${pollId}/analytics`, getAuthHeaders());
      setSelectedAnalytics({ pollId, data: res.data });
    } catch {
      showToast('Analytics failed', 'error');
    }
  };

  const deletePoll = async (pollId) => {
    try {
      await axios.delete(`${API_BASE_URL}poll/${pollId}`, getAuthHeaders());
      showToast('Poll deleted', 'success');
      fetchPolls();
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeletingPollId(null);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📊 Poll Dashboard</h1>

      <div className="mb-6 text-right">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {showCreateForm ? 'Cancel' : '+ Create Poll'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreatePoll} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Question</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={newPoll.question}
              onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Options</label>
            {newPoll.options.map((opt, i) => (
              <div key={i} className="flex items-center mb-2 gap-2">
                <input
                  className="flex-grow border px-3 py-2 rounded"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  required
                />
                {newPoll.options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)} className="text-red-500 text-lg font-bold">×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption} className="text-blue-600 mt-2">+ Add Option</button>
          </div>
          <div className="mt-4">
            <label className="block mb-1 font-medium">Expires At</label>
            <input
              type="datetime-local"
              className="w-full border px-3 py-2 rounded"
              value={newPoll.expiresAt}
              onChange={(e) => setNewPoll(prev => ({ ...prev, expiresAt: e.target.value }))}
              required
            />
          </div>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Poll</button>
        </form>
      )}

      {loading ? (
        <p>Loading polls...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {polls.map(poll => (
            <div key={poll._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">{poll.question}</h2>
              <p className="text-sm text-gray-500">Expires: {formatDate(poll.expiresAt)}</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => openAnalytics(poll._id)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  View Analytics
                </button>
                {deletingPollId === poll._id ? (
                  <>
                    <button
                      onClick={() => deletePoll(poll._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeletingPollId(null)}
                      className="text-gray-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDeletingPollId(poll._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>

              {selectedAnalytics?.pollId === poll._id && (
                <div className="mt-6">
                  <p className="font-medium text-gray-700 mb-2">Analytics:</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={selectedAnalytics.data.analytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="option" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toast.message && (
        <div className={`fixed bottom-5 right-5 px-4 py-2 rounded shadow-lg ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default PollDashboard;
