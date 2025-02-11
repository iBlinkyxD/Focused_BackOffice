import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Styles from "./RecoverPage.module.css";
import ForgotOTP from "../components/forgot/ForgotOTP";
import { forgotPassword } from "../services/UserService";
import { useTranslation } from "react-i18next";

export default function RecoverPage() {
  useEffect(() => {
    document.body.classList.add(Styles.forgot_background);
    return () => {
      document.body.classList.remove(Styles.forgot_background);
    };
  }, []);

  const [modal, setModal] = useState(false); // Modal visibility state
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const { t } = useTranslation();

  // Define validation schema
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(`${t("recover.invalid_email")}`)
      .required(`${t("recover.email_required")}`),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate({ email }, { abortEarly: false });
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

  const handleChange = async (field, value) => {
    const newValue = value;

    if (field === "email") {
      setEmail(newValue);
    }

    try {
      await validationSchema.validateAt(field, { email, [field]: newValue });
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
      await forgotPassword(email);
      handleContinue();
    } catch (error) {
      if (error.message === "No user with this email found.") {
        setError(`${error.message}`);
      } else {
        setError(`${t("recover.general_error")}`);
      }
    }
  };

  const resetForm = () => {
    setEmail("");
    setErrors({});
    setError("");
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  // Handle Continue button submission (show OTP modal)
  const handleContinue = () => {
    resetForm("");
    toggleModal();
  };

  return (
    <div className={Styles.forgot_page_container}>
      <div className={Styles.forgot_container}>
        <div className={Styles.forgot_left}>
          <center>
            <div className={Styles.resp_logo} />
          </center>
          <h1>
            {t("recover.forgot")} <br /> {t("recover.password")}
          </h1>
          <form className={Styles.form_container} onSubmit={handleSubmit}>
            {error && (
              <div className={Styles.error_container}>
                <p className={Styles.error_message2}>{error}</p>
              </div>
            )}{" "}
            <div className={Styles.input_group}>
              <label htmlFor="email">
                {t("recover.email")}{" "}
                {errors.email && (
                  <label className={Styles.error_label}>*</label>
                )}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={errors.email ? Styles.error_input : ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <p className={Styles.error_message}>{errors.email}</p>
              )}
            </div>
            <button type="submit" className={Styles.button}>
              {t("recover.continue")}
            </button>
          </form>

          <ForgotOTP modal={modal} toggleModal={toggleModal} />

          <div className={Styles.sign_up}>
            <Link to="/">{t("recover.back_to_login")}</Link>
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
