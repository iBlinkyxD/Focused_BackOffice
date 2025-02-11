import axios, { all } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getPatientByID = async (userToken, patientID) => {
  try {
    const response = await axios.get(`${apiUrl}patient/${patientID}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No patient found.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("You cannot access this patient.");
    } else {
      throw error;
    }
  }
};

export const getPatientProfessional = async (userToken, patientID) => {
  try {
    const response = await axios.get(
      `${apiUrl}professional/other_professional/${patientID}`,
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
      throw new Error("This patient does not belong to you.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No professional found.");
    } else {
      throw error;
    }
  }
};

export const editPatientAllergie = async (userToken, patientID, allergie) => {
  try {
    const response = await axios.put(
      `${apiUrl}patient/edit-allergies/${patientID}`,
      {
        allergies: allergie,
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
    } else if (error.response && error.response.status === 403) {
      throw new Error(
        "You are not authorized to edit this patient's allergies."
      );
    } else {
      throw error;
    }
  }
};

export const editPatientCondition = async (userToken, patientID, condition) => {
  try {
    const response = await axios.put(
      `${apiUrl}patient/edit-condition/${patientID}`,
      {
        condition: condition,
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
    } else if (error.response && error.response.status === 403) {
      throw new Error(
        "You are not authorized to edit this patient's conditions."
      );
    } else {
      throw error;
    }
  }
};

export const unlinkProfessional = async (userToken, userID, choice) => {
  try {
    const response = await axios.post(
      `${apiUrl}patient/unlink-professional/${userID}/${choice}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorDetail = error.response.data.detail;
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 400) {
      throw new Error(
        "Invalid choice value."
      );
    } else if (error.response && error.response.status === 404) {
      if(errorDetail === "This user is not a patient"){
        throw new Error("This user is not a patient");
      }else if(errorDetail === "No psychiatrist related to this patient."){
        throw new Error("No psychiatrist related to this patient.");
      }else if(errorDetail === "No psychologist related to this patient."){
        throw new Error("No psychologist related to this patient.");
      }
    } else{
      throw error;
    }
  }
};
