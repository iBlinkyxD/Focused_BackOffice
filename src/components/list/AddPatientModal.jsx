import React, { useState } from "react";
import Styles from "./AddPatientModal.module.css";
import * as yup from "yup";
import { IconX } from "@tabler/icons-react";
import { addProfessionalPatient } from "../../services/ProfessionalService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function AddPatientModal({ modal, toggleModal, sessionToken }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  // Validation schema
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(t("patientList.email_error_message"))
      .required(t("patientList.email_required")),
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
      await addProfessionalPatient(sessionToken, email);
      toggleModal();
      toast.success(t("patientList.email_message"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const resetForm = () => {
    setEmail("");
    setErrors({});
  };

  const handleToggleModal = () => {
    resetForm();
    toggleModal();
  };

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div className={Styles.modal_header}>
              <h1 className={Styles.title}>{t("patientList.link")}</h1>
              <IconX
                className={Styles.close_icon}
                onClick={handleToggleModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className={Styles.input_group}>
                <label htmlFor="email">
                  {t("patientList.email")}{" "}
                  {errors.email && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? Styles.error_input : ""}
                />
                {errors.email && (
                  <span className={Styles.error_message}>{errors.email}</span>
                )}
              </div>
              <button type="submit" className={Styles.create_btn}>
                {t("patientList.send")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
