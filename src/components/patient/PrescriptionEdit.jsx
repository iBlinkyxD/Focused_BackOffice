import { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import Styles from "./PrescriptionEdit.module.css";
import { IconX } from "@tabler/icons-react";
import AuthContext from "../../context/AuthProvider";
import { editPrescription, activatePrescription, disablePrescription } from "../../services/PrescriptionService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function PrescriptionEdit({
  modal,
  toggleModal,
  prescriptionData,
}) {
  const { sessionToken } = useContext(AuthContext);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [isConfirmAction, setIsConfirmAction] = useState(false); // Confirm state for disable action
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
    try {
      await editPrescription(sessionToken, prescriptionData.id, note);
      handleToggleModal();
      toast.success(t("prescriptionModal.successEditPrescription"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleActivate = async () => {
    try{
      await activatePrescription(sessionToken, prescriptionData.id);
      toggleModal();
      toast.success(t("prescriptionModal.successActivatePrescription"));
    }catch(error){
      toast.error(`${error.message}`);
    }
  }

  const handleDisableConfirm = async () => {
    try{
      await disablePrescription(sessionToken, prescriptionData.id);
      setIsConfirmAction(false);
      toggleModal();
      toast.success(t("prescriptionModal.successDisabledPrescription"));
    }catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleToggleModal = () => {
    toggleModal();
    resetForm();
  };

  const resetForm = () => {
    setNote("");
    setErrors({});
  };

  useEffect(() => {
    if (prescriptionData) {
      setNote(prescriptionData.note);
    }
  }, [prescriptionData]);

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div className={Styles.modal_header}>
              {!isConfirmAction ? (
                <>
                  <h1 className={Styles.title}>
                    {prescriptionData?.status === "Active"
                      ? t("prescriptionModal.editTitle")
                      : t("prescriptionModal.activateTitle")}
                  </h1>
                  <IconX
                    className={Styles.close_icon}
                    onClick={handleToggleModal}
                    style={{ cursor: "pointer" }}
                  />
                </>
              ) : (
                <>
                  <h1 className={Styles.title2}>{t("prescriptionModal.disableTitle")}</h1>
                  <IconX
                    className={Styles.close_icon}
                    onClick={handleToggleModal}
                    style={{ cursor: "pointer" }}
                  />
                </>
              )}
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
                  disabled={prescriptionData?.status === "Disable"}
                />
                {errors.note && (
                  <p className={Styles.error_message}>{errors.note}</p>
                )}
              </div>

              <div className={Styles.row}>
                {isConfirmAction ? (
                  <>
                    <button
                      type="button"
                      className={Styles.edit_btn}
                      onClick={handleDisableConfirm}
                    >
                      {t("prescriptionModal.confirmButton")}
                    </button>
                    <button
                      type="button"
                      className={Styles.delete_btn}
                      onClick={() => setIsConfirmAction(false)}
                    >
                      {t("prescriptionModal.cancelButton")}
                    </button>
                  </>
                ) : prescriptionData?.status === "Disable" ? (
                  <button
                    type="button"
                    className={Styles.active_btn}
                    onClick={handleActivate}
                  >
                    {t("prescriptionModal.activateButton")}
                  </button>
                ) : (
                  <>
                    <button type="submit" className={Styles.edit_btn}>
                    {t("prescriptionModal.saveButton")}
                    </button>
                    <button
                      type="button"
                      className={Styles.delete_btn}
                      onClick={() => setIsConfirmAction(true)}
                    >
                      {t("prescriptionModal.disableButton")}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
