import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getMedication = async (userToken) => {
  try {
    const response = await axios.get(`${apiUrl}medication/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No medication found.");
    } else {
      throw error;
    }
  }
};

export const getMedicationByID = async (userToken, medicationID) => {
  try {
    const response = await axios.get(`${apiUrl}medication/${medicationID}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No medication found.");
    } else {
      throw error;
    }
  }
};

export const addMedication = async (userToken, medication) => {
  try {
    const response = await axios.post(
      `${apiUrl}medication/create`,
      {
        name: medication,
      },
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
    } else {
      throw error;
    }
  }
};
