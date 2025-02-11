import { useCallback, useEffect, useState } from "react";
import Styles from "./PrescriptionInfo.module.css";
import { IconX, IconEdit } from "@tabler/icons-react";
import { getMedicationByID } from "../../services/MedicationService";
import { getMeasureByID } from "../../services/MeasureService";
import { getPrescriptionMedication } from "../../services/PrescriptionMedicationService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function PrescriptionInfo({
  modal,
  toggleModal,
  switchToMedicationModal,
  switchToEditModal,
  sessionToken,
  prescriptionID,
  prescriptionStatus,
  setMedicationDetails, // Function passed down from parent to set medication details in state
}) {
  const [medications, setMedications] = useState([]);
  const { t } = useTranslation();

  const fetchData = useCallback(async () => {
    if (prescriptionID === null) return;
    try {
      // Fetch the prescription medications
      const data = await getPrescriptionMedication(
        sessionToken,
        prescriptionID
      );

      // Fetch medication names and measure types for each entry
      const enrichedData = await Promise.all(
        data.map(async (medication) => {
          const medicationName = await getMedicationByID(
            sessionToken,
            medication.id_medication
          );
          const measureType = await getMeasureByID(
            sessionToken,
            medication.id_measure
          );

          return {
            ...medication,
            medicationName: medicationName.name, // Assuming response has a `name` property
            measureType: measureType.name,
            status: medication.active ? "Active" : "Disable", // Assuming response has a `type` property
          };
        })
      );

      setMedications(enrichedData); // Save enriched data to state
    } catch (error) {
      toast.error(`${error.message}`);
    }
  }, [sessionToken, prescriptionID]);

  useEffect(() => {
    if (modal && prescriptionID !== null) {
      fetchData(); // Call fetchData only when modal is open and prescriptionID is available
    }
  }, [modal, prescriptionID, fetchData]); // Depend on both modal and prescriptionID to refetch data

  const handleToggleModal = () => {
    setMedications([]);
    toggleModal();
  };

  const handleCreateClick = () => {
    switchToMedicationModal(); // Switch to the MedicationModal
  };

  const handleEditClick = (medication) => {
    setMedicationDetails(medication); // Pass only the selected medication details to parent
    switchToEditModal(); // Change modal state to "edit"
  };

  return (
    <>
      {modal && (
        <div className={Styles.modal}>
          <div className={Styles.overlay}></div>
          <div className={Styles.modal_content}>
            <div className={Styles.modal_header}>
              <h1 className={Styles.title}>
                {t("prescriptionInfo.prescription")}
              </h1>
              <IconX
                className={Styles.close_icon}
                onClick={handleToggleModal}
                style={{ cursor: "pointer" }}
              />
            </div>
            {/* Render medications dynamically */}
            {medications.length > 0 ? (
              medications.map((medication) => (
                <div key={medication.id_medication} className={Styles.infoBox}>
                  <div className={Styles.row}>
                    <p className={Styles.medication}>
                      {medication.medicationName}{" "}
                      <span
                        className={
                          medication.status === "Active"
                            ? Styles.active
                            : Styles.disable
                        }
                      >
                        {`(${medication.status})`}{" "}
                      </span>
                    </p>
                    {prescriptionStatus === "Active" && (
                      <IconEdit
                        className={Styles.edit_btn}
                        onClick={() => handleEditClick(medication)} // Pass the clicked medication data
                        style={{ cursor: "pointer" }}
                        color="#215A6D"
                      />
                    )}
                  </div>
                  <p className={Styles.subInfo}>
                    {t("prescriptionInfo.dose")}{" "}
                    <span className={Styles.info}>
                      {medication.dose} {medication.measureType}
                    </span>
                  </p>
                  <p className={Styles.subInfo}>
                    {t("prescriptionInfo.frequency")}{" "}
                    <span className={Styles.info}>
                      {medication.frequency} {t("prescriptionInfo.hours")}
                    </span>
                  </p>
                  <p className={Styles.subInfo}>
                    {t("prescriptionInfo.instruction")}{" "}
                    <span className={Styles.info}>
                      {medication.instructions || "N/A"}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className={Styles.no_data}>
                {t("prescriptionInfo.noMedicaation")}
              </p>
            )}
            {prescriptionStatus === "Active" && (
              <button onClick={handleCreateClick} className={Styles.create_btn}>
                {t("prescriptionInfo.addMedication")}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
