import axios from "../lib/axios";

// Get all issues
export const getIssues = async () => {
  try {
    const response = await axios.get(`/issues`);
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

// Get a single issue by ID
export const getIssueById = async (id) => {
  try {
    const response = await axios.get(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching issue:", error);
    throw error;
  }
};

// Create a new issue
export const createIssue = async (data) => {
  try {
    const response = await axios.post(`/issues`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

// Update an existing issue
export const updateIssue = async (id, data) => {
  try {
    const response = await axios.put(`/issues/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  }
};

// Delete an issue
export const deleteIssue = async (id) => {
  try {
    const response = await axios.delete(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting issue:", error);
    throw error;
  }
};
