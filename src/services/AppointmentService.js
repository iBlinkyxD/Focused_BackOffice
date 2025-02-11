import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getAppointment = async (userToken) => {
  try {
    const response = await axios.get(`${apiUrl}appointment/professional/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No appointments found.");
    } else {
      throw error;
    }
  }
};

export const createAppointment = async (
  userToken,
  patientID,
  date,
  startTime,
  endTime
) => {
  try {
    const response = await axios.post(
      `${apiUrl}appointment/create`,
      {
        id_patient: patientID,
        appointment_date: date,
        start_time: startTime,
        end_time: endTime,
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
        "You are not authorized to create an appointment for this patient."
      );
    } else if (error.response && error.response.status === 500){
      throw new Error("There's already an appointment for this day and time.");
    } else {
      throw error;
    }
  }
};

export const editAppointment = async (
  userToken,
  appointmentID,
  patientID,
  date,
  startTime,
  endTime
) => {
  try {
    const response = await axios.put(
      `${apiUrl}appointment/update?appointment_id=${appointmentID}`,
      {
        id_patient: patientID,
        appointment_date: date,
        start_time: startTime,
        end_time: endTime,
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
      throw new Error("Appointment not found.");
    } else if (error.response && error.response.status === 403) {
      if (
        errorDetail === "You are not authorized to update this appointment."
      ) {
        throw new Error("You are not authorized to update this appointment.");
      } else if (
        errorDetail ===
        "You are not authorized to assign this appointment to the specified patient."
      ) {
        throw new Error(
          "You are not authorized to assign this appointment to the specified patient."
        );
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
};

export const deleteAppointment = async (userToken, appointmentID) => {
  try {
    const response = await axios.delete(
      `${apiUrl}appointment/delete/${appointmentID}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Error deleting appointment");
    } else if (error.response && error.response.status === 404){
      throw new Error("Appointment not found.");
    } else if (error.response && error.response.status === 403){
      throw new Error("You are not authorized to delete this appointment.");
    } else {
      throw error;
    }
  }
};
