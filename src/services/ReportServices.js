import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getPatientTaskCompletion = async (
  userToken,
  patientID,
  startDate,
  endDate
) => {
  try {
    const response = await axios.get(
      `${apiUrl}task/reports/tasks/${patientID}/${startDate}/${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("This patient does not exist or does not belong to you.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No tasks found for the given criteria.");
    } else {
      throw error;
    }
  }
};

export const getPatientFlashcardProgresion = async (
  userToken,
  patientID,
) => {
  try {
    const response = await axios.get(
      `${apiUrl}flashcards/reports/flashcards/${patientID}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("This patient does not exist or does not belong to you.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No flashcards found for the given criteria.");
    } else {
      throw error;
    }
  }
};