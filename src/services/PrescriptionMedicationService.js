import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getPrescriptionMedication = async (userToken, prescriptionID) => {
  try {
    const response = await axios.get(
      `${apiUrl}prescription_medication/${prescriptionID}`,
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
      throw new Error("No prescription found.");
    } else if (error.response && error.response.status === 403) {
      throw new Error(
        "Cannot access prescriptions from patients not belonging to you."
      );
    } else {
      throw error;
    }
  }
};

export const createPrescriptionMedication = async (
  userToken,
  prescriptionID,
  medicationID,
  dose,
  frequency,
  measureID,
  instruction
) => {
  try {
    const response = await axios.post(
      `${apiUrl}prescription_medication/create`,
      {
        id_prescription: prescriptionID,
        id_medication: medicationID,
        dose: dose,
        frequency: frequency,
        id_measure: measureID,
        times_per_day: 0,
        instructions: instruction,
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
      throw new Error(
        "You cannot access this prescription or prescription does not exist."
      );
    } else if (error.response && error.response.status === 403) {
      if (
        errorDetail ===
        "This prescription is not active. Activate it first to create a medication."
      ) {
        throw new Error(
          "This prescription is not active. Activate it first to create a medication."
        );
      } else if (
        errorDetail ===
        "This medication already exists in one of the patient's prescriptions."
      ) {
        throw new Error(
          "This medication already exists in one of the patient's prescriptions."
        );
      }
    } else {
      throw error;
    }
  }
};

export const editPrescriptionMedication = async (
  userToken,
  prescriptionID,
  medicationID,
  dose,
  frequency,
  measureID,
  instruction
) => {
  try {
    const response = await axios.put(
      `${apiUrl}prescription_medication/update?id_medication=${medicationID}&id_prescription=${prescriptionID}`,
      {
        dose: dose,
        frequency: frequency,
        id_measure: measureID,
        instructions: instruction,
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
      if (
        errorDetail === "This medication does not exist in this prescription."
      ) {
        throw new Error("This medication does not exist in this prescription.");
      } else if (errorDetail === "Prescription medication not found") {
        throw new Error("Prescription medication not found");
      }
    } else if (error.response && error.response.status === 403) {
      if (
        errorDetail ===
        "You cannot access this prescription or prescription does not exist."
      ) {
        throw new Error(
          "You cannot access this prescription or prescription does not exist."
        );
      } else if (
        errorDetail ===
        "This prescription is not active. Activate it first to activate one of its medications."
      ) {
        throw new Error(
          "This prescription is not active. Activate it first to activate one of its medications."
        );
      }
    } else {
      throw error;
    }
  }
};

export const activatePrescriptionMedication = async (
  userToken,
  prescriptionID,
  medicationID
) => {
  try {
    const response = await axios.put(
      `${apiUrl}prescription_medication/update/active/${prescriptionID}/${medicationID}`,
      {}, // Pass an empty body for the PUT request
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
      if (
        errorDetail ===
        "This prescription is not active. Activate it first to updated one of its medications."
      ) {
        throw new Error(
          "This prescription is not active. Activate it first to updated one of its medications."
        );
      } else if (
        errorDetail ===
        "This medication is already active in one of the patient's prescriptions."
      ) {
        throw new Error(
          "This medication is already active in one of the patient's prescriptions."
        );
      }
    } else {
      throw error;
    }
  }
};

export const disablePrescriptionMedication = async (
  userToken,
  prescriptionID,
  medicationID
) => {
  try {
    const response = await axios.delete(
      `${apiUrl}prescription_medication/delete/${prescriptionID}/${medicationID}`,
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
    } else {
      throw error;
    }
  }
};
