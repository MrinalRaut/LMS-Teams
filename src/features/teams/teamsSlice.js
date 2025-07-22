// Filename: src/features/teams/teamsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance'; // Correct path to the custom axios instance

const API_BASE_URL = '/teams';

const initialState = {
  teams: [],
  isLoading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_BASE_URL);
      return response.data.teams;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch teams.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}.`);
      }
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamName, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_BASE_URL, { name: teamName });
      return response.data.team;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to create team.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}.`);
      }
    }
  }
);

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ teamId, teamName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/${teamId}`, { name: teamName });
      return response.data.team;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update team.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}.`);
      }
    }
  }
);

export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (teamId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/${teamId}`);
      return teamId;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to delete team.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}.`);
      }
    }
  }
);

export const addMemberToTeam = createAsyncThunk(
  'teams/addMemberToTeam',
  async ({ teamId, memberEmail }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/${teamId}/members`, { email: memberEmail });
      return { teamId, member: response.data.member };
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to add member to team.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}.`);
      }
    }
  }
);

export const removeMemberFromTeam = createAsyncThunk(
  'teams/removeMemberFromTeam',
  async ({ teamId, userId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/${teamId}/members/${userId}`);
      return { teamId, userId };
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to remove member from team.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}.`);
      }
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  'teams/updateMemberRole',
  async ({ teamId, userId, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/members/role`, { teamId, userId, role });
      return { teamId, updatedMember: response.data.member };
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to update member role.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}.`);
      }
    }
  }
);


const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearTeamsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.teams.findIndex(team => team._id === action.payload._id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = state.teams.filter(team => team._id !== action.payload);
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addMemberToTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMemberToTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        const { teamId, member } = action.payload;
        const teamIndex = state.teams.findIndex(team => team._id === teamId);
        if (teamIndex !== -1) {
          if (!state.teams[teamIndex].members) {
            state.teams[teamIndex].members = [];
          }
          state.teams[teamIndex].members.push(member);
        }
      })
      .addCase(addMemberToTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(removeMemberFromTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeMemberFromTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        const { teamId, userId } = action.payload;
        const teamIndex = state.teams.findIndex(team => team._id === teamId);
        if (teamIndex !== -1 && state.teams[teamIndex].members) {
          state.teams[teamIndex].members = state.teams[teamIndex].members.filter(
            member => (member.userId || member.email) !== userId
          );
        }
      })
      .addCase(removeMemberFromTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateMemberRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const { teamId, updatedMember } = action.payload;
        const teamIndex = state.teams.findIndex(team => team._id === teamId);
        if (teamIndex !== -1 && state.teams[teamIndex].members) {
          const memberIndex = state.teams[teamIndex].members.findIndex(
            member => (member.userId || member.email) === (updatedMember.userId || updatedMember.email)
          );
          if (memberIndex !== -1) {
            state.teams[teamIndex].members[memberIndex] = updatedMember;
          }
        }
      })
      .addCase(updateMemberRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTeamsError } = teamsSlice.actions;

export default teamsSlice.reducer;
