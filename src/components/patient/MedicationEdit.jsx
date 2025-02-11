import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import Styles from "./MedicationEdit.module.css";
import { IconX, IconPlus } from "@tabler/icons-react";
import AuthContext from "../../context/AuthProvider";
import { getMeasure, addMeasure } from "../../services/MeasureService";
import {
  editPrescriptionMedication,
  disablePrescriptionMedication,
  activatePrescriptionMedication,
} from "../../services/PrescriptionMedicationService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function MedicationEdit({
  modal,
  switchToPrescriptionModal,
  prescriptionID,
  medicationDetails,
}) {
  const { sessionToken } = useContext(AuthContext);
  const [medication, setMedication] = useState("");
  const [measure, setMeasure] = useState([]);
  const [selectedMeasure, setSelectedMeasure] = useState("");
  const [isAddingNewMeasure, setIsAddingNewMeasure] = useState(false);
  const [newMeasure, setNewMeasure] = useState("");
  const [dose, setDose] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [instruction, setInstruction] = useState("");
  const [errorMeasure, setErrorMeasure] = useState({});
  const [errors, setErrors] = useState({});
  const [isConfirmAction, setIsConfirmAction] = useState(false);
  const { t } = useTranslation();

  const handleCancelClick = () => {
    resetForm();
    switchToPrescriptionModal(); // Switch back to the PrescriptionInfo modal
  };

  const validationSchemaMeasure = yup.object().shape({
    newMeasure: yup.string().required(t("medicationEdit.selectedMeasureError")),
  });
  
  const validationSchema = yup.object().shape({
    dose: yup
      .number(t("medicationEdit.doseErrorNumeric"))
      .positive(t("medicationEdit.doseErrorPositive"))
      .min(0.01, t("medicationEdit.doseErrorMin"))
      .required(t("medicationEdit.doseErrorRequired")),
    selectedMeasure: yup.string().required(t("medicationEdit.selectedMeasureError")),
    frequency: yup
      .number(t("medicationEdit.frequencyErrorNumeric"))
      .positive(t("medicationEdit.frequencyErrorPositive"))
      .min(1, t("medicationEdit.frequencyErrorMin"))
      .required(t("medicationEdit.frequencyErrorRequired")),
    instruction: yup.string().required(t("medicationEdit.instructionError")),
  });

  const validateMeasure = async () => {
    try {
      await validationSchemaMeasure.validate(
        { newMeasure },
        { abortEarly: false }
      );
      setErrorMeasure({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrorMeasure(validationErrors);
        return false;
      }
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(
        { dose, selectedMeasure, frequency, instruction },
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

  const fetchData = useCallback(async () => {
    try {
      const measureData = await getMeasure(sessionToken);
      setMeasure(measureData);
    } catch (error) {
      toast.error(`${error.message}`);
    }
  }, [sessionToken]);

  const handleMeasureChange = async (e) => {
    const value = e.target.value;
    if (value === "add_new") {
      setIsAddingNewMeasure(true); // Show input for adding a new medication
      setSelectedMeasure(""); // Clear the current selection
    } else {
      setIsAddingNewMeasure(false); // Hide the "Add New" input
      setSelectedMeasure(value); // Set selected medication
    }

    try {
      await validationSchema.validateAt("selectedMeasure", {
        selectedMeasure: value,
      });
      setErrors((prev) => ({ ...prev, selectedMeasure: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, selectedMeasure: error.message }));
    }
  };

  const handleFormChange = async (field, value) => {
    const newValue = value;

    if (field === "dose") {
      setDose(newValue);
    } else if (field === "frequency") {
      setFrequency(newValue);
    } else if (field === "instruction") {
      setInstruction(newValue);
    }

    try {
      await validationSchema.validateAt(field, {
        dose,
        frequency,
        instruction,
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

  const handleNewMesChange = async (field, value) => {
    setNewMeasure(value);

    try {
      await validationSchemaMeasure.validateAt(field, {
        newMeasure,
        [field]: value,
      });
      setErrorMeasure((prev) => ({ ...prev, [field]: null }));
    } catch (error) {
      setErrorMeasure((prev) => ({
        ...prev,
        [field]: error.message,
      }));
    }
  };

  const handleAddMeasure = async (e) => {
    e.preventDefault();
    if (!(await validateMeasure())) return;
    try {
      const addedMeasure = await addMeasure(sessionToken, newMeasure);
      fetchData();
      if (addedMeasure?.message) {
        // Set the selected medication to the ID returned in the message
        setSelectedMeasure(addedMeasure.message);
      } else {
        console.error("Unexpected response format: ", addedMeasure);
      }
      setNewMeasure("");
      setIsAddingNewMeasure(false);
      toast.success(t("medicationEdit.successAddMeasureMessage"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;
    try {
      await editPrescriptionMedication(
        sessionToken,
        prescriptionID,
        medicationDetails.id_medication,
        dose,
        frequency,
        selectedMeasure,
        instruction
      );
      handleCancelClick();
      toast.success(t("medicationEdit.successEditMessage"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleActivate = async () => {
    try {
      await activatePrescriptionMedication(
        sessionToken,
        prescriptionID,
        medicationDetails.id_medication
      );
      handleCancelClick();
      toast.success(t("medicationEdit.successActivateMessage"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleDisable = async () => {
    try {
      await disablePrescriptionMedication(
        sessionToken,
        prescriptionID,
        medicationDetails.id_medication
      );
      handleCancelClick();
      toast.success(t("medicationEdit.successDisableMessage"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const resetForm = () => {
    setIsAddingNewMeasure(false);
    setMedication("");
    setSelectedMeasure("");
    setDose(0);
    setFrequency(0);
    setInstruction("");
    setNewMeasure("");
    setErrorMeasure({});
    setErrors({});
    setIsConfirmAction(false);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (medicationDetails) {
      setMedication(medicationDetails.medicationName);
      setDose(medicationDetails.dose);
      setFrequency(medicationDetails.frequency);
      setInstruction(medicationDetails.instructions || "");
      setSelectedMeasure(medicationDetails.id_measure);
    }
  }, [medicationDetails]);

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
                    {medicationDetails?.status === "Active"
                      ? t("medicationEdit.editTitle")
                      : t("medicationEdit.activateTitle")}
                  </h1>
                  <IconX
                    className={Styles.close_icon}
                    onClick={handleCancelClick}
                    style={{ cursor: "pointer" }}
                  />
                </>
              ) : (
                <>
                  {" "}
                  <h1 className={Styles.title2}>{t("medicationEdit.disableTitle")}</h1>
                  <IconX
                    className={Styles.close_icon}
                    onClick={handleCancelClick}
                    style={{ cursor: "pointer" }}
                  />
                </>
              )}
            </div>
            <form onSubmit={handleEdit} autoComplete="off">
              <div className={Styles.input_group}>
                <label htmlFor="medicineName">{t("medicationEdit.medicineNameLabel")}</label>
                <input
                  id="medicineName"
                  name="medicineName"
                  type="text"
                  disabled
                  value={medication}
                />
              </div>
              <div className={Styles.row}>
                <div className={Styles.group}>
                  <label htmlFor="dose">
                  {t("medicationEdit.doseLabel")}{" "}
                    {errors.dose && (
                      <label className={Styles.error_label}>*</label>
                    )}
                  </label>
                  <input
                    id="dose"
                    name="dose"
                    type="number"
                    value={dose}
                    min={0}
                    max={4000}
                    required
                    autoComplete="off"
                    onChange={(e) => handleFormChange("dose", e.target.value)}
                    className={errors.dose ? Styles.error_input : ""}
                    disabled={medicationDetails?.status === "Disable"}
                  />
                  {errors.dose && (
                    <p className={Styles.error_message}>{errors.dose}</p>
                  )}
                </div>
                <div className={Styles.group}>
                  <label htmlFor="measure">
                  {t("medicationEdit.measureLabel")}{" "}
                    {errors.selectedMeasure && (
                      <label className={Styles.error_label}>*</label>
                    )}
                  </label>
                  <select
                    id="measure"
                    name="measure"
                    value={selectedMeasure}
                    onChange={handleMeasureChange}
                    className={errors.selectedMeasure ? Styles.error_input : ""}
                    disabled={medicationDetails?.status === "Disable"}
                  >
                    {measure.map((mes) => (
                      <option key={mes.id} value={mes.id}>
                        {mes.name}
                      </option>
                    ))}
                    <option value="add_new">{t("medicationEdit.addNewMeasureButton")}</option>
                  </select>
                  {errors.selectedMeasure && (
                    <p className={Styles.error_message}>
                      {errors.selectedMeasure}
                    </p>
                  )}
                  {isAddingNewMeasure && (
                    <>
                      <div className={Styles.add_new_container}>
                        <input
                          id="measure"
                          name="measure"
                          type="text"
                          placeholder="Enter new measure"
                          value={newMeasure}
                          className={
                            errorMeasure.newMeasure ? Styles.error_input : ""
                          }
                          onChange={(e) =>
                            handleNewMesChange("newMeasure", e.target.value)
                          }
                          disabled={medicationDetails?.status === "Disable"}
                        />
                        <button
                          type="button"
                          onClick={handleAddMeasure}
                          className={Styles.add_btn}
                        >
                          <IconPlus />
                        </button>
                      </div>
                      {errorMeasure.newMeasure && (
                        <p className={Styles.error_message}>
                          {errorMeasure.newMeasure}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={Styles.input_group}>
                <label htmlFor="frequency">
                {t("medicationEdit.frequencyLabel")}{" "}
                  {errors.frequency && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="frequency"
                  name="frequency"
                  type="number"
                  value={frequency}
                  autoCapitalize="on"
                  autoComplete="off"
                  onChange={(e) =>
                    handleFormChange("frequency", e.target.value)
                  }
                  className={errors.frequency ? Styles.error_input : ""}
                  disabled={medicationDetails?.status === "Disable"}
                />
                {errors.frequency && (
                  <p className={Styles.error_message}>{errors.frequency}</p>
                )}
              </div>
              <div className={Styles.input_group}>
                <label htmlFor="instruction">
                {t("medicationEdit.instructionLabel")}{" "}
                  {errors.instruction && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <input
                  id="instruction"
                  name="instruction"
                  type="text"
                  value={instruction}
                  autoCapitalize="on"
                  autoComplete="off"
                  onChange={(e) =>
                    handleFormChange("instruction", e.target.value)
                  }
                  className={errors.instruction ? Styles.error_input : ""}
                  disabled={medicationDetails?.status === "Disable"}
                />
                {errors.instruction && (
                  <p className={Styles.error_message}>{errors.instruction}</p>
                )}
              </div>
              <div className={Styles.row}>
                {isConfirmAction ? (
                  <>
                    <button
                      type="button"
                      className={Styles.edit_btn}
                      onClick={handleDisable}
                    >
                      {t("medicationEdit.confirmButton")}
                    </button>
                    <button
                      type="button"
                      className={Styles.delete_btn}
                      onClick={() => setIsConfirmAction(false)}
                    >
                      {t("medicationEdit.cancelButton")}
                    </button>
                  </>
                ) : medicationDetails?.status === "Disable" ? (
                  <>
                    <button
                      type="button"
                      className={Styles.active_btn}
                      onClick={handleActivate}
                    >
                      {t("medicationEdit.activateButton")}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit" className={Styles.edit_btn}>
                    {t("medicationEdit.saveButton")}
                    </button>
                    <button
                      type="button"
                      className={Styles.delete_btn}
                      onClick={() => setIsConfirmAction(true)}
                    >
                      {t("medicationEdit.disableButton")}
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
