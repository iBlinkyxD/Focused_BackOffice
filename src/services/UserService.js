import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getAllUser = async (userToken) => {
  try {
    const response = await axios.get(`${apiUrl}usuarios/users`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("You cannot access this functionality.");
    } else if (error.response && error.response.status === 404) {
      throw new Error("No user found");
    } else {
      throw error;
    }
  }
};

export const getUserID = async (userToken) => {
  try {
    const response = await axios.get(`${apiUrl}usuarios/me/`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateToken = async (userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}usuarios/validate_token/${userToken}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("User not found.");
    } else {
      throw error;
    }
  }
};

export const changeUserPassword = async (
  userToken,
  oldPassword,
  newPassword
) => {
  try {
    const response = await axios.put(
      `${apiUrl}usuarios/change_password`,
      {
        old_password: oldPassword,
        password: newPassword,
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
    if (error.response && error.response.status === 400) {
      if (
        errorDetail ===
        "The old password does not match with the current password."
      ) {
        throw new Error(
          "The old password does not match with the current password."
        );
      } else if (errorDetail === "You are entering the same password.") {
        throw new Error("You are entering the same password.");
      }
    } else {
      throw error;
    }
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.put(`${apiUrl}usuarios/forgot_password/`, {
      email: email,
    });
    response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("No user with this email found.");
    } else {
      throw error;
    }
  }
};

export const newUserPassword = async (userToken, password, confirmPassword) => {
  try {
    const response = await axios.post(
      `${apiUrl}usuarios/new_password/${userToken}`,
      {
        password: password,
        confirm_password: confirmPassword,
      }
    );
    return response.data;
  } catch (error) {
    const errorDetail = error.response.data.detail;
    if (error.response && error.response.status === 400) {
      if (errorDetail === "Invalid token payload") {
        throw new Error("Invalid token payload.");
      } else if (errorDetail === "The passwords must match.") {
        throw new Error("The passwords must match.");
      }
    } else {
      throw error;
    }
  }
};

export const deactivateUser = async (userToken, userID) => {
  console.log(userToken);
  try {
    const response = await axios.put(
      `${apiUrl}usuarios/deactivate/${userID}`,
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
      if (errorDetail === "You cannot deactive your own user.") {
        throw new Error("You cannot deactive your own user.");
      } else if (errorDetail === "User not found") {
        throw new Error("User not found");
      }
    } else if (error.response && error.response.status === 403) {
      throw new Error("User is already deactivated.");
    } else {
      throw error;
    }
  }
};

export const activateUser = async (userToken, userID) => {
  try {
    const response = await axios.put(
      `${apiUrl}usuarios/activate/${userID}`,
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
      if (errorDetail === "You cannot activate your own user.") {
        throw new Error("You cannot activate your own user.");
      } else if (errorDetail === "User not found") {
        throw new Error("User not found");
      }
    } else if (error.response && error.response.status === 403) {
      throw new Error("User is already activated.");
    } else {
      throw error;
    }
  }
};

export const resendVerification = async (email) => {
  try {
    const response = await axios.post(`${apiUrl}usuarios/verification_mail/`, {
      email: email,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("No user with this email found.");
    } else if (error.response && error.response.status === 403) {
      throw new Error("This user is already verified.");
    } else {
      throw error;
    }
  }
};
