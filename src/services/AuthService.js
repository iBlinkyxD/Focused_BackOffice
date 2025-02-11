import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const signUp = async (
  firstName,
  email,
  password,
  role,
  lastName,
  birthdate,
  phone,
  documentType,
  document,
  exequatur,
  sex
) => {
  try {
    const response = await axios.post(`${apiUrl}usuarios/create`, {
      usuario: {
        nombre: email,
        email: email,
        password: password,
        id_rol: role,
      },
      professional: {
        name: firstName,
        lastname: lastName,
        birthdate: birthdate,
        phone: phone,
        document_type: documentType,
        document: document,
        exequatur: exequatur,
        sex: sex,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logIn = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post(`${apiUrl}usuarios/token/`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    if (error.reponse && error.response.status === 401) {
      throw new Error("Incorrect username or password");
    } else{
      throw error;
    }
  }
};
