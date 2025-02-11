import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getPatientMedication = async (
  userToken,
  patientID,
  startDate,
  endDate
) => {
  try {
    const response = await axios.get(
      `${apiUrl}medlog/reports/medication/${patientID}/${startDate}/${endDate}`,
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
      throw new Error("No medication found.");
    } else {
      throw error;
    }
  }
};
