import axios from "../lib/axios";

// Create a new user
export const register = async (data) => {
  try {
    const response = await axios.post(`/user/register`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
};
// API function to get all users (only uid and name)
export const getUsers = async () => {
  try {
    const response = await axios.get("/user/all"); // Adjust the endpoint as needed
    return response.data; // Assume API returns an array of users with uid and name
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
// API function to get all users (only uid and name)
export const updateUser = async (uid, data) => {
  try {
    const response = await axios.put(`/user/${uid}`, data); // ปรับ endpoint ตามที่จำเป็น
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
