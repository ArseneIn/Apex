import api from './axios';

// Auth
export const loginUser = (credentials) => api.post('/auth/token/', credentials).then(r => r.data);
export const registerUser = (data) => api.post('/auth/register/', data).then(r => r.data);
export const refreshToken = (refresh) => api.post('/auth/token/refresh/', { refresh }).then(r => r.data);
export const getCurrentUser = () => api.get('/auth/users/me/').then(r => r.data);

// Tasks
export const getTasks = (params) => api.get('/tasks/', { params }).then(r => r.data);
export const getTask = (id) => api.get(`/tasks/${id}/`).then(r => r.data);
export const createTask = (data) => api.post('/tasks/', data).then(r => r.data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}/`, data).then(r => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}/`).then(r => r.data);
export const moveTask = (id, status) => api.patch(`/tasks/${id}/`, { status }).then(r => r.data);

// Boards / Workspaces
export const getBoards = () => api.get('/boards/').then(r => r.data);
export const getBoard = (id) => api.get(`/boards/${id}/`).then(r => r.data);
export const createBoard = (data) => api.post('/boards/', data).then(r => r.data);
export const updateBoard = (id, data) => api.patch(`/boards/${id}/`, data).then(r => r.data);

// Workspaces
export const getWorkspaces = () => api.get('/workspaces/').then(r => r.data);
export const getWorkspace = (id) => api.get(`/workspaces/${id}/`).then(r => r.data);
export const createWorkspace = (data) => api.post('/workspaces/', data).then(r => r.data);
export const updateWorkspace = (id, data) => api.patch(`/workspaces/${id}/`, data).then(r => r.data);
export const getWorkspaceMembers = (id) => api.get(`/workspaces/${id}/members/`).then(r => r.data);
export const inviteMember = (id, email) => api.post(`/workspaces/${id}/invite/`, { email }).then(r => r.data);
export const removeMember = (workspaceId, userId) =>
  api.delete(`/workspaces/${workspaceId}/members/${userId}/`).then(r => r.data);

// Dashboard stats
export const getDashboardStats = () => api.get('/dashboard/stats/').then(r => r.data);
export const getRecentActivity = () => api.get('/dashboard/activity/').then(r => r.data);

// User profile
export const updateProfile = (data) => api.patch('/auth/users/me/', data).then(r => r.data);
export const changePassword = (data) => api.post('/auth/users/set_password/', data).then(r => r.data);
