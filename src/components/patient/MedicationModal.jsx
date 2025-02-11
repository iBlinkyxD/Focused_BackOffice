import { useCallback, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import Styles from "./MedicationModal.module.css";
import { IconX, IconPlus } from "@tabler/icons-react";
import AuthContext from "../../context/AuthProvider";
import { getMedication, addMedication } from "../../services/MedicationService";
import { getMeasure, addMeasure } from "../../services/MeasureService";
import { createPrescriptionMedication } from "../../services/PrescriptionMedicationService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function MedicationModal({
  modal,
  toggleModal,
  switchToPrescriptionModal,
  prescriptionID,
}) {
  const { sessionToken } = useContext(AuthContext);
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newMedication, setNewMedication] = useState("");
  const [measure, setMeasure] = useState([]);
  const [selectedMeasure, setSelectedMeasure] = useState("");
  const [isAddingNewMeasure, setIsAddingNewMeasure] = useState(false);
  const [newMeasure, setNewMeasure] = useState("");
  const [dose, setDose] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [instruction, setInstruction] = useState("");
  const [errorMedication, setErrorMedication] = useState({});
  const [errorMeasure, setErrorMeasure] = useState({});
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const validationSchemaMedication = yup.object().shape({
    newMedication: yup
      .string()
      .required(t("medicationEdit.selectedMedication")),
  });

  const validationSchemaMeasure = yup.object().shape({
    newMeasure: yup.string().required(t("medicationEdit.selectedMeasureError")),
  });

  const validationSchema = yup.object().shape({
    selectedMedication: yup
      .string()
      .required(t("medicationEdit.selectedMedication")),
    dose: yup
      .number(t("medicationEdit.doseErrorNumeric"))
      .positive(t("medicationEdit.doseErrorPositive"))
      .min(0.01, t("medicationEdit.doseErrorMin"))
      .required(t("medicationEdit.doseErrorRequired")),
    selectedMeasure: yup
      .string()
      .required(t("medicationEdit.selectedMeasureError")),
    frequency: yup
      .number(t("medicationEdit.frequencyErrorNumeric"))
      .positive(t("medicationEdit.frequencyErrorPositive"))
      .min(1, t("medicationEdit.frequencyErrorMin"))
      .required(t("medicationEdit.frequencyErrorRequired")),
    instruction: yup.string().required(t("medicationEdit.instructionError")),
  });

  const handleCancelClick = () => {
    resetForm();
    switchToPrescriptionModal(); // Switch back to the PrescriptionInfo modal
  };

  const validateMedication = async () => {
    try {
      await validationSchemaMedication.validate(
        { newMedication },
        { abortEarly: false }
      );
      setErrorMedication({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrorMedication(validationErrors);
        return false;
      }
    }
  };

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
        { selectedMedication, dose, selectedMeasure, frequency, instruction },
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

  const fetchMedicationData = useCallback(async () => {
    try {
      const medicationData = await getMedication(sessionToken);
      setMedications(medicationData);
    } catch (error) {
      toast.error(`${error.message}`);
    }
  }, [sessionToken]);

  const fetchMeasureData = useCallback(async () => {
    try {
      const measureData = await getMeasure(sessionToken);
      setMeasure(measureData);
    } catch (error) {
      toast.error(`${error.message}`);
    }
  }, [sessionToken]);

  const fetchData = useCallback(async () => {
    await Promise.all([fetchMedicationData(), fetchMeasureData()]);
  }, [fetchMedicationData, fetchMeasureData]);

  const handleMedicationChange = async (e) => {
    const value = e.target.value;
    if (value === "add_new") {
      setIsAddingNew(true); // Show input for adding a new medication
      setSelectedMedication(""); // Clear the current selection
    } else {
      setIsAddingNew(false); // Hide the "Add New" input
      setSelectedMedication(value); // Set selected medication
    }

    // Validate the selected medication immediately
    try {
      await validationSchema.validateAt("selectedMedication", {
        selectedMedication: value,
      });
      setErrors((prev) => ({ ...prev, selectedMedication: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, selectedMedication: error.message }));
    }
  };

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

  const handleNewMedChange = async (field, value) => {
    setNewMedication(value);

    try {
      await validationSchemaMedication.validateAt(field, {
        newMedication,
        [field]: value,
      });
      setErrorMedication((prev) => ({ ...prev, [field]: null }));
    } catch (error) {
      setErrorMedication((prev) => ({
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

  const handleAddMedication = async (e) => {
    e.preventDefault();
    if (!(await validateMedication())) return;
    try {
      const addedMedication = await addMedication(sessionToken, newMedication);
      fetchMedicationData();
      if (addedMedication?.message) {
        // Set the selected medication to the ID returned in the message
        setSelectedMedication(addedMedication.message);
      } else {
        console.error("Unexpected response format: ", addedMedication);
      }
      setNewMedication("");
      setIsAddingNew(false);
      toast.success(t("medicationEdit.successAddMedicationMessage"));
    } catch (error) {
      if(error.message === "Request failed with status code 500"){
        toast.error(t("medicationEdit.medicationExist"))
      }else{
        toast.error(`${error.message}`);
      }
    }
  };

  const handleAddMeasure = async (e) => {
    e.preventDefault();
    if (!(await validateMeasure())) return;
    try {
      const addedMeasure = await addMeasure(sessionToken, newMeasure);
      fetchMeasureData();
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
      if(error.message === "Request failed with status code 500"){
        toast.error(t("medicationEdit.measureExist"))
      }else{
        toast.error(`${error.message}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;
    try {
      await createPrescriptionMedication(
        sessionToken,
        prescriptionID,
        selectedMedication,
        dose,
        frequency,
        selectedMeasure,
        instruction
      );
      handleCancelClick();
      toast.success(t("medicationEdit.successAddedMedication"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const resetForm = () => {
    setIsAddingNew(false);
    setIsAddingNewMeasure(false);
    setSelectedMedication("");
    setSelectedMeasure("");
    setDose(0);
    setFrequency(0);
    setInstruction("");
    setNewMedication("");
    setNewMeasure("");
    setErrorMedication({});
    setErrorMeasure({});
    setErrors({});
  };

  const handleToggleModal = () => {
    toggleModal();
    resetForm(""); // Close modal
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div className={Styles.modal_header}>
              <h1 className={Styles.title}>{t("medicationEdit.addTitle")}</h1>
              <IconX
                className={Styles.close_icon}
                onClick={handleToggleModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className={Styles.input_group}>
                <label htmlFor="medicineName">
                  {t("medicationEdit.medicineNameLabel")}{" "}
                  {errors.selectedMedication && (
                    <label className={Styles.error_label}>*</label>
                  )}
                </label>
                <select
                  id="medicineName"
                  name="medicineName"
                  value={selectedMedication}
                  onChange={handleMedicationChange}
                  className={
                    errors.selectedMedication ? Styles.error_input : ""
                  }
                >
                  <option value="" disabled>
                    {t("medicationEdit.selectMedication")}
                  </option>
                  {medications.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name}
                    </option>
                  ))}
                  <option value="add_new">
                    {t("medicationEdit.addNewMedicationButton")}
                  </option>
                </select>
                {errors.selectedMedication && (
                  <p className={Styles.error_message}>
                    {errors.selectedMedication}
                  </p>
                )}
                {isAddingNew && (
                  <>
                    <div className={Styles.add_new_container}>
                      <input
                        id="medicationName"
                        name="medicationName"
                        type="text"
                        placeholder={t(
                          "medicationEdit.newMedicationPlaceHolder"
                        )}
                        autoComplete="off"
                        autoCapitalize="on"
                        value={newMedication}
                        className={
                          errorMedication.newMedication
                            ? Styles.error_input
                            : ""
                        }
                        onChange={(e) =>
                          handleNewMedChange("newMedication", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAddMedication}
                        className={Styles.add_btn}
                      >
                        <IconPlus />
                      </button>
                    </div>
                    {errorMedication.newMedication && (
                      <p className={Styles.error_message}>
                        {errorMedication.newMedication}
                      </p>
                    )}
                  </>
                )}
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
                  >
                    <option value="" disabled>
                    {t("medicationEdit.selectMeasure")}
                    </option>
                    {measure.map((mes) => (
                      <option key={mes.id} value={mes.id}>
                        {mes.name}
                      </option>
                    ))}
                    <option value="add_new">
                      {t("medicationEdit.addNewMeasureButton")}
                    </option>
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
                          placeholder={t(
                            "medicationEdit.newMeasurePlaceholder"
                          )}
                          value={newMeasure}
                          className={
                            errorMeasure.newMeasure ? Styles.error_input : ""
                          }
                          onChange={(e) =>
                            handleNewMesChange("newMeasure", e.target.value)
                          }
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
                />
                {errors.instruction && (
                  <p className={Styles.error_message}>{errors.instruction}</p>
                )}
              </div>
              <div className={Styles.row}>
                <button type="submit" className={Styles.create_btn}>
                  {t("medicationEdit.addButton")}
                </button>
                <button
                  onClick={handleCancelClick}
                  className={Styles.cancel_btn}
                >
                  {t("medicationEdit.cancelButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
