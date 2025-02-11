import React, { useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import Styles from "./ConditionModal.module.css";
import { editPatientCondition } from "../../services/PatientService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function ConditionModal({
  modal,
  toggleModal,
  patientID,
  sessionToken,
  condition,
  onUpdateCondition,
}) {
  const [patientCondition, setPatientCondition] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (modal) {
      setPatientCondition(condition || "");
    }
  }, [modal, condition]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editPatientCondition(sessionToken, patientID, patientCondition);
      onUpdateCondition(patientCondition);
      toggleModal();
      toast.success(t("conditionModal.conditionUpdate"));
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleToggleModal = () => {
    toggleModal();
  };

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div className={Styles.modal_header}>
              <h1 className={Styles.title}>
                {t("conditionModal.editCondition")}
              </h1>
              <IconX
                className={Styles.close_icon}
                onClick={handleToggleModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className={Styles.input_group}>
                <label htmlFor="condition">
                  {t("conditionModal.condition")}
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={patientCondition}
                  onChange={(e) => setPatientCondition(e.target.value)}
                >
                  <option value="Newly Diagnosed">
                    {t("conditionModal.newlyDiagnosed")}
                  </option>
                  <option value="Stable">{t("conditionModal.stable")}</option>
                  <option value="Improving">
                    {t("conditionModal.improving")}
                  </option>
                  <option value="Worsening">
                    {t("conditionModal.worsening")}
                  </option>
                  <option value="Chronic">{t("conditionModal.chronic")}</option>
                  <option value="In Crisis">
                    {t("conditionModal.inCrisis")}
                  </option>
                </select>
              </div>
              <button type="submit" className={Styles.create_btn}>
                {t("conditionModal.editCondition")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
