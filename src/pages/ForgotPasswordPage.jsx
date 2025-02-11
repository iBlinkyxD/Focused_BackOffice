import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Styles from "./ForgotPasswordPage.module.css";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import SuccessfulModal from "../components/forgot/SuccessfulModal";
import { validateToken, newUserPassword } from "../services/UserService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  useEffect(() => {
    document.body.classList.add(Styles.forgot_background);
    return () => {
      document.body.classList.remove(Styles.forgot_background);
    };
  }, []);
  const navigate = useNavigate();
  const { userToken } = useParams();
  const [modal, setModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, `${t("forgot.password_error_message")}`)
      .matches(/[a-z]/, `${t("forgot.password_lowercase")}`)
      .matches(/[A-Z]/, `${t("forgot.password_uppercase")}`)
      .matches(/\d/, `${t("forgot.password_number")}`)
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        `${t("forgot.password_special_character")}`
      )
      .required(`${t("forgot.password_required")}`),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), null],
        `${t("forgot.confirm_password_match")}`
      )
      .required(`${t("forgot.confirm_password_required")}`),
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    const validateUserToken = async () => {
      try {
        await validateToken(userToken);
      } catch (error) {
        console.error(error.message);
        navigate("/");
      }
    };

    validateUserToken();
  }, [userToken, navigate]);

  const validateForm = async () => {
    try {
      await validationSchema.validate(
        { password, confirmPassword },
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

    if (field === "password") {
      setPassword(newValue);
    } else if (field === "confirmPassword") {
      setConfirmPassword(newValue);
    }

    try {
      await validationSchema.validateAt(field, {
        password,
        confirmPassword,
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
      await newUserPassword(userToken, password, confirmPassword);
      handleContinue();
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  // Handle Continue button submission (show OTP modal)
  const handleContinue = () => {
    toggleModal();
    resetForm("");
  };

  return (
    <div className={Styles.forgot_page_container}>
      <div className={Styles.forgot_container}>
        <div className={Styles.forgot_left}>
          <center>
            <div className={Styles.resp_logo} />
          </center>
          <h1>
            {t("forgot.forgot_text")} <br /> {t("forgot.password")}
          </h1>
          <form onSubmit={handleSubmit} className={Styles.form_container}>
            {/* Conditionally render the email field and Continue button only if showPasswordFields is false */}
            <div className={Styles.input_group}>
              <label htmlFor="password">
              {t("forgot.password_label")}{" "}
                {errors.password && (
                  <label className={errors.password ? Styles.error_label : ""}>
                    *
                  </label>
                )}
              </label>
              <div className={Styles.password_container}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={errors.password ? Styles.error_input : ""}
                  autoComplete="off"
                  onChange={(e) => handleFormChange("password", e.target.value)}
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
              {errors.password && (
                <p className={Styles.error_message}>{errors.password}</p>
              )}
            </div>
            <div className={Styles.input_group}>
              <label htmlFor="confirmPassword">
              {t("forgot.confirm_password_label")}{" "}
                {errors.confirmPassword && (
                  <label
                    className={errors.confirmPassword ? Styles.error_label : ""}
                  >
                    *
                  </label>
                )}
              </label>
              <div className={Styles.password_container}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="off"
                  className={errors.confirmPassword ? Styles.error_input : ""}
                  onChange={(e) =>
                    handleFormChange("confirmPassword", e.target.value)
                  }
                />
                <span
                  onClick={toggleConfirmPasswordVisibility}
                  role="button"
                  aria-label="Toggle confirm password visibility"
                  className={Styles.toggle_icon}
                >
                  {showConfirmPassword ? (
                    <IconEyeOff size={16} />
                  ) : (
                    <IconEye size={16} />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className={Styles.error_message}>{errors.confirmPassword}</p>
              )}
            </div>
            <button type="submit" className={Styles.button}>
            {t("forgot.reset_password_button")}
            </button>
            <SuccessfulModal modal={modal} togglemodal={toggleModal} />
          </form>

          <div className={Styles.sign_up}>
            <Link to="/">{t("forgot.back_to_login")}</Link>
          </div>
        </div>

        <div className={Styles.forgot_right}>
          <img
            src="/assets/images/Focused-Logo.png"
            alt="Focused Logo"
            className={Styles.logo}
          />
        </div>
      </div>
    </div>
  );
}
