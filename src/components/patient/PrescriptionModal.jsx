import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import Styles from "./PrescriptionModal.module.css";
import { IconX } from "@tabler/icons-react";
import AuthContext from "../../context/AuthProvider";
import { createPrescription } from "../../services/PrescriptionService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function PrescriptionModal({ modal, toggleModal }) {
  const { patientId } = useParams();
  const { sessionToken, professionID } = useContext(AuthContext);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    note: yup.string().required(t("prescriptionModal.noteRequired")),
  });

  const validateForm = async () => {
    try {
      await validationSchema.validate({ note }, { abortEarly: false });
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

    if (field === "note") {
      setNote(newValue);
    }

    try {
      await validationSchema.validateAt(field, { note, [field]: newValue });
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
    console.log(professionID);
    try {
      await createPrescription(sessionToken, patientId, professionID, note);
      handleToggleModal();
      toast.success(t("prescriptionModal.successAddPrescription"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const resetForm = () => {
    setNote("");
    setErrors({});
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
              <h1 className={Styles.title}>{t("prescriptionModal.addTitle")}</h1>
              <IconX
                className={Styles.close_icon}
                onClick={handleToggleModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className={Styles.input_group}>
                <label htmlFor="note">
                  {t("prescriptionModal.note")}{" "}
                  {errors.note && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="note"
                  name="note"
                  type="text"
                  value={note}
                  autoComplete="off"
                  className={errors.note ? Styles.error_input : ""}
                  onChange={(e) => handleFormChange("note", e.target.value)}
                />
                {errors.note && (
                  <p className={Styles.error_message}>{errors.note}</p>
                )}
              </div>

              <button type="submit" className={Styles.create_btn}>
                {t("prescriptionModal.createButton")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
