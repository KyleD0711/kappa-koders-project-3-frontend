import apiClient from "/src/services/services.js";

export default {
  // Get a user's profile by userId
  async getUserProfile(userId) {
    try {
      const response = await apiClient.get(`/userProfile/${userId}`);
      return response.data;
    } catch (error) {
      // If the profile is not found, return null instead of throwing an error
      if (error.response && error.response.status === 404) {
        console.log(`User profile not found for userId: ${userId}`);
        return null; // Return null to indicate no profile found
      }
      // For other errors, rethrow them
      throw error;
    }
  },

  // Create a user's profile
  async createUserProfile(profileData) {
    try {
      const response = await apiClient.post(`/userProfile`, profileData);
      return response.data; // Return the created profile data
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error; // Rethrow the error for further handling
    }
  },

  // Update a user's profile
  updateUserProfile(userId, item) {
    return apiClient.put(`/userProfile/${userId}`, item);
  },

  // Delete a user's profile
  deleteUserProfile(userId) {
    return apiClient.delete(`/userProfile/${userId}`);
  },
};