// Filename: src/components/teams/TeamsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  updateMemberRole,
  clearTeamsError,
} from '../../features/teams/teamsSlice';
import toast from 'react-hot-toast';

const TeamsPage = () => {
  const dispatch = useDispatch();
  const { teams, isLoading, error } = useSelector((state) => state.teams);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamName, setTeamName] = useState('');

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedTeamForMembers, setSelectedTeamForMembers] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('');

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('alert');
  const [messageCallback, setMessageCallback] = useState(null);

  const showMessageBox = (msg, type = 'alert', callback = null) => {
    setMessage(msg);
    setMessageType(type);
    setMessageCallback(() => callback);
  };

  const closeMessageBox = () => {
    setMessage(null);
    setMessageType('alert');
    setMessageCallback(null);
  };

  const handleMessageConfirm = () => {
    if (messageCallback) {
      messageCallback();
    }
    closeMessageBox();
  };

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearTeamsError());
    }
  }, [error, dispatch]);

  const handleCreateTeamClick = () => {
    setEditingTeam(null);
    setTeamName('');
    setIsTeamModalOpen(true);
  };

  const handleEditTeamClick = (team) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setIsTeamModalOpen(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    let resultAction;

    if (editingTeam) {
      resultAction = await dispatch(updateTeam({ teamId: editingTeam._id, teamName }));
      if (updateTeam.fulfilled.match(resultAction)) {
        toast.success('Team updated successfully!');
        setIsTeamModalOpen(false);
      }
    } else {
      resultAction = await dispatch(createTeam(teamName));
      if (createTeam.fulfilled.match(resultAction)) {
        toast.success('Team created successfully!');
        setIsTeamModalOpen(false);
      }
    }
  };

  const handleDeleteTeam = (teamId) => {
    showMessageBox(
      "Are you sure you want to delete this team? This action cannot be undone.",
      'confirm',
      async () => {
        const resultAction = await dispatch(deleteTeam(teamId));
        if (deleteTeam.fulfilled.match(resultAction)) {
          toast.success('Team deleted successfully!');
        }
      }
    );
  };

  const handleManageMembersClick = (team) => {
    setSelectedTeamForMembers(team);
    setNewMemberEmail('');
    setMemberRole('');
    setIsMemberModalOpen(true);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(addMemberToTeam({ teamId: selectedTeamForMembers._id, memberEmail: newMemberEmail }));
    if (addMemberToTeam.fulfilled.match(resultAction)) {
      toast.success('Member added successfully!');
      setNewMemberEmail(''); // Clear input after adding
      // Re-fetch teams to get updated member list for the specific team
      dispatch(fetchTeams());
    }
  };

  const handleRemoveMember = (teamId, userId) => {
    showMessageBox(
      "Are you sure you want to remove this member from the team?",
      'confirm',
      async () => {
        const resultAction = await dispatch(removeMemberFromTeam({ teamId, userId }));
        if (removeMemberFromTeam.fulfilled.match(resultAction)) {
          toast.success('Member removed successfully!');
          // Re-fetch teams to get updated member list for the specific team
          dispatch(fetchTeams());
        }
      }
    );
  };

  const handleUpdateMemberRole = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(updateMemberRole({ teamId: selectedTeamForMembers._id, userId: newMemberEmail, role: memberRole }));
    if (updateMemberRole.fulfilled.match(resultAction)) {
      toast.success('Member role updated successfully!');
      setNewMemberEmail('');
      setMemberRole('');
      // Re-fetch teams to get updated member list for the specific team
      dispatch(fetchTeams());
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg max-w-4xl w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Team Management</h1>

      {isLoading && (
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3 text-gray-700">Loading...</p>
        </div>
      )}

      <div className="mb-6 text-right">
        <button
          onClick={handleCreateTeamClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Create New Team
        </button>
      </div>

      <div className="space-y-4">
        {teams.length === 0 && !isLoading && !error && (
          <p className="text-center text-gray-600">No teams found. Create one!</p>
        )}
        {teams.map((team) => (
          <div key={team._id} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-3 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
              <p className="text-sm text-gray-600">ID: {team._id}</p>
              {team.members && team.members.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-md font-medium text-gray-700">Members:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {team.members.map((member, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{member.email || member.userId} (Role: {member.role || 'N/A'})</span>
                        <button
                          onClick={() => handleRemoveMember(team._id, member.userId || member.email)}
                          className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
                          title="Remove Member"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleEditTeamClick(team)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
              >
                Edit Team
              </button>
              <button
                onClick={() => handleManageMembersClick(team)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              >
                Manage Members
              </button>
              <button
                onClick={() => handleDeleteTeam(team._id)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
              >
                Delete Team
              </button>
            </div>
          </div>
        ))}
      </div>

      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingTeam ? 'Edit Team' : 'Create New Team'}
            </h2>
            <form onSubmit={handleTeamSubmit}>
              <div className="mb-4">
                <label htmlFor="teamName" className="block text-gray-700 text-sm font-bold mb-2">
                  Team Name:
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {editingTeam ? 'Update Team' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMemberModalOpen && selectedTeamForMembers && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Manage Members for "{selectedTeamForMembers.name}"
            </h2>

            <form onSubmit={handleAddMember} className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Add New Member</h3>
              <div className="mb-4">
                <label htmlFor="newMemberEmail" className="block text-gray-700 text-sm font-bold mb-2">
                  Member Email/ID:
                </label>
                <input
                  type="text"
                  id="newMemberEmail"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., user@example.com or userId123"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Add Member
                </button>
              </div>
            </form>

            <form onSubmit={handleUpdateMemberRole} className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Update Member Role</h3>
              <div className="mb-4">
                <label htmlFor="memberIdForRole" className="block text-gray-700 text-sm font-bold mb-2">
                  Member Email/ID (to update role):
                </label>
                <input
                  type="text"
                  id="memberIdForRole"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter existing member's email/ID"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="memberRole" className="block text-sm font-medium text-gray-700 mb-1">
                  New Role:
                </label>
                <input
                  type="text"
                  id="memberRole"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="e.g., Admin, Member, Viewer"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Update Role
                </button>
              </div>
            </form>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Existing Members</h3>
              {selectedTeamForMembers.members && selectedTeamForMembers.members.length > 0 ? (
                <ul className="space-y-2">
                  {selectedTeamForMembers.members.map((member, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                      <span className="text-gray-800">{member.email || member.userId} (Role: {member.role || 'N/A'})</span>
                      <button
                        onClick={() => handleRemoveMember(selectedTeamForMembers._id, member.userId || member.email)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-lg shadow-sm transition duration-300 ease-in-out"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">No members in this team yet.</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setIsMemberModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <p className="text-lg font-medium text-gray-800 mb-6">{message}</p>
            <div className="flex justify-center gap-4">
              {messageType === 'confirm' && (
                <button
                  onClick={closeMessageBox}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleMessageConfirm}
                className={`font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out ${
                  messageType === 'alert' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {messageType === 'alert' ? 'OK' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
