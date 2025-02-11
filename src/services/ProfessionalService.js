import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getProfessionalMe = async (userToken) => {
  try {
    const response = await axios.get(`${apiUrl}professional/me/info`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("Professional not found.");
    } else {
      throw error;
    }
  }
};

export const updateProfessional = async (
  userToken,
  name,
  lastname,
  birthdate,
  phone,
  document_type,
  document,
  exequatur,
  sex,
  image
) => {
  try {
    const response = await axios.put(
      `${apiUrl}professional/update`,
      {
        name: name,
        lastname: lastname,
        birthdate: birthdate,
        phone: phone,
        document_type: document_type,
        document: document,
        exequatur: exequatur,
        sex: sex,
        image: image,
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
      throw new Error("Professioal not found.");
    } else {
      throw error;
    }
  }
};

export const getProfessionalPatient = async (userToken) => {
  try {
    const response = await axios.get(`${apiUrl}professional/me/mypatients`, {
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
    } else {
      throw error;
    }
  }
};

export const addProfessionalPatient = async (userToken, email) => {
  try {
    const response = await axios.put(
      `${apiUrl}professional/new_patient`,
      {
        email: email,
      },
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
    } else if (error.response && error.response.status === 404) {
      if (errorDetail === "No user with this email found.") {
        throw new Error("No user with this email found.");
      } else if (errorDetail === "This user is not a patient.") {
        throw new Error("This user is not a patient.");
      }
    } else if (error.response && error.response.status === 403) {
      if (errorDetail === "This already has a psychologist.") {
        throw new Error("This patient already has a psychologist.");
      } else if (errorDetail === "This already has a psychiatrist.") {
        throw new Error("This patient already has a psychiatrist.");
      }
    } else {
      throw error;
    }
  }
};
