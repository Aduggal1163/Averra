import React, { useState, useEffect } from 'react';
import { Vote, Clock, Users, TrendingUp, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const PollDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingLoading, setVotingLoading] = useState({});
  const [filter, setFilter] = useState('active'); // 'all', 'active', 'expired'
  const [successMessage, setSuccessMessage] = useState('');

  // Configure API base URL (adjust as needed)
  const API_BASE_URL = 'http://localhost:8080/api/v1/poll'; // Update this to your backend URL
  
  useEffect(() => {
    fetchPolls();
  }, [filter]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError('');
      
      let endpoint = '/getallpolls';
      if (filter === 'active') {
        endpoint = '/polls/active';
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') // Adjust based on your auth implementation
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPolls(data.polls || []);
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError(err.message || 'Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, selectedOption) => {
    try {
      setVotingLoading(prev => ({ ...prev, [pollId]: true }));
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/votepoll/${pollId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ selectedOption })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to record vote');
      }
      
      setSuccessMessage('Vote recorded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh polls to show updated results
      await fetchPolls();
    } catch (err) {
      console.error('Error voting:', err);
      setError(err.message || 'Failed to record vote');
    } finally {
      setVotingLoading(prev => ({ ...prev, [pollId]: false }));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const getTotalVotes = (options) => {
    return options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  const getVotePercentage = (votes, total) => {
    return total > 0 ? ((votes / total) * 100).toFixed(1) : 0;
  };

  const filteredPolls = polls.filter(poll => {
    if (filter === 'active') return !isExpired(poll.expiresAt);
    if (filter === 'expired') return isExpired(poll.expiresAt);
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading polls...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-400">
      {/* Header */}
      <header className="bg-white shadow-sm border-b ">
        <div className="max-w-6xl mx-auto px-4 py-6 w-300">
          <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-3 w-300">
              <Vote className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Community Polls</h1>
            </div>
            <button
              onClick={fetchPolls}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'active', label: 'Active Polls', icon: TrendingUp },
              { key: 'all', label: 'All Polls', icon: Vote },
              { key: 'expired', label: 'Expired', icon: Clock }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Polls Grid */}
        {filteredPolls.length === 0 ? (
          <div className="text-center py-12">
            <Vote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls found</h3>
            <p className="text-gray-600">
              {filter === 'active' ? 'No active polls available at the moment.' : 'No polls match your current filter.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolls.map((poll) => {
              const totalVotes = getTotalVotes(poll.options);
              const expired = isExpired(poll.expiresAt);
              const isVoting = votingLoading[poll._id];

              return (
                <div key={poll._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Poll Header */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2">
                        {poll.question}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        expired 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {expired ? 'Expired' : 'Active'}
                      </span>
                    </div>

                    {/* Poll Stats */}
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{totalVotes} votes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Expires {formatDate(poll.expiresAt)}</span>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      {poll.options.map((option, index) => {
                        const percentage = getVotePercentage(option.votes, totalVotes);
                        
                        return (
                          <div key={index} className="relative">
                            <button
                              onClick={() => !expired && !isVoting && handleVote(poll._id, option.text)}
                              disabled={expired || isVoting}
                              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                expired 
                                  ? 'bg-gray-50 cursor-not-allowed' 
                                  : 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer'
                              } ${isVoting ? 'opacity-50' : ''}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900">{option.text}</span>
                                <span className="text-sm text-gray-600">{percentage}%</span>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              
                              <div className="mt-1 text-xs text-gray-500">
                                {option.votes} votes
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Voting Status */}
                    {isVoting && (
                      <div className="mt-4 flex items-center justify-center text-sm text-blue-600">
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        Recording your vote...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollDashboard;