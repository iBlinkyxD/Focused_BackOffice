import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getPrescriptionByPatient = async (userToken, patientID) => {
  try {
    const response = await axios.get(
      `${apiUrl}prescription/patient/${patientID}`,
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
      throw new Error("No patient found.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("You are not this patient's psychaitrist.");
    } else {
      throw error;
    }
  }
};

export const createPrescription = async (
  userToken,
  patientID,
  professionalID,
  notes
) => {
  try {
    const response = await axios.post(
      `${apiUrl}prescription/create`,
      {
        id_patient: patientID,
        id_psychiatrist: professionalID,
        notes: notes,
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
      throw new Error("You cannot create a prescription with another patient.");
    } else {
      throw error;
    }
  }
};

export const editPrescription = async (userToken, prescriptionID, notes) => {
  try {
    const response = await axios.put(
      `${apiUrl}prescription/update?id_prescription=${prescriptionID}`,
      {
        notes: notes,
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
      throw new Error("Prescription not found.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("You cannot update this prescription.");
    } else {
      throw error;
    }
  }
};

export const activatePrescription = async (userToken, prescriptionID) => {
  try {
    const response = await axios.put(
      `${apiUrl}prescription/update/active/${prescriptionID}`,
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
    } else if (error.response && error.response.status === 404) {
      if (
        errorDetail ===
        "You cannot access this prescription or prescription does not exist."
      ) {
        throw new Error(
          "You cannot access this prescription or prescription does not exist."
        );
      } else if (
        errorDetail === "This medication does not exist in this prescription."
      ) {
        throw new Error("This medication does not exist in this prescription.");
      }
    } else if (error.response && error.response.status === 403) {
      throw new Error("This prescription is already active.");
    } else {
      throw error;
    }
  }
};

export const disablePrescription = async (userToken, prescriptionID) => {
  try {
    const response = await axios.delete(
      `${apiUrl}prescription/delete/${prescriptionID}`,
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
      throw new Error("This prescription does not exist.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("You cannot delete this prescription.");
    } else {
      throw error;
    }
  }
};
