import axios from "../lib/axios";

// Get all daily reports
export const getDailyReports = async () => {
  try {
    const response = await axios.get(`/daily-reports`);
    return response.data;
  } catch (error) {
    console.error("Error fetching daily reports:", error);
    throw error;
  }
};

// Get a single daily report by ID
export const getDailyReportById = async (id) => {
  try {
    const response = await axios.get(`/daily-reports/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching daily report:", error);
    throw error;
  }
};

// Create a new daily report
export const createDailyReport = async (data) => {
  try {
    const response = await axios.post(`/daily-reports`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating daily report:", error);
    throw error;
  }
};

// Update an existing daily report
export const updateDailyReport = async (id, data) => {
  try {
    const response = await axios.put(`/daily-reports/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating daily report:", error);
    throw error;
  }
};

// Delete a daily report
export const deleteDailyReport = async (id) => {
  try {
    const response = await axios.delete(`/daily-reports/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting daily report:", error);
    throw error;
  }
};
