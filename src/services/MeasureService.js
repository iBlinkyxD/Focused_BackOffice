import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getMeasure = async (userToken) => {
  try {
    const response = await axios.get(`${apiUrl}measure/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No measurement found.");
    } else {
      throw error;
    }
  }
};

export const getMeasureByID = async (userToken, measureID) => {
  try {
    const response = await axios.get(`${apiUrl}measure/${measureID}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No measurement found.");
    } else {
      throw error;
    }
  }
};

export const addMeasure = async (userToken, measure) => {
  try {
    const response = await axios.post(
      `${apiUrl}measure/create`,
      {
        name: measure,
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
