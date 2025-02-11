import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getOffice = async (userToken) => {
  try {
    const response = await axios.get(`${apiUrl}office/me/active`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No office found.");
    } else {
      throw error;
    }
  }
};

export const createOffice = async (userToken, name, city, sector, address) => {
  try {
    const response = await axios.post(
      `${apiUrl}office/create`,
      {
        name: name,
        city: city,
        sector: sector,
        address: address,
        active: true,
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

export const updateOffice = async (
  userToken,
  officeID,
  name,
  city,
  sector,
  address
) => {
  try {
    const response = await axios.put(
      `${apiUrl}office/update?id_office=${officeID}`,
      {
        name: name,
        city: city,
        sector: sector,
        address: address,
        active: true,
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
    } else if (error.response && error.response.status === 404) {
      throw new Error("Office not found.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("You do not have permission to update this office.");
    } else {
      throw error;
    }
  }
};
