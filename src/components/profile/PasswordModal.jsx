import { useContext, useState } from "react";
import * as yup from "yup";
import Styles from "./PasswordModal.module.css";
import { IconX, IconEye, IconEyeOff } from "@tabler/icons-react";
import AuthContext from "../../context/AuthProvider";
import { changeUserPassword } from "../../services/UserService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function PasswordModal({ modal, toggleModal }) {
  const { sessionToken } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("")
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    oldPassword: yup
      .string()
      .min(8, t("validation.passwordMin"))
      .matches(/[a-z]/, t("validation.passwordLowercase"))
      .matches(/[A-Z]/, t("validation.passwordUppercase"))
      .matches(/\d/, t("validation.passwordNum"))
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        t("validation.passwordChar")
      )
      .required(t("validation.oldPassword")),
    newPassword: yup
      .string()
      .min(8, t("validation.passwordMin"))
      .matches(/[a-z]/, t("validation.passwordLowercase"))
      .matches(/[A-Z]/, t("validation.passwordUppercase"))
      .matches(/\d/, t("validation.passwordNum"))
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        t("validation.passwordChar")
      )
      .required(t("validation.newPassword")),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], t("validation.passwordMatch"))
      .required(t("validation.passwordConfirm")),
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const toggleOldPasswordVisibility = () =>
    setShowOldPassword(!showOldPassword);

  const validateForm = async () => {
    try {
      await validationSchema.validate(
        { oldPassword, newPassword, confirmNewPassword },
        { abortEarly: false }
      );
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        return false;
      }
    }
  };

  const handleFormChange = async (field, value) => {
    const newValue = value;

    if (field === "oldPassword") {
      setOldPassword(newValue);
    } else if (field === "newPassword") {
      setNewPassword(newValue);
    } else if (field === "confirmNewPassword") {
      setConfirmNewPassword(newValue);
    }

    try {
      await validationSchema.validateAt(field, {
        oldPassword,
        newPassword,
        confirmNewPassword,
        [field]: newValue,
      });
      setErrors((prev) => ({ ...prev, [field]: null }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error.message,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;
    try {
      await changeUserPassword(sessionToken, oldPassword, newPassword);
      handleToggleModal();
      toast.success(t("validation.passwordUpdated"));
    } catch (error) {
      console.log(error.message);
      if(error.message === "The old password does not match with the current password.") {
        setError(`${error.message}`);
      }else if(error.message === "You are entering the same password."){
        setError(`${error.message}`);
      }else {
        setError(t("validation.error"));
      }
    }
  };

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setErrors({});
    setError("");
  };

  const handleToggleModal = () => {
    toggleModal();
    resetForm(""); // Close modal
  };

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div className={Styles.modal_header}>
              <h1 className={Styles.title}>{t("HTML.changePassword")}</h1>
              <IconX
                className={Styles.close_icon}
                onClick={handleToggleModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              {error && (
                <div className={Styles.error_container}>
                  <p className={Styles.error_message2}>{error}</p>
                </div>
              )}{" "}
              <div className={Styles.input_group}>
                <label htmlFor="oldPassword">
                  {t("HTML.oldPassword")}{" "}
                  {errors.oldPassword && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <div className={Styles.password_container}>
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    className={errors.oldPassword ? Styles.error_input : ""}
                    onChange={(e) =>
                      handleFormChange("oldPassword", e.target.value)
                    }
                  />
                  <span
                    onClick={toggleOldPasswordVisibility}
                    role="button"
                    aria-label="Toggle password visibility"
                    className={Styles.toggle_icon}
                  >
                    {showOldPassword ? (
                      <IconEyeOff size={16} />
                    ) : (
                      <IconEye size={16} />
                    )}
                  </span>
                </div>
                {errors.oldPassword && (
                  <p className={Styles.error_message}>{errors.oldPassword}</p>
                )}
              </div>
              <div className={Styles.input_group}>
                <label htmlFor="newPassword">
                  {t("HTML.newPassword")}{" "}
                  {errors.newPassword && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <div className={Styles.password_container}>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    className={errors.newPassword ? Styles.error_input : ""}
                    onChange={(e) =>
                      handleFormChange("newPassword", e.target.value)
                    }
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    role="button"
                    aria-label="Toggle password visibility"
                    className={Styles.toggle_icon}
                  >
                    {showPassword ? (
                      <IconEyeOff size={16} />
                    ) : (
                      <IconEye size={16} />
                    )}
                  </span>
                </div>
                {errors.newPassword && (
                  <p className={Styles.error_message}>{errors.newPassword}</p>
                )}
              </div>
              <div className={Styles.input_group}>
                <label htmlFor="confirmNewPassword">
                  {t("HTML.confirmPassword")}{" "}
                  {errors.confirmNewPassword && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <div className={Styles.password_container}>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={
                      errors.confirmNewPassword ? Styles.error_input : ""
                    }
                    onChange={(e) =>
                      handleFormChange("confirmNewPassword", e.target.value)
                    }
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    role="button"
                    aria-label="Toggle password visibility"
                    className={Styles.toggle_icon}
                  >
                    {showConfirmPassword ? (
                      <IconEyeOff size={16} />
                    ) : (
                      <IconEye size={16} />
                    )}
                  </span>
                </div>
                {errors.confirmNewPassword && (
                  <p className={Styles.error_message}>
                    {errors.confirmNewPassword}
                  </p>
                )}
              </div>
              <button type="submit" className={Styles.create_btn}>
              {t("HTML.changePassword")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}